import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, slug, description, active } = body;
  if (!name || !slug) {
    throw createError({ statusCode: 400, statusMessage: "Name and slug are required" });
  }
  const module = await prisma.module.create({
    data: {
      name,
      slug,
      description,
      active: active !== void 0 ? active : true
    }
  });
  return {
    ...module,
    id: Number(module.id)
  };
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
