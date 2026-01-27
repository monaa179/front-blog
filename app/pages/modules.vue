<template>
  <div class="modules-page">
    <header class="page-header">
      <div class="header-text">
        <h1>Modules</h1>
        <p class="subtitle">Gérez les modules d'analyse et de rédaction.</p>
      </div>
    </header>

    <div class="create-section glass-panel">
      <div class="section-title">Nouveau Module</div>
      <div class="form-grid">
        <div class="form-group">
          <label>Nom du module</label>
          <input 
            v-model="newModule.name" 
            type="text" 
            placeholder="Ex: Analyse SEO" 
            @input="generateSlug"
          />
        </div>
        <div class="form-group text-center">
          <label>Slug (Auto)</label>
          <input 
            v-model="newModule.slug" 
            type="text" 
            disabled 
            class="slug-input"
          />
        </div>
        <div class="form-group checkbox-cell">
           <label class="checkbox-container">
             <input type="checkbox" v-model="newModule.active">
             <span class="checkmark"></span>
             <span class="label-text">Actif par défaut</span>
           </label>
        </div>
        <div class="form-actions">
          <button 
            class="btn btn-primary btn-full" 
            @click="createModule"
            :disabled="!newModule.name || creating"
          >
            <div v-if="creating" class="loader-sm"></div>
            <span>{{ creating ? 'Ajout...' : 'Ajouter' }}</span>
          </button>
        </div>
      </div>
      <div class="form-group full-width mt-20">
        <label class="ai-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-icon"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12L2.69 7"></path><path d="M12 12l5.63 8.35"></path></svg>
          Description (Instructions IA)
        </label>
        <textarea 
          v-model="newModule.description" 
          placeholder="Décris ce que l'article doit aborder lorsque ce module est sélectionné..."
          rows="3"
        ></textarea>
        <p class="help-text">Décris ce que l’article doit aborder lorsque ce module est sélectionné.</p>
      </div>
    </div>

    <div class="list-section">
      <LoadingState v-if="loading" message="Chargement des modules..." />

      <div v-else class="table-container glass-panel">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Slug</th>
              <th>Statut</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="modules.length === 0">
              <td colspan="5" class="empty-row">Aucun module trouvé.</td>
            </tr>
            <tr v-for="mod in modules" :key="mod.id" class="module-row">
              <td>
                <span class="module-name">{{ mod.name }}</span>
              </td>
              <td>
                <span class="module-description" :title="mod.description">
                  {{ mod.description || 'Aucune description' }}
                </span>
              </td>
              <td>
                <code class="slug-badge">{{ mod.slug }}</code>
              </td>
              <td>
                <button 
                  class="status-pill" 
                  :class="{ active: mod.active }"
                  @click="toggleActive(mod)"
                >
                  <span class="status-dot"></span>
                  {{ mod.active ? 'Actif' : 'Inactif' }}
                </button>
              </td>
              <td class="text-right">
                <div class="actions-group">
                  <button 
                    class="btn btn-ghost btn-sm btn-square"
                    @click="openEditModal(mod)"
                    title="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button 
                    class="btn btn-ghost btn-sm btn-square text-danger"
                    @click="deleteModule(mod.id)"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ConfirmModal
      :is-open="isConfirmOpen"
      title="Supprimer le module"
      description="Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible."
      confirm-label="Supprimer"
      type="danger"
      :loading="actionLoading"
      @cancel="closeConfirm"
      @confirm="handleDelete"
    />

    <!-- Edit Modal -->
    <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content glass-panel edit-modal">
        <header class="modal-header">
          <h3>Modifier le Module</h3>
          <button class="close-btn" @click="closeEditModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <div class="modal-body">
          <div class="form-group">
            <label>Nom du module</label>
            <input v-model="editingModule.name" type="text" />
          </div>

          <div class="form-group mt-20">
            <label class="ai-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-icon"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12L2.69 7"></path><path d="M12 12l5.63 8.35"></path></svg>
              Description (Instructions IA)
            </label>
            <textarea v-model="editingModule.description" rows="5"></textarea>
            <p class="help-text">Décris ce que l’article doit aborder lorsque ce module est sélectionné.</p>
          </div>

          <div class="form-group mt-20">
            <label class="checkbox-container">
              <input type="checkbox" v-model="editingModule.active">
              <span class="checkmark"></span>
              <span class="label-text">Module actif</span>
            </label>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn btn-ghost" @click="closeEditModal">Annuler</button>
          <button class="btn btn-primary" @click="handleUpdate" :disabled="updating">
            <div v-if="updating" class="loader-sm"></div>
            <span>{{ updating ? 'Enregistrement...' : 'Enregistrer' }}</span>
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingState from '@/components/LoadingState.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const client = useSupabaseClient()

interface Module {
  id: number
  name: string
  slug: string
  description?: string
  active: boolean
  created_at?: string
}

const modules = ref<Module[]>([])
const loading = ref(true)
const creating = ref(false)
const updating = ref(false)

