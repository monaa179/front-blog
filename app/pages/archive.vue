<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div class="header-text">
        <h1>Archive</h1>
        <p class="subtitle">Vue d'ensemble des articles abandonnés.</p>
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
            <th style="width: 90px">Date</th>
            <th style="width: 120px">Statut</th>
            <th style="width: 140px; text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="article in articles" 
            :key="article.id" 
            class="article-row clickable"
            @click="goToArticle(article.id)"
          >
            <td>
              <div class="article-info">
                <div class="title-with-favorite">
                  <a href="#" @click.prevent>{{ article.original_title }}</a>
                  <span v-if="article.versions_count > 0" class="version-badge">{{ article.versions_count }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="article-desc">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
              <span v-else class="text-muted">—</span>
            </td>
            <td>
              <span class="article-date">{{ formatDate(article.created_at) }}</span>
            </td>
            <td class="status-cell" @click.stop>
              <div class="status-wrapper">
                <StatusBadge :status="article.status" />
                <select 
                  class="status-select-hidden"
                  :value="article.status"
                  @change="(e) => updateStatus(article.id, (e.target as HTMLSelectElement).value)"
                >
                  <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </td>
            <td class="text-right" @click.stop>
              <div class="actions">
                <button 
                  class="btn btn-primary btn-sm btn-write" 
                  @click="handleWrite(article)"
                  :disabled="processingId === article.id"
                >
                  <div v-if="processingId === article.id" class="loader-sm"></div>
                  <span>{{ (processingId === article.id) ? 'Rédaction...' : 'Rédiger' }}</span>
                </button>

                <button 
                  v-if="article.versions_count > 0"
                  class="btn btn-ghost btn-sm btn-icon-only"
                  @click="copyLatestVersion(article)"
                  title="Copier le contenu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>

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
import { ref, onMounted } from 'vue';
import { useArticles } from '@/composables/useArticles';
import { format } from 'date-fns';
import StatusBadge from '@/components/StatusBadge.vue';
import { useRouter } from 'vue-router';

const { articles, fetch, loading, error } = useArticles({ statuses: ['abandoned'] });
const statusOptions = ['proposed', 'writing', 'written', 'validated', 'published', 'error', 'abandoned'];
const processingId = ref<number | null>(null);
const router = useRouter();

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return format(new Date(dateStr), 'dd/MM/yyyy');
};

const goToArticle = (id: number) => {
  router.push(`/articles/${id}`);
};

const updateStatus = async (id: number, newStatus: string) => {
  const article = articles.value.find(a => a.id === id);
  if (article) article.status = newStatus;

  const { error: err } = await useSupabaseClient().from('articles').update({ status: newStatus }).eq('id', id);
  if (err) {
    console.error('Failed to update status', err);
  } else {
    await fetch();
  }
};

const handleWrite = async (article: any) => {
  processingId.value = article.id;

  try {
    await updateStatus(article.id, 'writing');

    const makeWebhook = 'https://hook.eu2.make.com/fa1xbhnay548sl6gu5zt8amx9jecv77q';
    const payload: any = { article_id: article.id };

    const res = await fetch(makeWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error('Make webhook responded with non-ok status', res.status);
      await updateStatus(article.id, 'error');
    }
  } catch (e) {
    console.error('Error triggering write for', article.id, e);
    await updateStatus(article.id, 'error');
  } finally {
    processingId.value = null;
  }
};

const copyLatestVersion = (article: any) => {
  if (article.last_version_content) {
    navigator.clipboard.writeText(article.last_version_content);
    alert('Contenu copié !');
  } else {
    alert('Aucun contenu à copier.');
  }
};

const deleteArticle = async (id: number) => {
  if (!confirm('Supprimer cet article ?')) return;

  const { error: err } = await useSupabaseClient().from('articles').delete().eq('id', id);
  if (err) {
    alert('Erreur lors de la suppression');
  } else {
    articles.value = articles.value.filter(a => a.id !== id);
  }
};

onMounted(() => {
  fetch();
});
</script>

<style scoped>
.dashboard-page {
  /* Add styles here or remove this block */
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
  /* Add styles here or remove this block */
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
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
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
  z-index: 1;
}

.article-row:hover td {
  border-top-color: var(--border-active);
  border-bottom-color: var(--border-active);
}

.article-row:hover td:first-child {
  border-left-color: var(--border-active);
  box-shadow: inset 4px 0 0 -1px var(--primary);
}

.article-row:hover td:last-child {
  border-right-color: var(--border-active);
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

.title-with-favorite {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-favorite {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-favorite:hover {
  transform: scale(1.1);
  color: var(--primary);
}

.btn-favorite.is-favorite {
  color: #ff4757; /* A nice red for favorites */
}

.btn-favorite svg {
  width: 16px;
  height: 16px;
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

.loader-xs {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 71, 87, 0.3);
  border-top-color: #ff4757;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-favorite:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  border-top-color: #primary;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 16px;
}
</style>