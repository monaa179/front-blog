export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Module ID is required'
        })
    }

    const module = await prisma.module.findUnique({
        where: { id: BigInt(id) }
    })

    if (!module) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Module not found'
        })
    }

    return {
        ...module,
        id: Number(module.id)
    }
})
