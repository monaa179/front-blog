import type { Profile } from '@prisma/client'

export const useAuth = () => {
    const user = useState<any | null>('auth_user', () => null)
    const loading = useState('auth_loading', () => false)

    const fetchUser = async () => {
        loading.value = true
        try {
            const { data } = await useFetch('/api/auth/me')
            if (data.value?.user) {
                user.value = data.value.user
            } else {
                user.value = null
            }
        } catch (e) {
            user.value = null
        } finally {
            loading.value = false
        }
    }

    const login = async (credentials: { email: string; password: string }) => {
        loading.value = true
        try {
            const { data, error } = await useFetch('/api/auth/login', {
                method: 'POST',
                body: credentials
            })
            if (error.value) throw error.value
            if (data.value?.user) {
                user.value = data.value.user
                return { success: true }
            }
        } catch (e: any) {
            return { success: false, error: e.message || 'Login failed' }
        } finally {
            loading.value = false
        }
        return { success: false, error: 'unknown error' }
    }

    const logout = async () => {
        loading.value = true
        try {
            await useFetch('/api/auth/logout', { method: 'POST' })
            user.value = null
            navigateTo('/login')
        } catch (e) {
            console.error('Logout error', e)
        } finally {
            loading.value = false
        }
    }

    return {
        user,
        loading,
        fetchUser,
        login,
        logout
    }
}
