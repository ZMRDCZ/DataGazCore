<template>
  <div class="morphing-shapes-container" ref="container">
    <!-- Основная область морфинга -->
    <div class="morphing-area">
      <!-- SVG с жидкими формами -->
      <svg class="liquid-canvas" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <!-- Фильтры для жидких эффектов -->
          <filter id="liquidGoo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
            <feColorMatrix in="blur" mode="matrix" 
                          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" 
                          result="goo"/>
            <feComposite in="SourceGraphic" in2="goo"/>
          </filter>
          
          <!-- Градиенты для форм -->
          <radialGradient id="morphGradient1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ff6600;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#ff0066;stop-opacity:0.2" />
          </radialGradient>
          
          <radialGradient id="morphGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#00ff88;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#0088ff;stop-opacity:0.2" />
          </radialGradient>
          
          <radialGradient id="morphGradient3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ff00ff;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#8800ff;stop-opacity:0.2" />
          </radialGradient>
        </defs>
        
        <!-- Жидкие морфирующие формы -->
        <g filter="url(#liquidGoo)" class="liquid-group">
          <path v-for="shape in morphingShapes" 
                :key="shape.id"
                :d="shape.path"
                :fill="shape.gradient"
                class="morphing-path"
                :style="{ 
                  opacity: shape.opacity,
                  transform: `scale(${shape.scale})`,
                  transformOrigin: 'center'
                }">
            <animateTransform
              attributeName="transform"
              type="rotate"
              :values="`0 ${shape.centerX} ${shape.centerY}; 360 ${shape.centerX} ${shape.centerY}; 0 ${shape.centerX} ${shape.centerY}`"
              :dur="`${shape.rotationSpeed}s`"
              repeatCount="indefinite"/>
          </path>
        </g>
        
        <!-- Интерактивные точки -->
        <g class="interactive-points">
          <circle v-for="point in interactivePoints"
                  :key="point.id"
                  :cx="point.x"
                  :cy="point.y"
                  :r="point.radius"
                  :fill="point.color"
                  class="interactive-point"
                  @mouseenter="attractPoint(point)"
                  @mouseleave="releasePoint(point)"
                  :style="{
                    filter: `drop-shadow(0 0 ${point.glow}px ${point.color})`
                  }">
          </circle>
        </g>
        
        <!-- Энергетические связи между точками -->
        <g class="energy-connections">
          <line v-for="connection in energyConnections"
                :key="connection.id"
                :x1="connection.x1"
                :y1="connection.y1"
                :x2="connection.x2"
                :y2="connection.y2"
                :stroke="connection.color"
                :stroke-width="connection.width"
                class="energy-line"
                :style="{
                  opacity: connection.opacity,
                  filter: `drop-shadow(0 0 5px ${connection.color})`
                }">
            <animate attributeName="stroke-opacity" 
                     values="0.2;1;0.2" 
                     :dur="`${connection.speed}s`" 
                     repeatCount="indefinite"/>
          </line>
        </g>
      </svg>
      
      <!-- CSS морфирующие элементы -->
      <div class="css-morphs">
        <div v-for="morph in cssMorphs"
             :key="morph.id"
             class="css-morph"
             :class="morph.type"
             :style="getCssMorphStyle(morph)"
             @mouseenter="activateMorph(morph)"
             @mouseleave="deactivateMorph(morph)">
          <div class="morph-core"></div>
          <div class="morph-halo"></div>
        </div>
      </div>
      
      <!-- Плазменные шары -->
      <div class="plasma-spheres">
        <div v-for="sphere in plasmaSpheres"
             :key="sphere.id"
             class="plasma-sphere"
             :style="getPlasmaSphereStyle(sphere)">
          <div class="plasma-core"></div>
          <div class="plasma-ring" v-for="ring in sphere.rings" :key="ring.id" :style="getRingStyle(ring)"></div>
        </div>
      </div>
      
      <!-- Квантовые вихри -->
      <div class="quantum-vortex" v-for="vortex in quantumVortices" :key="vortex.id" :style="getVortexStyle(vortex)">
        <div class="vortex-center"></div>
        <div class="vortex-arm" v-for="arm in vortex.arms" :key="arm.id" :style="getArmStyle(arm)"></div>
      </div>
    </div>
    
    <!-- Информационная панель -->
    <div class="morph-info-panel">
      <div class="info-item" v-for="info in morphInfo" :key="info.id">
        <div class="info-label">{{ info.label }}</div>
        <div class="info-value" :style="{ color: info.color }">{{ info.value }}</div>
        <div class="info-bar">
          <div class="info-fill" :style="{ width: info.percentage + '%', backgroundColor: info.color }"></div>
        </div>
      </div>
    </div>
    
    <!-- Контролы -->
    <div class="morph-controls">
      <button @click="toggleMorphMode" class="control-btn" :class="{ active: morphMode === 'fluid' }">
        💧 Жидкость
      </button>
      <button @click="toggleMorphMode" class="control-btn" :class="{ active: morphMode === 'plasma' }">
        ⚡ Плазма
      </button>
      <button @click="toggleMorphMode" class="control-btn" :class="{ active: morphMode === 'quantum' }">
        🌌 Квант
      </button>
      <button @click="resetMorphs" class="control-btn reset">
        🔄 Сброс
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface MorphingShape {
  id: number
  path: string
  gradient: string
  opacity: number
  scale: number
  centerX: number
  centerY: number
  rotationSpeed: number
}

