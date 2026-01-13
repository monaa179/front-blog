export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useSupabaseUser()
    const client = useSupabaseClient()

    // If not logged in, redirect to login
    if (!user.value) {
        return navigateTo('/login')
    }

    // Fetch user profile to check role
    const { data: profile, error } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.value.id)
        .single() as { data: { role: string } | null, error: any }

    // If no profile or not an admin, redirect to dashboard
    if (error || !profile || profile.role !== 'admin') {
        return navigateTo('/dashboard')
    }
})
