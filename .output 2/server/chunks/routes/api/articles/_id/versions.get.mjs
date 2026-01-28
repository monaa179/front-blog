import { d as defineEventHandler, b as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
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

const versions_get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Article ID is required"
    });
  }
  const articleId = BigInt(id);
  const article = await prisma.article.findUnique({
    where: { id: articleId }
  });
  if (!article) {
    throw createError({
      statusCode: 404,
      statusMessage: "Article not found"
    });
  }
  const versions = await prisma.articleVersion.findMany({
    where: { article_id: articleId },
    orderBy: { created_at: "desc" }
  });
  return versions.map((v) => ({
    ...v,
    id: Number(v.id),
    article_id: Number(v.article_id)
  }));
});

export { versions_get as default };
//# sourceMappingURL=versions.get.mjs.map
