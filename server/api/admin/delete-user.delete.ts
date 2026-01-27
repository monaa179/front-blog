export default defineEventHandler(async (event) => {
    // Current user must be admin
    const session = getCookie(event, 'auth_session')
    if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const { role: currentUserRole, id: currentUserId } = JSON.parse(session)
    if (currentUserRole !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const query = getQuery(event)
    const id = query.id as string

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID is required' })
    }

    if (id === currentUserId) {
        throw createError({ statusCode: 400, statusMessage: 'Cannot delete yourself' })
    }

    await prisma.profile.delete({
        where: { id }
    })

    return { success: true }
})
