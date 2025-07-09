<template>
  <div class="hero-search">
    <div class="search-oval" @keydown="handleKeySequence">
      <input
        ref="inputRef"
        v-model="query"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="onSearch"
        :placeholder="placeholder"
        class="search-input"
        type="text"
        aria-label="Поиск нормативных документов"
      />
      
      <VoiceSearch @result="handleVoiceResult" />
      
      <span ref="flameRef" class="flame-icon" :class="{ active: focused, 'easter-egg': showEasterEgg }">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="flame-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stop-color="#29b6f6"/>
              <stop offset="1" stop-color="#ffa000"/>
            </linearGradient>
          </defs>
          <path d="M16 4C18 10 24 12 24 18C24 22 20 26 16 26C12 26 8 22 8 18C8 12 14 10 16 4Z" fill="url(#flame-gradient)"/>
        </svg>
      </span>
      
      <FlameParticles :is-active="focused" :width="64" :height="64" />
      <DragDropZone @file-uploaded="handleFileUpload" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VoiceSearch from './VoiceSearch.vue'
import FlameParticles from './FlameParticles.vue'
import DragDropZone from './DragDropZone.vue'
import { animateFlame, easterEggFlameAnimation } from '@/utils/animations'

const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref('')
const focused = ref(false)
const placeholder = 'Введите ГОСТ, СП, чертёж или инцидент…'
const inputRef = ref<HTMLInputElement>()
const flameRef = ref<HTMLElement>()
const showEasterEgg = ref(false)

// Konami Code: ↑↑↓↓←→←→BA
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'
]
let currentSequence: string[] = []

function onFocus() {
  focused.value = true
  if (flameRef.value) {
    animateFlame(flameRef.value, true)
  }
}

function onBlur() {
  focused.value = false
  if (flameRef.value) {
    animateFlame(flameRef.value, false)
  }
}

function onSearch() {
  if (query.value.trim()) {
    emit('search', query.value.trim())
  }
}

function handleVoiceResult(transcript: string) {
  query.value = transcript
  onSearch()
}

function handleFileUpload(file: File) {
  console.log('Файл загружен:', file.name)
  // TODO: отправить файл на сервер для индексации
}

function handleKeySequence(event: KeyboardEvent) {
  currentSequence.push(event.key)
  
  // Сохраняем только последние 8 клавиш
  if (currentSequence.length > konamiSequence.length) {
    currentSequence.shift()
  }
  
  // Проверяем совпадение с Konami Code
  if (currentSequence.length === konamiSequence.length) {
    const matches = currentSequence.every((key, index) => key === konamiSequence[index])
    
    if (matches) {
      triggerEasterEgg()
      currentSequence = []
    }
  }
}

function triggerEasterEgg() {
  showEasterEgg.value = true
  
  if (flameRef.value) {
    easterEggFlameAnimation(flameRef.value)
  }
  
  // Скрываем через 3 секунды
  setTimeout(() => {
    showEasterEgg.value = false
  }, 3000)
}

onMounted(() => {
  // Фокус на input при загрузке
  if (inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style lang="scss" scoped>
.hero-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}
.search-oval {
  position: relative;
  width: 600px;
  height: 64px;
  background: #fff;
  border-radius: 32px;
  box-shadow: $color-shadow-xl;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
  transition: box-shadow $transition-fast;
  overflow: hidden;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.5rem;
  background: transparent;
  color: $color-text-main;
}
.flame-icon {
  display: flex;
  align-items: center;
  margin-left: 12px;
  filter: blur(0.5px) brightness(1.1);
  transition: transform 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.6s;
}
.flame-icon.active {
  animation: flame-pulse 1.8s infinite;
  filter: blur(1.5px) brightness(1.3);
}

.flame-icon.easter-egg {
  animation: easter-egg-flame 2s ease-in-out;
  filter: hue-rotate(180deg) brightness(1.5);
}

@keyframes flame-pulse {
  0%, 100% { transform: scale(1); filter: blur(1.5px) brightness(1.3); }
  50% { transform: scale(1.08); filter: blur(2.5px) brightness(1.5); }
}

@keyframes easter-egg-flame {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.3) rotate(90deg); }
  50% { transform: scale(1.5) rotate(180deg); }
  75% { transform: scale(1.3) rotate(270deg); }
  100% { transform: scale(1) rotate(360deg); }
}
</style> 