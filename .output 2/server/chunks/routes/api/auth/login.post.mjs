import { d as defineEventHandler, r as readBody, c as createError, s as setCookie } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { compare } from 'bcryptjs';
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

const login_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;
    console.log("\u{1F510} LOGIN ATTEMPT:", email);
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required"
      });
    }
    const profile = await prisma.profile.findUnique({
      where: { email }
    });
    console.log("\u{1F464} PROFILE FOUND:", !!profile);
    if (!profile || !profile.password) {
      console.log("\u274C LOGIN FAILED: No profile or no password");
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials"
      });
    }
    const isValid = await compare(password, profile.password);
    if (!isValid) {
      console.log("\u274C LOGIN FAILED: Invalid password");
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials"
      });
    }
    setCookie(event, "auth_session", JSON.stringify({
      id: profile.id,
      email: profile.email,
      role: profile.role
    }), {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      // 1 week
      path: "/"
    });
    console.log("\u2705 LOGIN SUCCESS:", email);
    return {
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        first_name: profile.first_name,
        last_name: profile.last_name
      }
    };
  } catch (err) {
    console.error("\u{1F525} LOGIN ERROR:", {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack
    });
    throw err;
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
