export default defineEventHandler(async (event) => {
    // Current user must be admin
    const session = getCookie(event, 'auth_session')
    if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const { role: currentUserRole } = JSON.parse(session)
    if (currentUserRole !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const profiles = await prisma.profile.findMany({
        orderBy: { created_at: 'desc' },
        select: {
            id: true,
            email: true,
            role: true,
            first_name: true,
            last_name: true,
            created_at: true,
            updated_at: true,
        }
    })

    return profiles
})
