<template>
  <div class="maintenance-demo">
    <h3>🔧 Maintenance Lite - Генератор задач ТОиР</h3>
    
    <div v-if="!taskGenerated" class="checklist-input">
      <h4>Чек-лист требований</h4>
      <div class="checklist-preview">
        <div v-for="item in checklistItems" :key="item.id" class="checklist-item">
          <span class="item-icon">{{ item.checked ? '✅' : '⭕' }}</span>
          <span class="item-text">{{ item.text }}</span>
        </div>
      </div>
      
      <div class="task-params">
        <h4>Параметры задачи</h4>
        <div class="params-grid">
          <div class="param-group">
            <label>Приоритет</label>
            <select v-model="taskParams.priority">
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>
          
          <div class="param-group">
            <label>Ответственный</label>
            <select v-model="taskParams.assignee">
              <option value="engineer1">Инженер Иванов И.И.</option>
              <option value="engineer2">Инженер Петров П.П.</option>
              <option value="foreman">Мастер Сидоров С.С.</option>
            </select>
          </div>
          
          <div class="param-group">
            <label>Срок выполнения</label>
            <input v-model="taskParams.deadline" type="date" />
          </div>
          
          <div class="param-group">
            <label>Объект ГРС</label>
            <input v-model="taskParams.object" type="text" placeholder="ГРС-01" />
          </div>
        </div>
      </div>
      
      <button class="generate-btn" @click="generateTask">
        ⚡ Сформировать наряд-допуск
      </button>
    </div>
    
    <div v-if="taskGenerated" class="task-result">
      <h4>Сформированный наряд-допуск</h4>
      
      <div class="task-document">
        <div class="doc-header">
          <div class="doc-title">НАРЯД-ДОПУСК № {{ taskNumber }}</div>
          <div class="doc-date">{{ new Date().toLocaleDateString('ru-RU') }}</div>
        </div>
        
        <div class="doc-content">
          <div class="doc-section">
            <h5>Объект работ</h5>
            <p>{{ taskParams.object || 'ГРС-01' }}</p>
          </div>
          
          <div class="doc-section">
            <h5>Вид работ</h5>
            <p>Проверка соответствия нормативным требованиям</p>
          </div>
          
          <div class="doc-section">
            <h5>Перечень работ</h5>
            <ul>
              <li v-for="item in checklistItems.filter(i => i.checked)" :key="item.id">
                {{ item.text }}
              </li>
            </ul>
          </div>
          
          <div class="doc-section">
            <h5>Ответственные лица</h5>
            <p>Ответственный исполнитель: {{ getAssigneeName() }}</p>
            <p>Допускающий: Мастер участка</p>
          </div>
          
          <div class="doc-section">
            <h5>Срок выполнения</h5>
            <p>{{ taskParams.deadline || 'Не указан' }}</p>
          </div>
        </div>
      </div>
      
      <div class="integration-status">
        <h4>Интеграция с SafePlant</h4>
        <div class="status-steps">
          <div class="status-step completed">
            <span class="step-icon">✅</span>
            <span class="step-text">Наряд создан</span>
          </div>
          <div class="status-step" :class="{ completed: integrationStep >= 2, active: integrationStep === 2 }">
            <span class="step-icon">📤</span>
            <span class="step-text">Отправка в SafePlant</span>
          </div>
          <div class="status-step" :class="{ completed: integrationStep >= 3, active: integrationStep === 3 }">
            <span class="step-icon">🔄</span>
            <span class="step-text">Синхронизация с SAP</span>
          </div>
          <div class="status-step" :class="{ completed: integrationStep >= 4 }">
            <span class="step-icon">📋</span>
            <span class="step-text">Задача назначена</span>
          </div>
        </div>
        
        <div class="integration-actions">
          <button 
            v-if="integrationStep === 1" 
            class="integration-btn"
            @click="sendToSafePlant"
          >
            📤 Отправить в SafePlant
          </button>
          
          <div v-if="integrationStep >= 4" class="integration-complete">
            <span class="complete-icon">🎉</span>
            <span class="complete-text">Задача успешно создана и назначена</span>
            <div class="task-links">
              <a href="#" class="task-link">Открыть в SafePlant</a>
              <a href="#" class="task-link">Просмотр в SAP</a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="task-actions">
        <button class="action-btn secondary" @click="resetTask">
          🔄 Создать новую задачу
        </button>
        <button class="action-btn primary" @click="downloadTask">
          📄 Скачать наряд-допуск
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

interface TaskParams {
  priority: string
  assignee: string
  deadline: string
  object: string
}

const props = defineProps<{
  checklistItems?: ChecklistItem[]
}>()

const taskGenerated = ref(false)
const integrationStep = ref(1)
const taskNumber = ref('')

const taskParams = ref<TaskParams>({
  priority: 'medium',
  assignee: 'engineer1',
  deadline: '',
  object: 'ГРС-01'
})

const defaultChecklist: ChecklistItem[] = [
  { id: '1', text: 'Проверить соответствие давления в системе', checked: true },
  { id: '2', text: 'Убедиться в наличии систем автоматизации ГРС', checked: true },
  { id: '3', text: 'Заменить устаревшую запорную арматуру', checked: false },
  { id: '4', text: 'Провести испытания по новым требованиям', checked: true }
]

const checklistItems = computed(() => props.checklistItems || defaultChecklist)

function generateTask() {
  taskNumber.value = 'NK-' + Date.now().toString().slice(-6)
  taskGenerated.value = true
  integrationStep.value = 1
}

function sendToSafePlant() {
  integrationStep.value = 2
  
  // Симуляция отправки
  setTimeout(() => {
    integrationStep.value = 3
  }, 1000)
  
  setTimeout(() => {
    integrationStep.value = 4
  }, 2000)
}

function getAssigneeName() {
  const names = {
    'engineer1': 'Инженер Иванов И.И.',
    'engineer2': 'Инженер Петров П.П.',
    'foreman': 'Мастер Сидоров С.С.'
  }
  return names[taskParams.value.assignee as keyof typeof names] || 'Не назначен'
}

function resetTask() {
  taskGenerated.value = false
  integrationStep.value = 1
}

function downloadTask() {
  // TODO: скачать PDF наряда-допуска
  console.log('Downloading task document')
}
</script>

<style lang="scss" scoped>
.maintenance-demo {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e7ff;
}

.checklist-preview {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.item-icon {
  font-size: 16px;
}

.item-text {
  color: #374151;
}

.task-params {
  margin-bottom: 24px;
}

.params-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  label {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }
  
  select, input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }
}

.generate-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.task-document {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 20px;
}

.doc-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.doc-date {
  color: #6b7280;
  font-weight: 600;
}

.doc-section {
  margin-bottom: 16px;
  
  h5 {
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }
  
  p, ul {
    color: #6b7280;
    margin: 0;
  }
  
  ul {
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 4px;
  }
}

.integration-status {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.status-steps {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
}

.status-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
  transition: opacity 0.3s;
  
  &.active {
    opacity: 0.8;
    
    .step-icon {
      animation: pulse 1.5s infinite;
    }
  }
  
  &.completed {
    opacity: 1;
  }
}

.step-icon {
  font-size: 24px;
}

.step-text {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #374151;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.integration-actions {
  margin-top: 16px;
}

.integration-btn {
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #059669;
  }
}

.integration-complete {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.complete-icon {
  font-size: 32px;
}

.complete-text {
  font-weight: 600;
  color: #065f46;
}

.task-links {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.task-link {
  color: #059669;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
}

.task-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
}
</style> 