interface InteractivePoint {
  id: number
  x: number
  y: number
  radius: number
  color: string
  glow: number
  originalX: number
  originalY: number
  vx: number
  vy: number
  isAttracted: boolean
}

interface EnergyConnection {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  width: number
  opacity: number
  speed: number
}

interface CssMorph {
  id: number
  type: string
  x: number
  y: number
  size: number
  rotation: number
  color: string
  isActive: boolean
  intensity: number
}

interface PlasmaSphere {
  id: number
  x: number
  y: number
  size: number
  energy: number
  rings: PlasmaRing[]
}

interface PlasmaRing {
  id: number
  radius: number
  opacity: number
  speed: number
}

interface QuantumVortex {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  arms: VortexArm[]
}

interface VortexArm {
  id: number
  angle: number
  length: number
  width: number
  opacity: number
}

interface MorphInfo {
  id: string
  label: string
  value: string
  color: string
  percentage: number
}

const container = ref<HTMLElement>()
const morphMode = ref<'fluid' | 'plasma' | 'quantum'>('fluid')

// Морфирующие формы
const morphingShapes = ref<MorphingShape[]>([])
const interactivePoints = ref<InteractivePoint[]>([])
const energyConnections = ref<EnergyConnection[]>([])
const cssMorphs = ref<CssMorph[]>([])
const plasmaSpheres = ref<PlasmaSphere[]>([])
const quantumVortices = ref<QuantumVortex[]>([])

// Информация о морфах
const morphInfo = ref<MorphInfo[]>([
  { id: 'energy', label: 'Энергия', value: '87%', color: '#ff6600', percentage: 87 },
  { id: 'coherence', label: 'Когерентность', value: '94%', color: '#00ff88', percentage: 94 },
  { id: 'stability', label: 'Стабильность', value: '76%', color: '#4d8fd9', percentage: 76 },
  { id: 'quantum', label: 'Квант. поле', value: '91%', color: '#ff00ff', percentage: 91 }
])

let animationFrame: number
let timeOffset = 0
let mousePosition = { x: 400, y: 300 }

