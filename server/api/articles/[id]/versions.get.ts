export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Article ID is required'
        })
    }

    const articleId = BigInt(id)

    // Check if article exists
    const article = await prisma.article.findUnique({
        where: { id: articleId }
    })

    if (!article) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Article not found'
        })
    }

    // Get all versions for this article
    const versions = await prisma.articleVersion.findMany({
        where: { article_id: articleId },
        orderBy: { created_at: 'desc' }
    })

    return versions.map(v => ({
        ...v,
        id: Number(v.id),
        article_id: Number(v.article_id)
    }))
})
