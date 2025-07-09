<template>
  <div class="knowledge-management-demo">
    <div class="demo-header">
      <h3>🧠 Демонстрация управления знаниями</h3>
      <p class="demo-subtitle">Интерактивные инструменты для организации и анализа технических знаний</p>
    </div>
    
    <div class="demo-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.title }}
      </button>
    </div>
    
    <!-- График знаний -->
    <div v-if="activeTab === 'graph'" class="demo-content">
      <div class="content-header">
        <h4>📊 График знаний</h4>
        <p>Визуализация связей между документами, оборудованием и процедурами</p>
      </div>
      
      <div class="graph-container">
        <div class="graph-controls">
          <button 
            v-for="filter in graphFilters" 
            :key="filter"
            class="graph-filter"
            :class="{ active: activeGraphFilter === filter }"
            @click="activeGraphFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
        
        <div class="knowledge-graph" ref="knowledgeGraphRef">
          <!-- Центральный узел -->
          <div class="graph-node central" :style="{ left: '50%', top: '50%' }">
            {{ selectedCentralNode.title }}
          </div>
          
          <!-- Связанные узлы -->
          <div 
            v-for="(node, index) in filteredNodes" 
            :key="node.id"
            class="graph-node"
            :class="[node.type, { connected: hoveredConnection === node.id }]"
            :style="getNodePosition(index, filteredNodes.length)"
            @mouseover="hoveredConnection = node.id"
            @mouseleave="hoveredConnection = null"
            @click="selectNode(node)"
          >
            <div class="node-icon">{{ getNodeIcon(node.type) }}</div>
            <div class="node-title">{{ node.title }}</div>
            <div class="node-relation">{{ node.relation }}</div>
          </div>
          
          <!-- Соединительные линии -->
          <svg class="graph-connections" viewBox="0 0 600 400">
            <g v-for="(node, index) in filteredNodes" :key="`line-${node.id}`">
              <line 
                :x1="300" 
                :y1="200"
                :x2="getConnectionPoint(index, filteredNodes.length).x"
                :y2="getConnectionPoint(index, filteredNodes.length).y"
                :class="{ highlighted: hoveredConnection === node.id }"
                stroke="#3b82f6"
                :stroke-width="hoveredConnection === node.id ? 3 : 1"
                stroke-opacity="0.6"
              />
            </g>
          </svg>
        </div>
        
        <div class="graph-legend">
          <div class="legend-item">
            <span class="legend-icon standard">📋</span>
            <span>Нормативы</span>
          </div>
          <div class="legend-item">
            <span class="legend-icon equipment">⚙️</span>
            <span>Оборудование</span>
          </div>
          <div class="legend-item">
            <span class="legend-icon incident">⚠️</span>
            <span>Инциденты</span>
          </div>
          <div class="legend-item">
            <span class="legend-icon procedure">🔧</span>
            <span>Процедуры</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Анализ версий -->
    <div v-if="activeTab === 'versions'" class="demo-content">
      <div class="content-header">
        <h4>📈 Анализ версий документов</h4>
        <p>Отслеживание изменений и их влияния на проекты</p>
      </div>
      
      <div class="version-analysis">
        <div class="document-selector">
          <select v-model="selectedDocument" class="document-select">
            <option value="">Выберите документ</option>
            <option v-for="doc in documents" :key="doc.id" :value="doc.id">
              {{ doc.title }}
            </option>
          </select>
        </div>
        
        <div v-if="selectedDocument" class="version-timeline">
          <div class="timeline-header">
            <h5>История версий</h5>
            <div class="impact-indicator">
              <span class="impact-label">Влияние изменений:</span>
              <div class="impact-level" :class="currentImpactLevel">
                {{ getImpactText(currentImpactLevel) }}
              </div>
            </div>
          </div>
          
          <div class="timeline">
            <div 
              v-for="version in documentVersions" 
              :key="version.id"
              class="timeline-item"
              :class="{ current: version.isCurrent, selected: selectedVersion === version.id }"
              @click="selectedVersion = version.id"
            >
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="version-info">
                  <span class="version-number">v{{ version.version }}</span>
                  <span class="version-date">{{ version.date }}</span>
                  <span v-if="version.isCurrent" class="current-badge">Текущая</span>
                </div>
                <div class="version-changes">
                  <div class="change-summary">
                    <span class="change-count added">+{{ version.added || 0 }}</span>
                    <span class="change-count modified">~{{ version.modified || 0 }}</span>
                    <span class="change-count removed">-{{ version.removed || 0 }}</span>
                  </div>
                  <div class="change-description">{{ version.description }}</div>
                </div>
                <div v-if="version.affectedProjects" class="affected-projects">
                  <span class="affected-label">Затронутые проекты:</span>
                  <span class="project-count">{{ version.affectedProjects }} проектов</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Интеллектуальные рекомендации -->
    <div v-if="activeTab === 'recommendations'" class="demo-content">
      <div class="content-header">
        <h4>💡 Интеллектуальные рекомендации</h4>
        <p>ИИ-анализ для оптимизации процессов и предотвращения проблем</p>
      </div>
      
      <div class="recommendations-container">
        <div class="recommendation-filters">
          <button 
            v-for="filter in recommendationFilters"
            :key="filter"
            class="filter-chip"
            :class="{ active: activeRecFilter === filter }"
            @click="activeRecFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
        
        <div class="recommendations-list">
          <div 
            v-for="rec in filteredRecommendations" 
            :key="rec.id"
            class="recommendation-card"
            :class="rec.priority"
          >
            <div class="rec-header">
              <div class="rec-icon">{{ rec.icon }}</div>
              <div class="rec-info">
                <h5 class="rec-title">{{ rec.title }}</h5>
                <div class="rec-meta">
                  <span class="rec-type">{{ rec.type }}</span>
                  <span class="rec-priority">{{ getPriorityText(rec.priority) }}</span>
                  <span class="rec-confidence">Уверенность: {{ rec.confidence }}%</span>
                </div>
              </div>
            </div>
            
            <div class="rec-content">
              <p class="rec-description">{{ rec.description }}</p>
              
              <div class="rec-details">
                <div class="rec-impact">
                  <span class="impact-label">Потенциальный эффект:</span>
                  <ul>
                    <li v-for="impact in rec.impacts" :key="impact">{{ impact }}</li>
                  </ul>
                </div>
                
                <div class="rec-actions">
                  <span class="actions-label">Рекомендуемые действия:</span>
                  <ol>
                    <li v-for="action in rec.actions" :key="action">{{ action }}</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div class="rec-footer">
              <button class="action-btn primary" @click="implementRecommendation(rec)">
                ✅ Применить
              </button>
              <button class="action-btn secondary" @click="scheduleRecommendation(rec)">
                📅 Запланировать
              </button>
              <button class="action-btn tertiary" @click="dismissRecommendation(rec)">
                ❌ Отклонить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface KnowledgeNode {
  id: string
  title: string
  type: 'standard' | 'equipment' | 'incident' | 'procedure'
  relation: string
}