onMounted(() => {
  initializeMorphs()
  startAnimation()
  
  // Добавляем обработчик мыши для интерактивности
  if (container.value) {
    container.value.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  
  if (container.value) {
    container.value.removeEventListener('mousemove', handleMouseMove)
  }
})

function initializeMorphs() {
  // Инициализация морфирующих форм (уменьшено с 3 до 2)
  for (let i = 0; i < 2; i++) {
    const centerX = 200 + i * 200
    const centerY = 200 + Math.sin(i) * 100
    
    morphingShapes.value.push({
      id: i,
      path: generateMorphPath(centerX, centerY, 80 + i * 20),
      gradient: `url(#morphGradient${i + 1})`,
      opacity: 0.7,
      scale: 1,
      centerX,
      centerY,
      rotationSpeed: 15 + i * 5
    })
  }
  
  // Инициализация интерактивных точек (уменьшено с 12 до 6)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const radius = 200
    const x = 400 + Math.cos(angle) * radius
    const y = 300 + Math.sin(angle) * radius
    
    interactivePoints.value.push({
      id: i,
      x,
      y,
      radius: 8,
      color: ['#ff6600', '#00ff88', '#ff00ff'][i % 3],
      glow: 10,
      originalX: x,
      originalY: y,
      vx: 0,
      vy: 0,
      isAttracted: false
    })
  }
  
  // Инициализация CSS морфов (уменьшено с 6 до 3)
  for (let i = 0; i < 3; i++) {
    cssMorphs.value.push({
      id: i,
      type: ['blob', 'star', 'wave'][i],
      x: Math.random() * 700 + 50,
      y: Math.random() * 500 + 50,
      size: Math.random() * 60 + 40,
      rotation: 0,
      color: ['#ff6600', '#00ff88', '#ff00ff'][i],
      isActive: false,
      intensity: Math.random()
    })
  }
  
  // Инициализация плазменных шаров (уменьшено с 4 до 2)
  for (let i = 0; i < 2; i++) {
    const rings: PlasmaRing[] = []
    for (let j = 0; j < 3; j++) { // уменьшено с 5 до 3 колец
      rings.push({
        id: j,
        radius: 20 + j * 15,
        opacity: 1 - j * 0.15,
        speed: 2 + j * 0.5
      })
    }
    
    plasmaSpheres.value.push({
      id: i,
      x: 150 + i * 150,
      y: 150 + Math.sin(i) * 100,
      size: 60,
      energy: Math.random(),
      rings
    })
  }
  
  // Инициализация квантовых вихрей (уменьшено с 3 до 1)
  for (let i = 0; i < 1; i++) {
    const arms: VortexArm[] = []
    for (let j = 0; j < 4; j++) { // уменьшено с 8 до 4 рук
      arms.push({
        id: j,
        angle: (j / 4) * Math.PI * 2,
        length: 60 + j * 10,
        width: 3 + j,
        opacity: 1 - j * 0.1
      })
    }
    
    quantumVortices.value.push({
      id: i,
      x: 200 + i * 200,
      y: 400,
      size: 80,
      rotation: 0,
      arms
    })
  }
  
  updateEnergyConnections()
}

function generateMorphPath(centerX: number, centerY: number, baseRadius: number): string {
  const points = 8
  let path = 'M'
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2
    const radius = baseRadius + Math.sin(i * 3 + timeOffset * 0.02) * 20
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    if (i === 0) {
      path += ` ${x} ${y}`
    } else {
      path += ` L ${x} ${y}`
    }
  }
  
  return path + ' Z'
}

function updateEnergyConnections() {
  energyConnections.value = []
  
  for (let i = 0; i < interactivePoints.value.length; i++) {
    for (let j = i + 1; j < interactivePoints.value.length; j++) {
      const point1 = interactivePoints.value[i]
      const point2 = interactivePoints.value[j]
      
      const distance = Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + 
        Math.pow(point1.y - point2.y, 2)
      )
      
      if (distance < 150) {
        energyConnections.value.push({
          id: `${i}-${j}`,
          x1: point1.x,
          y1: point1.y,
          x2: point2.x,
          y2: point2.y,
          color: point1.color,
          width: Math.max(1, 5 - distance / 30),
          opacity: Math.max(0.1, 1 - distance / 150),
          speed: 2 + Math.random() * 3
        })
      }
    }
  }
}

// Ограничение FPS до 30
let lastFrameTime = 0
const FPS_LIMIT = 30
const FRAME_DURATION = 1000 / FPS_LIMIT

