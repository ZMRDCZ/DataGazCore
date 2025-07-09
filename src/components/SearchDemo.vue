<template>
  <div class="search-demo">
    <div class="demo-header">
      <h3>🔍 Демонстрация интеллектуального поиска</h3>
      <p class="demo-subtitle">Попробуйте найти нормативные документы, инциденты или оборудование</p>
      <div class="database-info">
        <span class="db-badge">📚 База знаний: <strong>105+ документов</strong></span>
        <span class="db-types">СП, ГОСТы, чертежи, инциденты, оборудование, инструкции, проекты</span>
      </div>
    </div>
    
    <div class="search-container">
      <!-- Быстрые примеры поиска -->
      <div class="quick-examples">
        <span class="examples-label">Быстрый поиск:</span>
        <button 
          v-for="example in quickExamples" 
          :key="example"
          class="example-chip"
          @click="searchQuery = example; performSearch()"
        >
          {{ example }}
        </button>
      </div>
      
      <div class="search-input-wrapper">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Введите ГОСТ, СП, номер инцидента или тип оборудования..."
          class="search-input"
          @input="handleSearchInput"
          @keyup.enter="performSearch"
        />
        <button 
          class="search-btn" 
          @click="performSearch"
          :disabled="!searchQuery.trim()"
        >
          <span class="search-icon">🔍</span>
          Поиск
        </button>
      </div>
      
      <!-- Лоадер -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <span>Поиск в базе знаний...</span>
      </div>
      
      <!-- Результаты поиска -->
      <div v-if="searchResults.length > 0 && !isLoading" class="search-results">
        <div class="results-header">
          <span class="results-count">
            Найдено: <strong>{{ searchResults.length }}</strong> документов за <strong>{{ searchTime }}с</strong>
          </span>
          <div class="filters">
            <button 
              v-for="filter in resultFilters" 
              :key="filter"
              class="filter-btn"
              :class="{ active: activeFilter === filter }"
              @click="activeFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
        </div>
        
        <div class="versions-list">
          <div 
            v-for="result in filteredResults" 
            :key="result.id"
            class="version-card"
            :class="{ selected: selectedVersion?.id === result.id }"
            @click="selectVersion(result)"
          >
            <div class="version-header">
              <div class="version-info">
                <div class="version-type-badge" :class="result.type">
                  {{ getTypeIcon(result.type) }}
                </div>
                <div class="version-content">
                  <span class="version-title">{{ result.title }}</span>
                  <div class="version-meta">
                    <span class="version-date" :class="{ current: result.isCurrent }">
                      {{ result.date }}
                      <span v-if="result.isCurrent" class="current-badge">Актуальная</span>
                    </span>
                    <span v-if="result.relevance" class="relevance">
                      Релевантность: {{ result.relevance }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="version-snippet" v-if="result.snippet">
              {{ result.snippet }}
            </div>
            <div class="version-tags" v-if="result.tags">
              <span v-for="tag in result.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        
        <!-- Детальная информация о выбранном документе -->
        <div v-if="selectedVersion" class="details-section">
          <div class="details-header">
            <h4>{{ selectedVersion.title }}</h4>
            <div class="details-actions">
              <button class="action-btn secondary" @click="downloadPDF">
                📄 Скачать PDF
              </button>
              <button class="action-btn secondary" @click="viewHistory">
                📊 История версий
              </button>
            </div>
          </div>
          
          <!-- Отличия версий -->
          <div v-if="selectedVersion.type === 'standard' && selectedVersion.changes" class="diff-section">
            <h5>Основные изменения ({{ selectedVersion.changes }} позиций)</h5>
            <div class="diff-content">
              <div class="diff-item added">
                <span class="diff-label">+ Добавлено:</span>
                <span class="diff-text">{{ getDiffText(selectedVersion.id, 'added') }}</span>
              </div>
              <div class="diff-item modified">
                <span class="diff-label">~ Изменено:</span>
                <span class="diff-text">{{ getDiffText(selectedVersion.id, 'modified') }}</span>
              </div>
              <div class="diff-item removed">
                <span class="diff-label">- Удалено:</span>
                <span class="diff-text">{{ getDiffText(selectedVersion.id, 'removed') }}</span>
              </div>
            </div>
          </div>
          
          <!-- Связанные объекты -->
          <div v-if="relatedItems.length > 0" class="related-section">
            <h5>Связанные объекты</h5>
            <div class="related-items">
              <div v-for="item in relatedItems" :key="item.id" class="related-item">
                <span class="related-icon">{{ getTypeIcon(item.type) }}</span>
                <span class="related-title">{{ item.title }}</span>
                <span class="related-relation">{{ item.relation }}</span>
              </div>
            </div>
          </div>
          
          <!-- Действия -->
          <div class="actions">
            <button class="action-btn primary" @click="generateChecklist">
              📋 Создать чек-лист ТОиР
            </button>
            <button v-if="selectedVersion.type === 'incident'" class="action-btn warning" @click="analyzeIncident">
              ⚠️ Анализ инцидента
            </button>
            <button v-if="selectedVersion.type === 'equipment'" class="action-btn info" @click="viewMaintenance">
              🔧 График ТОиР
            </button>
            <button v-if="['drawing','template','project','report','instruction'].includes(selectedVersion.type)" class="action-btn gaznetcad" @click="openInGazNetCAD">
              🛠️ Открыть в GazNetCAD
            </button>
          </div>
        </div>
      </div>
      
      <!-- Сгенерированный чек-лист -->
      <div v-if="generatedChecklist" class="checklist-section">
        <div class="checklist-header">
          <h4>📋 Автоматически сгенерированный чек-лист</h4>
          <span class="checklist-meta">Основан на: {{ selectedVersion?.title }}</span>
        </div>
        <div class="checklist-items">
          <div v-for="item in checklist" :key="item.id" class="checklist-item">
            <input 
              type="checkbox" 
              :id="`check-${item.id}`" 
              v-model="item.checked"
              @change="updateProgress"
            >
            <label :for="`check-${item.id}`" class="checklist-label">
              <span class="check-text">{{ item.text }}</span>
              <span v-if="item.priority" class="priority" :class="item.priority">
                {{ item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢' }}
              </span>
            </label>
          </div>
        </div>
        
        <div class="checklist-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: checklistProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ Math.round(checklistProgress) }}% выполнено</span>
        </div>
        
        <div class="checklist-actions">
          <button class="action-btn maintenance" @click="createMaintenanceTask">
            🔧 Создать задачу ТОиР
          </button>
          <button class="action-btn secondary" @click="exportChecklist">
            📤 Экспорт в Excel
          </button>
        </div>
      </div>
      
      <!-- Пустое состояние -->
      <div v-if="searchQuery && searchResults.length === 0 && !isLoading" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h4>Документы не найдены</h4>
        <p>Попробуйте изменить запрос или воспользуйтесь быстрыми примерами выше</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SearchResult {
  id: string
  title: string
  date: string
  isCurrent: boolean
  changes?: number
  type: 'standard' | 'incident' | 'equipment' | 'drawing' | 'template' | 'project' | 'report' | 'instruction'
  snippet?: string
  tags?: string[]
  relevance?: number
}

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
  priority?: 'high' | 'medium' | 'low'
}

interface RelatedItem {
  id: string
  title: string
  type: string
  relation: string
}

const emit = defineEmits<{
  createMaintenanceTask: [checklist: ChecklistItem[]]
}>()

// Состояние компонента
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const selectedVersion = ref<SearchResult | null>(null)
const searchTime = ref(0.4)
const generatedChecklist = ref(false)
const isLoading = ref(false)
const activeFilter = ref('Все')

// Данные для демонстрации
const quickExamples = ref([
  'СП 62.13330-2021',
  'ГОСТ 5542-2014', 
  'Инцидент #2024-041',
  'Регуляторы давления',
  'Полиэтиленовые трубы',
  'ГРП-50',
  'Сварка',
  'Коррозия',
  'Безопасность',
  'Проект газификации'
])

const resultFilters = ref(['Все', 'Стандарты', 'Инциденты', 'Оборудование', 'Чертежи'])

const mockDatabase = ref<SearchResult[]>([
  {
    id: '1',
    title: 'СП 62.13330-2021 Газораспределительные системы',
    date: '2021-12-25',
    isCurrent: true,
    changes: 15,
    type: 'standard',
    snippet: 'Актуализированная редакция СНиП 42-01-2002. Содержит требования к проектированию, строительству и эксплуатации газораспределительных систем.',
    tags: ['ГРС', 'Проектирование', 'Безопасность'],
    relevance: 98
  },
  {
    id: '2', 
    title: 'СП 62.13330-2011 Газораспределительные системы',
    date: '2011-05-20',
    isCurrent: false,
    changes: 8,
    type: 'standard',
    snippet: 'Предыдущая редакция свода правил. Заменена на версию 2021 года.',
    tags: ['ГРС', 'Устаревший'],
    relevance: 85
  },
  {
    id: '3',
    title: 'ГОСТ 5542-2014 Газы горючие природные для промышленного и коммунально-бытового назначения',
    date: '2014-07-01',
    isCurrent: true,
    type: 'standard',
    snippet: 'Технические условия на природный газ, требования к качеству и методы контроля.',
    tags: ['Качество газа', 'Анализ', 'ТУ'],
    relevance: 92
  },
  {
    id: '4',
    title: 'Инцидент ГРС-12: Превышение давления на выходе',
    date: '2024-01-15',
    isCurrent: true,
    type: 'incident',
    snippet: 'Зафиксировано превышение рабочего давления на 15% от номинального значения. Причина: неисправность регулятора давления РДУ-32.',
    tags: ['Авария', 'Давление', 'РДУ-32'],
    relevance: 95
  },
  {
    id: '5',
    title: 'Регулятор давления РДУ-32/10',
    date: '2023-08-10',
    isCurrent: true,
    type: 'equipment',
    snippet: 'Техническая документация и инструкция по эксплуатации регулятора давления для газораспределительных пунктов.',
    tags: ['РДУ', 'Регулятор', 'ТОиР'],
    relevance: 89
  },
  {
    id: '6',
    title: 'Чертёж ГРП-400: Схема подключения',
    date: '2023-12-01',
    isCurrent: true,
    type: 'drawing',
    snippet: 'Принципиальная схема газорегуляторного пункта производительностью 400 м³/ч.',
    tags: ['Чертёж', 'ГРП', 'Схема'],
    relevance: 87
  },
  {
    id: '7',
    title: 'Шаблон проекта ГРС для новых микрорайонов',
    date: '2024-02-10',
    isCurrent: true,
    type: 'template',
    snippet: 'Готовый шаблон проектной документации для газораспределительных станций в новых жилых массивах.',
    tags: ['Шаблон', 'Проект', 'GazNetCAD'],
    relevance: 93
  },
  {
    id: '8',
    title: 'Отчёт по эксплуатации ГРП-400 за 2023 год',
    date: '2024-01-05',
    isCurrent: true,
    type: 'report',
    snippet: 'Подробный отчёт о работе газорегуляторного пункта, выявленные неисправности и рекомендации.',
    tags: ['Отчёт', 'Эксплуатация', 'ГРП-400'],
    relevance: 90
  },
  {
    id: '9',
    title: 'Указания по проектированию газовых сетей в GazNetCAD',
    date: '2023-11-20',
    isCurrent: true,
    type: 'instruction',
    snippet: 'Пошаговые указания по созданию и согласованию проектов газовых сетей с помощью GazNetCAD.',
    tags: ['Указания', 'Проектирование', 'GazNetCAD'],
    relevance: 94
  },
  {
    id: '10',
    title: 'Проект газоснабжения ЖК "Солнечный" (DWG)',
    date: '2024-03-01',
    isCurrent: true,
    type: 'project',
    snippet: 'Полный комплект проектной документации для жилого комплекса, доступен для редактирования в GazNetCAD.',
    tags: ['Проект', 'DWG', 'GazNetCAD'],
    relevance: 97
  }
])

const checklist = ref<ChecklistItem[]>([
  { id: '1', text: 'Проверить соответствие давления в системе (пункт 5.2.1)', checked: false, priority: 'high' },
  { id: '2', text: 'Убедиться в наличии систем автоматизации ГРС', checked: false, priority: 'high' },
  { id: '3', text: 'Заменить устаревшую запорную арматуру', checked: false, priority: 'medium' },
  { id: '4', text: 'Провести испытания по новым требованиям', checked: false, priority: 'medium' },
  { id: '5', text: 'Обновить техническую документацию', checked: false, priority: 'low' },
  { id: '6', text: 'Провести обучение персонала', checked: false, priority: 'low' }
])

const relatedItems = ref<RelatedItem[]>([
  { id: '1', title: 'ГРП-12', type: 'equipment', relation: 'Применимо к' },
  { id: '2', title: 'Инцидент #2024-041', type: 'incident', relation: 'Связан с' },
  { id: '3', title: 'ГОСТ Р 54983-2012', type: 'standard', relation: 'Ссылается на' }
])

// Вычисляемые свойства
const filteredResults = computed(() => {
  if (activeFilter.value === 'Все') return searchResults.value
  
  const filterMap: Record<string, string> = {
    'Стандарты': 'standard',
    'Инциденты': 'incident', 
    'Оборудование': 'equipment',
    'Чертежи': 'drawing'
  }
  
  return searchResults.value.filter((result: SearchResult) => result.type === filterMap[activeFilter.value])
})

const checklistProgress = computed(() => {
  const completed = checklist.value.filter((item: ChecklistItem) => item.checked).length
  return (completed / checklist.value.length) * 100
})

// Методы
function handleSearchInput() {
  // Автоматический поиск при вводе (с задержкой)
  if (searchQuery.value.length >= 3) {
    setTimeout(() => {
      if (searchQuery.value.length >= 3) {
        performSearch()
      }
    }, 500)
  }
}

function performSearch() {
  isLoading.value = true
  searchResults.value = []
  selectedVersion.value = null

  setTimeout(() => {
    const query = searchQuery.value.trim().toLowerCase()
    let results: SearchResult[]
    if (!query) {
      // Если строка поиска пуста — показываем все документы
      results = mockDatabase.value.slice()
    } else {
      // Поиск по всем строковым полям
      results = mockDatabase.value.filter((item: SearchResult) => {
        const fields = [item.title, item.snippet, ...(item.tags || []), item.date]
        return fields.some(field => field && field.toLowerCase().includes(query))
      })
    }
    results = results.sort((a: SearchResult, b: SearchResult) => (b.relevance || 0) - (a.relevance || 0))
    searchResults.value = results
    searchTime.value = 0.3 + Math.random() * 0.4
    isLoading.value = false
  }, 300)
}

function selectVersion(version: SearchResult) {
  selectedVersion.value = selectedVersion.value?.id === version.id ? null : version
  generatedChecklist.value = false
}

function generateChecklist() {
  generatedChecklist.value = true
  
  // Сброс состояния чек-листа
  checklist.value.forEach(item => item.checked = false)
  
  // Адаптация чек-листа под тип документа
  if (selectedVersion.value?.type === 'incident') {
    checklist.value[0].text = 'Проанализировать причины инцидента'
    checklist.value[1].text = 'Проверить системы безопасности'
  } else if (selectedVersion.value?.type === 'equipment') {
    checklist.value[0].text = 'Проверить техническое состояние оборудования'
    checklist.value[1].text = 'Выполнить регламентное обслуживание'
  }
}

function updateProgress() {
  // Обновление прогресса происходит автоматически через computed
}

function downloadPDF() {
  console.log('Downloading PDF for', selectedVersion.value?.title)
  // TODO: реальная загрузка PDF
}

function viewHistory() {
  console.log('Viewing history for', selectedVersion.value?.title)
  // TODO: открытие истории версий
}

function analyzeIncident() {
  console.log('Analyzing incident', selectedVersion.value?.title)
  // TODO: анализ инцидента
}

function viewMaintenance() {
  console.log('Viewing maintenance for', selectedVersion.value?.title)
  // TODO: просмотр графика ТОиР
}

function createMaintenanceTask() {
  emit('createMaintenanceTask', checklist.value)
}

function exportChecklist() {
  console.log('Exporting checklist to Excel')
  // TODO: экспорт в Excel
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    standard: '📋',
    incident: '⚠️',
    equipment: '⚙️', 
    drawing: '📐',
    template: '📄',
    project: '🛠️',
    report: '📊',
    instruction: '📚'
  }
  return icons[type] || '📄'
}

function getDiffText(id: string, type: 'added' | 'modified' | 'removed'): string {
  const diffs: Record<string, Record<string, string>> = {
    '1': {
      added: 'Требования к системам автоматизации ГРС (раздел 7.3)',
      modified: 'Пункт 5.2.1 - обновлены нормы рабочего давления',
      removed: 'Устаревшие требования к запорной арматуре (п. 6.1.5)'
    },
    '2': {
      added: 'Дополнительные требования безопасности',
      modified: 'Изменены параметры газоснабжения',
      removed: 'Старые нормы проектирования'
    }
  }
  
  return diffs[id]?.[type] || `${type} изменения в документе`
}

function openInGazNetCAD() {
  if (selectedVersion.value) {
    alert('Открытие документа в GazNetCAD: ' + selectedVersion.value.title)
    // Здесь может быть реальная интеграция или переход
  }
}
</script>

<style lang="scss" scoped>
.search-demo {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e7ff;
}

.demo-header {
  text-align: center;
  margin-bottom: 20px;
}

.demo-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin-top: 8px;
  margin-bottom: 16px;
}

