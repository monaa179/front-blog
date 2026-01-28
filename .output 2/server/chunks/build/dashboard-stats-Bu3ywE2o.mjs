import { defineComponent, ref, computed, mergeProps, createVNode, resolveDynamicComponent, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderVNode } from 'vue/server-renderer';
import { u as useArticles } from './useArticles-Ef0L452u.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard-stats",
  __ssrInlineRender: true,
  setup(__props) {
    const stats = ref({
      proposed: 0,
      validated: 0,
      published: 0,
      abandoned: 0,
      written: 0
    });
    useArticles();
    const IconProposed = () => h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [h("circle", { cx: "12", cy: "12", r: "10" }), h("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), h("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })]);
    const IconValidated = () => h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [h("polyline", { points: "20 6 9 17 4 12" })]);
    const IconPublished = () => h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [h("path", { d: "M5 12h14" }), h("path", { d: "M12 5v14" })]);
    const IconWritten = () => h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [h("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), h("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })]);
    const statConfig = {
      proposed: { label: "En attente", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", icon: IconProposed },
      validated: { label: "Validés", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", icon: IconValidated },
      written: { label: "Rédigés", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", icon: IconWritten },
      published: { label: "Publiés", color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)", icon: IconPublished }
    };
    const totalArticles = computed(() => {
      return Object.values(stats.value).reduce((a, b) => a + b, 0) || 1;
    });
    const getPercentage = (key) => {
      return (stats.value[key] || 0) / totalArticles.value * 100;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-stats" }, _attrs))} data-v-b63b4e4f><header class="page-header" data-v-b63b4e4f><div class="header-text" data-v-b63b4e4f><h1 data-v-b63b4e4f>Statistiques</h1><p class="subtitle" data-v-b63b4e4f>Vue d&#39;ensemble de votre production de contenu.</p></div></header><div class="stats-grid" data-v-b63b4e4f><!--[-->`);
      ssrRenderList(statConfig, (val, key) => {
        _push(`<div class="${ssrRenderClass([key, "stat-card glass-panel"])}" data-v-b63b4e4f><div class="card-inner" data-v-b63b4e4f><div class="stat-info" data-v-b63b4e4f><span class="stat-label" data-v-b63b4e4f>${ssrInterpolate(val.label)}</span><span class="stat-value" data-v-b63b4e4f>${ssrInterpolate(stats.value[key] || 0)}</span></div><div class="stat-icon-box" style="${ssrRenderStyle({ color: val.color, background: val.bg })}" data-v-b63b4e4f>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(val.icon), null, null), _parent);
        _push(`</div></div><div class="stat-progress" data-v-b63b4e4f><div class="progress-bar" style="${ssrRenderStyle({ width: getPercentage(key) + "%", background: val.color })}" data-v-b63b4e4f></div></div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard-stats.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboardStats = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b63b4e4f"]]);

export { dashboardStats as default };
//# sourceMappingURL=dashboard-stats-Bu3ywE2o.mjs.map
