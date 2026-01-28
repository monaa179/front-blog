import { compare } from 'bcryptjs'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { email, password } = body

        console.log('🔐 LOGIN ATTEMPT:', email)

        if (!email || !password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email and password are required',
            })
        }

        const profile = await prisma.profile.findUnique({
            where: { email },
        })

        console.log('👤 PROFILE FOUND:', !!profile)

        // Note: During initial migration, we might need to handle users with no passwords yet
        // or a special setup route.
        if (!profile || !profile.password) {
            // If user exists but has no password (migrated from Supabase Auth without password sync)
            // or if user doesn't exist
            console.log('❌ LOGIN FAILED: No profile or no password')
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid credentials',
            })
        }

        const isValid = await compare(password, profile.password as string)

        if (!isValid) {
            console.log('❌ LOGIN FAILED: Invalid password')
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid credentials',
            })
        }

        // Create session (simple cookie for now)
        // In a real app, use a more secure session management
        setCookie(event, 'auth_session', JSON.stringify({
            id: profile.id,
            email: profile.email,
            role: profile.role,
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        console.log('✅ LOGIN SUCCESS:', email)

        return {
            user: {
                id: profile.id,
                email: profile.email,
                role: profile.role,
                first_name: profile.first_name,
                last_name: profile.last_name,
            },
        }
    } catch (err: any) {
        // Log détaillé de l'erreur AVANT de la throw
        console.error('🔥 LOGIN ERROR:', {
            message: err.message,
            statusCode: err.statusCode,
            stack: err.stack,
        })

        // Re-throw l'erreur pour que Nuxt la gère normalement
        throw err
    }
})
