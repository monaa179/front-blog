<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div class="header-text">
        <h1>Recent Articles</h1>
        <p class="subtitle">Overview of your content pipeline.</p>
      </div>
      <div class="header-actions">
        <!-- Future: Filters or global actions -->
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Loading articles...</span>
    </div>

    <div v-else-if="error" class="error-msg">
      <div class="error-icon">⚠️</div>
      {{ error }}
    </div>

    <div v-else class="table-card-container">
      <table class="articles-table">
        <thead>
          <tr>
            <th style="width: 25%">Article</th>
            <th style="width: 20%">Description</th>
            <th style="width: 50px; text-align: center;">Link</th>
            <th style="width: 140px">Status</th>
            <th style="width: 20%">Modules</th>
            <th style="width: 120px; text-align: right;">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.id" class="article-row">
            <td>
              <div class="article-info">
                <div class="article-title" :title="article.original_title">{{ article.original_title }}</div>
                <span class="article-date">{{ formatDate(article.created_at) }}</span>
              </div>
            </td>
            <td>
              <div class="article-desc" :title="article.original_description || ''">
                {{ article.original_description || '—' }}
              </div>
            </td>
            <td class="text-center">
              <a 
                v-if="article.source_url" 
                :href="article.source_url" 
                target="_blank" 
                class="source-link-icon"
                title="Open Source URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="status-cell">
              <div class="status-wrapper">
                <StatusBadge :status="article.status" />
                <select 
                  class="status-select-hidden"
                  :value="article.status"
                  @change="(e) => updateStatus(article.id, (e.target as HTMLSelectElement).value)"
                >
                  <option v-for="s in filteredStatuses" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </td>
            <td class="modules-cell">
              <ModuleSelector 
                :model-value="article.modules" 
                :available-modules="allModules"
                @update:model-value="(newModules) => updateModules(article.id, newModules)"
              />
            </td>
            <td class="text-right">
              <div class="actions">
                <button 
                  v-if="canWrite(article.status)"
                  class="btn btn-primary btn-sm btn-write" 
                  @click.stop="handleWrite(article)"
                  :disabled="processingId === article.id || article.status === 'writing'"
                >
                  <span v-if="processingId === article.id">Wait...</span>
                  <span v-else>Rédiger</span>
                </button>
                <NuxtLink :to="`/articles/${article.id}`" class="btn btn-ghost btn-sm btn-icon-only" title="View Details">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const config = useRuntimeConfig()

interface Module {
  id: number;
  name: string;
  slug: string;
}

interface Article {
  id: number;
  original_title: string;
  original_description: string;
  source_url: string;
  status: string;
  created_at: string;
  modules: Module[];
  article_modules?: any[]; // Intermediate for loading
}

const loading = ref(true)
const error = ref<string | null>(null)
const articles = ref<Article[]>([])
const allModules = ref<Module[]>([])
const processingId = ref<number | null>(null)

const statusOptions = ['proposed', 'writing', 'written', 'validated', 'published', 'error', 'abandoned']
const writeableStatuses = ['proposed', 'error', 'abandoned', 'writing'] 
const filteredStatuses = statusOptions

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'MMM dd, HH:mm')
}

const fetchModules = async () => {
  const { data, error: err } = await client.from('modules').select('*').eq('active', true)
  if (err) console.error('Error fetching modules:', err)
  else allModules.value = (data as any[]) || []
}

const fetchArticles = async () => {
  loading.value = true
  const { data, error: err } = await client
    .from('articles')
    .select(`
      *,
      article_modules (
        module:modules (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (err) {
    error.value = err.message
  } else {
    articles.value = (data as any[]).map(article => ({
      ...article,
      modules: article.article_modules ? article.article_modules.map((am: any) => am.module) : []
    }))
  }
  loading.value = false
}

const updateStatus = async (id: number, newStatus: string) => {
  const article = articles.value.find(a => a.id === id)
  if (article) article.status = newStatus

  const { error: err } = await client.from('articles').update({ status: newStatus } as any).eq('id', id)
  if (err) console.error('Failed to update status', err)
}

const updateModules = async (articleId: number, newModules: any[]) => {
  const article = articles.value.find(a => a.id === articleId)
  if (article) article.modules = newModules

  const { error: deleteErr } = await client.from('article_modules').delete().eq('article_id', articleId)
  if (deleteErr) {
    console.error('Error deleting modules', deleteErr)
    return
  }

  if (newModules.length > 0) {
    const insertData = newModules.map(m => ({
      article_id: articleId,
      module_id: m.id
    }))
    
    const { error: insertErr } = await client.from('article_modules').insert(insertData as any)
    if (insertErr) console.error('Error inserting modules', insertErr)
  }
}

const canWrite = (status: string) => {
  return writeableStatuses.includes(status)
}

const handleWrite = async (article: any) => {
  if (article.status === 'writing') return 
  
  processingId.value = article.id
  
  try {
    await updateStatus(article.id, 'writing')
    
    await $fetch('/api/trigger-make', {
      method: 'POST',
      body: {
        article_id: article.id,
        original_title: article.original_title,
        original_description: article.original_description,
        source_url: article.source_url,
        modules: article.modules.map((m: any) => ({ 
            id: m.id,
            name: m.name,
            slug: m.slug 
        }))
      }
    })
  } catch (e) {
    console.error('Error triggering write', e)
    await updateStatus(article.id, 'error')
  } finally {
    processingId.value = null
  }
}

onMounted(() => {
  fetchModules()
  fetchArticles()
})
</script>

<style scoped>
.dashboard-page {
  /* Page container */
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.header-text h1 {
  font-size: 20px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 13px;
}

/* Hybrid Table (Card Look) */
.table-card-container {
  /* No outer border for the container, we style rows */
}

.articles-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px; /* Gap between rows */
}

.articles-table th {
  text-align: left;
  padding: 0 16px 8px 16px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-row {
  background: var(--bg-card);
  transition: transform 0.1s, box-shadow 0.1s;
  box-shadow: var(--shadow-sm);
}

.article-row td {
  padding: 16px;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

/* Rounded corners for the row */
.articles-table tr td:first-child {
  border-left: 1px solid var(--border-subtle);
  border-top-left-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-lg);
}

.articles-table tr td:last-child {
  border-right: 1px solid var(--border-subtle);
  border-top-right-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
}

.article-row:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-active);
}

/* Content Styling */
.article-info {
  display: flex;
  flex-direction: column;
}

.article-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-date {
  font-size: 11px;
  color: var(--text-muted);
}

.article-desc {
  font-size: 12px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.source-link-icon {
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 4px;
  display: inline-flex;
}

.source-link-icon:hover {
  background: var(--bg-hover);
  color: var(--primary);
}

.status-wrapper {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.status-select-hidden {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: var(--text-muted); font-size: 12px; }

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.btn-icon-only {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state, .error-msg {
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-active);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
