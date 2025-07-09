<template>
  <div 
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    :class="{ 
      'drag-active': isDragActive,
      'uploading': isUploading 
    }"
    class="drag-drop-zone"
  >
    <div v-if="!isUploading" class="drop-content">
      <div class="drop-icon">📁</div>
      <div class="drop-text">
        <span v-if="!isDragActive">Перетащите PDF/DWG файлы сюда</span>
        <span v-else>Отпустите для загрузки</span>
      </div>
    </div>
    
    <div v-if="isUploading" class="upload-progress">
      <div class="progress-icon">⚡</div>
      <div class="progress-text">Индексируем документ...</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <div class="progress-percent">{{ uploadProgress }}%</div>
    </div>
    
    <div v-if="uploadComplete" class="upload-complete">
      <div class="complete-icon">✅</div>
      <div class="complete-text">Документ успешно добавлен в базу знаний</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  fileUploaded: [file: File]
}>()

const isDragActive = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadComplete = ref(false)

let dragCounter = 0

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  dragCounter++
  isDragActive.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  dragCounter--
  if (dragCounter === 0) {
    isDragActive.value = false
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragActive.value = false
  dragCounter = 0
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    
    // Проверяем тип файла
    const validTypes = ['application/pdf', 'image/vnd.dwg', '.dwg']
    const isValidType = validTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith('.dwg')
    )
    
    if (!isValidType) {
      alert('Поддерживаются только PDF и DWG файлы')
      return
    }
    
    uploadFile(file)
  }
}

async function uploadFile(file: File) {
  isUploading.value = true
  uploadProgress.value = 0
  uploadComplete.value = false
  
  // Имитация загрузки с прогрессом
  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 15
    
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)
      
      setTimeout(() => {
        isUploading.value = false
        uploadComplete.value = true
        emit('fileUploaded', file)
        
        // Скрываем сообщение о завершении через 3 секунды
        setTimeout(() => {
          uploadComplete.value = false
        }, 3000)
      }, 500)
    }
  }, 200)
}
</script>

<style lang="scss" scoped>
.drag-drop-zone {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(227, 242, 253, 0.9);
  border: 2px dashed transparent;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  
  &.drag-active {
    opacity: 1;
    pointer-events: all;
    border-color: $color-accent-flame;
    background: rgba(227, 242, 253, 0.95);
  }
  
  &.uploading {
    opacity: 1;
    pointer-events: all;
    background: rgba(255, 255, 255, 0.95);
  }
}

.drop-content {
  text-align: center;
  color: $color-accent-flame;
}

.drop-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  animation: bounce 2s infinite;
}

.drop-text {
  font-size: 1.2rem;
  font-weight: 500;
}

.upload-progress {
  text-align: center;
  width: 300px;
}

.progress-icon {
  font-size: 2rem;
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
}

.progress-text {
  color: $color-text-main;
  font-weight: 500;
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e3f2fd;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-accent-flame, $color-accent-flame-end);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percent {
  color: $color-accent-flame;
  font-weight: 600;
}

.upload-complete {
  text-align: center;
  color: #4caf50;
}

.complete-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  animation: success-bounce 0.6s ease;
}

.complete-text {
  font-size: 1.1rem;
  font-weight: 500;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes success-bounce {
  0% { transform: scale(0.3); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style> 