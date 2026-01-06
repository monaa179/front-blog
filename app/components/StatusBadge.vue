<template>
  <span :class="['status-badge', status]">
    <span class="status-dot"></span>
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const statusLabel = computed(() => {
  switch (props.status) {
    case 'proposed': return 'Proposed'
    case 'writing': return 'Writing'
    case 'written': return 'Written'
    case 'validated': return 'Validated'
    case 'published': return 'Published'
    case 'error': return 'Error'
    case 'abandoned': return 'Abandoned'
    default: return props.status
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  border: 1px solid transparent; /* default */
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

/* Status Variants */
.proposed { 
  background: rgba(59, 130, 246, 0.1); 
  color: #60a5fa; 
  border-color: rgba(59, 130, 246, 0.2); 
}

.writing { 
  background: rgba(245, 158, 11, 0.1); 
  color: #fbbf24; 
  border-color: rgba(245, 158, 11, 0.2); 
}

.written { 
  background: rgba(16, 185, 129, 0.1); 
  color: #34d399; 
  border-color: rgba(16, 185, 129, 0.2); 
}

.validated { 
  background: rgba(16, 185, 129, 0.15); 
  color: #34d399; 
  border-color: rgba(16, 185, 129, 0.3); 
}

.published { 
  background: rgba(139, 92, 246, 0.1); 
  color: #a78bfa; 
  border-color: rgba(139, 92, 246, 0.2); 
}

.error { 
  background: rgba(239, 68, 68, 0.1); 
  color: #f87171; 
  border-color: rgba(239, 68, 68, 0.2); 
}

.abandoned { 
  background: rgba(113, 113, 122, 0.1); 
  color: #a1a1aa; 
  border-color: rgba(113, 113, 122, 0.2); 
}
</style>
