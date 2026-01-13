<template>
  <div class="dashboard-stats">
    <h1 class="title">Statistiques des Articles</h1>

    <div class="stats-container">
      <div class="stat-box">
        <h2>Proposé</h2>
        <p>{{ stats.proposed }}</p>
      </div>

      <div class="stat-box">
        <h2>Validé</h2>
        <p>{{ stats.validated }}</p>
      </div>

      <div class="stat-box">
        <h2>Publié</h2>
        <p>{{ stats.published }}</p>
      </div>

      <div class="stat-box">
        <h2>Abandonné</h2>
        <p>{{ stats.abandoned }}</p>
      </div>

      <div class="stat-box written">
        <h2>Rédigé</h2>
        <p>{{ stats.written }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticles } from '@/composables/useArticles'

const stats = ref({
  proposed: 0,
  validated: 0,
  published: 0,
  abandoned: 0,
  written: 0,
})

const { fetchArticleStats } = useArticles()

onMounted(async () => {
  stats.value = await fetchArticleStats()
})
</script>

<style scoped>
.dashboard-stats {
  padding: 32px;
  background-color: #0e0e0e;
  min-height: 100vh;
}

.title {
  font-size: 20px;
  font-weight: 500;
  color: #eaeaea;
  margin-bottom: 24px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.stat-box {
  background-color: #161616;
  border-radius: 10px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: background 0.2s ease, border 0.2s ease;
}

.stat-box:hover {
  background-color: #1b1b1b;
  border-color: rgba(255, 255, 255, 0.1);
}

.stat-box h2 {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9a9a9a;
  margin: 0;
}

.stat-box p {
  font-size: 32px;
  font-weight: 600;
  margin: 12px 0 0;
  color: #d44d5b;
}

/* Carte ÉCRIT (différenciée) */
.stat-box.written {
  border-color: rgba(143, 211, 166, 0.25);
}

.stat-box.written p {
  color: #8fd3a6;
}
</style>
