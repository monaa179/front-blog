export default defineEventHandler(async (event) => {
    const session = getCookie(event, 'auth_session')

    if (!session) {
        return { user: null }
    }

    try {
        const { id } = JSON.parse(session)
        const profile = await prisma.profile.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                first_name: true,
                last_name: true,
            }
        })

        return { user: profile }
    } catch (e) {
        return { user: null }
    }
})
