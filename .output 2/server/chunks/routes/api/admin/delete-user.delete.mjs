import { d as defineEventHandler, g as getCookie, c as createError, a as getQuery } from '../../../nitro/nitro.mjs';
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

const deleteUser_delete = defineEventHandler(async (event) => {
  const session = getCookie(event, "auth_session");
  if (!session) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const { role: currentUserRole, id: currentUserId } = JSON.parse(session);
  if (currentUserRole !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
  const query = getQuery(event);
  const id = query.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }
  if (id === currentUserId) {
    throw createError({ statusCode: 400, statusMessage: "Cannot delete yourself" });
  }
  await prisma.profile.delete({
    where: { id }
  });
  return { success: true };
});

export { deleteUser_delete as default };
//# sourceMappingURL=delete-user.delete.mjs.map
