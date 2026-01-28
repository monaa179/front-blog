import { d as defineEventHandler, r as readBody, c as createError, e as getHeader } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.original_title) {
      throw createError({
        statusCode: 400,
        statusMessage: "original_title is required"
      });
    }
    const secretKey = getHeader(event, "x-make-secret");
    const expectedSecret = process.env.MAKE_SECRET_KEY;
    if (expectedSecret && secretKey !== expectedSecret) {
      console.warn("[POST /api/articles] Invalid or missing secret key");
    }
    const article = await prisma.article.create({
      data: {
        source_url: body.source_url || null,
        original_title: body.original_title,
        original_description: body.original_description || "",
        suggested_title: body.suggested_title || null,
        suggested_description: body.suggested_description || null,
        score: body.score ? parseInt(body.score) : null,
        status: body.status || "proposed",
        // Default to 'proposed' for validation workflow
        author_id: body.author_id || null
      }
    });
    if (body.modules && Array.isArray(body.modules) && body.modules.length > 0) {
      const moduleConnections = body.modules.map((moduleId) => ({
        article_id: article.id,
        module_id: BigInt(moduleId)
      }));
      await prisma.articleModule.createMany({
        data: moduleConnections
      });
    }
    console.log(`[POST /api/articles] Article created with id: ${article.id}`);
    return {
      success: true,
      id: Number(article.id),
      message: "Article created successfully"
    };
  } catch (error) {
    console.error("[POST /api/articles] Error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create article"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
