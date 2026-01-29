// serializeBigInt is auto-imported from server/utils by Nitro

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })

    const article = await prisma.article.findUnique({
        where: { id: BigInt(id) },
        include: {
            modules: {
                include: {
                    module: true
                }
            },
            versions: {
                orderBy: {
                    created_at: 'desc'
                }
            }
        }
    })

    if (!article) throw createError({ statusCode: 404, statusMessage: 'Article not found' })

    return serializeBigInt({
        ...article,
        article_modules: article.modules.map(am => ({
            ...am,
            module: am.module
        })),
        article_versions: article.versions
    })
})

