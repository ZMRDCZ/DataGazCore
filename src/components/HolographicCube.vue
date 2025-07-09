<template>
  <div class="holographic-cube-container" ref="container">
    <!-- Голографическая проекция -->
    <div class="holographic-projection">
      <div class="cube-3d" ref="cube3d" @mousemove="handleMouseMove" @mouseleave="resetCube">
        <!-- Грани куба с данными -->
        <div class="cube-face front" :style="frontFaceStyle">
          <div class="data-stream">
            <div class="data-line" v-for="(line, index) in dataStream" :key="index" :style="getDataLineStyle(index)">
              {{ line }}
            </div>
          </div>
          <div class="hologram-glow"></div>
        </div>
        
        <div class="cube-face back">
          <div class="neural-network">
            <div class="neural-node" v-for="node in neuralNodes" :key="node.id" :style="getNodeStyle(node)">
              <div class="node-pulse"></div>
            </div>
            <svg class="neural-connections" viewBox="0 0 200 200">
              <path v-for="connection in neuralConnections" :key="connection.id" 
                    :d="connection.path" 
                    stroke="#00ff88" 
                    stroke-width="1" 
                    fill="none"
                    class="neural-connection">
              </path>
            </svg>
          </div>
        </div>
        
        <div class="cube-face left">
          <div class="liquid-morph" ref="liquidMorph">
            <svg viewBox="0 0 200 200" class="liquid-svg">
              <defs>
                <filter id="gooey" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"/>
                  <feComposite in="SourceGraphic" in2="goo"/>
                </filter>
              </defs>
              
              <g filter="url(#gooey)">
                <circle v-for="blob in liquidBlobs" :key="blob.id"
                        :cx="blob.x" :cy="blob.y" :r="blob.r"
                        :fill="blob.color" class="liquid-blob">
                </circle>
              </g>
            </svg>
          </div>
        </div>
        
        <div class="cube-face right">
          <div class="matrix-rain">
            <div class="matrix-column" v-for="column in matrixColumns" :key="column.id" :style="getMatrixColumnStyle(column)">
              <span v-for="char in column.chars" :key="char.id" class="matrix-char" :style="getMatrixCharStyle(char)">
                {{ char.value }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="cube-face top">
          <div class="energy-field">
            <div class="energy-wave" v-for="wave in energyWaves" :key="wave.id" :style="getEnergyWaveStyle(wave)"></div>
            <div class="energy-core"></div>
          </div>
        </div>
        
        <div class="cube-face bottom">
          <div class="quantum-grid">
            <div class="quantum-cell" v-for="cell in quantumCells" :key="cell.id" :style="getQuantumCellStyle(cell)">
              <div class="quantum-particle"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Голографические скан-линии -->
      <div class="scan-lines">
        <div class="scan-line" v-for="i in 20" :key="i" :style="getScanLineStyle(i)"></div>
      </div>
      
      <!-- Статистика в реальном времени -->
      <div class="hologram-stats">
        <div class="stat-item" v-for="stat in realtimeStats" :key="stat.id">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-graph">
            <canvas :ref="'chart-' + stat.id" width="80" height="30"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue'

interface DataNode {
  id: number
  x: number
  y: number
  size: number
  pulse: number
}

interface LiquidBlob {
  id: number
  x: number
  y: number
  r: number
  color: string
  vx: number
  vy: number
}

interface MatrixColumn {
  id: number
  x: number
  chars: MatrixChar[]
  speed: number
}

interface MatrixChar {
  id: number
  value: string
  opacity: number
  isHead: boolean
}

interface EnergyWave {
  id: number
  radius: number
  opacity: number
  delay: number
}

interface QuantumCell {
  id: number
  x: number
  y: number
  isActive: boolean
  energy: number
}

interface RealtimeStat {
  id: string
  label: string
  value: string
  color: string
  history: number[]
}

const container = ref<HTMLElement>()
const cube3d = ref<HTMLElement>()
const liquidMorph = ref<HTMLElement>()

// Состояние куба
const cubeRotation = reactive({ x: 0, y: 0, z: 0 })
const mousePosition = reactive({ x: 0, y: 0 })

// Потоки данных
const dataStream = ref<string[]>([
  '> Анализ газового потока...',
  '> Оптимизация маршрута...',
  '> Расчет давления...',
  '> Генерация спецификации...',
  '> Создание 3D модели...'
])

// Нейронная сеть
const neuralNodes = ref<DataNode[]>([])
const neuralConnections = ref<any[]>([])

// Жидкие блобы
const liquidBlobs = ref<LiquidBlob[]>([])

// Матричный дождь
const matrixColumns = ref<MatrixColumn[]>([])

// Энергетические волны
const energyWaves = ref<EnergyWave[]>([])

// Квантовая сетка
const quantumCells = ref<QuantumCell[]>([])

// Статистика в реальном времени
const realtimeStats = ref<RealtimeStat[]>([
  { id: 'pressure', label: 'Давление', value: '2.4 МПа', color: '#00ff88', history: [] },
  { id: 'flow', label: 'Поток', value: '1847 м³/ч', color: '#ff6600', history: [] },
  { id: 'efficiency', label: 'КПД', value: '94.2%', color: '#4d8fd9', history: [] }
])

let animationFrame: number
let timeOffset = 0

// Вычисляемые стили
const frontFaceStyle = computed(() => ({
  transform: `rotateY(${cubeRotation.y * 0.1}deg) rotateX(${cubeRotation.x * 0.1}deg)`,
  filter: `hue-rotate(${Math.sin(timeOffset * 0.01) * 30}deg)`
}))

onMounted(() => {
  initializeComponents()
  startAnimation()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

function initializeComponents() {
  // Инициализация нейронных узлов
  for (let i = 0; i < 15; i++) {
    neuralNodes.value.push({
      id: i,
      x: Math.random() * 180 + 10,
      y: Math.random() * 180 + 10,
      size: Math.random() * 6 + 3,
      pulse: Math.random() * Math.PI * 2
    })
  }
  
  // Создание нейронных связей
  for (let i = 0; i < neuralNodes.value.length; i++) {
    for (let j = i + 1; j < neuralNodes.value.length; j++) {
      const distance = Math.sqrt(
        Math.pow(neuralNodes.value[i].x - neuralNodes.value[j].x, 2) +
        Math.pow(neuralNodes.value[i].y - neuralNodes.value[j].y, 2)
      )
      
      if (distance < 80) {
        neuralConnections.value.push({
          id: `${i}-${j}`,
          path: `M ${neuralNodes.value[i].x} ${neuralNodes.value[i].y} L ${neuralNodes.value[j].x} ${neuralNodes.value[j].y}`
        })
      }
    }
  }
  
  // Инициализация жидких блобов
  for (let i = 0; i < 8; i++) {
    liquidBlobs.value.push({
      id: i,
      x: Math.random() * 160 + 20,
      y: Math.random() * 160 + 20,
      r: Math.random() * 15 + 10,
      color: ['#ff6600', '#00ff88', '#4d8fd9', '#ff00ff'][Math.floor(Math.random() * 4)],
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    })
  }
  
  // Инициализация матричных колонок
  for (let i = 0; i < 12; i++) {
    const chars: MatrixChar[] = []
    for (let j = 0; j < 15; j++) {
      chars.push({
        id: j,
        value: Math.random() < 0.5 ? String.fromCharCode(0x30A0 + Math.random() * 96) : Math.floor(Math.random() * 10).toString(),
        opacity: Math.random(),
        isHead: j === 0
      })
    }
    
    matrixColumns.value.push({
      id: i,
      x: i * 16,
      chars,
      speed: Math.random() * 50 + 20
    })
  }
  
  // Инициализация энергетических волн
  for (let i = 0; i < 5; i++) {
    energyWaves.value.push({
      id: i,
      radius: 0,
      opacity: 1,
      delay: i * 0.8
    })
  }
  
  // Инициализация квантовой сетки
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      quantumCells.value.push({
        id: i * 8 + j,
        x: i * 25,
        y: j * 25,
        isActive: Math.random() < 0.3,
        energy: Math.random()
      })
    }
  }
}

function startAnimation() {
  function animate() {
    timeOffset += 1
    
    // Анимация куба
    cubeRotation.x = Math.sin(timeOffset * 0.01) * 10
    cubeRotation.y = Math.cos(timeOffset * 0.008) * 15
    cubeRotation.z = Math.sin(timeOffset * 0.012) * 5
    
    // Анимация нейронных узлов
    neuralNodes.value.forEach(node => {
      node.pulse += 0.1
      node.size = 3 + Math.sin(node.pulse) * 2
    })
    
    // Анимация жидких блобов
    liquidBlobs.value.forEach(blob => {
      blob.x += blob.vx
      blob.y += blob.vy
      
      if (blob.x <= blob.r || blob.x >= 200 - blob.r) blob.vx *= -1
      if (blob.y <= blob.r || blob.y >= 200 - blob.r) blob.vy *= -1
      
      blob.x = Math.max(blob.r, Math.min(200 - blob.r, blob.x))
      blob.y = Math.max(blob.r, Math.min(200 - blob.r, blob.y))
    })
    
    // Анимация энергетических волн
    energyWaves.value.forEach(wave => {
      wave.radius = (wave.radius + 2) % 100
      wave.opacity = 1 - (wave.radius / 100)
    })
    
    // Анимация квантовых ячеек
    quantumCells.value.forEach(cell => {
      if (Math.random() < 0.02) {
        cell.isActive = !cell.isActive
      }
      cell.energy = Math.sin(timeOffset * 0.01 + cell.x * 0.1 + cell.y * 0.1) * 0.5 + 0.5
    })
    
    // Обновление статистики
    updateRealtimeStats()
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}

function handleMouseMove(event: MouseEvent) {
  const rect = cube3d.value?.getBoundingClientRect()
  if (rect) {
    mousePosition.x = (event.clientX - rect.left) / rect.width
    mousePosition.y = (event.clientY - rect.top) / rect.height
    
    cubeRotation.y += (mousePosition.x - 0.5) * 20
    cubeRotation.x += (mousePosition.y - 0.5) * 20
  }
}

function resetCube() {
  // Плавный возврат к исходному положению
}

function updateRealtimeStats() {
  realtimeStats.value.forEach(stat => {
    // Генерация новых значений
    const variation = Math.sin(timeOffset * 0.02) * 0.1 + Math.random() * 0.05
    
    switch (stat.id) {
      case 'pressure':
        const pressure = 2.4 + variation
        stat.value = `${pressure.toFixed(1)} МПа`
        stat.history.push(pressure)
        break
      case 'flow':
        const flow = 1847 + variation * 100
        stat.value = `${Math.round(flow)} м³/ч`
        stat.history.push(flow)
        break
      case 'efficiency':
        const efficiency = 94.2 + variation * 5
        stat.value = `${efficiency.toFixed(1)}%`
        stat.history.push(efficiency)
        break
    }
    
    // Ограничиваем историю
    if (stat.history.length > 50) {
      stat.history.shift()
    }
  })
}

// Стили для элементов
function getDataLineStyle(index: number) {
  return {
    animationDelay: `${index * 0.5}s`,
    opacity: Math.sin(timeOffset * 0.02 + index) * 0.3 + 0.7
  }
}

function getNodeStyle(node: DataNode) {
  return {
    left: `${node.x}px`,
    top: `${node.y}px`,
    width: `${node.size}px`,
    height: `${node.size}px`,
    transform: `scale(${1 + Math.sin(node.pulse) * 0.3})`
  }
}

function getMatrixColumnStyle(column: MatrixColumn) {
  return {
    left: `${column.x}px`,
    animationDuration: `${column.speed}s`
  }
}

function getMatrixCharStyle(char: MatrixChar) {
  return {
    opacity: char.opacity,
    color: char.isHead ? '#00ff88' : '#004400'
  }
}

function getEnergyWaveStyle(wave: EnergyWave) {
  return {
    width: `${wave.radius}px`,
    height: `${wave.radius}px`,
    opacity: wave.opacity,
    animationDelay: `${wave.delay}s`
  }
}

function getQuantumCellStyle(cell: QuantumCell) {
  return {
    left: `${cell.x}px`,
    top: `${cell.y}px`,
    opacity: cell.isActive ? cell.energy : 0.1,
    transform: `scale(${cell.isActive ? 1 + cell.energy * 0.5 : 0.5})`
  }
}

function getScanLineStyle(index: number) {
  return {
    top: `${index * 5}%`,
    animationDelay: `${index * 0.1}s`
  }
}
</script>

<style scoped lang="scss">
.holographic-cube-container {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  background: radial-gradient(circle at center, rgba(0, 255, 136, 0.1) 0%, transparent 70%);
  overflow: hidden;
}

.holographic-projection {
  position: relative;
  width: 400px;
  height: 400px;
}

.cube-3d {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 100px auto;
  transform-style: preserve-3d;
  animation: holographicFloat 6s ease-in-out infinite;
  cursor: pointer;
  
  &:hover {
    animation-play-state: paused;
  }
}

.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  backdrop-filter: blur(10px);
  overflow: hidden;
  
  &.front {
    transform: translateZ(100px);
    background: linear-gradient(45deg, rgba(0, 255, 136, 0.2), rgba(77, 143, 217, 0.2));
  }
  
  &.back {
    transform: translateZ(-100px) rotateY(180deg);
    background: rgba(255, 102, 0, 0.1);
  }
  
  &.left {
    transform: rotateY(-90deg) translateZ(100px);
    background: rgba(255, 0, 255, 0.1);
  }
  
  &.right {
    transform: rotateY(90deg) translateZ(100px);
    background: rgba(0, 255, 255, 0.1);
  }
  
  &.top {
    transform: rotateX(90deg) translateZ(100px);
    background: radial-gradient(circle, rgba(255, 255, 0, 0.2), transparent);
  }
  
  &.bottom {
    transform: rotateX(-90deg) translateZ(100px);
    background: rgba(255, 255, 255, 0.05);
  }
}

.data-stream {
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #00ff88;
  
  .data-line {
    margin-bottom: 8px;
    animation: dataFlow 2s ease-in-out infinite;
    text-shadow: 0 0 10px #00ff88;
  }
}

.hologram-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(0, 255, 136, 0.1), transparent);
  animation: hologramScan 3s linear infinite;
}