interface DocumentVersion {
  id: string
  version: string
  date: string
  isCurrent: boolean
  description: string
  added?: number
  modified?: number
  removed?: number
  affectedProjects?: number
}

interface Document {
  id: string
  title: string
}

interface Recommendation {
  id: string
  title: string
  type: string
  priority: 'high' | 'medium' | 'low'
  confidence: number
  description: string
  impacts: string[]
  actions: string[]
  icon: string
}

// Состояние компонента
const activeTab = ref('graph')
const activeGraphFilter = ref('Все')
const hoveredConnection = ref<string | null>(null)
const selectedDocument = ref('')
const selectedVersion = ref('')
const activeRecFilter = ref('Все')

// Данные
const tabs = ref([
  { id: 'graph', title: 'График знаний', icon: '📊' },
  { id: 'versions', title: 'Анализ версий', icon: '📈' },
  { id: 'recommendations', title: 'Рекомендации ИИ', icon: '💡' }
])

const selectedCentralNode = ref({
  title: 'СП 62.13330-2021'
})

const graphFilters = ref(['Все', 'Нормативы', 'Оборудование', 'Инциденты', 'Процедуры'])

const knowledgeNodes = ref<KnowledgeNode[]>([
  { id: '1', title: 'ГОСТ 5542-2014', type: 'standard', relation: 'Ссылается на' },
  { id: '2', title: 'ГРП-400', type: 'equipment', relation: 'Применимо к' },
  { id: '3', title: 'Инцидент #2024-041', type: 'incident', relation: 'Связан с' },
  { id: '4', title: 'Процедура ТОиР', type: 'procedure', relation: 'Генерирует' },
  { id: '5', title: 'РДУ-32/10', type: 'equipment', relation: 'Регулирует' },
  { id: '6', title: 'ГОСТ Р 54983-2012', type: 'standard', relation: 'Дополняет' },
  { id: '7', title: 'Авария ГРС-12', type: 'incident', relation: 'Предотвращает' },
  { id: '8', title: 'Чек-лист ТОиР #47', type: 'procedure', relation: 'Создается из' }
])

