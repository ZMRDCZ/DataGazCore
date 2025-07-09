// Мок данные для демонстрации поиска
const mockDocuments = [
  {
    id: '1',
    title: 'СП 62.13330-2021 Газораспределительные системы',
    version: '3.1',
    snippet: 'Актуализированная редакция СНиП 42-01-2002. Установлены требования к проектированию, строительству и эксплуатации газораспределительных систем.',
    tags: ['СП', 'PDF', 'Газ'],
    updated: '2024-05-12',
    type: 'standard'
  },
  {
    id: '2', 
    title: 'ГОСТ Р 58310-2018 Системы газораспределительные',
    version: '2.0',
    snippet: 'Технические требования к проектированию и монтажу газораспределительных систем низкого давления.',
    tags: ['ГОСТ', 'PDF', 'Системы'],
    updated: '2024-03-08',
    type: 'standard'
  },
  {
    id: '3',
    title: 'Чертёж узла редуцирования давления УРП-50',
    version: '1.4',
    snippet: 'Технический чертёж узла редуцирования давления для газопроводов среднего давления. DWG формат.',
    tags: ['Чертёж', 'DWG', 'УРП'],
    updated: '2024-01-15',
    type: 'drawing'
  },
  {
    id: '4',
    title: 'Инцидент #2024-041: Утечка на ГРП-12',
    version: '1.0',
    snippet: 'Отчёт о расследовании инцидента с утечкой газа на газорегуляторном пункте ГРП-12. Причина: износ запорной арматуры.',
    tags: ['Инцидент', 'ГРП', 'Безопасность'],
    updated: '2024-04-20',
    type: 'incident'
  }
]

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
  timeImprovement: '50 мин → 5 с',
  productivity: '+3 ч/день', 
  savings: '248 000 ₽/год',
  roi: '> 150 %',
  safetyImprovement: '–50 % аварий'
} 