.neural-network {
  position: relative;
  width: 100%;
  height: 100%;
}

.neural-node {
  position: absolute;
  background: radial-gradient(circle, #ff6600, transparent);
  border-radius: 50%;
  
  .node-pulse {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    animation: neuralPulse 2s ease-in-out infinite;
  }
}

.neural-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .neural-connection {
    animation: connectionPulse 3s ease-in-out infinite;
  }
}

.liquid-morph {
  width: 100%;
  height: 100%;
  
  .liquid-svg {
    width: 100%;
    height: 100%;
  }
  
  .liquid-blob {
    animation: liquidFloat 4s ease-in-out infinite;
  }
}

.matrix-rain {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  .matrix-column {
    position: absolute;
    top: -100%;
    width: 15px;
    animation: matrixFall linear infinite;
    
    .matrix-char {
      display: block;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      text-align: center;
      text-shadow: 0 0 5px currentColor;
    }
  }
}

.energy-field {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .energy-wave {
    position: absolute;
    border: 2px solid rgba(255, 255, 0, 0.6);
    border-radius: 50%;
    animation: energyPulse 3s ease-out infinite;
  }
  
  .energy-core {
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, #ffff00, #ff6600);
    border-radius: 50%;
    box-shadow: 0 0 20px #ffff00;
    animation: coreGlow 2s ease-in-out infinite alternate;
  }
}

