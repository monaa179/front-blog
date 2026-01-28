import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
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

const triggerMake_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const webhookUrl = config.public.makeWebhookUrl;
  if (!webhookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Make Webhook URL is not configured"
    });
  }
  try {
    const response = await $fetch(webhookUrl, {
      method: "POST",
      body
    });
    return response;
  } catch (error) {
    console.error("Make Webhook Error:", error);
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to trigger Make webhook"
    });
  }
});

export { triggerMake_post as default };
//# sourceMappingURL=trigger-make.post.mjs.map
