// Favorites feature removed. Keep a lightweight stub so existing imports don't crash
// but ensure no Supabase queries or article_favorites table usage remain here.
export const useFavorites = () => {
    const favoriteIds = useState<Set<number>>('favorite-article-ids', () => new Set())
    const pendingIds = useState<Set<number>>('favorite-pending-ids', () => new Set())

    // No-op functions (favorites are deprecated)
    const fetchFavorites = async () => {
        // Intentionally empty: favorites removed, source of truth is articles.status
        return
    }

    const toggleFavorite = async (_articleId: number) => {
        // Intentionally no-op to prevent accidental writes
        console.warn('[useFavorites] toggleFavorite called but favorites feature is removed')
        return
    }

    return {
        favoriteIds,
        pendingIds,
        fetchFavorites,
        toggleFavorite
    }
}
