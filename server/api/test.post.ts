export default defineEventHandler((event) => {
    return {
        ok: true,
        method: event.method,
        timestamp: new Date().toISOString(),
        message: 'API route is working correctly'
    }
})
