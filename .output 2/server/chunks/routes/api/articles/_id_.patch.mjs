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
  const { status, modules } = body;
  const updateData = {};
  if (status) updateData.status = status;
  if (modules) {
    await prisma.articleModule.deleteMany({
      where: { article_id: BigInt(id) }
    });
    if (modules.length > 0) {
      await prisma.articleModule.createMany({
        data: modules.map((m) => ({
          article_id: BigInt(id),
          module_id: BigInt(m.id)
        }))
      });
    }
  }
  if (Object.keys(updateData).length > 0) {
    await prisma.article.update({
      where: { id: BigInt(id) },
      data: updateData
    });
  }
  return { success: true };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
