import { d as defineEventHandler, b as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Module ID is required"
    });
  }
  const module = await prisma.module.findUnique({
    where: { id: BigInt(id) }
  });
  if (!module) {
    throw createError({
      statusCode: 404,
      statusMessage: "Module not found"
    });
  }
  return {
    ...module,
    id: Number(module.id)
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
