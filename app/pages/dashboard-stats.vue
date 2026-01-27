<template>
  <div class="dashboard-stats">
    <header class="page-header">
      <div class="header-text">
        <h1>Statistiques</h1>
        <p class="subtitle">Vue d'ensemble de votre production de contenu.</p>
      </div>
    </header>

    <div class="stats-grid">
      <div v-for="(val, key) in statConfig" :key="key" class="stat-card glass-panel" :class="key">
        <div class="card-inner">
          <div class="stat-info">
            <span class="stat-label">{{ val.label }}</span>
            <span class="stat-value">{{ stats[key] || 0 }}</span>
          </div>
          <div class="stat-icon-box" :style="{ color: val.color, background: val.bg }">
            <component :is="val.icon" />
          </div>
        </div>
        <div class="stat-progress">
          <div class="progress-bar" :style="{ width: getPercentage(key) + '%', background: val.color }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useArticles } from '@/composables/useArticles'

const stats = ref<Record<string, number>>({
  proposed: 0,
  validated: 0,
  published: 0,
  abandoned: 0,
  written: 0,
})

const { fetchArticleStats } = useArticles()

// Simple SVG Icons as components
const IconProposed = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('circle', { cx: '12', cy: '12', r: '10' }), h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }), h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })])
const IconValidated = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('polyline', { points: '20 6 9 17 4 12' })])
const IconPublished = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M5 12h14' }), h('path', { d: 'M12 5v14' })]) // Placeholder for "Globe" or something
const IconWritten = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }), h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })])

const statConfig = {
  proposed: { label: 'En attente', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: IconProposed },
  validated: { label: 'Validés', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: IconValidated },
  written: { label: 'Rédigés', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: IconWritten },
  published: { label: 'Publiés', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', icon: IconPublished }
}

const totalArticles = computed(() => {
  return Object.values(stats.value).reduce((a, b) => a + b, 0) || 1
})

const getPercentage = (key: string) => {
  return ((stats.value[key] || 0) / totalArticles.value) * 100
}

onMounted(async () => {
  const res = await fetchArticleStats()
  if (res) stats.value = res
})
</script>

<style scoped>
.dashboard-stats {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 48px;
}

.header-text h1 {
  font-size: 32px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.25s var(--ease-out);
}

.stat-card:hover {
  transform: translateY(-4px);
  background: var(--bg-card-hover);
  border-color: var(--border-active);
  box-shadow: var(--shadow-lg);
}

.card-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.stat-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease-out;
}
</style>
