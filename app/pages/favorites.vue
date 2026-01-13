<template>
  <div class="favorites-page">
    <div class="page-header">
        <div class="header-text">
          <h1>Favoris</h1>
          <p class="subtitle">Tous les articles validés.</p>
        </div>
      </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Chargement des articles validés...</span>
    </div>

    <div v-else-if="error" class="error-msg">
      <div class="error-icon">⚠️</div>
      {{ error }}
    </div>

    <div v-else-if="validatedArticles.length === 0" class="empty-state">
      <div class="empty-icon">📄</div>
      <h3>Aucun article validé pour le moment</h3>
      <p>Les articles validés apparaîtront ici.</p>
      <NuxtLink to="/dashboard" class="btn btn-primary mt-4">Retour au Dashboard</NuxtLink>
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
            v-for="article in validatedArticles" 
            :key="article.id" 
            class="article-row clickable"
            @click="goToArticle(article.id)"
          >
            <td>
              <div class="article-info">
                  <div class="title-with-favorite">
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
                <option value="validated">validated</option>
                <option value="published">published</option>
                <option value="abandoned">abandoned</option>
                <option value="proposed">proposed</option>
                <option value="writting">writing</option>
              </select>
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
import { ref, onMounted } from 'vue';

const router = useRouter()

// Use the shared articles composable and request only VALIDATED articles.
// Note: to be robust against casing in the DB we request both 'VALIDATED' and 'validated'.
// Business requirement: only show articles where status = 'VALIDATED'.
const { articles: validatedArticles, loading, error, fetch: fetchArticles } = useArticles({ statuses: ['validated', 'writing'], order: { column: 'created_at', ascending: false } })

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

// validatedArticles is provided by useArticles

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'dd/MM/yyyy')
}

// fetch is provided by useArticles

const goToArticle = (id: number) => {
  router.push(`/articles/${id}`)
}

const copyLatestVersion = (article: Article) => {
  if (article.last_version_content) {
    navigator.clipboard.writeText(article.last_version_content)
    alert('Contenu copié !')
  } else {
    alert('Aucun contenu à copier.')
  }
}

const allModules = ref<Module[]>([]);

const fetchModules = async () => {
  const { data, error: err } = await client.from('modules').select('*').eq('active', true);
  if (err) console.error('Error fetching modules:', err);
  else allModules.value = (data as any[]) || [];
};

const updateModules = async (articleId: number, newModules: any[]) => {
  const article = validatedArticles.value.find(a => a.id === articleId);
  if (article) article.modules = newModules;

  const { error: deleteErr } = await client.from('article_modules').delete().eq('article_id', articleId);
  if (deleteErr) {
    console.error('Error deleting modules', deleteErr);
    return;
  }

  if (newModules.length > 0) {
    const insertData = newModules.map(m => ({
      article_id: articleId,
      module_id: m.id
    }));

    const { error: insertErr } = await client.from('article_modules').insert(insertData as any);
    if (insertErr) console.error('Error inserting modules', insertErr);
  }
};

const deleteArticle = async (id: number) => {
  if (!confirm('Supprimer cet article ?')) return;

  const { error: err } = await client.from('articles').delete().eq('id', id);
  if (err) {
    alert('Erreur lors de la suppression');
  } else {
    validatedArticles.value = validatedArticles.value.filter(a => a.id !== id);
  }
};

const processingId = ref<number | null>(null);

const updateStatus = async (id: number, newStatus: string) => {
  const article = validatedArticles.value.find(a => a.id === id);
  if (article) article.status = newStatus;

  const { error: err } = await client.from('articles').update({ status: newStatus }).eq('id', id);
  if (err) {
    console.error('Failed to update status', err);
  } else {
    await fetchArticles();
  }
};

const handleWrite = async (article: any) => {
  console.debug('[handleWrite] clicked for article', article?.id);

  processingId.value = article.id;

  try {
    console.debug('[handleWrite] setting status -> writing (local + db) for', article.id);
    await updateStatus(article.id, 'writing');

    let createdVersionId: number | undefined;
    try {
      const { data: insertedData, error: insertErr } = await client.from('article_versions').insert({ article_id: article.id, content: null } as any).select('*');
      if (insertErr) console.error('Failed to insert placeholder version', insertErr);
      else if (insertedData && insertedData.length > 0) {
        createdVersionId = insertedData[0].id;
        const a = validatedArticles.value.find((x: any) => x.id === article.id);
        if (a) {
          a.versions_count = (a.versions_count || 0) + 1;
          a.last_version_content = a.last_version_content ?? '';
        }
      }
    } catch (ie) {
      console.error('[handleWrite] error inserting placeholder version', ie);
    }

    const makeWebhook = 'https://hook.eu2.make.com/fa1xbhnay548sl6gu5zt8amx9jecv77q';

    const payload: any = { article_id: article.id };
    if (createdVersionId) payload.version_id = createdVersionId;

    console.debug('[handleWrite] calling webhook', makeWebhook, 'payload:', payload);

    const res = await fetch(makeWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.debug('[handleWrite] webhook response status', res.status);

    if (!res.ok) {
      console.error('[handleWrite] Make webhook responded with non-ok status', res.status);
      await updateStatus(article.id, 'error');
    } else {
      console.debug('[handleWrite] webhook called successfully for', article.id);
    }

  } catch (e) {
    console.error('[handleWrite] Error triggering write for', article.id, e);
    try {
      await updateStatus(article.id, 'error');
    } catch (innerErr) {
      console.error('[handleWrite] failed to rollback status for', article.id, innerErr);
    }
  } finally {
    processingId.value = null;
  }
};

// Watch favoriteIds to remove articles from the list when unfavorited
onMounted(() => {
  fetchModules();
  fetchArticles();
})
</script>

<style scoped>

.page-header {
  margin-bottom: 32px;
}

.header-text h1 {
  font-size: 20px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 13px;
}

/* Table styling (matches dashboard) */
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

.article-row {
  background: var(--bg-card);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.article-row:hover {
  background: var(--bg-card-hover);
  box-shadow: var(--shadow-md);
}

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
  color: #ff4757;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-favorite:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.article-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

.module-mini-badge {
  display: inline-block;
  background: var(--bg-input);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  margin-right: 4px;
  margin-bottom: 4px;
  border: 1px solid var(--border-subtle);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-subtle);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 24px;
  opacity: 0.3;
}

.loader-xs {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 71, 87, 0.3);
  border-top-color: #ff4757;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-state, .error-msg {
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
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
.status-wrapper {
  position: relative;
  display: inline-block;
}

.status-select-hidden {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
