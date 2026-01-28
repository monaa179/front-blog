import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { L as LoadingState } from './LoadingState-Be_kyMDz.mjs';
import { C as ConfirmModal } from './ConfirmModal-BEbmclje.mjs';
import { _ as _export_sfc, b as useRouter } from './server.mjs';
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
  __name: "modules",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const modules2 = ref([]);
    const loading = ref(true);
    const creating = ref(false);
    const updating = ref(false);
    const newModule = ref({
      name: "",
      slug: "",
      description: "",
      active: true
    });
    const isConfirmOpen = ref(false);
    const moduleIdToDelete = ref(null);
    const actionLoading = ref(false);
    const closeConfirm = () => {
      isConfirmOpen.value = false;
      moduleIdToDelete.value = null;
      actionLoading.value = false;
    };
    const handleDelete = async () => {
      if (!moduleIdToDelete.value) return;
      actionLoading.value = true;
      try {
        await $fetch(`/api/modules/${moduleIdToDelete.value}`, { method: "DELETE" });
        modules2.value = modules2.value.filter((m) => m.id !== moduleIdToDelete.value);
        closeConfirm();
      } catch (error) {
        console.error("Error deleting module:", error);
      } finally {
        actionLoading.value = false;
      }
    };
    const isEditModalOpen = ref(false);
    const editingModule = ref({});
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "modules-page" }, _attrs))} data-v-3f3fb53c><header class="page-header" data-v-3f3fb53c><div class="header-text" data-v-3f3fb53c><h1 data-v-3f3fb53c>Modules</h1><p class="subtitle" data-v-3f3fb53c>Gérez les modules d&#39;analyse et de rédaction.</p></div></header><div class="create-section glass-panel" data-v-3f3fb53c><div class="section-title" data-v-3f3fb53c>Nouveau Module</div><div class="form-grid" data-v-3f3fb53c><div class="form-group" data-v-3f3fb53c><label data-v-3f3fb53c>Nom du module</label><input${ssrRenderAttr("value", unref(newModule).name)} type="text" placeholder="Ex: Analyse SEO" data-v-3f3fb53c></div><div class="form-group text-center" data-v-3f3fb53c><label data-v-3f3fb53c>Slug (Auto)</label><input${ssrRenderAttr("value", unref(newModule).slug)} type="text" disabled class="slug-input" data-v-3f3fb53c></div><div class="form-group checkbox-cell" data-v-3f3fb53c><label class="checkbox-container" data-v-3f3fb53c><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(newModule).active) ? ssrLooseContain(unref(newModule).active, null) : unref(newModule).active) ? " checked" : ""} data-v-3f3fb53c><span class="checkmark" data-v-3f3fb53c></span><span class="label-text" data-v-3f3fb53c>Actif par défaut</span></label></div><div class="form-actions" data-v-3f3fb53c><button class="btn btn-primary btn-full"${ssrIncludeBooleanAttr(!unref(newModule).name || unref(creating)) ? " disabled" : ""} data-v-3f3fb53c>`);
      if (unref(creating)) {
        _push(`<div class="loader-sm" data-v-3f3fb53c></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span data-v-3f3fb53c>${ssrInterpolate(unref(creating) ? "Ajout..." : "Ajouter")}</span></button></div></div><div class="form-group full-width mt-20" data-v-3f3fb53c><label class="ai-label" data-v-3f3fb53c><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-icon" data-v-3f3fb53c><path d="M12 2a10 10 0 1 0 10 10H12V2z" data-v-3f3fb53c></path><path d="M12 12L2.69 7" data-v-3f3fb53c></path><path d="M12 12l5.63 8.35" data-v-3f3fb53c></path></svg> Description (Instructions IA) </label><textarea placeholder="Décris ce que l&#39;article doit aborder lorsque ce module est sélectionné..." rows="3" data-v-3f3fb53c>${ssrInterpolate(unref(newModule).description)}</textarea><p class="help-text" data-v-3f3fb53c>Décris ce que l’article doit aborder lorsque ce module est sélectionné.</p></div></div><div class="list-section" data-v-3f3fb53c>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(LoadingState, { message: "Chargement des modules..." }, null, _parent));
      } else {
        _push(`<div class="table-container glass-panel" data-v-3f3fb53c><table class="modern-table" data-v-3f3fb53c><thead data-v-3f3fb53c><tr data-v-3f3fb53c><th data-v-3f3fb53c>Nom</th><th data-v-3f3fb53c>Description</th><th data-v-3f3fb53c>Slug</th><th data-v-3f3fb53c>Statut</th><th style="${ssrRenderStyle({ "text-align": "right" })}" data-v-3f3fb53c>Actions</th></tr></thead><tbody data-v-3f3fb53c>`);
        if (unref(modules2).length === 0) {
          _push(`<tr data-v-3f3fb53c><td colspan="5" class="empty-row" data-v-3f3fb53c>Aucun module trouvé.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(modules2), (mod) => {
          _push(`<tr class="module-row" data-v-3f3fb53c><td data-v-3f3fb53c><span class="module-name" data-v-3f3fb53c>${ssrInterpolate(mod.name)}</span></td><td data-v-3f3fb53c><span class="module-description"${ssrRenderAttr("title", mod.description)} data-v-3f3fb53c>${ssrInterpolate(mod.description || "Aucune description")}</span></td><td data-v-3f3fb53c><code class="slug-badge" data-v-3f3fb53c>${ssrInterpolate(mod.slug)}</code></td><td data-v-3f3fb53c><button class="${ssrRenderClass([{ active: mod.active }, "status-pill"])}" data-v-3f3fb53c><span class="status-dot" data-v-3f3fb53c></span> ${ssrInterpolate(mod.active ? "Actif" : "Inactif")}</button></td><td class="text-right" data-v-3f3fb53c><div class="actions-group" data-v-3f3fb53c><button class="btn btn-ghost btn-sm btn-square" title="Modifier" data-v-3f3fb53c><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3f3fb53c><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" data-v-3f3fb53c></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" data-v-3f3fb53c></path></svg></button><button class="btn btn-ghost btn-sm btn-square text-danger" title="Supprimer" data-v-3f3fb53c><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3f3fb53c><polyline points="3 6 5 6 21 6" data-v-3f3fb53c></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-3f3fb53c></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(ConfirmModal, {
        "is-open": unref(isConfirmOpen),
        title: "Supprimer le module",
        description: "Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.",
        "confirm-label": "Supprimer",
        type: "danger",
        loading: unref(actionLoading),
        onCancel: closeConfirm,
        onConfirm: handleDelete
      }, null, _parent));
      if (unref(isEditModalOpen)) {
        _push(`<div class="modal-overlay" data-v-3f3fb53c><div class="modal-content glass-panel edit-modal" data-v-3f3fb53c><header class="modal-header" data-v-3f3fb53c><h3 data-v-3f3fb53c>Modifier le Module</h3><button class="close-btn" data-v-3f3fb53c><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3f3fb53c><line x1="18" y1="6" x2="6" y2="18" data-v-3f3fb53c></line><line x1="6" y1="6" x2="18" y2="18" data-v-3f3fb53c></line></svg></button></header><div class="modal-body" data-v-3f3fb53c><div class="form-group" data-v-3f3fb53c><label data-v-3f3fb53c>Nom du module</label><input${ssrRenderAttr("value", unref(editingModule).name)} type="text" data-v-3f3fb53c></div><div class="form-group mt-20" data-v-3f3fb53c><label class="ai-label" data-v-3f3fb53c><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-icon" data-v-3f3fb53c><path d="M12 2a10 10 0 1 0 10 10H12V2z" data-v-3f3fb53c></path><path d="M12 12L2.69 7" data-v-3f3fb53c></path><path d="M12 12l5.63 8.35" data-v-3f3fb53c></path></svg> Description (Instructions IA) </label><textarea rows="5" data-v-3f3fb53c>${ssrInterpolate(unref(editingModule).description)}</textarea><p class="help-text" data-v-3f3fb53c>Décris ce que l’article doit aborder lorsque ce module est sélectionné.</p></div><div class="form-group mt-20" data-v-3f3fb53c><label class="checkbox-container" data-v-3f3fb53c><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(editingModule).active) ? ssrLooseContain(unref(editingModule).active, null) : unref(editingModule).active) ? " checked" : ""} data-v-3f3fb53c><span class="checkmark" data-v-3f3fb53c></span><span class="label-text" data-v-3f3fb53c>Module actif</span></label></div></div><footer class="modal-footer" data-v-3f3fb53c><button class="btn btn-ghost" data-v-3f3fb53c>Annuler</button><button class="btn btn-primary"${ssrIncludeBooleanAttr(unref(updating)) ? " disabled" : ""} data-v-3f3fb53c>`);
        if (unref(updating)) {
          _push(`<div class="loader-sm" data-v-3f3fb53c></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span data-v-3f3fb53c>${ssrInterpolate(unref(updating) ? "Enregistrement..." : "Enregistrer")}</span></button></footer></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/modules.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const modules = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3f3fb53c"]]);

export { modules as default };
//# sourceMappingURL=modules-KS7BuJvh.mjs.map
