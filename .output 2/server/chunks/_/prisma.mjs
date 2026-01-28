import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

let _prisma = null;
const prisma = new Proxy({}, {
  get(target, prop, receiver) {
    if (!_prisma) {
      console.log("[Prisma] Initializing Prisma with MariaDB adapter...");
      const url = process.env.DATABASE_URL;
      if (!url) {
        console.error("[Prisma] DATABASE_URL is missing!");
        throw new Error("DATABASE_URL is missing");
      }
      try {
        const adapterFactory = new PrismaMariaDb(url);
        _prisma = new PrismaClient({ adapter: adapterFactory });
        console.log("[Prisma] PrismaClient instance created.");
      } catch (e) {
        console.error("[Prisma] Failed to initialize MariaDB adapter:", e);
        throw e;
      }
    }
    const val = Reflect.get(_prisma, prop, receiver);
    return typeof val === "function" ? val.bind(_prisma) : val;
  }
});

export { prisma as p };
//# sourceMappingURL=prisma.mjs.map
