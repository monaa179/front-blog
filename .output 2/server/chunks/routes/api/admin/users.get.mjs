import { d as defineEventHandler, g as getCookie, c as createError } from '../../../nitro/nitro.mjs';
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

const users_get = defineEventHandler(async (event) => {
  const session = getCookie(event, "auth_session");
  if (!session) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const { role: currentUserRole } = JSON.parse(session);
  if (currentUserRole !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
  const profiles = await prisma.profile.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      first_name: true,
      last_name: true,
      created_at: true,
      updated_at: true
    }
  });
  return profiles;
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map
