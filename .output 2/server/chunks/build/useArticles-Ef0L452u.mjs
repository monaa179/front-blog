import { ref } from 'vue';

const useArticles = (options = {}) => {
  const articles = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const allModules = ref([]);
  const fetch = async () => {
    loading.value = true;
    error.value = null;
    try {
      const query = {};
      if (options.statuses && options.statuses.length > 0) {
        query.statuses = options.statuses;
      }
      if (options.order) {
        query.orderCol = options.order.column;
        query.ascending = String(options.order.ascending);
      }
      const data = await $fetch("/api/articles", { query });
      articles.value = data;
    } catch (err) {
      console.error("[useArticles] fetch error", err);
      error.value = err?.data?.statusMessage || err?.message || "Failed to fetch articles";
    } finally {
      loading.value = false;
    }
  };
  const deleteArticle = async (id) => {
    try {
      await $fetch(`/api/articles/${id}`, { method: "DELETE" });
      articles.value = articles.value.filter((a) => a.id !== id);
      return true;
    } catch (err) {
      console.error("[useArticles] delete error", err);
      return false;
    }
  };
  const archiveArticle = async (id) => {
    try {
      await $fetch(`/api/articles/${id}`, {
        method: "PATCH",
        body: { status: "abandoned" }
      });
      articles.value = articles.value.filter((a) => a.id !== id);
      return true;
    } catch (err) {
      console.error("[useArticles] archive error", err);
      return false;
    }
  };
  const updateStatus = async (id, newStatus) => {
    try {
      await $fetch(`/api/articles/${id}`, {
        method: "PATCH",
        body: { status: newStatus }
      });
      const article = articles.value.find((a) => a.id === id);
      if (article) article.status = newStatus;
      return true;
    } catch (err) {
      console.error("[useArticles] updateStatus error", err);
      return false;
    }
  };
  const fetchModules = async () => {
    try {
      const data = await $fetch("/api/modules", {
        query: { active: "true" }
      });
      allModules.value = data || [];
    } catch (err) {
      console.error("[useArticles] fetchModules error", err);
    }
  };
  const updateModules = async (articleId, newModules) => {
    try {
      await $fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        body: { modules: newModules }
      });
      const article = articles.value.find((a) => a.id === articleId);
      if (article) article.modules = newModules;
      return true;
    } catch (err) {
      console.error("[useArticles] updateModules error", err);
      return false;
    }
  };
  const fetchArticleStats = async () => {
    const stats = {
      proposed: 0,
      validated: 0,
      published: 0,
      abandoned: 0,
      written: 0
    };
    try {
      const data = await $fetch("/api/articles");
      data.forEach((article) => {
        const status = article.status?.toLowerCase();
        if (status in stats) {
          stats[status]++;
        }
      });
    } catch (err) {
      console.error("[useArticles] fetchArticleStats error", err);
    }
    return stats;
  };
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
  };
};

export { useArticles as u };
//# sourceMappingURL=useArticles-Ef0L452u.mjs.map
