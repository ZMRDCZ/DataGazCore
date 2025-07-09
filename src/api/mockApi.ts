import { documentsData } from './documentsData'

// Мок данные для демонстрации поиска - теперь используем расширенную коллекцию
const mockDocuments = documentsData

// Имитация поиска с задержкой
export async function searchDocuments(query: string): Promise<typeof mockDocuments> {
  // Имитация сетевой задержки
  await new Promise(resolve => setTimeout(resolve, 800))
  
  if (!query) return []
  
  // Простой поиск по названию и описанию
  const results = mockDocuments.filter(doc => 
    doc.title.toLowerCase().includes(query.toLowerCase()) ||
    doc.snippet.toLowerCase().includes(query.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  )
  
  return results
}

// Стриминг API для постепенного появления результатов
export async function* streamSearch(query: string) {
  const results = await searchDocuments(query)
  
  for (const result of results) {
    yield result
    await new Promise(resolve => setTimeout(resolve, 200)) // задержка между результатами
  }
}

// KPI данные
export const kpiData = {
  timeImprovement: '50 мин → 3 с',
  productivity: '+4 ч/день', 
  savings: '385 000 ₽/год',
  roi: '> 200 %',
  safetyImprovement: '–60 % аварий',
  documentsCount: '105+ документов',
  searchAccuracy: '98% точность'
} 