<template>
  <div class="admin-users-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Gestion des utilisateurs</h1>
        <p class="subtitle">Créez et gérez les comptes de votre plateforme</p>
      </div>
      <button class="btn btn-primary" @click="showCreateForm = !showCreateForm">
        <PlusIcon :size="16" v-if="!showCreateForm" />
        <span v-if="!showCreateForm">Nouvel utilisateur</span>
        <span v-else>Masquer le formulaire</span>
      </button>
    </header>

    <transition name="slide">
      <div v-if="showCreateForm" class="form-container card">
        <div class="card-header">
          <h3>Nouvel utilisateur</h3>
        </div>
        <form @submit.prevent="handleCreateUser" class="user-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Prénom</label>
              <input v-model="form.first_name" placeholder="Ex: Jean" required />
            </div>
            <div class="form-group">
              <label>Nom</label>
              <input v-model="form.last_name" placeholder="Ex: Dupont" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="jean@example.com" required />
            </div>
            <div class="form-group">
              <label>Mot de passe</label>
              <input v-model="form.password" type="password" placeholder="••••••••" required />
            </div>
            <div class="form-group full-width">
              <label>Rôle (libre saisie)</label>
              <input v-model="form.role" placeholder="Ex: admin, marketing, editor, designer..." required />
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="showCreateForm = false">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span v-if="creating">Création en cours...</span>
              <span v-else>Créer l'utilisateur</span>
            </button>
          </div>
        </form>
      </div>
    </transition>

    <div class="table-container card">
      <table class="users-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Rôle</th>
            <th>Créé le</th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="4" class="status-cell">
              <div class="loading-spinner"></div>
              Chargement des profils...
            </td>
          </tr>
          <tr v-else-if="profiles.length === 0">
            <td colspan="4" class="status-cell">Aucun utilisateur trouvé</td>
          </tr>
          <tr v-for="profile in profiles" :key="profile.id" class="user-row">
            <td class="user-cell">
              <div class="avatar-small">
                {{ profile.first_name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() }}
              </div>
              <div class="user-info">
                <span class="user-name">{{ profile.first_name }} {{ profile.last_name }}</span>
                <span class="user-email text-muted">{{ profile.email }}</span>
              </div>
            </td>
            <td>
              <span class="role-badge">{{ profile.role }}</span>
            </td>
            <td class="text-secondary">{{ formatDate(profile.created_at) }}</td>
            <td class="actions-cell">
              <button 
                class="btn-icon btn-danger" 
                @click="confirmDelete(profile)"
                :disabled="profile.id === currentUser?.id"
                title="Supprimer"
              >
                <Trash2Icon :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal
      :is-open="!!userToDelete"
      title="Supprimer l'utilisateur"
      :description="userToDelete ? `Êtes-vous sûr de vouloir supprimer ${userToDelete.email} ? Cette action est irréversible.` : ''"
      confirm-label="Supprimer définitivement"
      type="danger"
      :loading="deleting"
      @cancel="userToDelete = null"
      @confirm="handleDeleteUser"
    />

    <!-- Toasts Notifications -->
    <div class="toasts">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
          <div class="toast-icon">
            <CheckCircleIcon v-if="toast.type === 'success'" :size="18" />
            <AlertCircleIcon v-else :size="18" />
          </div>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PlusIcon, 
  Trash2Icon, 
  CheckCircleIcon, 
  AlertCircleIcon
} from 'lucide-vue-next'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ConfirmModal from '@/components/ConfirmModal.vue'

definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

const { user: currentUser } = useAuth()

const profiles = ref<any[]>([])
const loading = ref(true)
const creating = ref(false)
const deleting = ref(false)
const showCreateForm = ref(false)
const userToDelete = ref<any>(null)

const form = ref({
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: ''
})

const toasts = ref<any[]>([])

const addToast = (message: string, type: 'success' | 'error' = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 4000)
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const data = await $fetch<any[]>('/api/modules') // Wait, I need a /api/profiles or similar
    // Actually, I don't have a GET /api/admin/users yet. I'll create it.
    const res = await $fetch<any[]>('/api/admin/users')
    profiles.value = res || []
  } catch (e: any) {
    addToast('Erreur lors du chargement des profils', 'error')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleCreateUser = async () => {
  if (creating.value) return
  creating.value = true
  try {
    await $fetch('/api/admin/create-user', {
      method: 'POST',
      body: form.value
    })

    addToast('Utilisateur créé avec succès !')
    showCreateForm.value = false
    form.value = { email: '', password: '', first_name: '', last_name: '', role: '' }
    fetchUsers()
  } catch (e: any) {
    addToast(e.data?.statusMessage || e.message || 'Erreur lors de la création', 'error')
  } finally {
    creating.value = false
  }
}

const confirmDelete = (user: any) => {
  userToDelete.value = user
}

const handleDeleteUser = async () => {
  if (!userToDelete.value || deleting.value) return
  
  deleting.value = true
  try {
    await $fetch(`/api/admin/delete-user`, {
      method: 'DELETE',
      query: { id: userToDelete.value.id }
    })

    addToast('Utilisateur supprimé avec succès')
    userToDelete.value = null
    fetchUsers()
  } catch (e: any) {
    addToast(e.data?.statusMessage || e.message || 'Erreur lors de la suppression', 'error')
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'n/a'
  return format(new Date(dateString), 'd MMM yyyy, HH:mm', { locale: fr })
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-users-page {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-xl);
}

.header-content h1 {
  font-size: 24px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

/* Form Styles */
.form-container {
  margin-bottom: var(--spacing-xl);
  border-left: 3px solid var(--primary);
}

.card-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-form {
  padding: var(--spacing-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.full-width {
  grid-column: span 2;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

/* Table Styles */
.table-container {
  width: 100%;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
  background-color: rgba(255, 255, 255, 0.02);
}

.users-table td {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.user-row:hover {
  background-color: var(--bg-card-hover);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-subtle);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

.user-email {
  font-size: 12px;
}

.role-badge {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: 999px;
  background-color: var(--border-subtle);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.actions-header {
  text-align: right !important;
}

.actions-cell {
  text-align: right;
}

.btn-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-muted);
}

.btn-icon:hover:not(:disabled) {
  background-color: var(--bg-card-hover);
  color: var(--text-primary);
  border-color: var(--border-active);
}

.btn-icon.btn-danger:hover:not(:disabled) {
  color: var(--color-error);
  background-color: var(--color-error-bg);
  border-color: var(--color-error);
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.status-cell {
  text-align: center;
  padding: var(--spacing-2xl) !important;
  color: var(--text-muted);
}

/* Toast Styles */
.toasts {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 200;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-lg);
  min-width: 250px;
  max-width: 400px;
}

.toast.success {
  border-left: 4px solid var(--color-success);
}

.toast.success .toast-icon { color: var(--color-success); }

.toast.error {
  border-left: 4px solid var(--color-error);
}

.toast.error .toast-icon { color: var(--color-error); }

.toast-message {
  font-size: 13px;
  color: var(--text-primary);
}

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.toast-enter-active { transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.toast-leave-active { transition: all 0.2s ease; position: absolute; }
.toast-enter-from { opacity: 0; transform: translateX(50px); }
.toast-leave-to { opacity: 0; transform: scale(0.9); }

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
