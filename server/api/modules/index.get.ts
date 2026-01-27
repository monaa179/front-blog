export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const onlyActive = query.active === 'true'

    const modules = await prisma.module.findMany({
        where: onlyActive ? { active: true } : {}
    })

    return modules.map(m => ({
        ...m,
        id: Number(m.id)
    }))
})
