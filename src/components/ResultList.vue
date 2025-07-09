<template>
  <div class="result-list">
    <ResultCard v-for="result in results" :key="result.id" :result="result" />
  </div>
</template>

<script setup lang="ts">
import ResultCard from './ResultCard.vue'

defineProps<{ results: any[] }>()
</script>

<style lang="scss" scoped>
.result-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
  width: 600px;
}
</style> 