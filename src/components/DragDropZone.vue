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
      <div class="drop-hint">
        <span>или</span>
        <button @click="triggerFileInput" class="file-input-btn">
          Выберите файл
        </button>
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
    
    <!-- Скрытый input для выбора файлов -->
    <input 
      ref="fileInput"
      type="file"
      accept=".pdf,.dwg"
      multiple
      @change="handleFileSelect"
      class="hidden-file-input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  fileDrop: [files: FileList]
  fileUploaded: [file: File]
}>()

const isDragActive = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadComplete = ref(false)
const fileInput = ref<HTMLInputElement>()

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
    emit('fileDrop', files)
    processFiles(files)
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('fileDrop', target.files)
    processFiles(target.files)
  }
}

function processFiles(files: FileList) {
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
@import '@/styles/tokens.scss';

.drag-drop-zone {
  position: relative;
  background: rgba(227, 242, 253, 0.9);
  border: 2px dashed rgba(0, 91, 191, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  transition: all $transition-smooth;
  backdrop-filter: blur(8px);
  cursor: pointer;
  
  @include mobile {
    min-height: 100px;
    border-radius: 12px;
  }
  
  &:hover {
    border-color: $color-accent;
    background: rgba(227, 242, 253, 0.95);
  }
  
  &.drag-active {
    border-color: $color-accent;
    background: rgba(227, 242, 253, 0.95);
    transform: scale(1.02);
  }
  
  &.uploading {
    background: rgba(255, 255, 255, 0.95);
    border-color: $color-accent;
  }
}

.drop-content {
  text-align: center;
  color: $color-text-main;
  padding: 20px;
  
  @include mobile {
    padding: 16px;
  }
}

.drop-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  animation: bounce 2s infinite;
  
  @include mobile {
    font-size: 2rem;
    margin-bottom: 8px;
  }
}

.drop-text {
  font-size: 1.1rem;
  font-weight: $font-weight-medium;
  margin-bottom: 12px;
  
  @include mobile {
    font-size: 1rem;
    margin-bottom: 8px;
  }
}

.drop-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  color: $color-text-light;
  
  @include mobile {
    flex-direction: column;
    gap: 4px;
    font-size: 0.8rem;
  }
  
  span {
    color: $color-text-light;
  }
}

.file-input-btn {
  background: $color-accent;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all $transition-fast;
  
  @include mobile {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
  
  &:hover {
    background: $color-accent-light;
    transform: translateY(-1px);
  }
}

.upload-progress {
  text-align: center;
  width: 100%;
  max-width: 300px;
  padding: 20px;
  
  @include mobile {
    padding: 16px;
  }
}

.progress-icon {
  font-size: 1.8rem;
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
  
  @include mobile {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
}

.progress-text {
  color: $color-text-main;
  font-weight: $font-weight-medium;
  margin-bottom: 16px;
  
  @include mobile {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e3f2fd;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  
  @include mobile {
    height: 6px;
  }
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-accent, $color-accent-light);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percent {
  font-size: 0.9rem;
  color: $color-text-light;
  font-weight: $font-weight-medium;
  
  @include mobile {
    font-size: 0.8rem;
  }
}

.upload-complete {
  text-align: center;
  padding: 20px;
  
  @include mobile {
    padding: 16px;
  }
}

.complete-icon {
  font-size: 2rem;
  margin-bottom: 12px;
  animation: successBounce 0.6s ease-out;
  
  @include mobile {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
}

.complete-text {
  color: $color-text-main;
  font-weight: $font-weight-medium;
  
  @include mobile {
    font-size: 0.9rem;
  }
}

.hidden-file-input {
  display: none;
}

// Анимации
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes successBounce {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// Мобильные оптимизации
@include mobile {
  .drag-drop-zone {
    &:active {
      transform: scale(0.98);
    }
  }
  
  .drop-content {
    .drop-hint {
      flex-direction: column;
      gap: 6px;
    }
  }
}
</style> 