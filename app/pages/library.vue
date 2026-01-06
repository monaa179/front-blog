<template>
  <div class="library-page">
    <div class="page-header">
      <div class="header-text">
        <h1>Bibliothèque</h1>
        <p class="subtitle">Consultez l'historique complet de vos rédactions.</p>
      </div>
      
      <div class="header-filters">
        <div class="filter-group">
          <label>Module</label>
          <select v-model="selectedModuleId" class="filter-select">
            <option :value="null">Tous les modules</option>
            <option v-for="mod in allModules" :key="mod.id" :value="mod.id">
              {{ mod.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Chargement de la bibliothèque...</span>
    </div>

    <div v-else-if="filteredArticles.length === 0" class="empty-library">
      <div class="empty-icon">📚</div>
      <h3>Aucun article trouvé</h3>
      <p v-if="selectedModuleId">Aucun article ne correspond à ce module.</p>
      <p v-else>Vous n'avez pas encore d'articles rédigés.</p>
    </div>

    <div v-else class="library-container">
      <div class="library-grid">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id" 
          class="library-card"
          @click="router.push(`/articles/${article.id}`)"
        >
          <div class="card-header">
            <div class="card-title-group">
              <h4 class="card-title">{{ article.original_title }}</h4>
              <span class="card-date">{{ formatLibraryDate(article.last_version_at) }}</span>
            </div>
            <StatusBadge :status="article.status" />
          </div>
          
          <p class="card-desc">{{ article.original_description }}</p>
          
          <div class="card-footer">
            <div class="card-modules">
              <span v-for="mod in article.modules" :key="mod.id" class="mini-tag">
                {{ mod.name }}
              </span>
            </div>
            <div class="card-actions">
               <button class="btn btn-ghost btn-sm btn-icon-only" @click.stop="copyContent(article)">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const client = useSupabaseClient()
const router = useRouter()

interface Article {
  id: number;
  original_title: string;
  original_description: string;
  status: string;
  created_at: string;
  last_version_at: string | null;
  last_version_content: string | null;
  modules: any[];
}

const loading = ref(true)
const articles = ref<Article[]>([])
const allModules = ref<any[]>([])
const selectedModuleId = ref<number | null>(null)

const fetchModules = async () => {
  const { data } = await client.from('modules').select('*').eq('active', true)
  allModules.value = data || []
}

const fetchLibrary = async () => {
  loading.value = true
  
  // Fetch articles that have at least one version
  const { data, error } = await client
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
    .in('status', ['written', 'validated', 'published'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching library:', error)
  } else {
    articles.value = (data as any[]).map(art => {
      const versions = art.article_versions || []
      const lastVersion = versions.length > 0 
        ? versions.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null
        
      return {
        ...art,
        modules: art.article_modules ? art.article_modules.map((am: any) => am.module) : [],
        last_version_at: lastVersion?.created_at || art.created_at,
        last_version_content: lastVersion?.content || null
      }
    }).sort((a, b) => new Date(b.last_version_at!).getTime() - new Date(a.last_version_at!).getTime())
  }
  
  loading.value = false
}

const filteredArticles = computed(() => {
  if (!selectedModuleId.value) return articles.value
  return articles.value.filter(art => 
    art.modules.some(m => m.id === selectedModuleId.value)
  )
})

const formatLibraryDate = (dateStr: string | null) => {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'd MMMM yyyy', { locale: fr })
}

const copyContent = (article: Article) => {
  if (article.last_version_content) {
    navigator.clipboard.writeText(article.last_version_content)
    alert('Contenu copié !')
  }
}

onMounted(() => {
  fetchModules()
  fetchLibrary()
})
</script>

<style scoped>

.page-header {
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-text h1 {
  font-size: 24px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.header-filters {
  display: flex;
  gap: 16px;
}

.filter-group label {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
  display: block;
}

.filter-select {
  width: 200px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-subtle);
}

.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.library-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.library-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  background: var(--bg-card-hover);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-title-group {
  flex: 1;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.card-date {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
  margin-top: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.card-modules {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mini-tag {
  background: var(--bg-input);
  border: 1px solid var(--border-active);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  color: var(--text-secondary);
}

.loading-state, .empty-library {
  padding: 100px;
  text-align: center;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-subtle);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-active);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin: 0 auto 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
