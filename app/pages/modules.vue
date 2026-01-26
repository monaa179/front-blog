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
        <div class="form-group">
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
    </div>

    <div class="list-section">
      <LoadingState v-if="loading" message="Chargement des modules..." />

      <div v-else class="table-container glass-panel">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Slug</th>
              <th>Statut</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="modules.length === 0">
              <td colspan="4" class="empty-row">Aucun module trouvé.</td>
            </tr>
            <tr v-for="mod in modules" :key="mod.id" class="module-row">
              <td>
                <span class="module-name">{{ mod.name }}</span>
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
                <button 
                  class="btn btn-ghost btn-sm btn-square text-danger"
                  @click="deleteModule(mod.id)"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
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
  active: boolean
  created_at?: string
}

const modules = ref<Module[]>([])
const loading = ref(true)
const creating = ref(false)

const newModule = ref({
  name: '',
  slug: '',
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
      active: newModule.value.active
    } as any)
  
  if (error) {
    console.error('Error creating module:', error)
  } else {
    newModule.value = { name: '', slug: '', active: true }
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

@media (max-width: 800px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
