import { ref } from 'vue'

/**
 * useFavorites Composable
 * 
 * Manages article favorites for the authenticated user via Supabase.
 * Strictly follows RLS policies:
 * - SELECT: filtered by user_id
 * - INSERT: checked against auth.uid()
 * - DELETE: checked against auth.uid()
 */
export const useFavorites = () => {
    const client = useSupabaseClient()
    const user = useSupabaseUser()

    // Shared state for favorite IDs
    const favoriteIds = useState<Set<number>>('favorite-article-ids', () => new Set())
    // Track ongoing requests to prevent multiple clicks
    const pendingIds = useState<Set<number>>('favorite-pending-ids', () => new Set())
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Fetches all favorite article IDs for the current user.
     * RLS ensures we only get rows belonging to the authenticated user.
     */
    const fetchFavorites = async () => {
        if (!user.value?.id) {
            favoriteIds.value = new Set()
            return
        }

        loading.value = true
        error.value = null

        try {
            const { data, error: err } = await client
                .from('article_favorites')
                .select('article_id')
                .eq('user_id', user.value.id) // Explicitly sending user_id for RLS compliance

            if (err) throw err

            favoriteIds.value = new Set((data as { article_id: number }[]).map(f => f.article_id))
        } catch (err: any) {
            console.error('[Favorites] Error fetching:', err.message || err)
            error.value = 'Failed to load favorites'
        } finally {
            loading.value = false
        }
    }

    /**
     * Toggles an article's favorite state.
     * Updates the local state only AFTER a successful database response.
     */
    const toggleFavorite = async (articleId: number) => {
        if (!user.value?.id) {
            console.warn('[Favorites] User must be authenticated to favorite articles')
            return
        }

        // Prevent multiple clicks if a request is already pending for this article
        if (pendingIds.value.has(articleId)) return

        const isFav = favoriteIds.value.has(articleId)

        // Mark as pending
        pendingIds.value.add(articleId)
        error.value = null

        try {
            if (isFav) {
                // DELETE operation
                // RLS requires user_id === auth.uid()
                const { error: err } = await client
                    .from('article_favorites')
                    .delete()
                    .eq('article_id', articleId)
                    .eq('user_id', user.value.id) // Explicitly sending user_id

                if (err) {
                    if (err.code === '42501') {
                        throw new Error('Permission denied: You can only remove your own favorites.')
                    }
                    throw err
                }

                // Update local state ONLY after success
                favoriteIds.value.delete(articleId)
            } else {
                // INSERT operation
                // RLS requires user_id === auth.uid()
                const { error: err } = await client
                    .from('article_favorites')
                    .insert({
                        user_id: user.value.id,
                        article_id: articleId
                    } as any)

                if (err) {
                    // Handle 403 / RLS violations explicitly
                    if (err.code === '42501') {
                        throw new Error('Permission denied: You can only favorite articles for your own account.')
                    }
                    throw err
                }

                // Update local state ONLY after success
                favoriteIds.value.add(articleId)
            }
        } catch (err: any) {
            const errorMessage = err?.message || err || 'An unexpected error occurred'
            console.error('[Favorites] Error toggling:', errorMessage)
            error.value = errorMessage
        } finally {
            // Always remove from pending
            pendingIds.value.delete(articleId)
        }
    }

    return {
        favoriteIds,
        pendingIds,
        loading,
        error,
        fetchFavorites,
        toggleFavorite
    }
}
