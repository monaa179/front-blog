import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LoadingState",
  __ssrInlineRender: true,
  props: {
    message: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "loading-state" }, _attrs))} data-v-333d397a><div class="spinner-container" data-v-333d397a><div class="spinner-outer" data-v-333d397a></div><div class="spinner-inner" data-v-333d397a></div></div><span class="loading-message" data-v-333d397a>${ssrInterpolate(__props.message)}</span></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LoadingState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LoadingState = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-333d397a"]]), { __name: "LoadingState" });

export { LoadingState as L };
//# sourceMappingURL=LoadingState-Be_kyMDz.mjs.map
