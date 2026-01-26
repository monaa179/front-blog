<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div class="header-text">
        <h1>Archive</h1>
        <p class="subtitle">Gestion des articles refusés : nettoyage et récupération.</p>
      </div>
    </div>

    <LoadingState v-if="loading" message="Chargement des articles..." />

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
            <th style="width: 90px">Date</th>
            <th style="width: 120px">Statut</th>
            <th style="width: 140px; text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <ArticleTableRow
            v-for="article in articles"
            :key="article.id"
            :article="article"
            show-status
          >
            <template #actions>
              <button 
                class="btn btn-ghost btn-sm btn-icon-only" 
                @click="restoreArticle(article.id)"
                title="Restaurer l'article (remettre en validé)"
              >
                <span style="font-size: 16px;">♻️</span>
              </button>

              <button 
                class="btn btn-ghost btn-sm btn-icon-only text-danger"
                @click="deleteArticle(article.id)"
                title="Supprimer définitivement"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </template>
          </ArticleTableRow>
        </tbody>
      </table>
    </div>
    <ConfirmModal
      :is-open="isConfirmOpen"
      title="Supprimer définitivement"
      description="Êtes-vous sûr de vouloir supprimer définitivement cet article ? Cette action est irréversible."
      confirm-label="Supprimer définitivement"
      type="danger"
      :loading="actionLoading"
      @cancel="closeConfirm"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useArticles } from '@/composables/useArticles';
import LoadingState from '@/components/LoadingState.vue';
import ArticleTableRow from '@/components/ArticleTableRow.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

const { articles, fetch, loading, error, deleteArticle: apiDeleteArticle, updateStatus } = useArticles({ statuses: ['abandoned', 'error'] });

const restoreArticle = async (id: number) => {
  await updateStatus(id, 'validated');
};

// Modal State
const isConfirmOpen = ref(false)
const articleIdToDelete = ref<number | null>(null)
const actionLoading = ref(false)

const deleteArticle = (id: number) => {
  articleIdToDelete.value = id
  isConfirmOpen.value = true
}

const closeConfirm = () => {
  isConfirmOpen.value = false
  articleIdToDelete.value = null
  actionLoading.value = false
}

const handleDelete = async () => {
  if (!articleIdToDelete.value) return
  actionLoading.value = true
  const success = await apiDeleteArticle(articleIdToDelete.value);
  if (success) {
    closeConfirm()
  } else {
    actionLoading.value = false
  }
};

onMounted(() => {
  fetch();
});
</script>

<style scoped>
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

.articles-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
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

.btn-icon-only {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-subtle);
}

.text-danger { color: var(--color-error); }

.error-msg {
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
</style>