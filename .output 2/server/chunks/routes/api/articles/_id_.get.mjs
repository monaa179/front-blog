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
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID is required" });
  const article = await prisma.article.findUnique({
    where: { id: BigInt(id) },
    include: {
      modules: {
        include: {
          module: true
        }
      },
      versions: {
        orderBy: {
          created_at: "desc"
        }
      }
    }
  });
  if (!article) throw createError({ statusCode: 404, statusMessage: "Article not found" });
  return {
    ...article,
    id: Number(article.id),
    modules: article.modules.map((am) => ({
      ...am.module,
      id: Number(am.module.id)
    })),
    versions: article.versions.map((v) => ({
      ...v,
      id: Number(v.id),
      article_id: Number(v.article_id)
    }))
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