function startAnimation() {
  function animate(currentTime: number) {
    if (currentTime - lastFrameTime < FRAME_DURATION) {
      animationFrame = requestAnimationFrame(animate)
      return
    }
    lastFrameTime = currentTime
    
    timeOffset += 2 // Увеличиваем шаг времени для компенсации меньшего FPS
    
    // Обновление морфирующих форм
    morphingShapes.value.forEach((shape, index) => {
      shape.path = generateMorphPath(shape.centerX, shape.centerY, 80 + index * 20)
      shape.scale = 1 + Math.sin(timeOffset * 0.01 + index) * 0.2
      shape.opacity = 0.5 + Math.sin(timeOffset * 0.015 + index) * 0.3
    })
    
    // Обновление интерактивных точек
    interactivePoints.value.forEach(point => {
      if (!point.isAttracted) {
        // Орбитальное движение
        const angle = timeOffset * 0.01 + point.id * 0.5
        point.x = point.originalX + Math.cos(angle) * 20
        point.y = point.originalY + Math.sin(angle) * 20
      } else {
        // Притяжение к мыши
        const dx = mousePosition.x - point.x
        const dy = mousePosition.y - point.y
        point.vx += dx * 0.001
        point.vy += dy * 0.001
        point.vx *= 0.95
        point.vy *= 0.95
        point.x += point.vx
        point.y += point.vy
      }
      
      point.glow = 10 + Math.sin(timeOffset * 0.02 + point.id) * 5
    })
    
    // Обновление CSS морфов
    cssMorphs.value.forEach(morph => {
      morph.rotation += 1 + morph.intensity
      morph.intensity = 0.5 + Math.sin(timeOffset * 0.01 + morph.id) * 0.5
      
      if (!morph.isActive) {
        morph.size = (40 + morph.id * 10) + Math.sin(timeOffset * 0.02 + morph.id) * 10
      }
    })
    
    // Обновление плазменных шаров
    plasmaSpheres.value.forEach(sphere => {
      sphere.energy = 0.5 + Math.sin(timeOffset * 0.01 + sphere.id) * 0.5
      
      sphere.rings.forEach(ring => {
        ring.opacity = (1 - ring.id * 0.15) * sphere.energy
      })
    })
    
    // Обновление квантовых вихрей
    quantumVortices.value.forEach(vortex => {
      vortex.rotation += 2
      
      vortex.arms.forEach(arm => {
        arm.length = 60 + arm.id * 10 + Math.sin(timeOffset * 0.02 + arm.id) * 15
        arm.opacity = (1 - arm.id * 0.1) * (0.5 + Math.sin(timeOffset * 0.015) * 0.5)
      })
    })
    
    // Обновление энергетических связей
    updateEnergyConnections()
    
    // Обновление информации
    updateMorphInfo()
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animationFrame = requestAnimationFrame(animate)
}

function handleMouseMove(event: MouseEvent) {
  const rect = container.value?.getBoundingClientRect()
  if (rect) {
    mousePosition.x = (event.clientX - rect.left) * (800 / rect.width)
    mousePosition.y = (event.clientY - rect.top) * (600 / rect.height)
  }
}

function attractPoint(point: InteractivePoint) {
  point.isAttracted = true
  point.radius = 12
}

function releasePoint(point: InteractivePoint) {
  point.isAttracted = false
  point.radius = 8
  point.vx = 0
  point.vy = 0
}

function activateMorph(morph: CssMorph) {
  morph.isActive = true
  morph.size *= 1.5
}

function deactivateMorph(morph: CssMorph) {
  morph.isActive = false
}

function toggleMorphMode() {
  const modes: ('fluid' | 'plasma' | 'quantum')[] = ['fluid', 'plasma', 'quantum']
  const currentIndex = modes.indexOf(morphMode.value)
  morphMode.value = modes[(currentIndex + 1) % modes.length]
}

function resetMorphs() {
  // Сброс всех анимаций к исходному состоянию
  timeOffset = 0
  
  interactivePoints.value.forEach(point => {
    point.x = point.originalX
    point.y = point.originalY
    point.vx = 0
    point.vy = 0
    point.isAttracted = false
  })
}

function updateMorphInfo() {
  morphInfo.value.forEach(info => {
    const variation = Math.sin(timeOffset * 0.01) * 10 + Math.random() * 5
    
    switch (info.id) {
      case 'energy':
        info.percentage = Math.max(0, Math.min(100, 87 + variation))
        info.value = `${Math.round(info.percentage)}%`
        break
      case 'coherence':
        info.percentage = Math.max(0, Math.min(100, 94 + variation * 0.5))
        info.value = `${Math.round(info.percentage)}%`
        break
      case 'stability':
        info.percentage = Math.max(0, Math.min(100, 76 + variation * 1.5))
        info.value = `${Math.round(info.percentage)}%`
        break
      case 'quantum':
        info.percentage = Math.max(0, Math.min(100, 91 + variation * 0.8))
        info.value = `${Math.round(info.percentage)}%`
        break
    }
  })
}

// Стили для элементов
function getCssMorphStyle(morph: CssMorph) {
  return {
    left: morph.x + 'px',
    top: morph.y + 'px',
    width: morph.size + 'px',
    height: morph.size + 'px',
    transform: `rotate(${morph.rotation}deg) scale(${morph.isActive ? 1.5 : 1})`,
    backgroundColor: morph.color,
    boxShadow: `0 0 ${20 + morph.intensity * 30}px ${morph.color}`,
    opacity: 0.7 + morph.intensity * 0.3
  }
}

function getPlasmaSphereStyle(sphere: PlasmaSphere) {
  return {
    left: sphere.x + 'px',
    top: sphere.y + 'px',
    width: sphere.size + 'px',
    height: sphere.size + 'px',
    opacity: 0.5 + sphere.energy * 0.5
  }
}

function getRingStyle(ring: PlasmaRing) {
  return {
    width: ring.radius * 2 + 'px',
    height: ring.radius * 2 + 'px',
    opacity: ring.opacity,
    animationDuration: ring.speed + 's'
  }
}

function getVortexStyle(vortex: QuantumVortex) {
  return {
    left: vortex.x + 'px',
    top: vortex.y + 'px',
    width: vortex.size + 'px',
    height: vortex.size + 'px',
    transform: `rotate(${vortex.rotation}deg)`
  }
}

function getArmStyle(arm: VortexArm) {
  return {
    width: arm.length + 'px',
    height: arm.width + 'px',
    opacity: arm.opacity,
    transform: `rotate(${arm.angle}rad)`,
    transformOrigin: '0 50%',
    left: '50%',
    top: '50%'
  }
}
</script>

<style scoped lang="scss">
.morphing-shapes-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7));
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.morphing-area {
  position: relative;
  width: 100%;
  height: 100%;
}

