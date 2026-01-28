import { d as defineEventHandler, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
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

const setupAdmin_post = defineEventHandler(async (event) => {
  const count = await prisma.profile.count();
  if (count > 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin setup is only available for new installations"
    });
  }
  const body = await readBody(event);
  const { email, password, first_name, last_name } = body;
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required"
    });
  }
  const hashedPassword = await hash(password, 10);
  const admin = await prisma.profile.create({
    data: {
      email,
      password: hashedPassword,
      role: "admin",
      first_name,
      last_name
    }
  });
  return {
    success: true,
    message: "Admin user created successfully",
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role
    }
  };
});

export { setupAdmin_post as default };
//# sourceMappingURL=setup-admin.post.mjs.map
