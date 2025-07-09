<template>
  <div class="playground">
    <HeroSearch @search="handleSearch" />
    <KPIBar v-if="showKPI" :kpis="kpis" />
    <ResultList v-if="results.length" :results="results" />
    <KnowledgeGraph v-if="results.length" />
    <DocPreview 
      :document="selectedDocument" 
      :is-visible="showDocPreview"
      @close="searchStore.closeDocPreview"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import HeroSearch from '@/components/HeroSearch.vue'
import KPIBar from '@/components/KPIBar.vue'
import ResultList from '@/components/ResultList.vue'
import DocPreview from '@/components/DocPreview.vue'
import KnowledgeGraph from '@/components/KnowledgeGraph.vue'
import { useSearchStore } from '@/stores/searchStore'

const searchStore = useSearchStore()
const { results, showKPI, kpis, selectedDocument, showDocPreview } = storeToRefs(searchStore)

async function handleSearch(query: string) {
  await searchStore.search(query)
}
</script>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-top: 64px;
}
</style> 