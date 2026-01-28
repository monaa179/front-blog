import { d as defineEventHandler, b as getRouterParam, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
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

const versions_post = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID is required" });
  const body = await readBody(event);
  const { content } = body;
  const lastVersion = await prisma.articleVersion.findFirst({
    where: { article_id: BigInt(id) },
    orderBy: { version_number: "desc" }
  });
  const newVersionNumber = ((lastVersion == null ? void 0 : lastVersion.version_number) || 0) + 1;
  const version = await prisma.articleVersion.create({
    data: {
      article_id: BigInt(id),
      content: content || null,
      version_number: newVersionNumber
    }
  });
  return {
    ...version,
    id: Number(version.id),
    article_id: Number(version.article_id)
  };
});

export { versions_post as default };
//# sourceMappingURL=versions.post.mjs.map
