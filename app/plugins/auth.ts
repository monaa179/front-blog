export default defineNuxtPlugin(async (nuxtApp) => {
    const { user, fetchUser } = useAuth()

    // Only fetch if not already populated (e.g. from previous SSR attempt or hydration)
    if (!user.value) {
        try {
            await fetchUser()
        } catch (e) {
            console.error('[Auth Plugin] Failed to fetch initial user state', e)
        }
    }
})
