<template>
  <div class="hero-search">
    <div class="search-container">
      <!-- Основная поисковая строка -->
      <div class="search-input-wrapper">
        <div class="search-icon">🔍</div>
        <input 
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Введите ГОСТ, СП, чертёж или инцидент…"
          @input="handleInput"
          @keyup.enter="performSearch"
          @focus="handleFocus"
          @blur="handleBlur"
          :class="{ focused: isFocused }"
        />
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-btn"
          title="Очистить"
        >
          ✕
        </button>
        <VoiceSearch 
          v-if="showVoiceSearch"
          @result="handleVoiceResult"
          class="voice-search"
        />
      </div>
      
      <!-- Быстрые примеры поиска -->
      <div v-if="showExamples" class="search-examples">
        <div class="examples-label">Попробуйте:</div>
        <div class="examples-list">
          <button 
            v-for="example in searchExamples" 
            :key="example"
            @click="searchQuery = example; performSearch()"
            class="example-chip"
          >
            {{ example }}
          </button>
        </div>
      </div>
      
      <!-- Drag & Drop зона -->
      <DragDropZone 
        v-if="showDragDrop"
        @file-drop="handleFileDrop"
        class="drag-drop-zone"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import VoiceSearch from './VoiceSearch.vue'
import DragDropZone from './DragDropZone.vue'

const emit = defineEmits<{
  search: [query: string]
  fileDrop: [files: FileList]
}>()

// Состояние
const searchQuery = ref('')
const isFocused = ref(false)
const showExamples = ref(true)
const showVoiceSearch = ref(true)
const showDragDrop = ref(false)

// Примеры поиска
const searchExamples = ref([
  'СП 62.13330-2021',
  'ГОСТ 5542-2014',
  'Инцидент ГРС-12',
  'Регуляторы давления'
])

// Вычисляемые свойства
const hasQuery = computed(() => searchQuery.value.trim().length > 0)

// Методы
function handleInput() {
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
  if (!hasQuery.value) return
  emit('search', searchQuery.value.trim())
}

function clearSearch() {
  searchQuery.value = ''
  showExamples.value = true
}

function handleFocus() {
  isFocused.value = true
  showExamples.value = true
}

function handleBlur() {
  isFocused.value = false
  // Скрываем примеры через небольшую задержку
  setTimeout(() => {
    if (!isFocused.value) {
      showExamples.value = false
    }
  }, 200)
}

function handleVoiceResult(text: string) {
  searchQuery.value = text
  performSearch()
}

function handleFileDrop(files: FileList) {
  emit('fileDrop', files)
}

// Жизненный цикл
onMounted(() => {
  // Проверяем поддержку голосового поиска
  showVoiceSearch.value = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  
  // Проверяем поддержку drag & drop
  showDragDrop.value = 'ondrop' in window
})

onUnmounted(() => {
  // Очистка
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.hero-search {
  width: 100%;
  max-width: $search-oval-width;
  margin: 0 auto;
  
  @include mobile {
    max-width: $search-oval-width-mobile;
  }
}

.search-container {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: $search-oval-height / 2;
  box-shadow: $color-shadow-medium;
  border: 2px solid transparent;
  transition: all $transition-smooth;
  backdrop-filter: blur(10px);
  
  @include mobile {
    border-radius: $search-oval-height-mobile / 2;
    height: $search-oval-height-mobile;
  }
  
  &:hover {
    box-shadow: $color-shadow-xl;
    transform: translateY(-2px);
  }
  
  &.focused {
    border-color: $color-accent;
    box-shadow: $color-glow-orange;
  }
}

.search-icon {
  padding: 0 20px;
  font-size: 1.2rem;
  color: $color-text-light;
  transition: color $transition-fast;
  
  @include mobile {
    padding: 0 16px;
    font-size: 1rem;
  }
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 20px 0;
  font-size: 1.1rem;
  color: $color-text-main;
  outline: none;
  
  @include mobile {
    padding: 16px 0;
    font-size: 1rem;
  }
  
  &::placeholder {
    color: $color-text-light;
    opacity: 0.7;
  }
  
  &:focus::placeholder {
    opacity: 0.5;
  }
}

.clear-btn {
  padding: 8px 16px;
  background: none;
  border: none;
  color: $color-text-light;
  cursor: pointer;
  border-radius: 50%;
  transition: all $transition-fast;
  
  @include mobile {
    padding: 6px 12px;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: $color-text-main;
  }
}

.voice-search {
  margin-right: 16px;
  
  @include mobile {
    margin-right: 12px;
  }
}

.search-examples {
  margin-top: 20px;
  animation: fadeInUp $transition-smooth;
  
  @include mobile {
    margin-top: 16px;
  }
}

.examples-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
  text-align: center;
  
  @include mobile {
    font-size: 0.8rem;
    margin-bottom: 8px;
  }
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  
  @include mobile {
    gap: 6px;
  }
}

.example-chip {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all $transition-fast;
  backdrop-filter: blur(10px);
  
  @include mobile {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.drag-drop-zone {
  margin-top: 16px;
  
  @include mobile {
    margin-top: 12px;
  }
}

// Анимации
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Мобильные оптимизации
@include mobile {
  .search-input-wrapper {
    min-height: $search-oval-height-mobile;
  }
  
  .search-examples {
    .examples-list {
      justify-content: flex-start;
      overflow-x: auto;
      padding-bottom: 4px;
      
      &::-webkit-scrollbar {
        height: 2px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 1px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 1px;
      }
    }
  }
}

// Планшетные оптимизации
@include tablet {
  .hero-search {
    max-width: $search-oval-width-tablet;
  }
  
  .search-input-wrapper {
    height: $search-oval-height-tablet;
  }
}
</style> 