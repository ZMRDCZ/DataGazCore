import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { searchDocuments, streamSearch } from '@/api/mockApi'

export interface SearchResult {
  id: string
  title: string
  version: string
  snippet: string
  tags: string[]
  updated: string
  type: string
}

export const useSearchStore = defineStore('search', () => {
  // State
  const query = ref('')
  const results = ref<SearchResult[]>([])
  const isSearching = ref(false)
  const hasSearched = ref(false)
  const selectedDocument = ref<SearchResult | null>(null)
  const showDocPreview = ref(false)
  
  // KPI state
  const showKPI = ref(false)
  const kpis = ref([
    { label: 'Время поиска', value: '50 мин → 5 с', animated: false },
    { label: 'Продуктивность', value: '+3 ч/день', animated: false },
    { label: 'Экономия', value: '248 000 ₽/год', animated: false },
    { label: 'ROI', value: '> 150 %', animated: false }
  ])

  // Getters
  const hasResults = computed(() => results.value.length > 0)
  const searchStats = computed(() => ({
    totalResults: results.value.length,
    searchTime: isSearching.value ? 'Поиск...' : '0.4 с'
  }))

  // Actions
  async function search(searchQuery: string) {
    if (!searchQuery.trim()) return
    
    query.value = searchQuery
    isSearching.value = true
    results.value = []
    
    try {
      // Показываем KPI после первого поиска
      if (!hasSearched.value) {
        setTimeout(() => {
          showKPI.value = true
          animateKPIs()
        }, 500)
        hasSearched.value = true
      }
      
      // Выполняем поиск
      const searchResults = await searchDocuments(searchQuery)
      results.value = searchResults
      
    } catch (error) {
      console.error('Ошибка поиска:', error)
    } finally {
      isSearching.value = false
    }
  }

  // Стриминг поиск для демонстрации
  async function streamingSearch(searchQuery: string) {
    if (!searchQuery.trim()) return
    
    query.value = searchQuery
    isSearching.value = true
    results.value = []
    
    try {
      for await (const result of streamSearch(searchQuery)) {
        results.value.push(result)
      }
    } catch (error) {
      console.error('Ошибка стриминг поиска:', error)
    } finally {
      isSearching.value = false
    }
  }

  function selectDocument(document: SearchResult) {
    selectedDocument.value = document
    showDocPreview.value = true
  }

  function closeDocPreview() {
    showDocPreview.value = false
    selectedDocument.value = null
  }

  function animateKPIs() {
    kpis.value.forEach((kpi, index) => {
      setTimeout(() => {
        kpi.animated = true
      }, index * 150)
    })
  }

  function clearSearch() {
    query.value = ''
    results.value = []
    isSearching.value = false
    showKPI.value = false
    hasSearched.value = false
  }

  return {
    // State
    query,
    results,
    isSearching,
    hasSearched,
    selectedDocument,
    showDocPreview,
    showKPI,
    kpis,
    
    // Getters
    hasResults,
    searchStats,
    
    // Actions
    search,
    streamingSearch,
    selectDocument,
    closeDocPreview,
    animateKPIs,
    clearSearch
  }
}) 