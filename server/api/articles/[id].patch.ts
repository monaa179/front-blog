export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })

    const body = await readBody(event)
    const { status, modules } = body

    const updateData: any = {}
    if (status) updateData.status = status

    if (modules) {
        // Handling modules update (many-to-many)
        await prisma.articleModule.deleteMany({
            where: { article_id: BigInt(id) }
        })

        if (modules.length > 0) {
            await prisma.articleModule.createMany({
                data: modules.map((m: any) => ({
                    article_id: BigInt(id),
                    module_id: BigInt(m.id)
                }))
            })
        }
    }

    if (Object.keys(updateData).length > 0) {
        await prisma.article.update({
            where: { id: BigInt(id) },
            data: updateData
        })
    }

    return { success: true }
})
