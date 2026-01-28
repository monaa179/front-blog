import { d as defineEventHandler } from '../../nitro/nitro.mjs';
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

const test_post = defineEventHandler((event) => {
  return {
    ok: true,
    method: event.method,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    message: "API route is working correctly"
  };
});

export { test_post as default };
//# sourceMappingURL=test.post.mjs.map
