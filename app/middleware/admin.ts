export default defineNuxtRouteMiddleware((to, from) => {
    const { user } = useAuth()

    // If no user or not an admin, redirect to dashboard
    if (!user.value || user.value.role !== 'admin') {
        return navigateTo('/dashboard')
    }
})
