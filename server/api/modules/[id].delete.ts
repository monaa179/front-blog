export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })

    await prisma.module.delete({
        where: { id: BigInt(id) }
    })

    return { success: true }
})
