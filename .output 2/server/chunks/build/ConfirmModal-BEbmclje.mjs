import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ConfirmModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    title: {},
    description: {},
    confirmLabel: {},
    cancelLabel: { default: "Annuler" },
    type: {},
    loading: { type: Boolean, default: false },
    showArchive: { type: Boolean, default: false }
  },
  emits: ["cancel", "confirm", "confirm-archive"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="modal-overlay" data-v-30f92834>`);
          if (__props.isOpen) {
            _push2(`<div class="modal-container" data-v-30f92834><div class="modal-header" data-v-30f92834><div class="${ssrRenderClass([__props.type, "icon-wrapper"])}" data-v-30f92834>`);
            if (__props.type === "danger") {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-30f92834><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" data-v-30f92834></path><line x1="12" y1="9" x2="12" y2="13" data-v-30f92834></line><line x1="12" y1="17" x2="12.01" y2="17" data-v-30f92834></line></svg>`);
            } else {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-30f92834><polyline points="3 6 5 6 21 6" data-v-30f92834></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-30f92834></path></svg>`);
            }
            _push2(`</div><h3 data-v-30f92834>${ssrInterpolate(__props.title)}</h3></div><div class="modal-body" data-v-30f92834><p data-v-30f92834>${ssrInterpolate(__props.description)}</p></div><div class="modal-footer" data-v-30f92834><button class="btn btn-ghost" data-v-30f92834>${ssrInterpolate(__props.cancelLabel)}</button><div class="action-group" data-v-30f92834>`);
            if (__props.showArchive) {
              _push2(`<button class="btn btn-outline"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""} data-v-30f92834>`);
              if (!__props.loading) {
                _push2(`<span data-v-30f92834>Archiver</span>`);
              } else {
                _push2(`<div class="loader-sm" data-v-30f92834></div>`);
              }
              _push2(`</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button class="${ssrRenderClass([__props.type === "danger" ? "btn-danger" : "btn-primary", "btn"])}"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""} data-v-30f92834>`);
            if (!__props.loading) {
              _push2(`<span data-v-30f92834>${ssrInterpolate(__props.confirmLabel)}</span>`);
            } else {
              _push2(`<div class="loader-sm" data-v-30f92834></div>`);
            }
            _push2(`</button></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ConfirmModal = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-30f92834"]]), { __name: "ConfirmModal" });

export { ConfirmModal as C };
//# sourceMappingURL=ConfirmModal-BEbmclje.mjs.map
