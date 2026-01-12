import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    const client = serverSupabaseServiceRole(event)

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // Check if current user is admin
    const { data: currentUserProfile } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as { data: { role: string } | null }

    if (currentUserProfile?.role !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const query = getQuery(event)
    const userId = query.id as string

    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing user ID' })
    }

    if (userId === user.id) {
        throw createError({ statusCode: 400, statusMessage: 'Cannot delete your own account' })
    }

    // Delete user from auth (this will cascade to profiles if RLS/Foreign Key is set to cascade)
    const { error } = await client.auth.admin.deleteUser(userId)

    if (error) {
        throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return { success: true }
})
