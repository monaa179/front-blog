import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { PlusIcon, Trash2Icon, CheckCircleIcon, AlertCircleIcon } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { C as ConfirmModal } from './ConfirmModal-BEbmclje.mjs';
import { _ as _export_sfc, a as useAuth } from './server.mjs';
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
  __name: "users",
  __ssrInlineRender: true,
  setup(__props) {
    const { user: currentUser } = useAuth();
    const profiles = ref([]);
    const loading = ref(true);
    const creating = ref(false);
    const deleting = ref(false);
    const showCreateForm = ref(false);
    const userToDelete = ref(null);
    const form = ref({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: ""
    });
    const toasts = ref([]);
    const addToast = (message, type = "success") => {
      const id = Date.now();
      toasts.value.push({ id, message, type });
      setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
      }, 4e3);
    };
    const fetchUsers = async () => {
      loading.value = true;
      try {
        const data = await $fetch("/api/modules");
        const res = await $fetch("/api/admin/users");
        profiles.value = res || [];
      } catch (e) {
        addToast("Erreur lors du chargement des profils", "error");
        console.error(e);
      } finally {
        loading.value = false;
      }
    };
    const handleDeleteUser = async () => {
      if (!userToDelete.value || deleting.value) return;
      deleting.value = true;
      try {
        await $fetch(`/api/admin/delete-user`, {
          method: "DELETE",
          query: { id: userToDelete.value.id }
        });
        addToast("Utilisateur supprimé avec succès");
        userToDelete.value = null;
        fetchUsers();
      } catch (e) {
        addToast(e.data?.statusMessage || e.message || "Erreur lors de la suppression", "error");
      } finally {
        deleting.value = false;
      }
    };
    const formatDate = (dateString) => {
      if (!dateString) return "n/a";
      return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: fr });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-users-page" }, _attrs))} data-v-a7ae9a5e><header class="page-header" data-v-a7ae9a5e><div class="header-content" data-v-a7ae9a5e><h1 data-v-a7ae9a5e>Gestion des utilisateurs</h1><p class="subtitle" data-v-a7ae9a5e>Créez et gérez les comptes de votre plateforme</p></div><button class="btn btn-primary" data-v-a7ae9a5e>`);
      if (!unref(showCreateForm)) {
        _push(ssrRenderComponent(unref(PlusIcon), { size: 16 }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(showCreateForm)) {
        _push(`<span data-v-a7ae9a5e>Nouvel utilisateur</span>`);
      } else {
        _push(`<span data-v-a7ae9a5e>Masquer le formulaire</span>`);
      }
      _push(`</button></header>`);
      if (unref(showCreateForm)) {
        _push(`<div class="form-container card" data-v-a7ae9a5e><div class="card-header" data-v-a7ae9a5e><h3 data-v-a7ae9a5e>Nouvel utilisateur</h3></div><form class="user-form" data-v-a7ae9a5e><div class="form-grid" data-v-a7ae9a5e><div class="form-group" data-v-a7ae9a5e><label data-v-a7ae9a5e>Prénom</label><input${ssrRenderAttr("value", unref(form).first_name)} placeholder="Ex: Jean" required data-v-a7ae9a5e></div><div class="form-group" data-v-a7ae9a5e><label data-v-a7ae9a5e>Nom</label><input${ssrRenderAttr("value", unref(form).last_name)} placeholder="Ex: Dupont" required data-v-a7ae9a5e></div><div class="form-group" data-v-a7ae9a5e><label data-v-a7ae9a5e>Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="jean@example.com" required data-v-a7ae9a5e></div><div class="form-group" data-v-a7ae9a5e><label data-v-a7ae9a5e>Mot de passe</label><input${ssrRenderAttr("value", unref(form).password)} type="password" placeholder="••••••••" required data-v-a7ae9a5e></div><div class="form-group full-width" data-v-a7ae9a5e><label data-v-a7ae9a5e>Rôle (libre saisie)</label><input${ssrRenderAttr("value", unref(form).role)} placeholder="Ex: admin, marketing, editor, designer..." required data-v-a7ae9a5e></div></div><div class="form-actions" data-v-a7ae9a5e><button type="button" class="btn btn-outline" data-v-a7ae9a5e>Annuler</button><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(creating)) ? " disabled" : ""} data-v-a7ae9a5e>`);
        if (unref(creating)) {
          _push(`<span data-v-a7ae9a5e>Création en cours...</span>`);
        } else {
          _push(`<span data-v-a7ae9a5e>Créer l&#39;utilisateur</span>`);
        }
        _push(`</button></div></form></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="table-container card" data-v-a7ae9a5e><table class="users-table" data-v-a7ae9a5e><thead data-v-a7ae9a5e><tr data-v-a7ae9a5e><th data-v-a7ae9a5e>Utilisateur</th><th data-v-a7ae9a5e>Rôle</th><th data-v-a7ae9a5e>Créé le</th><th class="actions-header" data-v-a7ae9a5e>Actions</th></tr></thead><tbody data-v-a7ae9a5e>`);
      if (unref(loading)) {
        _push(`<tr data-v-a7ae9a5e><td colspan="4" class="status-cell" data-v-a7ae9a5e><div class="loading-spinner" data-v-a7ae9a5e></div> Chargement des profils... </td></tr>`);
      } else if (unref(profiles).length === 0) {
        _push(`<tr data-v-a7ae9a5e><td colspan="4" class="status-cell" data-v-a7ae9a5e>Aucun utilisateur trouvé</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(profiles), (profile) => {
        _push(`<tr class="user-row" data-v-a7ae9a5e><td class="user-cell" data-v-a7ae9a5e><div class="avatar-small" data-v-a7ae9a5e>${ssrInterpolate(profile.first_name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase())}</div><div class="user-info" data-v-a7ae9a5e><span class="user-name" data-v-a7ae9a5e>${ssrInterpolate(profile.first_name)} ${ssrInterpolate(profile.last_name)}</span><span class="user-email text-muted" data-v-a7ae9a5e>${ssrInterpolate(profile.email)}</span></div></td><td data-v-a7ae9a5e><span class="role-badge" data-v-a7ae9a5e>${ssrInterpolate(profile.role)}</span></td><td class="text-secondary" data-v-a7ae9a5e>${ssrInterpolate(formatDate(profile.created_at))}</td><td class="actions-cell" data-v-a7ae9a5e><button class="btn-icon btn-danger"${ssrIncludeBooleanAttr(profile.id === unref(currentUser)?.id) ? " disabled" : ""} title="Supprimer" data-v-a7ae9a5e>`);
        _push(ssrRenderComponent(unref(Trash2Icon), { size: 16 }, null, _parent));
        _push(`</button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      _push(ssrRenderComponent(ConfirmModal, {
        "is-open": !!unref(userToDelete),
        title: "Supprimer l'utilisateur",
        description: unref(userToDelete) ? `Êtes-vous sûr de vouloir supprimer ${unref(userToDelete).email} ? Cette action est irréversible.` : "",
        "confirm-label": "Supprimer définitivement",
        type: "danger",
        loading: unref(deleting),
        onCancel: ($event) => userToDelete.value = null,
        onConfirm: handleDeleteUser
      }, null, _parent));
      _push(`<div class="toasts" data-v-a7ae9a5e><!--[-->`);
      ssrRenderList(unref(toasts), (toast) => {
        _push(`<div class="${ssrRenderClass(["toast", toast.type])}" data-v-a7ae9a5e><div class="toast-icon" data-v-a7ae9a5e>`);
        if (toast.type === "success") {
          _push(ssrRenderComponent(unref(CheckCircleIcon), { size: 18 }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(AlertCircleIcon), { size: 18 }, null, _parent));
        }
        _push(`</div><span class="toast-message" data-v-a7ae9a5e>${ssrInterpolate(toast.message)}</span></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const users = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a7ae9a5e"]]);

export { users as default };
//# sourceMappingURL=users-BYmm_nRm.mjs.map
