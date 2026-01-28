import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { u as useArticles } from './useArticles-Ef0L452u.mjs';
import { L as LoadingState } from './LoadingState-Be_kyMDz.mjs';
import { A as ArticleTableRow } from './ArticleTableRow-dgAqsZi0.mjs';
import { C as ConfirmModal } from './ConfirmModal-BEbmclje.mjs';
import { _ as _export_sfc } from './server.mjs';
import './StatusBadge-CFTuBF6z.mjs';
import './date-CTtNTFg4.mjs';
import 'date-fns';
import 'date-fns/locale';
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
  __name: "archive",
  __ssrInlineRender: true,
  setup(__props) {
    const { articles, loading, error, deleteArticle: apiDeleteArticle, updateStatus } = useArticles({ statuses: ["abandoned", "error"] });
    const restoreArticle = async (id) => {
      await updateStatus(id, "validated");
    };
    const isConfirmOpen = ref(false);
    const articleIdToDelete = ref(null);
    const actionLoading = ref(false);
    const deleteArticle = (id) => {
      articleIdToDelete.value = id;
      isConfirmOpen.value = true;
    };
    const closeConfirm = () => {
      isConfirmOpen.value = false;
      articleIdToDelete.value = null;
      actionLoading.value = false;
    };
    const handleDelete = async () => {
      if (!articleIdToDelete.value) return;
      actionLoading.value = true;
      const success = await apiDeleteArticle(articleIdToDelete.value);
      if (success) {
        closeConfirm();
      } else {
        actionLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-page" }, _attrs))} data-v-57d2de56><div class="page-header" data-v-57d2de56><div class="header-text" data-v-57d2de56><h1 data-v-57d2de56>Archive</h1><p class="subtitle" data-v-57d2de56>Gestion des articles refusés : nettoyage et récupération.</p></div></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(LoadingState, { message: "Chargement des articles..." }, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="error-msg" data-v-57d2de56><div class="error-icon" data-v-57d2de56>⚠️</div> ${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div class="table-card-container" data-v-57d2de56><table class="articles-table" data-v-57d2de56><thead data-v-57d2de56><tr data-v-57d2de56><th style="${ssrRenderStyle({ "width": "40%" })}" data-v-57d2de56>Titre</th><th style="${ssrRenderStyle({ "width": "30%" })}" data-v-57d2de56>Description</th><th style="${ssrRenderStyle({ "width": "40px", "text-align": "center" })}" data-v-57d2de56>URL</th><th style="${ssrRenderStyle({ "width": "90px" })}" data-v-57d2de56>Date</th><th style="${ssrRenderStyle({ "width": "120px" })}" data-v-57d2de56>Statut</th><th style="${ssrRenderStyle({ "width": "140px", "text-align": "right" })}" data-v-57d2de56>Actions</th></tr></thead><tbody data-v-57d2de56><!--[-->`);
        ssrRenderList(unref(articles), (article) => {
          _push(ssrRenderComponent(ArticleTableRow, {
            key: article.id,
            article,
            "show-status": ""
          }, {
            actions: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button class="btn btn-ghost btn-sm btn-icon-only" title="Restaurer l&#39;article (remettre en validé)" data-v-57d2de56${_scopeId}><span style="${ssrRenderStyle({ "font-size": "16px" })}" data-v-57d2de56${_scopeId}>♻️</span></button><button class="btn btn-ghost btn-sm btn-icon-only text-danger" title="Supprimer définitivement" data-v-57d2de56${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-57d2de56${_scopeId}><polyline points="3 6 5 6 21 6" data-v-57d2de56${_scopeId}></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-57d2de56${_scopeId}></path></svg></button>`);
              } else {
                return [
                  createVNode("button", {
                    class: "btn btn-ghost btn-sm btn-icon-only",
                    onClick: ($event) => restoreArticle(article.id),
                    title: "Restaurer l'article (remettre en validé)"
                  }, [
                    createVNode("span", { style: { "font-size": "16px" } }, "♻️")
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    class: "btn btn-ghost btn-sm btn-icon-only text-danger",
                    onClick: ($event) => deleteArticle(article.id),
                    title: "Supprimer définitivement"
                  }, [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "14",
                      height: "14",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    }, [
                      createVNode("polyline", { points: "3 6 5 6 21 6" }),
                      createVNode("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
                    ]))
                  ], 8, ["onClick"])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(ssrRenderComponent(ConfirmModal, {
        "is-open": unref(isConfirmOpen),
        title: "Supprimer définitivement",
        description: "Êtes-vous sûr de vouloir supprimer définitivement cet article ? Cette action est irréversible.",
        "confirm-label": "Supprimer définitivement",
        type: "danger",
        loading: unref(actionLoading),
        onCancel: closeConfirm,
        onConfirm: handleDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/archive.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const archive = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-57d2de56"]]);

export { archive as default };
//# sourceMappingURL=archive-BdFncJ8A.mjs.map