.liquid-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.morphing-path {
  transition: d 0.1s ease-out;
  filter: drop-shadow(0 0 10px currentColor);
}

.interactive-point {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.5);
  }
}

.energy-line {
  transition: all 0.1s ease-out;
}

.css-morphs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.css-morph {
  position: absolute;
  border-radius: 50%;
  transition: all 0.3s ease;
  pointer-events: auto;
  cursor: pointer;
  
  &.blob {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    animation: blobMorph 4s ease-in-out infinite;
  }
  
  &.star {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
  
  &.wave {
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    animation: waveMorph 3s ease-in-out infinite;
  }
  
  &.spiral {
    border-radius: 0 100% 0 100%;
    animation: spiralMorph 5s linear infinite;
  }
  
  &.diamond {
    border-radius: 0;
    transform: rotate(45deg);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  
  &.heart {
    clip-path: path('M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z');
  }
}

.plasma-spheres {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.plasma-sphere {
  position: absolute;
  border-radius: 50%;
  
  .plasma-core {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, #ffffff, #ff6600);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px #ffffff;
    animation: plasmaCore 2s ease-in-out infinite alternate;
  }
  
  .plasma-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 2px solid rgba(255, 102, 0, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: plasmaRing linear infinite;
  }
}

.quantum-vortex {
  position: absolute;
  
  .vortex-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background: radial-gradient(circle, #ff00ff, #8800ff);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px #ff00ff;
  }
  
  .vortex-arm {
    position: absolute;
    background: linear-gradient(90deg, #ff00ff, transparent);
    border-radius: 2px;
    animation: vortexArm 1s ease-in-out infinite alternate;
  }
}

.morph-info-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 15px;
  
  .info-item {
    margin-bottom: 10px;
    
    .info-label {
      font-size: 12px;
      color: #888;
      margin-bottom: 2px;
    }
    
    .info-value {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .info-bar {
      width: 120px;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
      
      .info-fill {
        height: 100%;
        transition: width 0.3s ease;
        border-radius: 2px;
      }
    }
  }
}

.morph-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  
  .control-btn {
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 12px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    &.active {
      background: linear-gradient(45deg, #ff6600, #ff0066);
      border-color: #ff6600;
    }
    
    &.reset {
      background: rgba(255, 0, 0, 0.2);
      border-color: #ff0000;
      
      &:hover {
        background: rgba(255, 0, 0, 0.4);
      }
    }
  }
}

// Анимации
@keyframes blobMorph {
  0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
  25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
  50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
  75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
}

@keyframes waveMorph {
  0%, 100% { border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; }
  50% { border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; }
}

@keyframes spiralMorph {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes plasmaCore {
  0% { box-shadow: 0 0 20px #ffffff; }
  100% { box-shadow: 0 0 40px #ff6600, 0 0 60px #ffffff; }
}

@keyframes plasmaRing {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

@keyframes vortexArm {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}
</style> 