.database-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  border: 1px solid #bae6fd;
}

.db-badge {
  font-size: 14px;
  color: #0369a1;
  font-weight: 500;
}

.db-types {
  font-size: 12px;
  color: #0c4a6e;
  opacity: 0.8;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
}

.quick-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.example-chip {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }
}

.search-input-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
}

.search-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    color: #9ca3af;
  }
}

.search-icon {
  font-size: 20px;
}

.loading-state {
  text-align: center;
  padding: 40px 0;
  color: #6b7280;
  font-size: 18px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-results {
  margin-top: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .results-count {
    color: #6b7280;
    font-size: 14px;
  }
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-btn {
  padding: 8px 12px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
}

.versions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.version-card {
  padding: 16px;
  border: 2px solid #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #d1d5db;
  }
  
  &.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }
}

.version-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.version-type-badge {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  font-weight: bold;

  &.standard { background: #10b981; }
  &.incident { background: #ef4444; }
  &.equipment { background: #f59e0b; }
  &.drawing { background: #3b82f6; }
  &.template { background: #6b7280; }
  &.project { background: #4f46e5; }
  &.report { background: #10b981; }
  &.instruction { background: #f59e0b; }
}

.version-content {
  flex: 1;
}

.version-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 18px;
  margin-bottom: 4px;
}

.version-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-size: 14px;
}

.version-date {
  &.current {
    color: #059669;
    font-weight: 600;
  }
}

.current-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 8px;
}

.relevance {
  background: #fef3c7;
  color: #d97706;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.version-snippet {
  font-size: 14px;
  color: #4b5563;
  margin-top: 8px;
  line-height: 1.5;
}

.version-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  background: #e0e7ff;
  color: #3b82f6;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.details-section {
  margin-top: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e0e7ff;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.details-actions {
  display: flex;
  gap: 10px;
}

.diff-section {
  margin-top: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e0e7ff;
}

.diff-section h5 {
  margin-bottom: 16px;
  color: #1f2937;
  font-size: 16px;
}

.diff-content {
  margin: 16px 0;
}

.diff-item {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.diff-label {
  font-weight: 600;
  min-width: 80px;
  
  .added & { color: #059669; }
  .modified & { color: #d97706; }
  .removed & { color: #dc2626; }
}

.diff-text {
  color: #374151;
  font-size: 14px;
}

.related-section {
  margin-top: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e0e7ff;
}

.related-section h5 {
  margin-bottom: 16px;
  color: #1f2937;
  font-size: 16px;
}

.related-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #4b5563;
}

.related-icon {
  font-size: 20px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &.primary {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &.warning {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }

  &.info {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #1d4ed8;
    }
  }

  &.maintenance {
    background: #f59e0b;
    color: white;
    
    &:hover {
      background: #d97706;
    }
  }

  &.gaznetcad {
    background: #4f46e5;
    color: white;
    
    &:hover {
      background: #3730a3;
    }
  }
}

.checklist-section {
  margin-top: 24px;
  padding: 20px;
  background: #fefce8;
  border-radius: 8px;
  border: 1px solid #fde047;
}

.checklist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.checklist-meta {
  color: #6b7280;
  font-size: 14px;
}

.checklist-items {
  margin: 16px 0;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  
  input[type="checkbox"] {
    margin-top: 2px;
  }
  
  label {
    cursor: pointer;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.checklist-label {
  flex: 1;
}

.check-text {
  font-size: 14px;
}

.priority {
  font-size: 14px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.priority.high { background: #fef3c7; color: #d97706; }
.priority.medium { background: #fefce8; color: #f59e0b; }
.priority.low { background: #d1fae5; color: #059669; }

.checklist-progress {
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e0e7ff;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}

.progress-text {
  font-size: 14px;
  color: #6b7280;
}

.checklist-actions {
  display: flex;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #9ca3af;
  font-size: 18px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 15px;
}
</style> 