<template>
  <div class="dashboard-page">
    <header class="page-header">
      <div class="header-text">
        <h1>Validation</h1>
        <p class="subtitle">Passez en revue et validez les nouveaux sujets d'articles.</p>
      </div>
    </header>

    <LoadingState v-if="loading" message="Chargement des propositions..." />

    <div v-else-if="error" class="error-msg glass-panel">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button class="btn btn-outline btn-sm mt-4" @click="fetch">Réessayer</button>
    </div>

    <div v-else class="content-container">
      <div v-if="proposedArticles.length > 0" class="table-card glass-panel">
        <table class="modern-table">
          <thead>
            <tr>
              <th style="width: 35%">Sujet</th>
              <th style="width: 45%">Description</th>
              <th style="width: 100px">Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <ArticleTableRow
              v-for="article in proposedArticles"
              :key="article.id"
              :article="article"
              @click="router.push(`/articles/${article.id}`)"
            >
              <template #actions>
                <div class="action-group" @click.stop>
                  <button 
                    class="btn btn-primary btn-sm btn-icon-label" 
                    @click="validateArticle(article.id)"
                    title="Valider"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Valider</span>
                  </button>

                  <button 
                    class="btn btn-ghost btn-sm btn-square text-danger"
                    @click="refuseArticle(article.id)"
                    title="Refuser"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </template>
            </ArticleTableRow>
          </tbody>
        </table>
      </div>
      
      <div v-else class="empty-state glass-panel">
        <div class="empty-illustration">☕</div>
        <h3>Tout est en ordre</h3>
        <p>Aucun nouveau sujet en attente de validation pour le moment.</p>
      </div>
    </div>
    <ConfirmModal
      :is-open="isConfirmOpen"
      title="Refuser le sujet"
      description="Voulez-vous vraiment refuser ce sujet ? Il sera envoyé à l'archive."
      confirm-label="Refuser"
      type="warning"
      :loading="actionLoading"
      @cancel="closeConfirm"
      @confirm="handleRefuse"
    />
  </div>
</template>

<script setup lang="ts">
import { useArticles } from '@/composables/useArticles'
import LoadingState from '@/components/LoadingState.vue'
import ArticleTableRow from '@/components/ArticleTableRow.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()

const { articles, loading, error, fetch, updateStatus } = useArticles({ 
  statuses: ['proposed'],
  order: { column: 'created_at', ascending: false } 
})

const proposedArticles = computed(() => articles.value.filter(article => article.status === 'proposed'))

const validateArticle = async (id: number) => {
  await updateStatus(id, 'validated')
}

// Modal State
const isConfirmOpen = ref(false)
const articleIdToRefuse = ref<number | null>(null)
const actionLoading = ref(false)

const refuseArticle = (id: number) => {
  articleIdToRefuse.value = id
  isConfirmOpen.value = true
}

const closeConfirm = () => {
  isConfirmOpen.value = false
  articleIdToRefuse.value = null
  actionLoading.value = false
}

const handleRefuse = async () => {
  if (!articleIdToRefuse.value) return
  actionLoading.value = true
  const success = await updateStatus(articleIdToRefuse.value, 'abandoned')
  if (success) {
    closeConfirm()
  } else {
    actionLoading.value = false
  }
}

onMounted(() => {
  fetch()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 40px;
}

.header-text h1 {
  font-size: 32px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 15px;
}

.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  text-align: left;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid var(--border-subtle);
}

.action-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
}

.btn-icon-label {
  padding: 0 16px;
  gap: 8px;
}

.btn-square {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-danger {
  color: var(--color-error);
}

.text-danger:hover {
  background: var(--color-error-bg);
}

.empty-state {
  padding: 80px 40px;
  text-align: center;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  max-width: 600px;
  margin: 0 auto;
}

.empty-illustration {
  font-size: 48px;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-muted);
  font-size: 14px;
}

.error-msg {
  padding: 60px;
  text-align: center;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-error);
}

.error-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.mt-4 { margin-top: 16px; }
</style>
