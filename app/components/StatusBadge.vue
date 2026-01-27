<template>
  <div class="status-badge" :class="statusClass">
    <div class="status-dot"></div>
    <span>{{ statusLabel }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    proposed: 'Proposé',
    written: 'Rédigé',
    validated: 'Validé',
    published: 'Publié',
    error: 'Erreur',
    abandoned: 'Abandonné',
    to_write: 'À rédiger'
  }
  return map[props.status] || props.status
})

const statusClass = computed(() => `status-${props.status.toLowerCase()}`)
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* Specific Statuses */
.status-proposed {
  background: rgba(238, 238, 238, 0.05);
  color: var(--text-secondary);
  border-color: var(--border-subtle);
}
.status-proposed .status-dot { background: var(--text-muted); }

.status-written {
  background: var(--color-success-bg);
  color: var(--color-success);
  border-color: rgba(16, 185, 129, 0.2);
}
.status-written .status-dot { background: var(--color-success); }

.status-validated {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.2);
}
.status-validated .status-dot { background: #3b82f6; }

.status-published {
  background: var(--primary-subtle);
  color: var(--primary);
  border-color: rgba(212, 77, 91, 0.2);
}
.status-published .status-dot { background: var(--primary); }

.status-error {
  background: var(--color-error-bg);
  color: var(--color-error);
  border-color: rgba(212, 77, 91, 0.2);
}
.status-error .status-dot { background: var(--color-error); }

.status-abandoned {
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-muted);
  border-color: var(--border-subtle);
  text-decoration: line-through;
}
.status-abandoned .status-dot { background: var(--text-muted); }

.status-to_write {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
  border-color: rgba(168, 85, 247, 0.2);
}
.status-to_write .status-dot { background: #a855f7; }
</style>