const documents = ref<Document[]>([
  { id: '1', title: 'СП 62.13330-2021 Газораспределительные системы' },
  { id: '2', title: 'ГОСТ 5542-2014 Газы горючие природные' },
  { id: '3', title: 'ГОСТ Р 54983-2012 Газоснабжение' }
])

const documentVersions = ref<DocumentVersion[]>([
  {
    id: '1',
    version: '2021',
    date: '2021-12-25',
    isCurrent: true,
    description: 'Актуализированная редакция с новыми требованиями к автоматизации',
    added: 15,
    modified: 8,
    removed: 3,
    affectedProjects: 247
  },
  {
    id: '2',
    version: '2011',
    date: '2011-05-20',
    isCurrent: false,
    description: 'Базовая редакция с основными требованиями',
    added: 0,
    modified: 5,
    removed: 0,
    affectedProjects: 156
  },
  {
    id: '3',
    version: '2024 (проект)',
    date: '2024-03-15',
    isCurrent: false,
    description: 'Проект новой редакции с требованиями цифровизации',
    added: 22,
    modified: 12,
    removed: 7,
    affectedProjects: 89
  }
])

const recommendationFilters = ref(['Все', 'Безопасность', 'Эффективность', 'Соответствие', 'Профилактика'])

const recommendations = ref<Recommendation[]>([
  {
    id: '1',
    title: 'Устаревшая документация на ГРП-400',
    type: 'Соответствие',
    priority: 'high',
    confidence: 94,
    description: 'Обнаружено несоответствие текущей документации ГРП-400 новым требованиям СП 62.13330-2021',
    impacts: [
      'Риск нарушения нормативных требований',
      'Возможные штрафы при проверках',
      'Снижение безопасности эксплуатации'
    ],
    actions: [
      'Обновить техническую документацию ГРП-400',
      'Провести аудит соответствия',
      'Обучить персонал новым требованиям'
    ],
    icon: '📋'
  },
  {
    id: '2',
    title: 'Превентивное обслуживание РДУ-32',
    type: 'Профилактика',
    priority: 'medium',
    confidence: 87,
    description: 'На основе анализа инцидентов рекомендуется сократить интервал ТОиР для регуляторов РДУ-32',
    impacts: [
      'Снижение количества аварий на 35%',
      'Экономия 2.3 млн руб/год на ремонтах',
      'Повышение надежности газоснабжения'
    ],
    actions: [
      'Пересмотреть график ТОиР для РДУ-32',
      'Внедрить дополнительные проверки',
      'Обновить процедуры обслуживания'
    ],
    icon: '🔧'
  },
  {
    id: '3',
    title: 'Оптимизация процедур безопасности',
    type: 'Безопасность',
    priority: 'high',
    confidence: 91,
    description: 'Выявлены возможности автоматизации проверок безопасности с использованием IoT-датчиков',
    impacts: [
      'Непрерывный мониторинг состояния',
      'Раннее обнаружение утечек',
      'Снижение человеческого фактора'
    ],
    actions: [
      'Установить IoT-датчики на критичных узлах',
      'Интегрировать с системой мониторинга',
      'Настроить автоматические оповещения'
    ],
    icon: '🛡️'
  }
])

// Вычисляемые свойства
const filteredNodes = computed(() => {
  if (activeGraphFilter.value === 'Все') return knowledgeNodes.value
  
  const filterMap: Record<string, string> = {
    'Нормативы': 'standard',
    'Оборудование': 'equipment',
    'Инциденты': 'incident',
    'Процедуры': 'procedure'
  }
  
  return knowledgeNodes.value.filter((node: KnowledgeNode) => 
    node.type === filterMap[activeGraphFilter.value]
  )
})

const currentImpactLevel = computed(() => {
  if (!selectedDocument.value) return 'low'
  
  const doc = documentVersions.value.find((v: DocumentVersion) => v.isCurrent)
  const totalChanges = (doc?.added || 0) + (doc?.modified || 0) + (doc?.removed || 0)
  
  if (totalChanges > 20) return 'high'
  if (totalChanges > 10) return 'medium'
  return 'low'
})

const filteredRecommendations = computed(() => {
  if (activeRecFilter.value === 'Все') return recommendations.value
  
  return recommendations.value.filter((rec: Recommendation) => 
    rec.type === activeRecFilter.value
  )
})

// Методы
function getNodePosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI
  const radius = 120
  const centerX = 50
  const centerY = 50
  
  const x = centerX + (radius * Math.cos(angle)) / 3
  const y = centerY + (radius * Math.sin(angle)) / 3
  
  return {
    left: `${x}%`,
    top: `${y}%`
  }
}

