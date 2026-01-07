<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div class="header-text">
        <h1>Dashboard</h1>
        <p class="subtitle">Vue d'ensemble des articles.</p>
      </div>
      <div class="header-actions">
        <!-- Future: Filters or global actions -->
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Chargement des articles...</span>
    </div>

    <div v-else-if="error" class="error-msg">
      <div class="error-icon">⚠️</div>
      {{ error }}
    </div>

    <div v-else class="table-card-container">
      <table class="articles-table">
        <thead>
          <tr>
            <th style="width: 40%">Titre</th>
            <th style="width: 30%">Description</th>
            <th style="width: 40px; text-align: center;">URL</th>
            <th style="width: 120px">Statut</th>
            <th style="width: 140px">Modules</th>
            <th style="width: 90px">Date</th>
            <th style="width: 140px; text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="article in articles" 
            :key="article.id" 
            class="article-row"
          >
            <td>
              <div class="article-info">
                <div class="article-title">
                  <a href="#" @click.stop.prevent="goToArticle(article.id)">{{ article.original_title }}</a>
                  <span v-if="article.versions_count > 0" class="version-badge">{{ article.versions_count }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="article-desc">
                {{ article.original_description || '—' }}
              </div>
            </td>
            <td class="text-center" @click.stop>
              <a 
                v-if="article.source_url" 
                :href="article.source_url" 
                target="_blank" 
                class="source-link-icon"
                title="Open Source URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="status-cell" @click.stop>
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
              <div v-if="article.status === 'error'" class="error-indication" title="Une erreur est survenue lors de la rédaction">
                ⚠️ Erreur
              </div>
            </td>
            <td class="modules-cell" @click.stop>
              <ModuleSelector 
                :model-value="article.modules" 
                :available-modules="allModules"
                @update:model-value="(newModules) => updateModules(article.id, newModules)"
              />
            </td>
            <td>
              <span class="article-date">{{ formatDate(article.created_at) }}</span>
            </td>
            <td class="text-right" @click.stop>
              <div class="actions">
                <!-- Write Button: always visible -->
                <button 
                  class="btn btn-primary btn-sm btn-write" 
                  @click="handleWrite(article)"
                  :disabled="processingId === article.id"
                >
                  <div v-if="processingId === article.id" class="loader-sm"></div>
                  <span>{{ (processingId === article.id) ? 'Rédaction...' : 'Rédiger' }}</span>
                </button>

                <!-- Copy Button (if at least one version exists) -->
                <button 
                  v-if="article.versions_count > 0"
                  class="btn btn-ghost btn-sm btn-icon-only"
                  @click="copyLatestVersion(article)"
                  title="Copier le contenu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>

                <!-- Delete Action -->
                <button 
                  class="btn btn-ghost btn-sm btn-icon-only text-danger"
                  @click="deleteArticle(article.id)"
                  title="Supprimer l'article"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
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
  last_version_content?: string;
  versions_count: number;
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
  return format(new Date(dateStr), 'dd/MM/yyyy')
}

const fetchModules = async () => {
  const { data, error: err } = await client.from('modules').select('*').eq('active', true)
  if (err) console.error('Error fetching modules:', err)
  else allModules.value = (data as any[]) || []
}

