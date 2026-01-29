export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })

    const body = await readBody(event)

    // 🔍 DEBUG LOGGING
    console.log('📥 VERSIONS POST - Article ID:', id)
    console.log('📥 VERSIONS POST - Raw body:', JSON.stringify(body))
    console.log('📥 VERSIONS POST - Content received:', body?.content ? `${String(body.content).substring(0, 100)}...` : 'NULL/EMPTY')
    console.log('📥 VERSIONS POST - Body keys:', Object.keys(body || {}))

    const { content } = body

    const lastVersion = await prisma.articleVersion.findFirst({
        where: { article_id: BigInt(id) },
        orderBy: { version_number: 'desc' }
    })

    const newVersionNumber = (lastVersion?.version_number || 0) + 1

    const version = await prisma.articleVersion.create({
        data: {
            article_id: BigInt(id),
            content: content || null,
            version_number: newVersionNumber
        }
    })

    return {
        ...version,
        id: Number(version.id),
        article_id: Number(version.article_id)
    }
})