const newModule = ref({
  name: '',
  slug: '',
  description: '',
  active: true
})

const generateSlug = () => {
  newModule.value.slug = newModule.value.name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

const fetchModules = async () => {
  loading.value = true
  const { data, error } = await client
    .from('modules')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) console.error('Error fetching modules:', error)
  else modules.value = (data as Module[]) || []
  
  loading.value = false
}

const createModule = async () => {
  if (!newModule.value.name) return
  creating.value = true
  
  const { error } = await client
    .from('modules')
    .insert({
      name: newModule.value.name,
      slug: newModule.value.slug,
      description: newModule.value.description,
      active: newModule.value.active
    } as any)
  
  if (error) {
    console.error('Error creating module:', error)
  } else {
    newModule.value = { name: '', slug: '', description: '', active: true }
    fetchModules()
  }
  creating.value = false
}

const toggleActive = async (mod: Module) => {
  const newVal = !mod.active
  mod.active = newVal
  
  const { error } = await (client.from('modules') as any)
    .update({ active: newVal })
    .eq('id', mod.id)
    
  if (error) {
    mod.active = !newVal // revert
    console.error('Error updating module:', error)
  }
}

// Modal State
const isConfirmOpen = ref(false)
const moduleIdToDelete = ref<number | null>(null)
const actionLoading = ref(false)

const deleteModule = (id: number) => {
  moduleIdToDelete.value = id
  isConfirmOpen.value = true
}

const closeConfirm = () => {
  isConfirmOpen.value = false
  moduleIdToDelete.value = null
  actionLoading.value = false
}

const handleDelete = async () => {
  if (!moduleIdToDelete.value) return
  actionLoading.value = true
  
  const { error } = await client.from('modules').delete().eq('id', moduleIdToDelete.value)
  
  if (error) {
    console.error('Error deleting module:', error)
    actionLoading.value = false
  } else {
    modules.value = modules.value.filter(m => m.id !== moduleIdToDelete.value)
    closeConfirm()
  }
}

// Edit Modal Logic
const isEditModalOpen = ref(false)
const editingModule = ref<Partial<Module>>({})

const openEditModal = (mod: Module) => {
  editingModule.value = { ...mod }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editingModule.value = {}
}

const handleUpdate = async () => {
  if (!editingModule.value.id || !editingModule.value.name) return
  updating.value = true

  const { error } = await (client.from('modules') as any)
    .update({
      name: editingModule.value.name,
      description: editingModule.value.description,
      active: editingModule.value.active
    })
    .eq('id', editingModule.value.id)

  if (error) {
    console.error('Error updating module:', error)
  } else {
    const idx = modules.value.findIndex(m => m.id === editingModule.value.id)
    if (idx !== -1) {
      modules.value[idx] = { ...modules.value[idx], ...editingModule.value } as Module
    }
    closeEditModal()
  }
  updating.value = false
}

onMounted(() => {
  fetchModules()
})
</script>

<style scoped>
.modules-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
}

.header-text h1 {
  font-size: 32px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 15px;
}

.create-section {
  padding: 24px;
  border-radius: var(--radius-xl);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  margin-bottom: 40px;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 20px;
  align-items: flex-end;
}

.checkbox-cell {
  padding-bottom: 10px;
}

.slug-input {
  background: var(--bg-dark);
  color: var(--text-muted);
  cursor: not-allowed;
}

/* Custom Checkbox */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-container:hover .checkmark {
  border-color: var(--border-active);
}

.checkbox-container input:checked + .checkmark {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-container input:checked + .checkmark:after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 11px;
  border: solid white;
  border-width: 0 2.5px 2.5px 0;
  transform: rotate(45deg);
}

.label-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Table */
.table-container {
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  text-align: left;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid var(--border-subtle);
}

.modern-table td {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 14px;
}

.module-row:hover {
  background: rgba(255, 255, 255, 0.01);
}

.module-name {
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.module-description {
  color: var(--text-muted);
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 300px;
}

.slug-badge {
  background: rgba(255, 255, 255, 0.04);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  font-family: inherit;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.status-pill.active {
  background: var(--color-success-bg);
  border-color: rgba(16, 185, 129, 0.2);
  color: var(--color-success);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.text-right { text-align: right; }
.btn-square { width: 36px; height: 36px; padding: 0; justify-content: center; }
.text-danger:hover { background: var(--color-error-bg); }

.empty-row {
  padding: 48px;
  text-align: center;
  color: var(--text-muted);
}

.loader-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 10px;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Utilities */
.mt-20 { margin-top: 20px; }
.full-width { grid-column: 1 / -1; }

.ai-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-light);
  font-weight: 600 !important;
  margin-bottom: 8px !important;
}

.ai-icon {
  color: var(--primary);
}

.help-text {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 8px;
}

.actions-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-modal {
  width: 90%;
  max-width: 500px;
  padding: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(255, 255, 255, 0.01);
}

@media (max-width: 800px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
