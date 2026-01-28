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
  const statuses = query.statuses;
  const orderCol = query.orderCol || "created_at";
  const ascending = query.ascending === "true";
  const statusList = Array.isArray(statuses) ? statuses : statuses ? [statuses] : [];
  const articles = await prisma.article.findMany({
    where: statusList.length > 0 ? {
      status: { in: statusList }
    } : {},
    orderBy: {
      [orderCol]: ascending ? "asc" : "desc"
    },
    include: {
      modules: {
        include: {
          module: true
        }
      },
      versions: {
        orderBy: {
          created_at: "desc"
        },
        take: 1
      },
      _count: {
        select: { versions: true }
      }
    }
  });
  return articles.map((article) => {
    var _a, _b, _c;
    return {
      ...article,
      id: Number(article.id),
      // Convert BigInt to Number
      modules: article.modules.map((am) => ({
        ...am.module,
        id: Number(am.module.id)
      })),
      last_version_content: ((_a = article.versions[0]) == null ? void 0 : _a.content) || null,
      last_version_at: ((_b = article.versions[0]) == null ? void 0 : _b.created_at) || article.created_at,
      last_version_created_at: ((_c = article.versions[0]) == null ? void 0 : _c.created_at) || article.created_at,
      versions_count: article._count.versions
    };
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
