import { d as defineEventHandler, b as getRouterParam, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
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

const _id__patch = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID is required" });
  const body = await readBody(event);
  const { name, description, active } = body;
  const updateData = {};
  if (name !== void 0) updateData.name = name;
  if (description !== void 0) updateData.description = description;
  if (active !== void 0) updateData.active = active;
  const module = await prisma.module.update({
    where: { id: BigInt(id) },
    data: updateData
  });
  return {
    ...module,
    id: Number(module.id)
  };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
