<template>
  <div class="module-selector-wrapper" ref="container">
    <div class="badges-list" @click="toggleDropdown">
      <span v-if="selectedModules.length === 0" class="placeholder">Select modules...</span>
      <span 
        v-for="module in selectedModules" 
        :key="module.id" 
        class="module-badge"
      >
        {{ module.name }}
        <span class="remove-x" @click.stop="removeModule(module.id)">×</span>
      </span>
    </div>

    <transition name="fade">
      <div v-if="isOpen" class="dropdown-menu">
        <div 
          v-for="option in availableModules" 
          :key="option.id"
          class="dropdown-item"
          @click="toggleModule(option)"
          :class="{ active: isSelected(option.id) }"
        >
          <span class="check-box">
             <svg v-if="isSelected(option.id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          {{ option.name }}
        </div>
        <div v-if="availableModules.length === 0" class="empty-dropdown">
          No modules available
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  modelValue: any[], // Array of module objects
  availableModules: any[] // Array of all available module objects
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const container = ref<HTMLElement | null>(null)

const selectedModules = computed(() => props.modelValue || [])

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const isSelected = (id: number) => {
  return selectedModules.value.some(m => m.id === id)
}

const toggleModule = (module: any) => {
  const current = [...selectedModules.value]
  const index = current.findIndex(m => m.id === module.id)
  
  if (index >= 0) {
    current.splice(index, 1)
  } else {
    current.push(module)
  }
  
  emit('update:modelValue', current)
}

const removeModule = (id: number) => {
  const current = selectedModules.value.filter(m => m.id !== id)
  emit('update:modelValue', current)
}

// Click outside to close
const handleClickOutside = (event: Event) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Scoped Styles for ModuleSelector */
.module-selector-wrapper {
  position: relative;
  width: 100%;
}

.badges-list {
  min-height: 38px; /* Match input height slightly larger */
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 4px 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.badges-list:hover {
  border-color: var(--border-active);
  background: var(--bg-card-hover);
}

.placeholder {
  color: var(--text-muted);
  font-size: 13px;
  padding-left: 4px;
}

.module-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05); /* Neutral dark badge */
  color: var(--text-primary);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px; /* Slightly squarer premium feel */
  border: 1px solid var(--border-active);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.remove-x {
  margin-left: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: color 0.2s;
}

.remove-x:hover {
  color: var(--primary); /* Red on hover */
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  z-index: 50;
  box-shadow: var(--shadow-xl); /* Deeper shadow */
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
}

.dropdown-item {
  padding: 8px 12px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast);
}

.dropdown-item:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.dropdown-item.active {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.check-box {
  width: 16px;
  height: 16px;
  border: 1px solid var(--border-active);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  background: var(--bg-input);
  transition: all 0.2s;
}

.dropdown-item.active .check-box {
  border-color: var(--primary);
  background: rgba(212, 77, 91, 0.1); 
}

.empty-dropdown {
  padding: 12px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
