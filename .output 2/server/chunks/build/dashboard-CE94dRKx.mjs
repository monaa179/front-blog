import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, withModifiers, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { u as useArticles } from './useArticles-Ef0L452u.mjs';
import { L as LoadingState } from './LoadingState-Be_kyMDz.mjs';
import { A as ArticleTableRow } from './ArticleTableRow-dgAqsZi0.mjs';
import { C as ConfirmModal } from './ConfirmModal-BEbmclje.mjs';
import { _ as _export_sfc, b as useRouter } from './server.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const {
      articles,
      loading,
      error,
      updateStatus,
      archiveArticle: archiveArticleAction,
      deleteArticle: deleteArticleAction
    } = useArticles({
      statuses: ["proposed"],
      order: { column: "created_at", ascending: false }
    });
    const proposedArticles = computed(() => articles.value.filter((article) => article.status === "proposed"));
    const validateArticle = async (id) => {
      await updateStatus(id, "validated");
    };
    const isConfirmOpen = ref(false);
    const articleIdToRefuse = ref(null);
    const actionLoading = ref(false);
    const refuseArticle = (id) => {
      articleIdToRefuse.value = id;
      isConfirmOpen.value = true;
    };
    const closeConfirm = () => {
      isConfirmOpen.value = false;
      articleIdToRefuse.value = null;
      actionLoading.value = false;
    };
    const handleArchive = async () => {
      if (!articleIdToRefuse.value) return;
      actionLoading.value = true;
      const success = await archiveArticleAction(articleIdToRefuse.value);
      if (success) {
        closeConfirm();
      } else {
        actionLoading.value = false;
      }
    };
    const handleDeleteDefinitely = async () => {
      if (!articleIdToRefuse.value) return;
      actionLoading.value = true;
      const success = await deleteArticleAction(articleIdToRefuse.value);
      if (success) {
        closeConfirm();
      } else {
        actionLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-page" }, _attrs))} data-v-53eb61bf><header class="page-header" data-v-53eb61bf><div class="header-text" data-v-53eb61bf><h1 data-v-53eb61bf>Validation</h1><p class="subtitle" data-v-53eb61bf>Passez en revue et validez les nouveaux sujets d&#39;articles.</p></div></header>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(LoadingState, { message: "Chargement des propositions..." }, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="error-msg glass-panel" data-v-53eb61bf><div class="error-icon" data-v-53eb61bf>⚠️</div><p data-v-53eb61bf>${ssrInterpolate(unref(error))}</p><button class="btn btn-outline btn-sm mt-4" data-v-53eb61bf>Réessayer</button></div>`);
      } else {
        _push(`<div class="content-container" data-v-53eb61bf>`);
        if (unref(proposedArticles).length > 0) {
          _push(`<div class="table-card glass-panel" data-v-53eb61bf><table class="modern-table" data-v-53eb61bf><thead data-v-53eb61bf><tr data-v-53eb61bf><th style="${ssrRenderStyle({ "width": "35%" })}" data-v-53eb61bf>Sujet</th><th style="${ssrRenderStyle({ "width": "45%" })}" data-v-53eb61bf>Description</th><th style="${ssrRenderStyle({ "width": "100px" })}" data-v-53eb61bf>Date</th><th style="${ssrRenderStyle({ "text-align": "right" })}" data-v-53eb61bf>Actions</th></tr></thead><tbody data-v-53eb61bf><!--[-->`);
          ssrRenderList(unref(proposedArticles), (article) => {
            _push(ssrRenderComponent(ArticleTableRow, {
              key: article.id,
              article,
              onClick: ($event) => unref(router).push(`/articles/${article.id}`)
            }, {
              actions: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="action-group" data-v-53eb61bf${_scopeId}><button class="btn btn-primary btn-sm btn-icon-label" title="Valider" data-v-53eb61bf${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-53eb61bf${_scopeId}><polyline points="20 6 9 17 4 12" data-v-53eb61bf${_scopeId}></polyline></svg><span data-v-53eb61bf${_scopeId}>Valider</span></button><button class="btn btn-ghost btn-sm btn-square text-danger" title="Refuser" data-v-53eb61bf${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-53eb61bf${_scopeId}><line x1="18" y1="6" x2="6" y2="18" data-v-53eb61bf${_scopeId}></line><line x1="6" y1="6" x2="18" y2="18" data-v-53eb61bf${_scopeId}></line></svg></button></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "action-group",
                      onClick: withModifiers(() => {
                      }, ["stop"])
                    }, [
                      createVNode("button", {
                        class: "btn btn-primary btn-sm btn-icon-label",
                        onClick: ($event) => validateArticle(article.id),
                        title: "Valider"
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          width: "14",
                          height: "14",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "3",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round"
                        }, [
                          createVNode("polyline", { points: "20 6 9 17 4 12" })
                        ])),
                        createVNode("span", null, "Valider")
                      ], 8, ["onClick"]),
                      createVNode("button", {
                        class: "btn btn-ghost btn-sm btn-square text-danger",
                        onClick: ($event) => refuseArticle(article.id),
                        title: "Refuser"
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2.5",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round"
                        }, [
                          createVNode("line", {
                            x1: "18",
                            y1: "6",
                            x2: "6",
                            y2: "18"
                          }),
                          createVNode("line", {
                            x1: "6",
                            y1: "6",
                            x2: "18",
                            y2: "18"
                          })
                        ]))
                      ], 8, ["onClick"])
                    ], 8, ["onClick"])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></tbody></table></div>`);
        } else {
          _push(`<div class="empty-state glass-panel" data-v-53eb61bf><div class="empty-illustration" data-v-53eb61bf>☕</div><h3 data-v-53eb61bf>Tout est en ordre</h3><p data-v-53eb61bf>Aucun nouveau sujet en attente de validation pour le moment.</p></div>`);
        }
        _push(`</div>`);
      }
      _push(ssrRenderComponent(ConfirmModal, {
        "is-open": unref(isConfirmOpen),
        title: "Refuser le sujet",
        description: "Voulez-vous archiver cet article ou le supprimer définitivement ?",
        "confirm-label": "Supprimer définitivement",
        type: "danger",
        loading: unref(actionLoading),
        "show-archive": "",
        onCancel: closeConfirm,
        onConfirm: handleDeleteDefinitely,
        onConfirmArchive: handleArchive
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-53eb61bf"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-CE94dRKx.mjs.map
