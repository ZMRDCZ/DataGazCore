<template>
  <div class="result-card" @click="handleClick">
    <div class="result-header">
      <span class="result-title">{{ result.title }}</span>
      <span class="result-version">v{{ result.version }}</span>
    </div>
    <div class="result-snippet">{{ result.snippet }}</div>
    <div class="result-meta">
      <span v-for="tag in result.tags" :key="tag" class="result-tag">{{ tag }}</span>
      <span class="result-date">Обновлено {{ result.updated }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'

interface Result {
  id: string
  title: string
  version: string
  snippet: string
  tags: string[]
  updated: string
  type: string
}

const props = defineProps<{ result: Result }>()
const searchStore = useSearchStore()

function handleClick() {
  searchStore.selectDocument(props.result)
}
</script>

<style lang="scss" scoped>
.result-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(41, 182, 246, 0.18);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fade-slide-up 0.25s cubic-bezier(0.4,0,0.2,1);
}
.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.result-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: $color-text-main;
}
.result-version {
  background: $color-accent-flame;
  color: #fff;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 0.9rem;
  margin-left: 8px;
}
.result-snippet {
  color: $color-text-secondary;
  font-size: 1rem;
}
.result-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
}
.result-tag {
  background: #e3f2fd;
  color: $color-accent-flame;
  border-radius: 6px;
  padding: 2px 8px;
}
.result-date {
  color: #90caf9;
  margin-left: auto;
}
@keyframes fade-slide-up {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: none; }
}
</style> 