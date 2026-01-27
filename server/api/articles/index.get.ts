export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const statuses = query.statuses as string[] | string
    const orderCol = (query.orderCol as string) || 'created_at'
    const ascending = query.ascending === 'true'

    const statusList = Array.isArray(statuses) ? statuses : statuses ? [statuses] : []

    const articles = await prisma.article.findMany({
        where: statusList.length > 0 ? {
            status: { in: statusList }
        } : {},
        orderBy: {
            [orderCol]: ascending ? 'asc' : 'desc'
        },
        include: {
            modules: {
                include: {
                    module: true
                }
            },
            versions: {
                orderBy: {
                    created_at: 'desc'
                },
                take: 1
            },
            _count: {
                select: { versions: true }
            }
        }
    })

    // Format response to match what the frontend expects
    return articles.map(article => ({
        ...article,
        id: Number(article.id), // Convert BigInt to Number
        modules: article.modules.map(am => ({
            ...am.module,
            id: Number(am.module.id)
        })),
        last_version_content: article.versions[0]?.content || null,
        last_version_at: article.versions[0]?.created_at || article.created_at,
        last_version_created_at: article.versions[0]?.created_at || article.created_at,
        versions_count: article._count.versions
    }))
})