function getConnectionPoint(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI
  const radius = 100
  
  return {
    x: 300 + radius * Math.cos(angle),
    y: 200 + radius * Math.sin(angle)
  }
}

function getNodeIcon(type: string): string {
  const icons: Record<string, string> = {
    standard: '📋',
    equipment: '⚙️',
    incident: '⚠️',
    procedure: '🔧'
  }
  return icons[type] || '📄'
}

function selectNode(node: KnowledgeNode) {
  selectedCentralNode.value = { title: node.title }
  // Здесь можно добавить логику обновления связей
}

function getImpactText(level: string): string {
  const texts: Record<string, string> = {
    high: 'Высокое',
    medium: 'Среднее', 
    low: 'Низкое'
  }
  return texts[level] || 'Неизвестно'
}

function getPriorityText(priority: string): string {
  const texts: Record<string, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий'
  }
  return texts[priority] || 'Неизвестно'
}

function implementRecommendation(rec: Recommendation) {
  console.log('Implementing recommendation:', rec.title)
  // TODO: реализация рекомендации
}

function scheduleRecommendation(rec: Recommendation) {
  console.log('Scheduling recommendation:', rec.title)
  // TODO: планирование рекомендации
}

function dismissRecommendation(rec: Recommendation) {
  console.log('Dismissing recommendation:', rec.title)
  // TODO: отклонение рекомендации
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.knowledge-management-demo {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: $color-shadow-medium;
  border: 1px solid #e0e7ff;
}

.demo-header {
  text-align: center;
  margin-bottom: 32px;
  
  h3 {
    color: $color-text-main;
    margin-bottom: 8px;
    font-size: 1.75rem;
    font-weight: $font-weight-bold;
  }
  
  .demo-subtitle {
    color: $color-text-light;
    font-size: 1.125rem;
  }
}

.demo-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 2px solid #f3f4f6;
  
  @include mobile {
    flex-direction: column;
  }
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: $font-weight-medium;
  color: $color-text-light;
  transition: $transition-fast;
  
  &.active {
    color: $color-primary;
    border-bottom-color: $color-primary;
  }
  
  &:hover:not(.active) {
    color: $color-text-main;
  }
  
  .tab-icon {
    font-size: 1.2rem;
  }
}

.demo-content {
  min-height: 400px;
}

.content-header {
  margin-bottom: 24px;
  
  h4 {
    color: $color-text-main;
    margin-bottom: 8px;
    font-size: 1.5rem;
    font-weight: $font-weight-semibold;
  }
  
  p {
    color: $color-text-light;
    line-height: 1.6;
  }
}

// === ГРАФИК ЗНАНИЙ ===
.graph-container {
  position: relative;
}

.graph-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.graph-filter {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  cursor: pointer;
  transition: $transition-fast;
  font-weight: $font-weight-medium;
  
  &.active {
    background: $color-primary;
    color: white;
    border-color: $color-primary;
  }
  
  &:hover:not(.active) {
    background: #e5e7eb;
  }
}

.knowledge-graph {
  position: relative;
  height: 400px;
  background: #f8fafe;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e0e7ff;
}

.graph-node {
  position: absolute;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: $color-shadow-soft;
  cursor: pointer;
  transition: $transition-smooth;
  border: 2px solid transparent;
  min-width: 120px;
  text-align: center;
  
  &.central {
    background: $color-primary;
    color: white;
    font-weight: $font-weight-bold;
    font-size: 1.1rem;
    padding: 16px 20px;
    border-color: $color-primary-dark;
    z-index: 10;
  }
  
  &.standard {
    border-color: #10b981;
    
    &.connected {
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }
  }
  
  &.equipment {
    border-color: #f59e0b;
    
    &.connected {
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
    }
  }
  
  &.incident {
    border-color: #ef4444;
    
    &.connected {
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
    }
  }
  
  &.procedure {
    border-color: #8b5cf6;
    
    &.connected {
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
    }
  }
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.05);
    z-index: 5;
  }
}

.node-icon {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.node-title {
  font-weight: $font-weight-semibold;
  font-size: 0.85rem;
  margin-bottom: 2px;
  color: $color-text-main;
}

.node-relation {
  font-size: 0.75rem;
  color: $color-text-light;
}

.graph-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  
  line {
    transition: $transition-fast;
    
    &.highlighted {
      stroke: $color-accent !important;
      stroke-width: 3;
    }
  }
}

.graph-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  
  @include mobile {
    flex-wrap: wrap;
    gap: 12px;
  }
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: $color-text-light;
}

