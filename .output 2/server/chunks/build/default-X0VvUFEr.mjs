import { _ as __nuxt_component_0 } from './nuxt-link-t9xXPaHD.mjs';
import { defineComponent, mergeProps, withCtx, openBlock, createBlock, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc, a as useAuth } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout-container" }, _attrs))} data-v-16a5b3d1><aside class="sidebar glass-sidebar" data-v-16a5b3d1><div class="logo" data-v-16a5b3d1><div class="logo-box" data-v-16a5b3d1><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-16a5b3d1><path d="M12 20h9" data-v-16a5b3d1></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" data-v-16a5b3d1></path></svg></div><span class="logo-text" data-v-16a5b3d1>DigiBlog</span></div><div class="nav-section" data-v-16a5b3d1><div class="nav-label" data-v-16a5b3d1>General</div><nav class="nav-links" data-v-16a5b3d1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard-stats",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16a5b3d1${_scopeId}><rect x="3" y="3" width="7" height="7" data-v-16a5b3d1${_scopeId}></rect><rect x="14" y="3" width="7" height="7" data-v-16a5b3d1${_scopeId}></rect><rect x="14" y="14" width="7" height="7" data-v-16a5b3d1${_scopeId}></rect><rect x="3" y="14" width="7" height="7" data-v-16a5b3d1${_scopeId}></rect></svg><span data-v-16a5b3d1${_scopeId}>Dashboard</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                createVNode("rect", {
                  x: "3",
                  y: "3",
                  width: "7",
                  height: "7"
                }),
                createVNode("rect", {
                  x: "14",
                  y: "3",
                  width: "7",
                  height: "7"
                }),
                createVNode("rect", {
                  x: "14",
                  y: "14",
                  width: "7",
                  height: "7"
                }),
                createVNode("rect", {
                  x: "3",
                  y: "14",
                  width: "7",
                  height: "7"
                })
              ])),
              createVNode("span", null, "Dashboard")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16a5b3d1${_scopeId}><line x1="8" y1="6" x2="21" y2="6" data-v-16a5b3d1${_scopeId}></line><line x1="8" y1="12" x2="21" y2="12" data-v-16a5b3d1${_scopeId}></line><line x1="8" y1="18" x2="21" y2="18" data-v-16a5b3d1${_scopeId}></line><rect x="3" y="5" width="2" height="2" data-v-16a5b3d1${_scopeId}></rect><rect x="3" y="11" width="2" height="2" data-v-16a5b3d1${_scopeId}></rect><rect x="3" y="17" width="2" height="2" data-v-16a5b3d1${_scopeId}></rect></svg><span data-v-16a5b3d1${_scopeId}>Validation</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                createVNode("line", {
                  x1: "8",
                  y1: "6",
                  x2: "21",
                  y2: "6"
                }),
                createVNode("line", {
                  x1: "8",
                  y1: "12",
                  x2: "21",
                  y2: "12"
                }),
                createVNode("line", {
                  x1: "8",
                  y1: "18",
                  x2: "21",
                  y2: "18"
                }),
                createVNode("rect", {
                  x: "3",
                  y: "5",
                  width: "2",
                  height: "2"
                }),
                createVNode("rect", {
                  x: "3",
                  y: "11",
                  width: "2",
                  height: "2"
                }),
                createVNode("rect", {
                  x: "3",
                  y: "17",
                  width: "2",
                  height: "2"
                })
              ])),
              createVNode("span", null, "Validation")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div><div class="nav-section" data-v-16a5b3d1><div class="nav-label" data-v-16a5b3d1>Management</div><nav class="nav-links" data-v-16a5b3d1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/library",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16a5b3d1${_scopeId}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-16a5b3d1${_scopeId}></path><polyline points="14 2 14 8 20 8" data-v-16a5b3d1${_scopeId}></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-16a5b3d1${_scopeId}></line><line x1="16" y1="17" x2="8" y2="17" data-v-16a5b3d1${_scopeId}></line><polyline points="10 9 9 9 8 9" data-v-16a5b3d1${_scopeId}></polyline></svg><span data-v-16a5b3d1${_scopeId}>Bibliothèque</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                createVNode("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
                createVNode("polyline", { points: "14 2 14 8 20 8" }),
                createVNode("line", {
                  x1: "16",
                  y1: "13",
                  x2: "8",
                  y2: "13"
                }),
                createVNode("line", {
                  x1: "16",
                  y1: "17",
                  x2: "8",
                  y2: "17"
                }),
                createVNode("polyline", { points: "10 9 9 9 8 9" })
              ])),
              createVNode("span", null, "Bibliothèque")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/modules",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16a5b3d1${_scopeId}><polygon points="12 2 2 7 12 12 22 7 12 2" data-v-16a5b3d1${_scopeId}></polygon><polyline points="2 17 12 22 22 17" data-v-16a5b3d1${_scopeId}></polyline><polyline points="2 12 12 17 22 12" data-v-16a5b3d1${_scopeId}></polyline></svg><span data-v-16a5b3d1${_scopeId}>Modules</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                createVNode("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
                createVNode("polyline", { points: "2 17 12 22 22 17" }),
                createVNode("polyline", { points: "2 12 12 17 22 12" })
              ])),
              createVNode("span", null, "Modules")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/archive",
        class: "nav-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16a5b3d1${_scopeId}><path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" data-v-16a5b3d1${_scopeId}></path><rect x="3" y="8" width="18" height="4" data-v-16a5b3d1${_scopeId}></rect><path d="M10 12v6" data-v-16a5b3d1${_scopeId}></path><path d="M14 12v6" data-v-16a5b3d1${_scopeId}></path></svg><span data-v-16a5b3d1${_scopeId}>Archive</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                createVNode("path", { d: "M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" }),
                createVNode("rect", {
                  x: "3",
                  y: "8",
                  width: "18",
                  height: "4"
                }),
                createVNode("path", { d: "M10 12v6" }),
                createVNode("path", { d: "M14 12v6" })
              ])),
              createVNode("span", null, "Archive")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div><div class="sidebar-footer" data-v-16a5b3d1>`);
      if (unref(user)) {
        _push(`<div class="user-card" data-v-16a5b3d1><div class="avatar" data-v-16a5b3d1>${ssrInterpolate(unref(user).email?.charAt(0).toUpperCase())}</div><div class="user-meta" data-v-16a5b3d1><span class="user-email"${ssrRenderAttr("title", unref(user).email)} data-v-16a5b3d1>${ssrInterpolate(unref(user).email)}</span><span class="user-status" data-v-16a5b3d1>Online</span></div><button class="logout-minimal" title="Déconnexion" data-v-16a5b3d1><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16a5b3d1><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" data-v-16a5b3d1></path><polyline points="16 17 21 12 16 7" data-v-16a5b3d1></polyline><line x1="21" y1="12" x2="9" y2="12" data-v-16a5b3d1></line></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></aside><main class="main-content" data-v-16a5b3d1><div class="content-wrapper" data-v-16a5b3d1>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-16a5b3d1"]]);

export { _default as default };
//# sourceMappingURL=default-X0VvUFEr.mjs.map
