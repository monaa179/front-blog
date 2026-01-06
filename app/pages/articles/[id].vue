<template>
  <div class="article-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      Loading article...
    </div>

    <div v-else-if="article" class="article-container">
      <!-- Main Content Column -->
      <div class="main-column">
        <header class="article-header">
           <NuxtLink to="/dashboard" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Dashboard
          </NuxtLink>
           
           <div class="title-section">
             <h1 class="article-title">{{ article.original_title }}</h1>
             <div class="article-meta-line">
               <StatusBadge :status="article.status" />
               <span class="dot">•</span>
               <span class="date">Updated {{ formatDate(article.updated_at) }}</span>
             </div>
           </div>
        </header>

        <section class="versions-section">
          <div class="versions-header">
            <h3>Contenu Rédigé</h3>
            <div class="version-tabs" v-if="versions.length > 0">
              <button 
                v-for="(ver, index) in versions" 
                :key="ver.id"
                class="version-tab"
                :class="{ active: selectedVersion?.id === ver.id, latest: index === 0 }"
                @click="selectedVersion = ver"
              >
                v{{ ver.version_number }}
                <span v-if="index === 0" class="latest-badge">(Récent)</span>
              </button>
            </div>
          </div>

          <div v-if="versions.length === 0" class="empty-state">
            <div class="empty-icon">✍️</div>
            <h4>Aucun contenu généré pour le moment</h4>
            <p>Cliquez sur "Rédiger" depuis le dashboard pour lancer la génération.</p>
          </div>

          <div v-else-if="selectedVersion" class="version-viewer">
             <div class="viewer-toolbar">
               <span class="version-timestamp">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                 Rédigé le {{ formatDate(selectedVersion.created_at) }}
               </span>
               <button class="btn btn-primary btn-sm copy-btn" @click="copyContent">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                 Copier le Markdown
               </button>
             </div>
             <div class="markdown-body">
               <div class="article-content-txt">
                 {{ selectedVersion.content }}
               </div>
             </div>
          </div>
        </section>
      </div>

      <!-- Right Sidebar -->
      <aside class="side-column">
        <div class="sidebar-card">
          <h3 class="sidebar-heading">Details</h3>
          
          <div class="detail-group">
            <label>Original Description</label>
            <p class="description-text">{{ article.original_description || 'No description provided.' }}</p>
          </div>

          <div class="detail-group">
            <label>Source URL</label>
            <a v-if="article.source_url" :href="article.source_url" target="_blank" class="link-item">
              {{ article.source_url }}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
            <span v-else class="text-muted">No source URL</span>
          </div>

          <div class="detail-group">
            <label>Modules</label>
            <div class="modules-list">
              <span v-for="mod in article.modules" :key="mod.id" class="module-tag">
                {{ mod.name }}
              </span>
              <span v-if="!article.modules || article.modules.length === 0" class="text-muted text-sm">No modules</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const route = useRoute()
const client = useSupabaseClient()
// Fix: Ensure ID is single string
const articleId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

const loading = ref(true)
const article = ref<any>(null)
const versions = ref<any[]>([])
const selectedVersion = ref<any>(null)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'MMM dd, yyyy HH:mm')
}

const fetchData = async () => {
  loading.value = true
  
  if (!articleId) {
    loading.value = false
    return
  }

  // Fetch Article + Modules
  const { data: articleData, error: articleError } = await client
    .from('articles')
    .select(`
      *,
      article_modules (
        module:modules (*)
      )
    `)
    .eq('id', articleId)
    .single()

  if (articleError) {
    console.error('Error loading article', articleError)
  } else {
    const rawData = articleData as any
    article.value = {
      ...rawData,
      modules: rawData.article_modules ? rawData.article_modules.map((am: any) => am.module) : []
    }
  }

  // Fetch Versions
  const { data: versionsData, error: versionsError } = await client
    .from('article_versions')
    .select('*')
    .eq('article_id', articleId)
    .order('version_number', { ascending: false })

  if (versionsError) {
    console.error('Error loading versions', versionsError)
  } else {
    versions.value = versionsData || []
    if (versions.value.length > 0) {
      // Latest version is the one with the highest version_number (first in the list due to order)
      selectedVersion.value = versions.value[0]
    }
  }

  loading.value = false
}

const copyContent = () => {
  if (selectedVersion.value?.content) {
    navigator.clipboard.writeText(selectedVersion.value.content)
    alert('Content copied to clipboard')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.article-page {
  padding: 40px 0;
}

.article-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: start;
}

/* Header */
.article-header {
  margin-bottom: 40px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--text-primary);
}

.title-section h1 {
  font-size: 32px;
  line-height: 1.2;
  margin-bottom: 12px;
}

.article-meta-line {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.dot {
  opacity: 0.5;
}

/* Main Column */
.versions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.versions-header h3 {
  font-size: 18px;
  color: var(--text-primary);
}

.version-tabs {
  background: var(--bg-card);
  padding: 3px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  display: flex;
}

.version-tab {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.version-tab:hover {
  color: var(--text-primary);
}

.version-tab.latest {
  border-left: 2px solid var(--primary);
}

.latest-badge {
  font-size: 10px;
  opacity: 0.7;
  margin-left: 4px;
}

.version-tab.active {
  background: var(--bg-card-hover);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  border-color: var(--border-active);
}

.version-viewer {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.viewer-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-sidebar);
}

.version-timestamp {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.markdown-body {
  padding: 48px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
  background-color: var(--bg-dark); /* Contrast for reader mode */
}

.article-content-txt {
  white-space: pre-wrap;
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  background: var(--bg-card);
  border: 2px dashed var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 60px;
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.empty-state h4 {
  font-size: 16px;
  margin-bottom: 4px;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Sidebar */
.side-column {
  position: sticky;
  top: 40px;
}

.sidebar-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.sidebar-heading {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 24px;
  font-weight: 600;
}

.detail-group {
  margin-bottom: 24px;
}

.detail-group:last-child {
  margin-bottom: 0;
}

.detail-group label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.description-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
}

.link-item {
  font-size: 14px;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  word-break: break-all;
}

.link-item:hover {
  text-decoration: underline;
}

.modules-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.module-tag {
  background: var(--bg-input);
  border: 1px solid var(--border-active);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
}

.text-muted {
  color: var(--text-muted);
}

.text-sm {
  font-size: 13px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
  color: var(--text-secondary);
  gap: 12px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-active);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
