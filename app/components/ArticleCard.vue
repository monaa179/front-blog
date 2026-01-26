<template>
  <div 
    class="article-card" 
    :class="{ 
      published: article.status === 'published',
      dragging: isDragging 
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="isDragging = false"
    @click="$emit('click', article)"
  >
    <div class="card-header">
      <h4 class="article-title">{{ article.original_title }}</h4>
      <button 
        class="minimal-delete" 
        @click.stop="$emit('delete', article.id)"
        title="Supprimer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    </div>

    <p class="article-desc">{{ article.original_description }}</p>
    
    <div class="card-meta">
      <div class="modules-hint" @click.stop>
         <ModuleSelector 
          :model-value="article.modules" 
          :available-modules="availableModules"
          @update:model-value="(newModules) => $emit('update-modules', article.id, newModules)"
        />
      </div>
      <span class="card-date">{{ formatLibraryDate(article.last_version_at || article.created_at) }}</span>
    </div>

    <div class="card-actions" v-if="$slots.actions" @click.stop>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article, Module } from '@/types/article'
import { formatLibraryDate } from '@/utils/date'
import ModuleSelector from './ModuleSelector.vue'

const props = defineProps<{
  article: Article
  availableModules: Module[]
}>()

defineEmits<{
  (e: 'click', article: Article): void
  (e: 'delete', id: number): void
  (e: 'update-modules', id: number, modules: Module[]): void
}>()

const isDragging = ref(false)

const handleDragStart = (event: DragEvent) => {
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(props.article))
  }
}
</script>

<style scoped>
.article-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.article-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-active);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.article-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-primary);
}

.minimal-delete {
  background: transparent;
  border: none;
  padding: 6px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.minimal-delete:hover {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.article-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.modules-hint {
  flex: 1;
  min-width: 0;
}

.card-date {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.article-card.published {
  border-left: 3px solid var(--color-success);
}

.article-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}
</style>
