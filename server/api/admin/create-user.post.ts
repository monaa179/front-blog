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

    const body = await readBody(event)
    const { email, password, first_name, last_name, role } = body

    if (!email || !password || !role) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await client.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { first_name, last_name }
    })

    if (authError) {
        throw createError({ statusCode: 400, statusMessage: authError.message })
    }

    if (!authData.user) {
        throw createError({ statusCode: 500, statusMessage: 'User creation failed' })
    }

    // 2. Create profile entry
    const { error: profileError } = await client
        .from('profiles')
        .insert({
            id: authData.user.id,
            email,
            first_name,
            last_name,
            role
        } as any)

    if (profileError) {
        // Cleanup auth user if profile creation fails
        await client.auth.admin.deleteUser(authData.user.id)
        throw createError({ statusCode: 400, statusMessage: profileError.message })
    }

    return { success: true, user: authData.user }
})
