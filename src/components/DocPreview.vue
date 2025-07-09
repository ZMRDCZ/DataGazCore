<template>
  <div v-if="isVisible && document" class="doc-preview-overlay" @click="close">
    <div class="doc-preview" @click.stop>
      <div class="preview-header">
        <h2>{{ document?.title }}</h2>
        <button @click="close" class="close-btn">×</button>
      </div>
      
      <div class="preview-content">
        <div class="document-viewer">
          <div v-if="document?.type === 'pdf'" class="pdf-viewer">
            <div class="pdf-placeholder">
              📄 PDF просмотр: {{ document?.title }}
              <p>{{ document?.snippet }}</p>
            </div>
          </div>
          
          <div v-else-if="document?.type === 'drawing'" class="dwg-viewer">
            <div class="dwg-placeholder">
              📐 Чертёж: {{ document?.title }}
              <p>{{ document?.snippet }}</p>
            </div>
          </div>
          
          <div v-else class="text-viewer">
            <div class="text-content">
              <h3>{{ document?.title }}</h3>
              <div class="document-meta">
                <span class="version">Версия {{ document?.version }}</span>
                <span class="updated">Обновлено {{ document?.updated }}</span>
              </div>
              <p>{{ document?.snippet }}</p>
              
              <div class="actions">
                <button class="action-btn primary">Прикрепить к чек-листу ТОиР</button>
                <button class="action-btn secondary">Скачать</button>
                <button class="action-btn secondary">История версий</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="related-panel">
          <h3>Связанные объекты</h3>
          <div class="related-items">
            <div v-for="item in relatedItems" :key="item.id" class="related-item">
              <span class="item-icon">{{ getItemIcon(item.type) }}</span>
              <div class="item-info">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-type">{{ item.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Document {
  id: string
  title: string
  version: string
  snippet: string
  tags: string[]
  updated: string
  type: string
}

interface Props {
  document: Document | null
  isVisible: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const relatedItems = computed(() => [
  { id: '1', title: 'ГРП-12', type: 'Оборудование' },
  { id: '2', title: 'Инцидент #2024-041', type: 'Инцидент' },
  { id: '3', title: 'СП 62.13330-2021', type: 'Норматив' }
])

function close() {
  emit('close')
}

function getItemIcon(type: string): string {
  switch (type) {
    case 'Оборудование': return '⚙️'
    case 'Инцидент': return '⚠️'
    case 'Норматив': return '📋'
    case 'Чертёж': return '📐'
    default: return '📄'
  }
}
</script>

<style lang="scss" scoped>
.doc-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.doc-preview {
  width: 90vw;
  height: 80vh;
  max-width: 1200px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e3f2fd;
  
  h2 {
    margin: 0;
    color: $color-text-main;
  }
}

.close-btn {
  border: none;
  background: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
}

.preview-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.document-viewer {
  flex: 2;
  padding: 24px;
  overflow-y: auto;
}

.pdf-placeholder,
.dwg-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 1.2rem;
  color: #666;
}

.text-content {
  h3 {
    color: $color-text-main;
    margin-bottom: 16px;
  }
}

.document-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  .version {
    background: $color-accent-flame;
    color: #fff;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 0.9rem;
  }
  
  .updated {
    color: #666;
    font-size: 0.9rem;
  }
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &.primary {
    background: $color-accent-flame;
    color: #fff;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(41, 182, 246, 0.3);
    }
  }
  
  &.secondary {
    background: #e3f2fd;
    color: $color-accent-flame;
    
    &:hover {
      background: #bbdefb;
    }
  }
}

.related-panel {
  flex: 1;
  background: #f8f9fa;
  padding: 24px;
  border-left: 1px solid #e3f2fd;
  
  h3 {
    margin: 0 0 24px 0;
    color: $color-text-main;
  }
}

.related-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.item-icon {
  font-size: 1.5rem;
}

.item-info {
  .item-title {
    font-weight: 500;
    color: $color-text-main;
  }
  
  .item-type {
    font-size: 0.9rem;
    color: #666;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: scale(0.9) translateY(32px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
</style> 