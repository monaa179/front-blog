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
      const query: any = {}
      if (options.statuses && options.statuses.length > 0) {
        query.statuses = options.statuses
      }
      if (options.order) {
        query.orderCol = options.order.column
        query.ascending = String(options.order.ascending)
      }

      const data = await $fetch<any[]>('/api/articles', { query })
      articles.value = data
    } catch (err: any) {
      console.error('[useArticles] fetch error', err)
      error.value = err?.data?.statusMessage || err?.message || 'Failed to fetch articles'
    } finally {
      loading.value = false
    }
  }

  /* ===========================
     SHARED ACTIONS
  =========================== */
  const deleteArticle = async (id: number) => {
    try {
      await $fetch(`/api/articles/${id}`, { method: 'DELETE' })
      articles.value = articles.value.filter(a => a.id !== id)
      return true
    } catch (err) {
      console.error('[useArticles] delete error', err)
      return false
    }
  }

  const archiveArticle = async (id: number) => {
    try {
      await $fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        body: { status: 'abandoned' }
      })
      articles.value = articles.value.filter(a => a.id !== id)
      return true
    } catch (err) {
      console.error('[useArticles] archive error', err)
      return false
    }
  }

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await $fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        body: { status: newStatus }
      })
      const article = articles.value.find(a => a.id === id)
      if (article) article.status = newStatus
      return true
    } catch (err) {
      console.error('[useArticles] updateStatus error', err)
      return false
    }
  }

  const fetchModules = async () => {
    try {
      const data = await $fetch<Module[]>('/api/modules', {
        query: { active: 'true' }
      })
      allModules.value = data || []
    } catch (err) {
      console.error('[useArticles] fetchModules error', err)
    }
  }

  const updateModules = async (articleId: number, newModules: Module[]) => {
    try {
      await $fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        body: { modules: newModules }
      })
      const article = articles.value.find(a => a.id === articleId)
      if (article) article.modules = newModules
      return true
    } catch (err) {
      console.error('[useArticles] updateModules error', err)
      return false
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
      // We could create a specific stats endpoint, 
      // but for now we'll just fetch all and count or fetch a summary
      const data = await $fetch<any[]>('/api/articles')

      data.forEach(article => {
        const status = article.status?.toLowerCase()
        if (status in stats) {
          (stats as any)[status]++
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
