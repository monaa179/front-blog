<template>
  <div class="favorites-page">
    <div class="page-header">
      <div class="header-text">
        <h1>Mes Favoris</h1>
        <p class="subtitle">Vos articles préférés en un seul endroit.</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Chargement de vos favoris...</span>
    </div>

    <div v-else-if="error" class="error-msg">
      <div class="error-icon">⚠️</div>
      {{ error }}
    </div>

    <div v-else-if="favoritedArticles.length === 0" class="empty-state">
      <div class="empty-icon">❤️</div>
      <h3>Aucun favori pour le moment</h3>
      <p>Parcourez le dashboard et cliquez sur le cœur pour ajouter des articles à vos favoris.</p>
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
            v-for="article in favoritedArticles" 
            :key="article.id" 
            class="article-row clickable"
            @click="goToArticle(article.id)"
          >
            <td>
              <div class="article-info">
                  <div class="title-with-favorite">
                    <button 
                      class="btn-favorite is-favorite" 
                      @click.stop="toggleFavorite(article.id)"
                      :disabled="pendingIds.has(article.id)"
                      title="Retirer des favoris"
                    >
                      <div v-if="pendingIds.has(article.id)" class="loader-xs"></div>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
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
              </div>
            </td>
            <td class="modules-cell" @click.stop>
              <div class="modules-list">
                <span v-for="m in article.modules" :key="m.id" class="module-mini-badge">
                  {{ m.name }}
                </span>
                <span v-if="article.modules.length === 0" class="text-muted">—</span>
              </div>
            </td>
            <td>
              <span class="article-date">{{ formatDate(article.created_at) }}</span>
            </td>
            <td class="text-right" @click.stop>
              <div class="actions">
                <button 
                  v-if="article.versions_count > 0"
                  class="btn btn-ghost btn-sm btn-icon-only"
                  @click="copyLatestVersion(article)"
                  title="Copier le contenu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
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
const { favoriteIds, pendingIds, toggleFavorite, fetchFavorites } = useFavorites()

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
const favoritedArticles = ref<Article[]>([])

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'dd/MM/yyyy')
}

const fetchFavoritedArticles = async () => {
  if (!user.value?.id) {
    console.warn('[FavoritesPage] fetchFavoritedArticles called but user.id is missing')
    return
  }
  
  loading.value = true
  error.value = null

  try {
    // We join article_favorites with articles
    const { data, error: err } = await client
      .from('article_favorites')
      .select(`
        article_id,
        article:articles (
          *,
          article_modules (
            module:modules (*)
          ),
          article_versions (
            content,
            created_at
          )
        )
      `)
      .eq('user_id', user.value.id)

    if (err) throw err

    favoritedArticles.value = (data as any[]).map(row => {
      const article = row.article
      if (!article) return null

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
    }).filter(Boolean) as Article[]

  } catch (err: any) {
    console.error('[FavoritesPage] Supabase Error:', err)
    error.value = `Erreur: ${err.message || 'Impossible de charger vos favoris.'}`
  } finally {
    loading.value = false
  }
}

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

// Watch favoriteIds to remove articles from the list when unfavorited
watch(favoriteIds, (newVal) => {
  favoritedArticles.value = favoritedArticles.value.filter(a => newVal.has(a.id))
}, { deep: true })

// Load favorites when user is available
watch(() => user.value?.id, async (userId) => {
  if (userId) {
    console.log('[FavoritesPage] User available, fetching favorites...', userId)
    await fetchFavorites() // Sync global favorite IDs
    await fetchFavoritedArticles()
  } else {
    loading.value = false
  }
}, { immediate: true })
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

@keyframes spin { to { transform: rotate(360deg); } }
</style>
