/**
 * Recursively converts all BigInt values to Number in an object
 * This is needed because Prisma with MariaDB returns BigInt for IDs,
 * but JSON.stringify cannot serialize BigInt
 */
export function serializeBigInt<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (typeof obj === 'bigint') {
        return Number(obj) as unknown as T
    }

    // Preserve Date objects - don't convert them
    if (obj instanceof Date) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(item => serializeBigInt(item)) as unknown as T
    }

    if (typeof obj === 'object') {
        const result: Record<string, any> = {}
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = serializeBigInt((obj as Record<string, any>)[key])
            }
        }
        return result as T
    }

    return obj
}

