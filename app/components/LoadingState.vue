<template>
  <div class="loading-state">
    <div class="spinner-container">
      <div class="spinner-outer"></div>
      <div class="spinner-inner"></div>
    </div>
    <span class="loading-message">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<style scoped>
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 60px;
}

.spinner-container {
  position: relative;
  width: 48px;
  height: 48px;
}

.spinner-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 255, 255, 0.05);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s infinite cubic-bezier(0.5, 0, 0.5, 1);
}

.spinner-inner {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-bottom-color: var(--primary);
  border-radius: 50%;
  animation: spin 1.5s infinite linear reverse;
  opacity: 0.5;
}

.loading-message {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
