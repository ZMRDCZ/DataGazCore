<template>
  <Teleport to="body">
    <div 
      v-if="isVisible" 
      class="modal-overlay"
      @click="closeModal"
      :style="overlayStyle"
    >
      <div 
        class="modal-container"
        @click.stop
        :style="containerStyle"
      >
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="title-icon">📊</span>
            Граф знаний
          </h2>
          <button 
            class="close-button"
            @click="closeModal"
            aria-label="Закрыть"
          >
            <span class="close-icon">✕</span>
          </button>
        </div>
        
        <div class="modal-content">
          <KnowledgeGraph class="modal-graph" />
          
          <div class="graph-legend">
            <h3 class="legend-title">Типы узлов</h3>
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-color standard"></div>
                <span>Нормативы</span>
              </div>
              <div class="legend-item">
                <div class="legend-color equipment"></div>
                <span>Оборудование</span>
              </div>
              <div class="legend-item">
                <div class="legend-color drawing"></div>
                <span>Чертежи</span>
              </div>
              <div class="legend-item">
                <div class="legend-color incident"></div>
                <span>Инциденты</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="footer-info">
            <span class="info-text">
              💡 Наведите курсор на узел для подробной информации
            </span>
          </div>
          <button 
            class="action-button"
            @click="exportGraph"
          >
            <span class="button-icon">📤</span>
            Экспорт
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import KnowledgeGraph from '@/components/KnowledgeGraph.vue'

interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const animationPhase = ref<'entering' | 'visible' | 'leaving'>('entering')
const gasParticles = ref<Array<{ x: number; y: number; opacity: number }>>([])

// Computed styles для газового эффекта появления
const overlayStyle = computed(() => {
  const baseStyle = {
    transition: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
  
  switch (animationPhase.value) {
    case 'entering':
      return {
        ...baseStyle,
        opacity: '0',
        backdropFilter: 'blur(0px)'
      }
    case 'visible':
      return {
        ...baseStyle,
        opacity: '1',
        backdropFilter: 'blur(20px)'
      }
    case 'leaving':
      return {
        ...baseStyle,
        opacity: '0',
        backdropFilter: 'blur(0px)'
      }
  }
})

const containerStyle = computed(() => {
  const baseStyle = {
    transition: 'all 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
  
  switch (animationPhase.value) {
    case 'entering':
      return {
        ...baseStyle,
        transform: 'scale(0.8) translateY(50px)',
        opacity: '0'
      }
    case 'visible':
      return {
        ...baseStyle,
        transform: 'scale(1) translateY(0)',
        opacity: '1'
      }
    case 'leaving':
      return {
        ...baseStyle,
        transform: 'scale(0.9) translateY(-30px)',
        opacity: '0'
      }
  }
})

function closeModal() {
  animationPhase.value = 'leaving'
  setTimeout(() => {
    emit('close')
  }, 400)
}

function exportGraph() {
  // TODO: Реализовать экспорт графа
  console.log('Экспорт графа знаний')
}

function generateGasParticles() {
  gasParticles.value = Array.from({ length: 20 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.2
  }))
}

// Запускаем анимацию появления при открытии модала
watch(() => props.isVisible, async (visible) => {
  if (visible) {
    animationPhase.value = 'entering'
    generateGasParticles()
    
    await nextTick()
    setTimeout(() => {
      animationPhase.value = 'visible'
    }, 50)
  }
})

// Закрытие по Escape
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isVisible) {
    closeModal()
  }
}

// Добавляем слушатель клавиатуры
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-overlay;
  z-index: $z-modal;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-container {
  background: $color-card-bg;
  border-radius: $card-radius;
  box-shadow: $color-shadow-xl;
  max-width: 1000px;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  border: 1px solid $color-card-border;
  backdrop-filter: blur(20px);
  
  // Газовый эффект границы
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, $color-accent, $color-accent-light, $color-accent);
    border-radius: $card-radius;
    z-index: -1;
    opacity: 0.6;
    filter: blur(8px);
    animation: gasGlow 3s ease-in-out infinite alternate;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid $color-card-border;
  background: linear-gradient(135deg, rgba(41, 182, 246, 0.05) 0%, rgba(255, 160, 0, 0.05) 100%);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: $font-weight-semibold;
  color: $color-text-main;
  margin: 0;
}

.title-icon {
  font-size: 1.75rem;
  animation: float 2s ease-in-out infinite;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    background: rgba(255, 87, 87, 0.1);
    transform: scale(1.1);
  }
}

.close-icon {
  font-size: 16px;
  color: $color-text-secondary;
  font-weight: bold;
}

.modal-content {
  display: flex;
  height: 500px;
  position: relative;
}

.modal-graph {
  flex: 1;
  
  :deep(.knowledge-graph) {
    height: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }
}

.graph-legend {
  width: 200px;
  padding: 24px;
  background: linear-gradient(180deg, rgba(248, 249, 250, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%);
  border-left: 1px solid $color-card-border;
  backdrop-filter: blur(10px);
}

.legend-title {
  font-size: 1rem;
  font-weight: $font-weight-semibold;
  color: $color-text-main;
  margin-bottom: 16px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: $color-text-secondary;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  &.standard {
    background: #29b6f6;
  }
  
  &.equipment {
    background: #ffa726;
  }
  
  &.drawing {
    background: #66bb6a;
  }
  
  &.incident {
    background: #ff7043;
  }
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  border-top: 1px solid $color-card-border;
  background: rgba(248, 249, 250, 0.5);
}

.footer-info {
  display: flex;
  align-items: center;
}

.info-text {
  font-size: 0.875rem;
  color: $color-text-light;
  font-style: italic;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, $color-accent-flame 0%, $color-accent-flame-end 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-smooth;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $color-shadow-soft;
  }
}

.button-icon {
  font-size: 1rem;
}

// === ANIMATIONS ===
@keyframes gasGlow {
  0% {
    opacity: 0.4;
    filter: blur(8px);
  }
  100% {
    opacity: 0.8;
    filter: blur(4px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

// === RESPONSIVE ===
@include mobile {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    margin: 0;
    max-height: calc(100vh - 20px);
    border-radius: $card-radius-mobile;
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .modal-content {
    flex-direction: column;
    height: auto;
  }
  
  .graph-legend {
    width: 100%;
    padding: 20px 24px;
    border-left: none;
    border-top: 1px solid $color-card-border;
  }
  
  .modal-graph {
    height: 300px;
  }
  
  .modal-footer {
    padding: 16px 24px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .footer-info {
    justify-content: center;
    margin-bottom: 8px;
  }
  
  .action-button {
    justify-content: center;
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-container::before {
    animation: none;
  }
  
  .title-icon {
    animation: none;
  }
  
  .action-button:hover {
    transform: none;
  }
}
</style> 