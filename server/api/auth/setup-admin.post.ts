import { hash } from 'bcryptjs'

export default defineEventHandler(async (event) => {
    const count = await prisma.profile.count()

    if (count > 0) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Admin setup is only available for new installations',
        })
    }

    const body = await readBody(event)
    const { email, password, first_name, last_name } = body

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email and password are required',
        })
    }

    const hashedPassword = await hash(password, 10)

    const admin = await prisma.profile.create({
        data: {
            email,
            password: hashedPassword,
            role: 'admin',
            first_name,
            last_name,
        }
    })

    return {
        success: true,
        message: 'Admin user created successfully',
        user: {
            id: admin.id,
            email: admin.email,
            role: admin.role
        }
    }
})
