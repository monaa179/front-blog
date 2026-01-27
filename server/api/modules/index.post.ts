export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, slug, description, active } = body

    if (!name || !slug) {
        throw createError({ statusCode: 400, statusMessage: 'Name and slug are required' })
    }

    const module = await prisma.module.create({
        data: {
            name,
            slug,
            description,
            active: active !== undefined ? active : true
        }
    })

    return {
        ...module,
        id: Number(module.id)
    }
})