.legend-icon {
  font-size: 1.2rem;
  
  &.standard { color: #10b981; }
  &.equipment { color: #f59e0b; }
  &.incident { color: #ef4444; }
  &.procedure { color: #8b5cf6; }
}

// === АНАЛИЗ ВЕРСИЙ ===
.document-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 24px;
  
  &:focus {
    outline: none;
    border-color: $color-primary;
  }
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @include mobile {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  h5 {
    color: $color-text-main;
    font-size: 1.25rem;
    margin: 0;
  }
}

.impact-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .impact-label {
    color: $color-text-light;
    font-size: 0.9rem;
  }
  
  .impact-level {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: $font-weight-semibold;
    
    &.high {
      background: #fef2f2;
      color: #dc2626;
    }
    
    &.medium {
      background: #fef3c7;
      color: #d97706;
    }
    
    &.low {
      background: #ecfdf5;
      color: #059669;
    }
  }
}

.timeline {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
}

.timeline-item {
  position: relative;
  padding-left: 60px;
  margin-bottom: 24px;
  cursor: pointer;
  
  &.current .timeline-marker {
    background: $color-accent;
    border-color: $color-accent;
  }
  
  &.selected {
    .timeline-content {
      border-color: $color-primary;
      box-shadow: $color-glow-blue;
    }
  }
}

.timeline-marker {
  position: absolute;
  left: 12px;
  top: 8px;
  width: 16px;
  height: 16px;
  background: #d1d5db;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #e5e7eb;
}

.timeline-content {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  padding: 16px;
  transition: $transition-smooth;
  
  &:hover {
    border-color: #d1d5db;
  }
}

.version-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  
  .version-number {
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
  
  .version-date {
    color: $color-text-light;
    font-size: 0.9rem;
  }
  
  .current-badge {
    background: $color-accent;
    color: white;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: $font-weight-semibold;
  }
}

.change-summary {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  
  .change-count {
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: $font-weight-semibold;
    
    &.added {
      background: #ecfdf5;
      color: #059669;
    }
    
    &.modified {
      background: #fef3c7;
      color: #d97706;
    }
    
    &.removed {
      background: #fef2f2;
      color: #dc2626;
    }
  }
}

.change-description {
  color: $color-text-light;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.affected-projects {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .affected-label {
    color: $color-text-light;
    font-size: 0.85rem;
  }
  
  .project-count {
    background: #e0e7ff;
    color: $color-primary;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: $font-weight-semibold;
  }
}

// === РЕКОМЕНДАЦИИ ===
.recommendation-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  cursor: pointer;
  transition: $transition-fast;
  font-weight: $font-weight-medium;
  
  &.active {
    background: $color-primary;
    color: white;
    border-color: $color-primary;
  }
  
  &:hover:not(.active) {
    background: #e5e7eb;
  }
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.recommendation-card {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
  transition: $transition-smooth;
  
  &.high {
    border-left: 4px solid #ef4444;
  }
  
  &.medium {
    border-left: 4px solid #f59e0b;
  }
  
  &.low {
    border-left: 4px solid #10b981;
  }
  
  &:hover {
    border-color: #d1d5db;
    box-shadow: $color-shadow-medium;
  }
}

.rec-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.rec-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.rec-info {
  flex: 1;
}

.rec-title {
  color: $color-text-main;
  margin-bottom: 8px;
  font-size: 1.25rem;
  font-weight: $font-weight-semibold;
}

.rec-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  span {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: $font-weight-medium;
  }
  
  .rec-type {
    background: #e0e7ff;
    color: $color-primary;
  }
  
  .rec-priority {
    background: #fef3c7;
    color: #d97706;
  }
  
  .rec-confidence {
    background: #ecfdf5;
    color: #059669;
  }
}

.rec-content {
  margin-bottom: 24px;
}

.rec-description {
  color: $color-text-light;
  line-height: 1.6;
  margin-bottom: 16px;
}

.rec-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @include mobile {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.rec-impact,
.rec-actions {
  .impact-label,
  .actions-label {
    font-weight: $font-weight-semibold;
    color: $color-text-main;
    margin-bottom: 8px;
    display: block;
  }
  
  ul,
  ol {
    margin: 0;
    padding-left: 20px;
    
    li {
      color: $color-text-light;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 4px;
    }
  }
}

.rec-footer {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: $transition-smooth;
  
  &.primary {
    background: $color-primary;
    color: white;
    
    &:hover {
      background: $color-primary-dark;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: $color-text-main;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &.tertiary {
    background: transparent;
    color: $color-text-light;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
    }
  }
}
</style> 