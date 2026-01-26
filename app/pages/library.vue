<template>
  <div class="library-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Bibliothèque</h1>
          <p class="subtitle">Gerez la rédaction et la publication de vos contenus.</p>
        </div>
        
        <div class="header-actions">
          <div class="filter-wrapper">
            <label class="sr-only">Filtrer par module</label>
            <div class="select-container">
              <svg class="select-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9v6l4 2v-8L22 3z"></path></svg>
              <select v-model="selectedModuleId" class="minimal-select">
                <option :value="null">Tous les modules</option>
                <option v-for="mod in allModules" :key="mod.id" :value="mod.id">
                  {{ mod.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="board-container">
      <LoadingState v-if="loading" message="Chargement de vos articles..." />

      <div v-else class="kanban-board">
        <div v-for="col in columns" :key="col.id" class="kanban-column" :class="col.id">
          <div class="column-header">
            <div class="column-title-group">
              <div class="status-dot" :class="col.id"></div>
              <h3>{{ col.title }}</h3>
            </div>
            <span class="count-badge">{{ col.articles.length }}</span>
          </div>
          
          <div class="column-content scroll-y">
            <ArticleCard
              v-for="article in col.articles"
              :key="article.id"
              :article="article"
              :available-modules="allModules"
              @click="router.push(`/articles/${article.id}`)"
              @delete="openDeleteConfirm"
              @update-modules="updateModules"
            >
              <template #actions>
                <button 
                  v-if="col.id === 'validated' || col.id === 'toWrite'"
                  class="btn btn-primary btn-sm btn-full" 
                  @click.stop="handleWrite(article)"
                  :disabled="processingId === article.id"
                >
                  <div v-if="processingId === article.id" class="loader-sm"></div>
                  <span>{{ getWriteButtonText(article, col.id) }}</span>
                </button>

                <template v-if="col.id === 'toWrite'">
                  <button 
                    class="btn btn-ghost btn-sm btn-square" 
                    @click.stop="updateStatus(article.id, 'validated')"
                    title="Retour vers Validé"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </button>
                </template>

                <template v-if="col.id === 'written'">
                  <button 
                    class="btn btn-outline btn-sm btn-full" 
                    @click.stop="handleWrite(article)"
                    :disabled="processingId === article.id"
                  >
                    <div v-if="processingId === article.id" class="loader-sm"></div>
                    <span>{{ (processingId === article.id) ? 'Lancement...' : 'Re-rédiger' }}</span>
                  </button>
                  <button class="btn btn-ghost btn-sm btn-square" @click.stop="copyContent(article)" title="Copier le contenu">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                </template>

                <template v-if="col.id === 'published'">
                  <button class="btn btn-ghost btn-sm btn-full" @click.stop="copyContent(article)">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                     Copier
                  </button>
                </template>
              </template>
            </ArticleCard>

            <div v-if="col.articles.length === 0" class="empty-column">
              <div class="empty-icon">✨</div>
              <p>{{ col.emptyMessage }}</p>
            </div>
            </div>
          </div>
      </div>
    </div>
    <ConfirmModal
      :is-open="isConfirmOpen"
      :title="confirmTitle"
      :description="confirmDescription"
      :confirm-label="confirmLabel"
      type="danger"
      :loading="actionLoading"
      show-archive
      @cancel="closeConfirm"
      @confirm="handleDeleteDefinitely"
      @confirm-archive="handleArchive"
    />
  </div>
</template>

<script setup lang="ts">
import { useArticles } from '@/composables/useArticles'
import type { Article } from '@/types/article'
import LoadingState from '@/components/LoadingState.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const client = useSupabaseClient()
const router = useRouter()

const selectedModuleId = ref<number | null>(null)
const processingId = ref<number | null>(null)

// Modal State
const isConfirmOpen = ref(false)
const articleToProcess = ref<Article | null>(null)
const actionLoading = ref(false)
const confirmTitle = ref('Supprimer l\'article')
const confirmDescription = ref('Voulez-vous archiver cet article ou le supprimer définitivement ?')
const confirmLabel = ref('Supprimer définitivement')

const { 
  articles, 
  loading, 
  allModules,
  fetch: fetchLibraryArticles,
  fetchModules,
  archiveArticle: archiveArticleAction,
  deleteArticle: deleteArticleAction,
  updateStatus,
  updateModules
} = useArticles({ 
  statuses: ['validated', 'written', 'published', 'error'], 
  order: { column: 'created_at', ascending: false } 
})

const filteredArticles = computed(() => {
  if (!selectedModuleId.value) return articles.value
  return articles.value.filter(art => 
    art.modules.some(m => m.id === selectedModuleId.value)
  )
})

const columns = computed(() => [
  {
    id: 'validated',
    title: 'Idées Validées',
    articles: filteredArticles.value.filter(a => a.status === 'validated'),
    emptyMessage: 'Aucune idée validée.'
  },
  {
    id: 'toWrite',
    title: 'En Rédaction',
    articles: filteredArticles.value.filter(a => ['error'].includes(a.status)),
    emptyMessage: 'Rien en cours.'
  },
  {
    id: 'written',
    title: 'Prêt',
    articles: filteredArticles.value.filter(a => a.status === 'written'),
    emptyMessage: 'Rien de prêt.'
  },
  {
    id: 'published',
    title: 'Publié',
    articles: filteredArticles.value.filter(a => a.status === 'published'),
    emptyMessage: 'Aucun article publié.'
  }
])

const getWriteButtonText = (article: Article, columnId: string) => {
  if (processingId.value === article.id) return 'Envoi...'
  if (columnId === 'validated') return 'Lancer la rédaction'
  return 'Relancer'
}

const copyContent = (article: Article) => {
  if (article.last_version_content) {
    navigator.clipboard.writeText(article.last_version_content)
  }
}

const handleWrite = async (article: Article) => {
  processingId.value = article.id
  try {
    const { data: vData } = await client.from('article_versions').insert({ article_id: article.id, content: null } as any).select('*')
    const versionId = (vData as any)?.[0]?.id

    const makeWebhook = 'https://hook.eu2.make.com/fa1xbhnay548sl6gu5zt8amx9jecv77q'
    const res = await fetch(makeWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        article_id: article.id, 
        version_id: versionId,
        modules: article.modules?.map((m: any) => m.name)
      })
    })

    if (!res.ok) {
      await updateStatus(article.id, 'validated')
    }
  } catch (e) {
    console.error(e)
  } finally {
    processingId.value = null
  }
}

