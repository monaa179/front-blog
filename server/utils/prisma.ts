import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

let _prisma: PrismaClient | null = null

export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop, receiver) {
        if (!_prisma) {
            console.log('[Prisma] Initializing Prisma with MariaDB adapter...')
            const url = process.env.DATABASE_URL
            if (!url) {
                console.error('[Prisma] DATABASE_URL is missing!')
                throw new Error('DATABASE_URL is missing')
            }

            try {
                // Prisma 7 PrismaMariaDb is a factory/adapter class
                const adapterFactory = new PrismaMariaDb(url)

                // We need to 'connect' it if it's a factory, or pass it directly if it's the adapter
                // In Prisma 7, the recommended way for MariaDB is often using the factory and then connecting
                // or passing the adapter instance. Let's use the simplest robust path.
                _prisma = new PrismaClient({ adapter: adapterFactory } as any)

                console.log('[Prisma] PrismaClient instance created.')
            } catch (e) {
                console.error('[Prisma] Failed to initialize MariaDB adapter:', e)
                throw e
            }
        }
        const val = Reflect.get(_prisma, prop, receiver)
        return typeof val === 'function' ? val.bind(_prisma) : val
    }
})

export const closePrisma = async () => {
    if (_prisma) {
        await _prisma.$disconnect()
        _prisma = null
    }
}
