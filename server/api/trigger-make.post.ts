export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const webhookUrl = config.public.makeWebhookUrl

    if (!webhookUrl) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Make Webhook URL is not configured'
        })
    }

    // Forward the request to Make
    try {
        const response = await $fetch(webhookUrl, {
            method: 'POST',
            body: body
        })
        return response
    } catch (error) {
        console.error('Make Webhook Error:', error)
        throw createError({
            statusCode: 502,
            statusMessage: 'Failed to trigger Make webhook'
        })
    }
})
