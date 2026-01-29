// serializeBigInt is auto-imported from server/utils by Nitro

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const onlyActive = query.active === 'true'

    const modules = await prisma.module.findMany({
        where: onlyActive ? { active: true } : {}
    })

    return serializeBigInt(modules)
})