.quantum-grid {
  position: relative;
  width: 100%;
  height: 100%;
  
  .quantum-cell {
    position: absolute;
    width: 20px;
    height: 20px;
    
    .quantum-particle {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, #ffffff, transparent);
      border-radius: 50%;
      animation: quantumFlicker 1.5s ease-in-out infinite;
    }
  }
}

.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  .scan-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00ff88, transparent);
    animation: scanAnimation 4s linear infinite;
  }
}

.hologram-stats {
  position: absolute;
  top: 20px;
  right: 20px;
  
  .stat-item {
    margin-bottom: 15px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 5px;
    backdrop-filter: blur(10px);
    
    .stat-label {
      font-size: 10px;
      color: #888;
      margin-bottom: 2px;
    }
    
    .stat-value {
      font-size: 14px;
      font-weight: bold;
      text-shadow: 0 0 10px currentColor;
    }
    
    .stat-graph {
      margin-top: 5px;
      
      canvas {
        width: 100%;
        height: 30px;
      }
    }
  }
}

// Анимации
@keyframes holographicFloat {
  0%, 100% { transform: rotateX(10deg) rotateY(0deg) translateY(0px); }
  25% { transform: rotateX(15deg) rotateY(90deg) translateY(-10px); }
  50% { transform: rotateX(5deg) rotateY(180deg) translateY(5px); }
  75% { transform: rotateX(20deg) rotateY(270deg) translateY(-5px); }
}

@keyframes dataFlow {
  0% { opacity: 0.5; transform: translateX(-5px); }
  50% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0.5; transform: translateX(5px); }
}

@keyframes hologramScan {
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(300%) skewX(-20deg); }
}

@keyframes neuralPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0.4; }
}

@keyframes connectionPulse {
  0%, 100% { stroke-opacity: 0.3; }
  50% { stroke-opacity: 0.8; }
}

@keyframes liquidFloat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes matrixFall {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(300%); }
}

@keyframes energyPulse {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}

@keyframes coreGlow {
  0% { box-shadow: 0 0 20px #ffff00; }
  100% { box-shadow: 0 0 40px #ff6600, 0 0 60px #ffff00; }
}

@keyframes quantumFlicker {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes scanAnimation {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(600px); opacity: 0; }
}
</style> 