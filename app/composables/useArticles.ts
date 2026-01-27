import { ref } from 'vue'
import type { Article, Module } from '@/types/article'

/**
 * useArticles
 * Fetch articles with modules and versions. Reusable between Dashboard and Library.
 * Options:
 *  - statuses: string[] optional list of statuses to filter
 *  - order: { column: string, ascending: boolean }
 */
export const useArticles = (
  options: { statuses?: string[]; order?: { column: string; ascending: boolean } } = {}
) => {
  const client = useSupabaseClient()

  const articles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const allModules = ref<Module[]>([])

  /* ===========================
     FETCH ARTICLES (LIST)
  =========================== */
  const fetch = async () => {
    loading.value = true
    error.value = null

    try {
      const query = client
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

      if (options.statuses && options.statuses.length > 0) {
        query.in('status', options.statuses)
      }

      const orderCol = options.order?.column || 'created_at'
      const ascending = !!options.order?.ascending

      const { data, error: err } = await query.order(orderCol, { ascending })
      if (err) throw err

      articles.value = (data as any[]).map(article => {
        const versions = article.article_versions || []
        const lastVersion = versions.length
          ? versions.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]
          : null

        return {
          ...article,
          modules: article.article_modules
            ? article.article_modules.map((am: any) => am.module)
            : [],
          last_version_content: lastVersion?.content || null,
          last_version_at: lastVersion?.created_at || article.created_at,
          last_version_created_at: lastVersion?.created_at || article.created_at,
          versions_count: versions.length || 0
        }
      })
    } catch (err: any) {
      console.error('[useArticles] fetch error', err)
      error.value = err?.message || 'Failed to fetch articles'
    } finally {
      loading.value = false
    }
  }

  /* ===========================
     SHARED ACTIONS
  =========================== */
  const deleteArticle = async (id: number) => {
    const { error: err } = await client.from('articles').delete().eq('id', id)
    if (err) {
      console.error('[useArticles] delete error', err)
      return false
    }
    articles.value = articles.value.filter(a => a.id !== id)
    return true
  }

  const archiveArticle = async (id: number) => {
    const { error: err } = await (client.from('articles') as any).update({ status: 'abandoned' }).eq('id', id)
    if (err) {
      console.error('[useArticles] archive error', err)
      return false
    }
    articles.value = articles.value.filter(a => a.id !== id)
    return true
  }

  const updateStatus = async (id: number, newStatus: string) => {
    const { error: err } = await (client.from('articles') as any).update({ status: newStatus }).eq('id', id)
    if (err) {
      console.error('[useArticles] updateStatus error', err)
      return false
    }
    const article = articles.value.find(a => a.id === id)
    if (article) article.status = newStatus
    return true
  }

  const fetchModules = async () => {
    const { data, error: err } = await client.from('modules').select('*').eq('active', true)
    if (err) {
      console.error('[useArticles] fetchModules error', err)
      return
    }
    allModules.value = data || []
  }

  const updateModules = async (articleId: number, newModules: Module[]) => {
    const { error: deleteErr } = await client.from('article_modules').delete().eq('article_id', articleId)
    if (deleteErr) {
      console.error('[useArticles] updateModules delete error', deleteErr)
      return false
    }

    if (newModules.length > 0) {
      const insertData = newModules.map(m => ({
        article_id: articleId,
        module_id: m.id
      }))

      const { error: insertErr } = await client.from('article_modules').insert(insertData as any)
      if (insertErr) {
        console.error('[useArticles] updateModules insert error', insertErr)
        return false
      }
    }

    const article = articles.value.find(a => a.id === articleId)
    if (article) article.modules = newModules
    return true
  }

  /* ===========================
     FETCH ARTICLE STATS (DASHBOARD)
  =========================== */
  const fetchArticleStats = async () => {
    const stats = {
      proposed: 0,
      validated: 0,
      published: 0,
      abandoned: 0,
      written: 0,
    }

    try {
      const { data, error } = await client
        .from('articles')
        .select('status')

      if (error) throw error

      data.forEach(article => {
        const status = (article as any).status?.toLowerCase()
        switch (status) {
          case 'proposed':
            stats.proposed++
            break
          case 'written':
            stats.written++
            break
          case 'validated':
            stats.validated++
            break
          case 'published':
            stats.published++
            break
          case 'abandoned':
            stats.abandoned++
            break
        }
      })
    } catch (err) {
      console.error('[useArticles] fetchArticleStats error', err)
    }

    return stats
  }

  return {
    articles,
    loading,
    error,
    allModules,
    fetch,
    fetchArticleStats,
    deleteArticle,
    updateStatus,
    fetchModules,
    updateModules,
    archiveArticle
  }
}