const fetchArticles = async () => {
  loading.value = true
  // Fetch articles with modules and the latest version
  const { data, error: err } = await client
    .from('articles')
    .select(`
      *,
      article_modules (
        module:modules (*)
      ),
      article_versions (
        content,
        created_at
      )
    `)
    .order('created_at', { ascending: false })

  if (err) {
    error.value = err.message
  } else {
    articles.value = (data as any[]).map(article => {
      // Pick the latest version content if available
      const versions = article.article_versions || []
      const lastVersion = versions.length > 0 
        ? versions.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null

      return {
        ...article,
        modules: article.article_modules ? article.article_modules.map((am: any) => am.module) : [],
        last_version_content: lastVersion?.content || null,
        versions_count: versions.length || 0
      }
    })
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
  // Note: we intentionally avoid returning early here so the fetch is always attempted
  // Button disabled state (via processingId) prevents double clicks from the UI.

  console.debug('[handleWrite] clicked for article', article?.id)

  // Mark as processing to disable the button in the UI
  processingId.value = article.id

  try {
    console.debug('[handleWrite] setting status -> writing (local + db) for', article.id)
    // Update status locally and in Supabase to show immediate feedback
    await updateStatus(article.id, 'writing')

    // Create a placeholder version entry so each click creates a new version record (non-destructive)
    let createdVersionId: number | null = null
    try {
      const { data: insertedData, error: insertErr } = await client.from('article_versions').insert({ article_id: article.id, content: null } as any).select('*')
      if (insertErr) console.error('Failed to insert placeholder version', insertErr)
      else if (insertedData && Array.isArray(insertedData) && insertedData.length > 0) {
        createdVersionId = insertedData[0].id
        // update local article versions_count and set placeholder content
        const a = articles.value.find((x: any) => x.id === article.id)
        if (a) {
          a.versions_count = (a.versions_count || 0) + 1
          a.last_version_content = a.last_version_content ?? ''
        }
      }
    } catch (ie) {
      console.error('[handleWrite] error inserting placeholder version', ie)
    }

    // Call Make webhook to trigger the external drafting automation
    const makeWebhook = 'https://hook.eu2.make.com/fa1xbhnay548sl6gu5zt8amx9jecv77q'

    const payload: any = { article_id: article.id }
    if (createdVersionId) payload.version_id = createdVersionId

    console.debug('[handleWrite] calling webhook', makeWebhook, 'payload:', payload)

    const res = await fetch(makeWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    console.debug('[handleWrite] webhook response status', res.status)

    if (!res.ok) {
      // If Make returns non-2xx, mark the article as error so user can retry
      console.error('[handleWrite] Make webhook responded with non-ok status', res.status)
      await updateStatus(article.id, 'error')
    } else {
      console.debug('[handleWrite] webhook called successfully for', article.id)
      // leave status as 'writing' so server/workflow can update to 'written' when done
    }

  } catch (e) {
    console.error('[handleWrite] Error triggering write for', article.id, e)
    // Roll back status to error so user can see and retry
    try {
      await updateStatus(article.id, 'error')
    } catch (innerErr) {
      console.error('[handleWrite] failed to rollback status for', article.id, innerErr)
    }
  } finally {
    // Always clear processing flag so button becomes active again
    processingId.value = null
  }
}

const goToArticle = (id: number) => {
  router.push(`/articles/${id}`)
}

const copyLatestVersion = (article: Article) => {
  if (article.last_version_content) {
    navigator.clipboard.writeText(article.last_version_content)
    // Optional: show a toast
    alert('Contenu copié !')
  } else {
    alert('Aucun contenu à copier.')
  }
}

const deleteArticle = async (id: number) => {
  if (!confirm('Supprimer cet article ?')) return
  
  const { error: err } = await client.from('articles').delete().eq('id', id)
  if (err) {
    alert('Erreur lors de la suppression')
  } else {
    articles.value = articles.value.filter(a => a.id !== id)
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
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  cursor: default;
  vertical-align: top;
}

.article-row.clickable {
  cursor: pointer;
}

/* Rounded corners for the row */
.articles-table tr td {
  padding: 16px;
  vertical-align: top;
}

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
  background: var(--bg-card-hover);
  box-shadow: var(--shadow-md);
  position: relative;
}

.article-row:hover td:first-child {
  box-shadow: inset 4px 0 0 -1px var(--primary);
}

/* Content Styling */
.article-info {
  display: flex;
  flex-direction: column;
}

.article-title {
  font-weight: 600;
  color: #ffffff;
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
}

.version-badge {
  display: inline-block;
  margin-left: 8px;
  background: var(--bg-input);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
}

.article-date {
  font-size: 11px;
  color: var(--text-muted);
}

.article-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
  word-break: break-word;
}

.source-link-icon {
  color: var(--text-muted);
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  margin-top: 2px;
}

.source-link-icon:hover {
  background: var(--bg-card-hover);
  color: var(--primary);
  border-color: var(--primary);
}

.modules-cell {
  overflow: visible !important;
}

.error-indication {
  font-size: 10px;
  color: var(--color-error);
  margin-top: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
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
.text-danger { color: var(--color-error); }

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.btn-write {
  min-width: 90px;
  gap: 8px;
}

.loader-sm {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-icon-only {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-subtle);
}

.loading-state, .error-msg {
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-subtle);
  margin-top: 20px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-active);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
