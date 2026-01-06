export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()

    // If user is logged in and trying to access login page, redirect to dashboard
    if (user.value && to.path === '/login') {
        return navigateTo('/dashboard')
    }

    // If user is not logged in and trying to access any page other than login, redirect to login
    if (!user.value && to.path !== '/login') {
        return navigateTo('/login')
    }
})
