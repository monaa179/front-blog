import { d as defineEventHandler, g as getCookie } from '../../../nitro/nitro.mjs';
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

const me_get = defineEventHandler(async (event) => {
  const session = getCookie(event, "auth_session");
  if (!session) {
    return { user: null };
  }
  try {
    const { id } = JSON.parse(session);
    const profile = await prisma.profile.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        first_name: true,
        last_name: true
      }
    });
    return { user: profile };
  } catch (e) {
    return { user: null };
  }
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
