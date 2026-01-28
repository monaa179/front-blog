export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        // Validate required fields
        if (!body.original_title) {
            throw createError({
                statusCode: 400,
                statusMessage: 'original_title is required'
            })
        }

        // Optional: Verify Make.com secret key for security
        const secretKey = getHeader(event, 'x-make-secret')
        const expectedSecret = process.env.MAKE_SECRET_KEY

        if (expectedSecret && secretKey !== expectedSecret) {
            console.warn('[POST /api/articles] Invalid or missing secret key')
            // You can uncomment the next lines to enforce authentication
            // throw createError({
            //   statusCode: 401,
            //   statusMessage: 'Unauthorized'
            // })
        }

        // Create the article
        const article = await prisma.article.create({
            data: {
                source_url: body.source_url || null,
                original_title: body.original_title,
                original_description: body.original_description || '',
                suggested_title: body.suggested_title || null,
                suggested_description: body.suggested_description || null,
                score: body.score ? parseInt(body.score) : null,
                status: body.status || 'proposed', // Default to 'proposed' for validation workflow
                author_id: body.author_id || null,
            }
        })

        // Handle modules if provided
        if (body.modules && Array.isArray(body.modules) && body.modules.length > 0) {
            const moduleConnections = body.modules.map((moduleId: number | string) => ({
                article_id: article.id,
                module_id: BigInt(moduleId)
            }))

            await prisma.articleModule.createMany({
                data: moduleConnections
            })
        }

        console.log(`[POST /api/articles] Article created with id: ${article.id}`)

        return {
            success: true,
            id: Number(article.id),
            message: 'Article created successfully'
        }
    } catch (error: any) {
        console.error('[POST /api/articles] Error:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to create article'
        })
    }
})
