import { d as defineEventHandler, f as deleteCookie } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler(async (event) => {
  deleteCookie(event, "auth_session");
  return { success: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
