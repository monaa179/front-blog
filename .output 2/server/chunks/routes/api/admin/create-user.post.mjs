import { d as defineEventHandler, g as getCookie, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { hash } from 'bcryptjs';
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

const createUser_post = defineEventHandler(async (event) => {
  const session = getCookie(event, "auth_session");
  if (!session) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  const { role: currentUserRole } = JSON.parse(session);
  if (currentUserRole !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
  const body = await readBody(event);
  const { email, password, first_name, last_name, role } = body;
  if (!email || !password || !role) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }
  const existingUser = await prisma.profile.findUnique({ where: { email } });
  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: "User already exists" });
  }
  const hashedPassword = await hash(password, 10);
  const newUser = await prisma.profile.create({
    data: {
      email,
      password: hashedPassword,
      first_name,
      last_name,
      role
    }
  });
  return { success: true, user: { id: newUser.id, email: newUser.email } };
});

export { createUser_post as default };
//# sourceMappingURL=create-user.post.mjs.map
