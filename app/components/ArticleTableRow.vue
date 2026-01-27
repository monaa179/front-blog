<template>
  <tr class="article-row" @click="$emit('click', article)">
    <td>
      <div class="article-info">
        <div class="title-with-favorite">
          <span class="article-title">{{ article.original_title }}</span>
          <span v-if="article.versions_count && article.versions_count > 0" class="version-badge">{{ article.versions_count }}</span>
        </div>
      </div>
    </td>
    <td>
      <div class="article-desc">
        {{ article.original_description || '—' }}
      </div>
    </td>
    <td class="text-center">
      <a 
        v-if="article.source_url" 
        :href="article.source_url" 
        target="_blank" 
        class="source-link-icon"
        title="Open Source URL"
        @click.stop
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>
      <span v-else class="text-muted">—</span>
    </td>
    <td>
      <span class="article-date">{{ formatDate(article.created_at) }}</span>
    </td>
    <td v-if="showStatus">
      <div class="status-wrapper">
        <StatusBadge :status="article.status" />
      </div>
    </td>
    <td class="text-right">
      <div class="actions" @click.stop>
        <slot name="actions"></slot>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Article } from '@/types/article'
import { formatDate } from '@/utils/date'

defineProps<{
  article: Article
  showStatus?: boolean
}>()

defineEmits<{
  (e: 'click', article: Article): void
}>()
</script>

<style scoped>
.article-row {
  background: var(--bg-card);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  vertical-align: top;
  cursor: pointer;
}

.article-row td {
  padding: 16px;
  vertical-align: top;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}

.article-row td:first-child {
  border-left: 1px solid var(--border-subtle);
  border-top-left-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-lg);
}

.article-row td:last-child {
  border-right: 1px solid var(--border-subtle);
  border-top-right-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
}

.article-row:hover {
  background: var(--bg-card-hover);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 1;
}

.article-row:hover td {
  border-top-color: var(--border-active);
  border-bottom-color: var(--border-active);
}

.article-row:hover td:first-child {
  border-left-color: var(--border-active);
  box-shadow: inset 4px 0 0 -1px var(--primary);
}

.article-row:hover td:last-child {
  border-right-color: var(--border-active);
}

.article-title {
  font-weight: 600;
  color: #ffffff;
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
}

.version-badge {
  display: inline-block;
  margin-left: 8px;
  background: var(--bg-input);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
}

.article-date {
  font-size: 11px;
  color: var(--text-muted);
}

.title-with-favorite {
  display: flex;
  align-items: center;
  gap: 12px;
}

.article-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  word-break: break-word;
}

.source-link-icon {
  color: var(--text-muted);
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  margin-top: 2px;
}

.source-link-icon:hover {
  background: var(--bg-card-hover);
  color: var(--primary);
  border-color: var(--primary);
}

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: var(--text-muted); font-size: 12px; }

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.status-wrapper {
  display: inline-block;
}
</style>
