import { d as defineEventHandler, a as getQuery } from '../../nitro/nitro.mjs';
import { p as prisma } from '../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:url';
import '@prisma/client';
import '@prisma/adapter-mariadb';

const index_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const onlyActive = query.active === "true";
  const modules = await prisma.module.findMany({
    where: onlyActive ? { active: true } : {}
  });
  return modules.map((m) => ({
    ...m,
    id: Number(m.id)
  }));
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
