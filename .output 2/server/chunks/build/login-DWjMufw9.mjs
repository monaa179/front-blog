import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, a as useAuth, b as useRouter } from './server.mjs';
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
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    useRouter();
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-container" }, _attrs))} data-v-e73132d2><div class="login-card" data-v-e73132d2><div class="logo" data-v-e73132d2><h1 class="brand" data-v-e73132d2>DigiBlog</h1><p class="subtitle" data-v-e73132d2>Transformez l’actualité en articles de blog prêts à publier</p></div><form class="login-form" data-v-e73132d2><div class="form-group" data-v-e73132d2><label for="email" data-v-e73132d2>Email address</label><input type="email" id="email"${ssrRenderAttr("value", unref(email))} placeholder="name@company.com" required${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-e73132d2></div><div class="form-group" data-v-e73132d2><label for="password" data-v-e73132d2>Password</label><input type="password" id="password"${ssrRenderAttr("value", unref(password))} placeholder="••••••••" required${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-e73132d2></div>`);
      if (unref(error)) {
        _push(`<div class="error-message" data-v-e73132d2>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="btn btn-primary full-width"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-e73132d2>`);
      if (unref(loading)) {
        _push(`<span data-v-e73132d2>Signing in...</span>`);
      } else {
        _push(`<span data-v-e73132d2>Sign In</span>`);
      }
      _push(`</button></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e73132d2"]]);

export { login as default };
//# sourceMappingURL=login-DWjMufw9.mjs.map
