export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })

    const body = await readBody(event)
    const { name, description, active } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (active !== undefined) updateData.active = active

    const module = await prisma.module.update({
        where: { id: BigInt(id) },
        data: updateData
    })

    return {
        ...module,
        id: Number(module.id)
    }
})
