import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const props = __props;
    const statusLabel = computed(() => {
      const map = {
        proposed: "Proposé",
        written: "Rédigé",
        validated: "Validé",
        published: "Publié",
        error: "Erreur",
        abandoned: "Abandonné",
        to_write: "À rédiger"
      };
      return map[props.status] || props.status;
    });
    const statusClass = computed(() => `status-${props.status.toLowerCase()}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["status-badge", unref(statusClass)]
      }, _attrs))} data-v-31a3bd5e><div class="status-dot" data-v-31a3bd5e></div><span data-v-31a3bd5e>${ssrInterpolate(unref(statusLabel))}</span></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-31a3bd5e"]]), { __name: "StatusBadge" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=StatusBadge-CFTuBF6z.mjs.map
