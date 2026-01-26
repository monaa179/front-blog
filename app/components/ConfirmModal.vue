<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('cancel')">
        <Transition name="modal">
          <div v-if="isOpen" class="modal-container">
            <div class="modal-header">
              <div class="icon-wrapper" :class="type">
                <svg v-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </div>
              <h3>{{ title }}</h3>
            </div>
            
            <div class="modal-body">
              <p>{{ description }}</p>
            </div>

            <div class="modal-footer">
              <button class="btn btn-ghost" @click="$emit('cancel')">{{ cancelLabel }}</button>
              <div class="action-group">
                <button 
                  v-if="showArchive"
                  class="btn btn-outline" 
                  @click="$emit('confirm-archive')"
                  :disabled="loading"
                >
                  <span v-if="!loading">Archiver</span>
                  <div v-else class="loader-sm"></div>
                </button>
                <button 
                  class="btn" 
                  :class="type === 'danger' ? 'btn-danger' : 'btn-primary'"
                  @click="$emit('confirm')"
                  :disabled="loading"
                >
                  <span v-if="!loading">{{ confirmLabel }}</span>
                  <div v-else class="loader-sm"></div>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  type: 'danger' | 'warning'
  loading?: boolean
  showArchive?: boolean
}

withDefaults(defineProps<Props>(), {
  cancelLabel: 'Annuler',
  loading: false,
  showArchive: false
})

defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
  (e: 'confirm-archive'): void
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 440px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  margin-bottom: 16px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.icon-wrapper.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-body {
  text-align: center;
  margin-bottom: 24px;
}

.modal-body p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.action-group {
  display: flex;
  gap: 12px;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.loader-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-leave-active {
  transition: all 0.2s ease-in;
}
.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
