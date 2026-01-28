import { _ as __nuxt_component_0 } from './nuxt-link-t9xXPaHD.mjs';
import { _ as __nuxt_component_1 } from './StatusBadge-CFTuBF6z.mjs';
import { defineComponent, withAsyncContext, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';
import { _ as _export_sfc, c as useRoute, d as useAsyncData } from './server.mjs';
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
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const articleId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    const { data: article, pending, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`article-${articleId}`, async () => {
      return await $fetch(`/api/articles/${articleId}`);
    })), __temp = await __temp, __restore(), __temp);
    const selectedVersionIndex = ref(0);
    const versions = computed(() => {
      if (!article.value?.article_versions) return [];
      return [...article.value.article_versions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    const latestVersion = computed(() => versions.value[selectedVersionIndex.value] || null);
    const currentContent = computed(() => latestVersion.value?.content || null);
    const articleModules = computed(() => {
      if (!article.value?.article_modules) return [];
      return article.value.article_modules.map((am) => am.module);
    });
    const editedContent = ref("");
    const showCopySuccess = ref(false);
    const isModified = computed(() => {
      const original = currentContent.value || "";
      return editedContent.value !== original;
    });
    watch(currentContent, (newVal) => {
      editedContent.value = newVal || "";
    }, { immediate: true });
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_StatusBadge = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "article-page" }, _attrs))} data-v-20345846>`);
      if (unref(pending)) {
        _push(`<div class="loading-state" data-v-20345846><div class="spinner" data-v-20345846></div> Chargement de l&#39;article... </div>`);
      } else if (unref(error)) {
        _push(`<div class="error-msg" data-v-20345846><div class="error-info" data-v-20345846><h3 data-v-20345846>Erreur lors du chargement</h3><p data-v-20345846>${ssrInterpolate(unref(error).message || "Une erreur est survenue lors de la récupération des données.")}</p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard",
          class: "btn btn-secondary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour au dashboard`);
            } else {
              return [
                createTextVNode("Retour au dashboard")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(article)) {
        _push(`<div class="article-container" data-v-20345846><div class="main-column" data-v-20345846><header class="article-header" data-v-20345846><a class="back-link" data-v-20345846><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-20345846><path d="M19 12H5M12 19l-7-7 7-7" data-v-20345846></path></svg> Retour </a><div class="title-section" data-v-20345846><h1 class="article-title" data-v-20345846>${ssrInterpolate(unref(article).original_title)}</h1><div class="article-meta-line" data-v-20345846>`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: unref(article).status
        }, null, _parent));
        _push(`<span class="dot" data-v-20345846>•</span><span class="date" data-v-20345846>Mis à jour le ${ssrInterpolate(formatDate(unref(article).updated_at))}</span></div></div></header><section class="content-section" data-v-20345846><div class="section-header" data-v-20345846><h3 data-v-20345846>Contenu Rédigé</h3>`);
        if (unref(versions).length > 0) {
          _push(`<div class="version-info" data-v-20345846><span class="version-count" data-v-20345846>${ssrInterpolate(unref(versions).length)} version(s) disponible(s)</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(versions).length > 1) {
          _push(`<div class="version-selector" data-v-20345846><label for="version-select" data-v-20345846>Choisir une version :</label><select id="version-select" data-v-20345846><!--[-->`);
          ssrRenderList(unref(versions), (v, idx) => {
            _push(`<option${ssrRenderAttr("value", idx)} data-v-20345846${ssrIncludeBooleanAttr(Array.isArray(unref(selectedVersionIndex)) ? ssrLooseContain(unref(selectedVersionIndex), idx) : ssrLooseEqual(unref(selectedVersionIndex), idx)) ? " selected" : ""}> Version ${ssrInterpolate(v.version_number || unref(versions).length - idx)} (${ssrInterpolate(formatDate(v.created_at))}) </option>`);
          });
          _push(`<!--]--></select></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(versions).length === 0) {
          _push(`<div class="empty-state" data-v-20345846><div class="empty-icon" data-v-20345846>✍️</div><h4 data-v-20345846>Aucun contenu rédigé pour cet article</h4><p data-v-20345846>Le contenu apparaîtra ici une fois la génération terminée.</p></div>`);
        } else {
          _push(`<div class="content-editor" data-v-20345846><div class="editor-toolbar" data-v-20345846><div class="toolbar-left" data-v-20345846><span class="version-tag" data-v-20345846><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-20345846><circle cx="12" cy="12" r="10" data-v-20345846></circle><polyline points="12 6 12 12 16 14" data-v-20345846></polyline></svg> Version du ${ssrInterpolate(formatDate(unref(latestVersion)?.created_at))}</span>`);
          if (unref(isModified)) {
            _push(`<span class="modified-badge" data-v-20345846>Modifié</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="toolbar-actions" data-v-20345846>`);
          if (unref(isModified)) {
            _push(`<button class="btn btn-ghost btn-sm reset-btn" data-v-20345846> Réinitialiser </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="btn btn-primary btn-sm copy-btn"${ssrIncludeBooleanAttr(!unref(editedContent)) ? " disabled" : ""} data-v-20345846>`);
          if (unref(showCopySuccess)) {
            _push(`<!--[--><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-20345846><polyline points="20 6 9 17 4 12" data-v-20345846></polyline></svg> Copié ✓ <!--]-->`);
          } else {
            _push(`<!--[--><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-20345846><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-20345846></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-20345846></path></svg> Copier le contenu <!--]-->`);
          }
          _push(`</button></div></div><div class="editor-body" data-v-20345846><textarea class="markdown-editor" placeholder="Le contenu de cette version est vide. Commencez à rédiger ici..." data-v-20345846>${ssrInterpolate(unref(editedContent))}</textarea></div></div>`);
        }
        _push(`</section></div><aside class="side-column" data-v-20345846><div class="sidebar-card" data-v-20345846><h3 class="sidebar-heading" data-v-20345846>Détails de l&#39;article</h3><div class="detail-group" data-v-20345846><label data-v-20345846>Description originale</label><p class="description-text" data-v-20345846>${ssrInterpolate(unref(article).original_description || "Aucune description fournie.")}</p></div><div class="detail-group" data-v-20345846><label data-v-20345846>URL Source</label>`);
        if (unref(article).source_url) {
          _push(`<a${ssrRenderAttr("href", unref(article).source_url)} target="_blank" class="link-item" data-v-20345846> Voir la source <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-20345846><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" data-v-20345846></path><polyline points="15 3 21 3 21 9" data-v-20345846></polyline><line x1="10" y1="14" x2="21" y2="3" data-v-20345846></line></svg></a>`);
        } else {
          _push(`<span class="text-muted" data-v-20345846>Aucune URL source</span>`);
        }
        _push(`</div><div class="detail-group" data-v-20345846><label data-v-20345846>Modules activés</label><div class="modules-list" data-v-20345846><!--[-->`);
        ssrRenderList(unref(articleModules), (am) => {
          _push(`<span class="module-tag" data-v-20345846>${ssrInterpolate(am.name)}</span>`);
        });
        _push(`<!--]-->`);
        if (unref(articleModules).length === 0) {
          _push(`<span class="text-muted text-sm" data-v-20345846>Aucun module</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></aside></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/articles/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-20345846"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-CnWVuvRE.mjs.map
