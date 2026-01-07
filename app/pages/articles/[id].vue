<template>
  <div class="article-page">
    <div v-if="pending" class="loading-state">
      <div class="spinner"></div>
      Chargement de l'article...
    </div>

    <div v-else-if="error" class="error-msg">
      <div class="error-info">
        <h3>Erreur lors du chargement</h3>
        <p>{{ error.message || 'Une erreur est survenue lors de la récupération des données.' }}</p>
      </div>
      <NuxtLink to="/dashboard" class="btn btn-secondary">Retour au dashboard</NuxtLink>
    </div>

    <div v-else-if="article" class="article-container">
      <!-- Main Content Column -->
      <div class="main-column">
        <header class="article-header">
           <NuxtLink to="/dashboard" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Retour au Dashboard
          </NuxtLink>
           
           <div class="title-section">
             <h1 class="article-title">{{ article.original_title }}</h1>
             <div class="article-meta-line">
               <StatusBadge :status="article.status" />
               <span class="dot">•</span>
               <span class="date">Mis à jour le {{ formatDate(article.updated_at) }}</span>
             </div>
           </div>
        </header>

        <section class="content-section">
          <div class="section-header">
            <h3>Contenu Rédigé</h3>
            <div class="version-info" v-if="versions.length > 0">
              <span class="version-count">{{ versions.length }} version(s) disponible(s)</span>
            </div>
          </div>

          <!-- Multiple Versions Selector -->
          <div class="version-selector" v-if="versions.length > 1">
            <label for="version-select">Choisir une version :</label>
            <select id="version-select" v-model="selectedVersionIndex">
              <option v-for="(v, idx) in versions" :key="v.id" :value="idx">
                Version {{ v.version_number || versions.length - idx }} ({{ formatDate(v.created_at) }})
              </option>
            </select>
          </div>

          <div v-if="versions.length === 0" class="empty-state">
            <div class="empty-icon">✍️</div>
            <h4>Aucun contenu rédigé pour cet article</h4>
            <p>Le contenu apparaîtra ici une fois la rédaction terminée.</p>
          </div>

          <div v-else class="content-editor">
            <div class="editor-toolbar">
              <div class="toolbar-left">
                <span class="version-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Version du {{ formatDate(latestVersion?.created_at) }}
                </span>
                <span v-if="isModified" class="modified-badge">Modifié</span>
              </div>
              <div class="toolbar-actions">
                <button v-if="isModified" class="btn btn-ghost btn-sm reset-btn" @click="resetContent">
                  Réinitialiser
                </button>
                <button class="btn btn-primary btn-sm copy-btn" @click="copyContent" :disabled="!editedContent">
                  <template v-if="showCopySuccess">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Copié ✓
                  </template>
                  <template v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copier le contenu
                  </template>
                </button>
              </div>
            </div>
            <div class="editor-body">
              <textarea 
                v-model="editedContent" 
                class="markdown-editor" 
                placeholder="Le contenu de cette version est vide. Commencez à rédiger ici..."
              ></textarea>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Sidebar -->
      <aside class="side-column">
        <div class="sidebar-card">
          <h3 class="sidebar-heading">Détails de l'article</h3>
          
          <div class="detail-group">
            <label>Description originale</label>
            <p class="description-text">{{ article.original_description || 'Aucune description fournie.' }}</p>
          </div>

          <div class="detail-group">
            <label>URL Source</label>
            <a v-if="article.source_url" :href="article.source_url" target="_blank" class="link-item">
              Voir la source
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
            <span v-else class="text-muted">Aucune URL source</span>
          </div>

          <div class="detail-group">
            <label>Modules activés</label>
            <div class="modules-list">
              <span v-for="am in article.article_modules" :key="am.module.id" class="module-tag">
                {{ am.module.name }}
              </span>
              <span v-if="!article.article_modules || article.article_modules.length === 0" class="text-muted text-sm">Aucun module</span>
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
const articleId = route.params.id

// Fetch article and its versions in a single query
const { data: article, pending, error } = await useAsyncData(`article-${articleId}`, async () => {
    const { data, error } = await client
        .from('articles')
        .select(`
            *,
            article_modules (
                module:modules (*)
            ),
            article_versions (*)
        `)
        .eq('id', articleId)
        .single()
    
    if (error) throw error
    return data
})

// Current selected version index (0 = most recent)
const selectedVersionIndex = ref(0)

// Computed versions sorted by created_at DESC
const versions = computed(() => {
    if (!article.value?.article_versions) return []
    return [...article.value.article_versions].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
})

const latestVersion = computed(() => versions.value[selectedVersionIndex.value] || null)
const currentContent = computed(() => latestVersion.value?.content || null)

const editedContent = ref('')
const showCopySuccess = ref(false)

const isModified = computed(() => {
    const original = currentContent.value || ''
    return editedContent.value !== original
})

const resetContent = () => {
    editedContent.value = currentContent.value || ''
}

// Watch for version changes to update the editor
watch(currentContent, (newVal) => {
    editedContent.value = newVal || ''
}, { immediate: true })

const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-'
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm')
}

const copyContent = () => {
    if (editedContent.value) {
        navigator.clipboard.writeText(editedContent.value)
        showCopySuccess.value = true
        setTimeout(() => {
            showCopySuccess.value = false
        }, 2000)
    }
}
</script>

<style scoped>
.article-page {
  padding: 40px 0;
}

.article-container {
  display: grid;
  grid-template-columns: 1fr 340px;
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
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 24px;
  transition: color 0.2s;
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary);
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 12px;
  color: var(--text-primary);
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

/* Content Section */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.version-count {
  font-size: 13px;
  color: var(--text-muted);
}

.version-selector {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card);
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.version-selector label {
  font-size: 13px;
  color: var(--text-secondary);
}

.version-selector select {
  background: var(--bg-input);
  border: 1px solid var(--border-active);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  outline: none;
}

.content-editor {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-sidebar);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modified-badge {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.reset-btn {
  color: var(--text-secondary);
  font-weight: 500;
}

.reset-btn:hover {
  color: var(--text-primary);
  background: var(--bg-input);
}

.version-tag {
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
  min-width: 160px;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.editor-body {
  padding: 0;
  position: relative;
}

.markdown-editor {
  width: 100%;
  min-height: 600px;
  padding: 32px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  resize: vertical;
  outline: none;
  white-space: pre-wrap;
  word-break: break-word;
}

.markdown-editor::placeholder {
  color: var(--text-muted);
  opacity: 0.5;
}

.empty-state {
  background: var(--bg-card);
  border: 2px dashed var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 80px 40px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h4 {
  font-size: 18px;
  margin-bottom: 8px;
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
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 24px;
  font-weight: 700;
}

.detail-group {
  margin-bottom: 28px;
}

.detail-group:last-child {
  margin-bottom: 0;
}

.detail-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
}

.link-item {
  font-size: 14px;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
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
  font-weight: 600;
  color: var(--text-secondary);
}

.loading-state, .error-msg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px;
  min-height: 50vh;
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-active);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.error-info h3 {
  color: var(--color-error);
  margin-bottom: 12px;
}

.error-info p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .article-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .side-column {
    position: static;
  }
}
</style>
