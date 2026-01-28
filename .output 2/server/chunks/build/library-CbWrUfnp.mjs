import { defineComponent, ref, computed, mergeProps, unref, withCtx, openBlock, createBlock, withModifiers, createCommentVNode, createVNode, toDisplayString, Fragment, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { u as useArticles } from './useArticles-Ef0L452u.mjs';
import { L as LoadingState } from './LoadingState-Be_kyMDz.mjs';
import { a as formatLibraryDate } from './date-CTtNTFg4.mjs';
import { _ as _export_sfc, b as useRouter } from './server.mjs';
import { C as ConfirmModal } from './ConfirmModal-BEbmclje.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ModuleSelector",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    availableModules: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isOpen = ref(false);
    const container = ref(null);
    const selectedModules = computed(() => props.modelValue || []);
    const isSelected = (id) => {
      return selectedModules.value.some((m) => m.id === id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "module-selector-wrapper",
        ref_key: "container",
        ref: container
      }, _attrs))} data-v-b0ff9ce5><div class="badges-list" data-v-b0ff9ce5>`);
      if (selectedModules.value.length === 0) {
        _push(`<span class="placeholder" data-v-b0ff9ce5>Select modules...</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(selectedModules.value, (module) => {
        _push(`<span class="module-badge" data-v-b0ff9ce5>${ssrInterpolate(module.name)} <span class="remove-x" data-v-b0ff9ce5>×</span></span>`);
      });
      _push(`<!--]--></div>`);
      if (isOpen.value) {
        _push(`<div class="dropdown-menu" data-v-b0ff9ce5><div class="dropdown-content" data-v-b0ff9ce5><!--[-->`);
        ssrRenderList(__props.availableModules, (option) => {
          _push(`<div class="${ssrRenderClass([{ active: isSelected(option.id) }, "dropdown-item"])}" data-v-b0ff9ce5><span class="check-box" data-v-b0ff9ce5>`);
          if (isSelected(option.id)) {
            _push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="10" height="10" data-v-b0ff9ce5><polyline points="20 6 9 17 4 12" data-v-b0ff9ce5></polyline></svg>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span><span class="item-label" data-v-b0ff9ce5>${ssrInterpolate(option.name)}</span></div>`);
        });
        _push(`<!--]-->`);
        if (__props.availableModules.length === 0) {
          _push(`<div class="empty-dropdown" data-v-b0ff9ce5> No modules available </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModuleSelector.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ModuleSelector = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-b0ff9ce5"]]), { __name: "ModuleSelector" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ArticleCard",
  __ssrInlineRender: true,
  props: {
    article: {},
    availableModules: {}
  },
  emits: ["click", "delete", "update-modules"],
  setup(__props) {
    const isDragging = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["article-card", {
          published: __props.article.status === "published",
          dragging: unref(isDragging)
        }],
        draggable: "true"
      }, _attrs))} data-v-b6986797><div class="card-header" data-v-b6986797><h4 class="article-title" data-v-b6986797>${ssrInterpolate(__props.article.original_title)}</h4><button class="minimal-delete" title="Supprimer" data-v-b6986797><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-b6986797><polyline points="3 6 5 6 21 6" data-v-b6986797></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-b6986797></path></svg></button></div><p class="article-desc" data-v-b6986797>${ssrInterpolate(__props.article.original_description)}</p><div class="card-meta" data-v-b6986797><div class="modules-hint" data-v-b6986797>`);
      _push(ssrRenderComponent(ModuleSelector, {
        "model-value": __props.article.modules,
        "available-modules": __props.availableModules,
        "onUpdate:modelValue": (newModules) => _ctx.$emit("update-modules", __props.article.id, newModules)
      }, null, _parent));
      _push(`</div><span class="card-date" data-v-b6986797>${ssrInterpolate(unref(formatLibraryDate)(__props.article.last_version_at || __props.article.created_at))}</span></div>`);
      if (_ctx.$slots.actions) {
        _push(`<div class="card-actions" data-v-b6986797>`);
        ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticleCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ArticleCard = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-b6986797"]]), { __name: "ArticleCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "library",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const selectedModuleId = ref(null);
    const processingId = ref(null);
    const isConfirmOpen = ref(false);
    const articleToProcess = ref(null);
    const actionLoading = ref(false);
    const confirmTitle = ref("Supprimer l'article");
    const confirmDescription = ref("Voulez-vous archiver cet article ou le supprimer définitivement ?");
    const confirmLabel = ref("Supprimer définitivement");
    const activeDropZone = ref(null);
    const {
      articles,
      loading,
      allModules,
      archiveArticle: archiveArticleAction,
      deleteArticle: deleteArticleAction,
      updateStatus,
      updateModules
    } = useArticles({
      statuses: ["validated", "written", "published", "to_write"],
      order: { column: "created_at", ascending: false }
    });
    const filteredArticles = computed(() => {
      if (!selectedModuleId.value) return articles.value;
      return articles.value.filter(
        (art) => art.modules.some((m) => m.id === selectedModuleId.value)
      );
    });
    const columns = computed(() => [
      {
        id: "validated",
        title: "Idées Validées",
        articles: filteredArticles.value.filter((a) => a.status === "validated" || a.status === "to_write"),
        emptyMessage: "Aucune idée validée."
      },
      {
        id: "written",
        title: "Prêt",
        articles: filteredArticles.value.filter((a) => a.status === "written"),
        emptyMessage: "Rien de prêt."
      },
      {
        id: "published",
        title: "Publié",
        articles: filteredArticles.value.filter((a) => a.status === "published"),
        emptyMessage: "Aucun article publié."
      }
    ]);
    const getWriteButtonText = (article) => {
      if (processingId.value === article.id) return "Lancement...";
      if (article.versions_count && article.versions_count > 0) return "Relancer";
      return "Lancer la rédaction";
    };
    const copyContent = (article) => {
      if (article.last_version_content) {
        (void 0).clipboard.writeText(article.last_version_content);
      }
    };
    const handleWrite = async (article) => {
      processingId.value = article.id;
      try {
        const vData = await $fetch(`/api/articles/${article.id}/versions`, {
          method: "POST",
          body: { content: null }
        });
        const versionId = vData.id;
        const makeWebhook = "https://hook.eu2.make.com/fa1xbhnay548sl6gu5zt8amx9jecv77q";
        const res = await fetch(makeWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            article_id: article.id,
            version_id: versionId,
            modules: article.modules?.map((m) => m.name)
          })
        });
        if (!res.ok) {
          await updateStatus(article.id, "validated");
        }
      } catch (e) {
        console.error(e);
      } finally {
        processingId.value = null;
      }
    };
    const openDeleteConfirm = (id) => {
      const art = articles.value.find((a) => a.id === id);
      if (art) {
        articleToProcess.value = art;
        isConfirmOpen.value = true;
      }
    };
    const closeConfirm = () => {
      isConfirmOpen.value = false;
      articleToProcess.value = null;
      actionLoading.value = false;
    };
    const handleArchive = async () => {
      if (!articleToProcess.value) return;
      actionLoading.value = true;
      const success = await archiveArticleAction(articleToProcess.value.id);
      if (success) {
        closeConfirm();
      } else {
        actionLoading.value = false;
      }
    };
    const handleDeleteDefinitely = async () => {
      if (!articleToProcess.value) return;
      actionLoading.value = true;
      const success = await deleteArticleAction(articleToProcess.value.id);
      if (success) {
        closeConfirm();
      } else {
        actionLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "library-page" }, _attrs))} data-v-33890ef7><header class="page-header" data-v-33890ef7><div class="header-content" data-v-33890ef7><div class="header-text" data-v-33890ef7><h1 data-v-33890ef7>Bibliothèque</h1><p class="subtitle" data-v-33890ef7>Gerez la rédaction et la publication de vos contenus.</p></div><div class="header-actions" data-v-33890ef7><div class="filter-wrapper" data-v-33890ef7><label class="sr-only" data-v-33890ef7>Filtrer par module</label><div class="select-container" data-v-33890ef7><svg class="select-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-33890ef7><path d="M22 3H2l8 9v6l4 2v-8L22 3z" data-v-33890ef7></path></svg><select class="minimal-select" data-v-33890ef7><option${ssrRenderAttr("value", null)} data-v-33890ef7${ssrIncludeBooleanAttr(Array.isArray(unref(selectedModuleId)) ? ssrLooseContain(unref(selectedModuleId), null) : ssrLooseEqual(unref(selectedModuleId), null)) ? " selected" : ""}>Tous les modules</option><!--[-->`);
      ssrRenderList(unref(allModules), (mod) => {
        _push(`<option${ssrRenderAttr("value", mod.id)} data-v-33890ef7${ssrIncludeBooleanAttr(Array.isArray(unref(selectedModuleId)) ? ssrLooseContain(unref(selectedModuleId), mod.id) : ssrLooseEqual(unref(selectedModuleId), mod.id)) ? " selected" : ""}>${ssrInterpolate(mod.name)}</option>`);
      });
      _push(`<!--]--></select></div></div></div></div></header><div class="board-container" data-v-33890ef7>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(LoadingState, { message: "Chargement de vos articles..." }, null, _parent));
      } else {
        _push(`<div class="kanban-board" data-v-33890ef7><!--[-->`);
        ssrRenderList(unref(columns), (col) => {
          _push(`<div class="${ssrRenderClass([[col.id, { "drag-over": unref(activeDropZone) === col.id }], "kanban-column"])}" data-v-33890ef7><div class="column-header" data-v-33890ef7><div class="column-title-group" data-v-33890ef7><div class="${ssrRenderClass([col.id, "status-dot"])}" data-v-33890ef7></div><h3 data-v-33890ef7>${ssrInterpolate(col.title)}</h3></div><span class="count-badge" data-v-33890ef7>${ssrInterpolate(col.articles.length)}</span></div><div class="column-content scroll-y" data-v-33890ef7><!--[-->`);
          ssrRenderList(col.articles, (article) => {
            _push(ssrRenderComponent(ArticleCard, {
              key: article.id,
              article,
              "available-modules": unref(allModules),
              onClick: ($event) => unref(router).push(`/articles/${article.id}`),
              onDelete: openDeleteConfirm,
              onUpdateModules: unref(updateModules)
            }, {
              actions: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (col.id === "validated") {
                    _push2(`<button class="btn btn-primary btn-sm btn-full"${ssrIncludeBooleanAttr(unref(processingId) === article.id) ? " disabled" : ""} data-v-33890ef7${_scopeId}>`);
                    if (unref(processingId) === article.id) {
                      _push2(`<div class="loader-sm" data-v-33890ef7${_scopeId}></div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<span data-v-33890ef7${_scopeId}>${ssrInterpolate(getWriteButtonText(article))}</span></button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (col.id === "written") {
                    _push2(`<!--[--><button class="btn btn-primary btn-sm btn-full"${ssrIncludeBooleanAttr(unref(processingId) === article.id) ? " disabled" : ""} data-v-33890ef7${_scopeId}>`);
                    if (unref(processingId) === article.id) {
                      _push2(`<div class="loader-sm" data-v-33890ef7${_scopeId}></div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<span data-v-33890ef7${_scopeId}>${ssrInterpolate(getWriteButtonText(article))}</span></button><button class="btn btn-ghost btn-sm btn-square" title="Copier le contenu" data-v-33890ef7${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-33890ef7${_scopeId}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-33890ef7${_scopeId}></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-33890ef7${_scopeId}></path></svg></button><!--]-->`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (col.id === "published") {
                    _push2(`<button class="btn btn-ghost btn-sm btn-full" data-v-33890ef7${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2" data-v-33890ef7${_scopeId}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-33890ef7${_scopeId}></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-33890ef7${_scopeId}></path></svg> Copier </button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    col.id === "validated" ? (openBlock(), createBlock("button", {
                      key: 0,
                      class: "btn btn-primary btn-sm btn-full",
                      onClick: withModifiers(($event) => handleWrite(article), ["stop"]),
                      disabled: unref(processingId) === article.id
                    }, [
                      unref(processingId) === article.id ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "loader-sm"
                      })) : createCommentVNode("", true),
                      createVNode("span", null, toDisplayString(getWriteButtonText(article)), 1)
                    ], 8, ["onClick", "disabled"])) : createCommentVNode("", true),
                    col.id === "written" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode("button", {
                        class: "btn btn-primary btn-sm btn-full",
                        onClick: withModifiers(($event) => handleWrite(article), ["stop"]),
                        disabled: unref(processingId) === article.id
                      }, [
                        unref(processingId) === article.id ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "loader-sm"
                        })) : createCommentVNode("", true),
                        createVNode("span", null, toDisplayString(getWriteButtonText(article)), 1)
                      ], 8, ["onClick", "disabled"]),
                      createVNode("button", {
                        class: "btn btn-ghost btn-sm btn-square",
                        onClick: withModifiers(($event) => copyContent(article), ["stop"]),
                        title: "Copier le contenu"
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
                          createVNode("rect", {
                            x: "9",
                            y: "9",
                            width: "13",
                            height: "13",
                            rx: "2",
                            ry: "2"
                          }),
                          createVNode("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                        ]))
                      ], 8, ["onClick"])
                    ], 64)) : createCommentVNode("", true),
                    col.id === "published" ? (openBlock(), createBlock("button", {
                      key: 2,
                      class: "btn btn-ghost btn-sm btn-full",
                      onClick: withModifiers(($event) => copyContent(article), ["stop"])
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
                        "stroke-linejoin": "round",
                        class: "mr-2"
                      }, [
                        createVNode("rect", {
                          x: "9",
                          y: "9",
                          width: "13",
                          height: "13",
                          rx: "2",
                          ry: "2"
                        }),
                        createVNode("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                      ])),
                      createTextVNode(" Copier ")
                    ], 8, ["onClick"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]-->`);
          if (col.articles.length === 0) {
            _push(`<div class="empty-column" data-v-33890ef7><div class="empty-icon" data-v-33890ef7>✨</div><p data-v-33890ef7>${ssrInterpolate(col.emptyMessage)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(ConfirmModal, {
        "is-open": unref(isConfirmOpen),
        title: unref(confirmTitle),
        description: unref(confirmDescription),
        "confirm-label": unref(confirmLabel),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/library.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const library = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-33890ef7"]]);

export { library as default };
//# sourceMappingURL=library-CbWrUfnp.mjs.map
