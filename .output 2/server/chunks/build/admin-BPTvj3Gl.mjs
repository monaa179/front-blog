import { g as defineNuxtRouteMiddleware, a as useAuth, n as navigateTo } from './server.mjs';
import 'vue';
import '../nitro/nitro.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';
import 'perfect-debounce';

const admin = defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();
  if (!user.value || user.value.role !== "admin") {
    return navigateTo("/dashboard");
  }
});

export { admin as default };
//# sourceMappingURL=admin-BPTvj3Gl.mjs.map
