import { _ as __nuxt_component_1 } from './StatusBadge-CFTuBF6z.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { f as formatDate } from './date-CTtNTFg4.mjs';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ArticleTableRow",
  __ssrInlineRender: true,
  props: {
    article: {},
    showStatus: { type: Boolean }
  },
  emits: ["click"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StatusBadge = __nuxt_component_1;
      _push(`<tr${ssrRenderAttrs(mergeProps({ class: "article-row" }, _attrs))} data-v-acc6a08f><td data-v-acc6a08f><div class="article-info" data-v-acc6a08f><div class="title-with-favorite" data-v-acc6a08f><span class="article-title" data-v-acc6a08f>${ssrInterpolate(__props.article.original_title)}</span>`);
      if (__props.article.versions_count && __props.article.versions_count > 0) {
        _push(`<span class="version-badge" data-v-acc6a08f>${ssrInterpolate(__props.article.versions_count)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></td><td data-v-acc6a08f><div class="article-desc" data-v-acc6a08f>${ssrInterpolate(__props.article.original_description || "—")}</div></td><td class="text-center" data-v-acc6a08f>`);
      if (__props.article.source_url) {
        _push(`<a${ssrRenderAttr("href", __props.article.source_url)} target="_blank" class="source-link-icon" title="Open Source URL" data-v-acc6a08f><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-acc6a08f><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" data-v-acc6a08f></path><polyline points="15 3 21 3 21 9" data-v-acc6a08f></polyline><line x1="10" y1="14" x2="21" y2="3" data-v-acc6a08f></line></svg></a>`);
      } else {
        _push(`<span class="text-muted" data-v-acc6a08f>—</span>`);
      }
      _push(`</td><td data-v-acc6a08f><span class="article-date" data-v-acc6a08f>${ssrInterpolate(unref(formatDate)(__props.article.created_at))}</span></td>`);
      if (__props.showStatus) {
        _push(`<td data-v-acc6a08f><div class="status-wrapper" data-v-acc6a08f>`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: __props.article.status
        }, null, _parent));
        _push(`</div></td>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<td class="text-right" data-v-acc6a08f><div class="actions" data-v-acc6a08f>`);
      ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
      _push(`</div></td></tr>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticleTableRow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ArticleTableRow = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-acc6a08f"]]), { __name: "ArticleTableRow" });

export { ArticleTableRow as A };
//# sourceMappingURL=ArticleTableRow-dgAqsZi0.mjs.map
