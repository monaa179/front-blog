import { ref } from 'vue'

/**
 * useArticles
 * Fetch articles with modules and versions. Reusable between Dashboard, Favorites, Library.
 * Options:
 *  - statuses: string[] optional list of statuses to filter
 *  - order: { column: string, ascending: boolean }
 */
export const useArticles = (
  options: { statuses?: string[]; order?: { column: string; ascending: boolean } } = {}
) => {
  const client = useSupabaseClient()

  const articles = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

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
        switch (article.status?.toLowerCase()) {
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
    fetch,
    fetchArticleStats,
  }
}
