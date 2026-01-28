import { _ as __nuxt_component_0 } from './nuxt-link-t9xXPaHD.mjs';
import { ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "setup",
  __ssrInlineRender: true,
  setup(__props) {
    const form = ref({
      email: "",
      password: "",
      first_name: "",
      last_name: ""
    });
    const loading = ref(false);
    const error = ref(null);
    const success = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "setup-container" }, _attrs))} data-v-5a9de630><div class="setup-card glass-panel" data-v-5a9de630><div class="logo" data-v-5a9de630><h1 class="brand" data-v-5a9de630>DigiBlog</h1><p class="subtitle" data-v-5a9de630>Initialisation de l&#39;administrateur</p></div>`);
      if (unref(success)) {
        _push(`<div class="success-message" data-v-5a9de630><div class="success-icon" data-v-5a9de630>✅</div><h2 data-v-5a9de630>Compte créé !</h2><p data-v-5a9de630>Votre compte administrateur est prêt. Vous pouvez maintenant vous connecter.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "btn btn-primary full-width"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Aller à la connexion`);
            } else {
              return [
                createTextVNode("Aller à la connexion")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<form class="setup-form" data-v-5a9de630><div class="form-grid" data-v-5a9de630><div class="form-group" data-v-5a9de630><label data-v-5a9de630>Prénom</label><input${ssrRenderAttr("value", unref(form).first_name)} placeholder="Jean" required data-v-5a9de630></div><div class="form-group" data-v-5a9de630><label data-v-5a9de630>Nom</label><input${ssrRenderAttr("value", unref(form).last_name)} placeholder="Dupont" required data-v-5a9de630></div></div><div class="form-group" data-v-5a9de630><label data-v-5a9de630>Email address</label><input type="email"${ssrRenderAttr("value", unref(form).email)} placeholder="admin@example.com" required data-v-5a9de630></div><div class="form-group" data-v-5a9de630><label data-v-5a9de630>Password</label><input type="password"${ssrRenderAttr("value", unref(form).password)} placeholder="••••••••" required data-v-5a9de630></div>`);
        if (unref(error)) {
          _push(`<div class="error-message" data-v-5a9de630>${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="btn btn-primary full-width"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-5a9de630>`);
        if (unref(loading)) {
          _push(`<span data-v-5a9de630>Création en cours...</span>`);
        } else {
          _push(`<span data-v-5a9de630>Créer le compte admin</span>`);
        }
        _push(`</button></form>`);
      }
      if (!unref(success)) {
        _push(`<p class="help-text" data-v-5a9de630> Cette page n&#39;est accessible que si aucun utilisateur n&#39;existe dans la base de données. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/setup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const setup = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5a9de630"]]);

export { setup as default };
//# sourceMappingURL=setup-BpBdsu58.mjs.map
