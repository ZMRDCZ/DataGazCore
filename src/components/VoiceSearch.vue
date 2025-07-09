<template>
  <button 
    @click="toggleVoiceSearch"
    :class="{ active: isListening }"
    class="voice-search-btn"
    :title="isListening ? 'Остановить запись' : 'Голосовой поиск'"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path 
        v-if="!isListening"
        d="M12 1C13.1 1 14 1.9 14 3V10C14 11.1 13.1 12 12 12S10 11.1 10 10V3C10 1.9 10.9 1 12 1ZM19 10V11C19 15.4 15.4 19 11 19S3 15.4 3 11V10H5V11C5 14.3 7.7 17 11 17S17 14.3 17 11V10H19ZM11 22H13V20H11V22Z"
        fill="currentColor"
      />
      <circle 
        v-else
        cx="12" 
        cy="12" 
        r="8" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
        class="listening-pulse"
      />
    </svg>
    <span v-if="isListening" class="listening-text">Слушаю...</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  result: [text: string]
}>()

const isListening = ref(false)
// Используем any для кроссбраузерности и устранения ошибок TS
const recognition = ref<any>(null)

let SpeechRecognition: any = null

onMounted(() => {
  // Проверяем поддержку Web Speech API
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    recognition.value = new SpeechRecognition()
    if (recognition.value) {
      recognition.value.continuous = false
      recognition.value.interimResults = false
      recognition.value.lang = 'ru-RU'
      
      recognition.value.onstart = () => {
        isListening.value = true
      }
      
      recognition.value.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        emit('result', transcript)
        isListening.value = false
      }
      
      recognition.value.onerror = (event: any) => {
        console.error('Ошибка распознавания речи:', event.error)
        isListening.value = false
      }
      
      recognition.value.onend = () => {
        isListening.value = false
      }
    }
  }
})

onUnmounted(() => {
  if (recognition.value) {
    recognition.value.stop()
  }
})

function toggleVoiceSearch() {
  if (!recognition.value) {
    alert('Голосовой поиск не поддерживается в вашем браузере')
    return
  }
  
  if (isListening.value) {
    recognition.value.stop()
  } else {
    recognition.value.start()
  }
}
</script>

<style lang="scss" scoped>
.voice-search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: #e3f2fd;
  color: $color-accent-flame;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #bbdefb;
    transform: scale(1.05);
  }
  
  &.active {
    background: $color-accent-flame;
    color: #fff;
    animation: voice-pulse 1.5s infinite;
  }
}

.listening-pulse {
  animation: pulse 1s infinite;
}

.listening-text {
  font-size: 0.9rem;
  font-weight: 500;
}

@keyframes voice-pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(41, 182, 246, 0.4);
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(41, 182, 246, 0);
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.1);
  }
}
</style> 