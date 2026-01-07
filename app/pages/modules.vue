<template>
  <div class="modules-page">
    <div class="header-row">
      <div class="title-section">
        <h1>Modules</h1>
        <p class="subtitle">Ajoutez les modules de Digichef.</p>
      </div>
    </div>

    <!-- Create Module Form -->
    <div class="create-module-card">
      <div class="form-row">
        <div class="form-group">
          <label>Module Name</label>
          <input 
            v-model="newModule.name" 
            type="text" 
            placeholder="e.g. SEO Analysis" 
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
        <div class="form-group checkbox-group">
           <label class="checkbox-label">
             <input type="checkbox" v-model="newModule.active">
             <span>Module actif par défaut</span>
           </label>
        </div>
        <div class="form-actions">
          <button 
            class="btn btn-primary" 
            @click="createModule"
            :disabled="!newModule.name || creating"
          >
            {{ creating ? 'Adding...' : 'Add Module' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modules List -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="modules-list-container">
      <table class="modules-table">
        <thead>
          <tr>
            <th style="width: 30%">Name</th>
            <th style="width: 30%">Slug</th>
            <th style="width: 20%">Status</th>
            <th style="width: 20%; text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="modules.length === 0">
            <td colspan="4" class="text-center text-muted">No modules found. Add one above.</td>
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
                class="status-toggle" 
                :class="{ active: mod.active }"
                @click="toggleActive(mod)"
              >
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
                <span>{{ mod.active ? 'Active' : 'Inactive' }}</span>
              </button>
            </td>
            <td class="text-right">
              <button 
                class="btn btn-sm btn-danger-ghost"
                @click="deleteModule(mod.id)"
                title="Delete Module"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  
  const { data, error } = await client
    .from('modules')
    .insert({
      name: newModule.value.name,
      slug: newModule.value.slug,
      active: newModule.value.active
    })
    .select() // Select to get the new items active status if we need it
  
  if (error) {
    console.error('Error creating module:', error)
    alert('Failed to create module') // Simple feedback for now
  } else {
    // Reset form and reload
    newModule.value = { name: '', slug: '', active: true }
    fetchModules()
  }
  creating.value = false
}

const toggleActive = async (mod: Module) => {
  const newVal = !mod.active
  // Optimistic update
  mod.active = newVal
  
  const { error } = await client
    .from('modules')
    .update({ active: newVal } as any)
    .eq('id', mod.id)
    
  if (error) {
    mod.active = !newVal // revert
    console.error('Error updating module:', error)
  }
}

const deleteModule = async (id: number) => {
  if (!confirm('Are you sure you want to delete this module?')) return
  
  const { error } = await client.from('modules').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting module:', error)
    alert('Could not delete module. It might be in use.')
  } else {
    modules.value = modules.value.filter(m => m.id !== id)
  }
}

onMounted(() => {
  fetchModules()
})
</script>

<style scoped>
.modules-page {
  max-width: 900px;
  margin: 0 auto;
}

.header-row {
  margin-bottom: 32px;
}

.create-module-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 32px;
}

.form-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.form-group {
  flex: 1;
}

.checkbox-group {
  flex: 0 0 auto;
  padding-bottom: 8px; /* align with inputs center ish */
}

.form-actions {
  flex: 0 0 auto;
}

.slug-input {
  color: var(--text-muted);
  background: var(--bg-dark);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
}

/* Table */
.modules-list-container {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.modules-table {
  width: 100%;
  border-collapse: collapse;
}

.modules-table th {
  text-align: left;
  padding: 12px 20px;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);
  font-weight: 500;
  letter-spacing: 0.05em;
  background: var(--bg-sidebar);
}

.modules-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: 13px;
}

.modules-table tr:last-child td {
  border-bottom: none;
}

.module-row:hover {
  background: var(--bg-card-hover);
}

.module-name {
  font-weight: 500;
}

.slug-badge {
  font-family: 'Geist Mono', monospace; /* If avail, else fallback */
  background: var(--bg-input);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

/* Toggle Switch */
.status-toggle {
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.toggle-track {
  width: 32px;
  height: 18px;
  background: var(--border-active);
  border-radius: 9px;
  position: relative;
  transition: background 0.2s;
}

.toggle-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.status-toggle.active .toggle-track {
  background: var(--color-success);
}

.status-toggle.active .toggle-thumb {
  transform: translateX(14px);
}

.status-toggle span {
  font-size: 12px;
  color: var(--text-secondary);
  width: 50px;
  text-align: left;
}

.loading-state {
  padding: 40px;
  display: flex;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-active);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