/* ===========================
   CONFIRM MODAL HANDLERS
=========================== */
const openDeleteConfirm = (id: number) => {
  const art = articles.value.find(a => a.id === id)
  if (art) {
    articleToProcess.value = art
    isConfirmOpen.value = true
  }
}

const closeConfirm = () => {
  isConfirmOpen.value = false
  articleToProcess.value = null
  actionLoading.value = false
}

const handleArchive = async () => {
  if (!articleToProcess.value) return
  actionLoading.value = true
  const success = await archiveArticleAction(articleToProcess.value.id)
  if (success) {
    closeConfirm()
  } else {
    actionLoading.value = false
  }
}

const handleDeleteDefinitely = async () => {
  if (!articleToProcess.value) return
  actionLoading.value = true
  const success = await deleteArticleAction(articleToProcess.value.id)
  if (success) {
    closeConfirm()
  } else {
    actionLoading.value = false
  }
}

onMounted(() => {
  fetchModules()
  fetchLibraryArticles()
})
</script>

<style scoped>
.library-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 96px);
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-text h1 {
  font-size: 32px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 15px;
}

/* Minimal Select */
.select-container {
  position: relative;
  display: flex;
  align-items: center;
}

.select-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.minimal-select {
  padding-left: 36px;
  width: 220px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  appearance: none;
  cursor: pointer;
}

.minimal-select:hover {
  background: var(--bg-card-hover);
}

.board-container {
  flex: 1;
  overflow: hidden;
  display: flex;
}

.kanban-board {
  display: flex;
  gap: 20px;
  width: 100%;
  padding-bottom: 8px;
}

.kanban-column {
  flex: 1;
  min-width: 300px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.column-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.01);
}

.column-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.validated { background: var(--color-info); }
.status-dot.toWrite { background: var(--primary); }
.status-dot.written { background: var(--color-success); }
.status-dot.published { background: var(--text-muted); }

.column-header h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.count-badge {
  background: var(--border-subtle);
  color: var(--text-secondary);
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
}

.column-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
}

.scroll-y { overflow-y: auto; }
.scroll-y::-webkit-scrollbar { width: 4px; }

.btn-full { flex: 1; }
.btn-square { width: 34px; padding: 0; flex-shrink: 0; }

.empty-column {
  padding: 40px 20px;
  text-align: center;
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-lg);
  margin-top: 8px;
}

.empty-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.empty-column p {
  font-size: 13px;
  color: var(--text-muted);
}

.loader-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 10px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
