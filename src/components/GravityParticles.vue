<template>
  <div class="gravity-particles-container" ref="container" @mousemove="handleMouseMove" @mouseleave="resetGravity">
    <!-- Canvas для частиц -->
    <canvas ref="particlesCanvas" class="particles-canvas"></canvas>
    
    <!-- Гравитационные источники -->
    <div class="gravity-sources">
      <div v-for="source in gravitySources" 
           :key="source.id" 
           class="gravity-source"
           :class="source.type"
           :style="getGravitySourceStyle(source)"
           @mouseenter="activateSource(source)"
           @mouseleave="deactivateSource(source)">
        <div class="source-core"></div>
        <div class="source-field" v-for="field in source.fields" :key="field.id" :style="getFieldStyle(field)"></div>
        <div class="source-particles">
          <div v-for="orbit in source.orbitingParticles" :key="orbit.id" 
               class="orbiting-particle" 
               :style="getOrbitStyle(orbit, source)"></div>
        </div>
      </div>
    </div>
    
    <!-- Магнитные поля -->
    <svg class="magnetic-fields" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="magneticGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#ff6600;stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:#ff00ff;stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:#0088ff;stop-opacity:0.1" />
        </radialGradient>
        
        <filter id="magneticGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Магнитные линии -->
      <g class="magnetic-lines">
        <path v-for="line in magneticLines" 
              :key="line.id"
              :d="line.path"
              stroke="url(#magneticGradient)"
              stroke-width="2"
              fill="none"
              filter="url(#magneticGlow)"
              class="magnetic-line"
              :style="{ opacity: line.intensity }">
          <animate attributeName="stroke-dasharray" 
                   values="0,1000;1000,0;0,1000" 
                   :dur="`${line.speed}s`" 
                   repeatCount="indefinite"/>
        </path>
      </g>
      
      <!-- Энергетические вихри -->
      <g class="energy-vortices">
        <circle v-for="vortex in energyVortices"
                :key="vortex.id"
                :cx="vortex.x"
                :cy="vortex.y"
                :r="vortex.radius"
                fill="none"
                :stroke="vortex.color"
                stroke-width="3"
                class="energy-vortex"
                :style="{ 
                  opacity: vortex.opacity,
                  filter: `drop-shadow(0 0 10px ${vortex.color})`
                }">
          <animateTransform
            attributeName="transform"
            type="rotate"
            :values="`0 ${vortex.x} ${vortex.y}; 360 ${vortex.x} ${vortex.y}`"
            :dur="`${vortex.rotationSpeed}s`"
            repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
    
    <!-- Портал эффекты -->
    <div class="portals">
      <div v-for="portal in portals" 
           :key="portal.id"
           class="portal"
           :style="getPortalStyle(portal)">
        <div class="portal-ring" v-for="ring in portal.rings" :key="ring.id" :style="getPortalRingStyle(ring)"></div>
        <div class="portal-center"></div>
        <div class="portal-distortion"></div>
      </div>
    </div>
    
    <!-- Частицы данных -->
    <div class="data-particles">
      <div v-for="dataParticle in dataParticles" 
           :key="dataParticle.id"
           class="data-particle"
           :style="getDataParticleStyle(dataParticle)">
        <div class="data-core">{{ dataParticle.symbol }}</div>
        <div class="data-trail"></div>
      </div>
    </div>
    
    <!-- Контроллер гравитации -->
    <div class="gravity-controller">
      <div class="controller-panel">
        <div class="control-group">
          <label>Сила гравитации</label>
          <input type="range" v-model="gravityStrength" min="0" max="2" step="0.1" class="gravity-slider">
          <span class="control-value">{{ gravityStrength }}</span>
        </div>
        
        <div class="control-group">
          <label>Количество частиц</label>
          <input type="range" v-model="particleCount" min="50" max="200" step="50" class="gravity-slider">
          <span class="control-value">{{ particleCount }}</span>
        </div>
        
        <div class="control-group">
          <label>Режим</label>
          <select v-model="gravityMode" class="gravity-select">
            <option value="attract">Притяжение</option>
            <option value="repel">Отталкивание</option>
            <option value="orbit">Орбита</option>
            <option value="chaos">Хаос</option>
          </select>
        </div>
        
        <button @click="explode" class="explode-btn">💥 Взрыв</button>
        <button @click="implode" class="implode-btn">🌀 Коллапс</button>
        <button @click="resetParticles" class="reset-btn">🔄 Сброс</button>
      </div>
    </div>
    
    <!-- Индикатор энергии -->
    <div class="energy-indicator">
      <div class="energy-bar">
        <div class="energy-fill" :style="{ height: energyLevel + '%' }"></div>
      </div>
      <div class="energy-label">Энергия: {{ Math.round(energyLevel) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  mass: number
  trail: { x: number, y: number }[]
}

interface GravitySource {
  id: number
  x: number
  y: number
  mass: number
  type: string
  isActive: boolean
  fields: GravityField[]
  orbitingParticles: OrbitingParticle[]
  pulsePhase: number
}

interface GravityField {
  id: number
  radius: number
  opacity: number
  speed: number
}

interface OrbitingParticle {
  id: number
  angle: number
  radius: number
  speed: number
  size: number
  color: string
}

interface MagneticLine {
  id: number
  path: string
  intensity: number
  speed: number
}

interface EnergyVortex {
  id: number
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  rotationSpeed: number
}

interface Portal {
  id: number
  x: number
  y: number
  size: number
  rings: PortalRing[]
  intensity: number
}

interface PortalRing {
  id: number
  radius: number
  opacity: number
  rotation: number
}

interface DataParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  symbol: string
  color: string
  size: number
}

const container = ref<HTMLElement>()
const particlesCanvas = ref<HTMLCanvasElement>()

// Состояние системы
const gravityStrength = ref(1.0)
const particleCount = ref(500)
const gravityMode = ref<'attract' | 'repel' | 'orbit' | 'chaos'>('attract')
const energyLevel = ref(50)

// Физические объекты
const particles = ref<Particle[]>([])
const gravitySources = ref<GravitySource[]>([])
const magneticLines = ref<MagneticLine[]>([])
const energyVortices = ref<EnergyVortex[]>([])
const portals = ref<Portal[]>([])
const dataParticles = ref<DataParticle[]>([])

// Позиция мыши
const mousePosition = { x: 0, y: 0, isActive: false }

// Canvas контекст
let ctx: CanvasRenderingContext2D | null = null
let animationFrame: number
let timeOffset = 0

onMounted(() => {
  initializeCanvas()
  initializePhysics()
  startAnimation()
  
  // Обработчики изменения параметров
  watch(particleCount, updateParticleCount)
  watch(gravityMode, updateGravityMode)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

function initializeCanvas() {
  if (particlesCanvas.value && container.value) {
    const canvas = particlesCanvas.value
    const rect = container.value.getBoundingClientRect()
    
    canvas.width = rect.width
    canvas.height = rect.height
    
    ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.globalCompositeOperation = 'lighter'
    }
  }
}

function initializePhysics() {
  // Инициализация частиц
  createParticles()
  
  // Инициализация источников гравитации
  for (let i = 0; i < 4; i++) {
    const fields: GravityField[] = []
    const orbitingParticles: OrbitingParticle[] = []
    
    // Создание полей
    for (let j = 0; j < 5; j++) {
      fields.push({
        id: j,
        radius: 30 + j * 20,
        opacity: 1 - j * 0.15,
        speed: 2 + j * 0.5
      })
    }
    
    // Создание орбитальных частиц
    for (let j = 0; j < 8; j++) {
      orbitingParticles.push({
        id: j,
        angle: (j / 8) * Math.PI * 2,
        radius: 60 + j * 5,
        speed: 0.02 + j * 0.005,
        size: 3 + j * 0.5,
        color: ['#ff6600', '#00ff88', '#ff00ff', '#ffff00'][j % 4]
      })
    }
    
    gravitySources.value.push({
      id: i,
      x: 200 + i * 200,
      y: 200 + Math.sin(i) * 100,
      mass: 1000,
      type: ['primary', 'secondary', 'tertiary', 'quantum'][i],
      isActive: false,
      fields,
      orbitingParticles,
      pulsePhase: Math.random() * Math.PI * 2
    })
  }
  
  // Инициализация магнитных линий
  for (let i = 0; i < 12; i++) {
    magneticLines.value.push({
      id: i,
      path: generateMagneticPath(i),
      intensity: 0.3 + Math.random() * 0.7,
      speed: 3 + Math.random() * 4
    })
  }
  
  // Инициализация энергетических вихрей
  for (let i = 0; i < 6; i++) {
    energyVortices.value.push({
      id: i,
      x: Math.random() * 1200,
      y: Math.random() * 800,
      radius: 20 + Math.random() * 40,
      color: ['#ff6600', '#00ff88', '#ff00ff', '#ffff00', '#00ffff', '#ff0066'][i],
      opacity: 0.6,
      rotationSpeed: 2 + Math.random() * 6
    })
  }
  
  // Инициализация порталов
  for (let i = 0; i < 3; i++) {
    const rings: PortalRing[] = []
    for (let j = 0; j < 4; j++) {
      rings.push({
        id: j,
        radius: 20 + j * 15,
        opacity: 1 - j * 0.2,
        rotation: 0
      })
    }
    
    portals.value.push({
      id: i,
      x: 300 + i * 300,
      y: 400,
      size: 80,
      rings,
      intensity: 0.8
    })
  }
  
  // Инициализация частиц данных
  const symbols = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ', 'π', 'ρ', 'σ', 'φ', 'χ', 'ψ', 'ω']
  for (let i = 0; i < 20; i++) {
    dataParticles.value.push({
      id: i,
      x: Math.random() * 1200,
      y: Math.random() * 800,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: ['#ff6600', '#00ff88', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 4)],
      size: 12 + Math.random() * 8
    })
  }
}

function createParticles() {
  particles.value = []
  
  for (let i = 0; i < particleCount.value; i++) {
    particles.value.push({
      x: Math.random() * (container.value?.clientWidth || 1200),
      y: Math.random() * (container.value?.clientHeight || 800),
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 3 + 1,
      color: ['#ff6600', '#00ff88', '#4d8fd9', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 5)],
      life: 1,
      mass: Math.random() * 2 + 1,
      trail: []
    })
  }
}

function startAnimation() {
  function animate() {
    timeOffset += 1
    
    if (ctx && particlesCanvas.value) {
      // Очистка canvas с эффектом следа
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, particlesCanvas.value.width, particlesCanvas.value.height)
      
      // Обновление физики частиц
      updateParticles()
      
      // Рендеринг частиц
      renderParticles()
      
      // Обновление других элементов
      updateGravitySources()
      updateDataParticles()
      updatePortals()
      updateEnergyLevel()
    }
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}

function updateParticles() {
  particles.value.forEach(particle => {
    // Гравитационное воздействие источников
    gravitySources.value.forEach(source => {
      if (source.isActive) {
        const dx = source.x - particle.x
        const dy = source.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 0) {
          const force = (source.mass * particle.mass) / (distance * distance)
          const acceleration = force / particle.mass
          
          let fx = (dx / distance) * acceleration * gravityStrength.value * 0.01
          let fy = (dy / distance) * acceleration * gravityStrength.value * 0.01
          
          switch (gravityMode.value) {
            case 'attract':
              particle.vx += fx
              particle.vy += fy
              break
            case 'repel':
              particle.vx -= fx
              particle.vy -= fy
              break
            case 'orbit':
              const perpX = -dy / distance
              const perpY = dx / distance
              particle.vx += perpX * acceleration * 0.1
              particle.vy += perpY * acceleration * 0.1
              break
            case 'chaos':
              particle.vx += fx * Math.sin(timeOffset * 0.01)
              particle.vy += fy * Math.cos(timeOffset * 0.01)
              break
          }
        }
      }
    })
    
    // Влияние мыши
    if (mousePosition.isActive) {
      const dx = mousePosition.x - particle.x
      const dy = mousePosition.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 150 && distance > 0) {
        const force = 100 / (distance * distance)
        particle.vx += (dx / distance) * force * 0.1
        particle.vy += (dy / distance) * force * 0.1
      }
    }
    
    // Обновление позиции
    particle.x += particle.vx
    particle.y += particle.vy
    
    // Добавление в след
    particle.trail.push({ x: particle.x, y: particle.y })
    if (particle.trail.length > 10) {
      particle.trail.shift()
    }
    
    // Затухание скорости
    particle.vx *= 0.995
    particle.vy *= 0.995
    
    // Границы экрана
    const width = particlesCanvas.value?.width || 1200
    const height = particlesCanvas.value?.height || 800
    
    if (particle.x < 0 || particle.x > width) particle.vx *= -0.8
    if (particle.y < 0 || particle.y > height) particle.vy *= -0.8
    
    particle.x = Math.max(0, Math.min(width, particle.x))
    particle.y = Math.max(0, Math.min(height, particle.y))
  })
}

function renderParticles() {
  if (!ctx) return
  
  particles.value.forEach(particle => {
    // Рендеринг следа
    if (particle.trail.length > 1) {
      ctx.strokeStyle = particle.color + '40'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(particle.trail[0].x, particle.trail[0].y)
      
      for (let i = 1; i < particle.trail.length; i++) {
        ctx.lineTo(particle.trail[i].x, particle.trail[i].y)
      }
      
      ctx.stroke()
    }
    
    // Рендеринг частицы
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    )
    gradient.addColorStop(0, particle.color)
    gradient.addColorStop(1, particle.color + '00')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()
    
    // Блик на частице
    ctx.fillStyle = '#ffffff80'
    ctx.beginPath()
    ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.3, 0, Math.PI * 2)
    ctx.fill()
  })
}

function updateGravitySources() {
  gravitySources.value.forEach(source => {
    source.pulsePhase += 0.05
    
    // Обновление орбитальных частиц
    source.orbitingParticles.forEach(orbit => {
      orbit.angle += orbit.speed
    })
  })
}

function updateDataParticles() {
  dataParticles.value.forEach(particle => {
    particle.x += particle.vx
    particle.y += particle.vy
    
    // Отскок от границ
    const width = container.value?.clientWidth || 1200
    const height = container.value?.clientHeight || 800
    
    if (particle.x < 0 || particle.x > width) particle.vx *= -1
    if (particle.y < 0 || particle.y > height) particle.vy *= -1
    
    particle.x = Math.max(0, Math.min(width, particle.x))
    particle.y = Math.max(0, Math.min(height, particle.y))
  })
}

function updatePortals() {
  portals.value.forEach(portal => {
    portal.rings.forEach(ring => {
      ring.rotation += 1 + ring.id * 0.5
    })
    
    portal.intensity = 0.5 + Math.sin(timeOffset * 0.02) * 0.3
  })
}

function updateEnergyLevel() {
  // Расчет общей энергии системы
  let totalEnergy = 0
  
  particles.value.forEach(particle => {
    const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
    totalEnergy += velocity * particle.mass
  })
  
  energyLevel.value = Math.min(100, (totalEnergy / particles.value.length) * 10)
}

function handleMouseMove(event: MouseEvent) {
  const rect = container.value?.getBoundingClientRect()
  if (rect) {
    mousePosition.x = event.clientX - rect.left
    mousePosition.y = event.clientY - rect.top
    mousePosition.isActive = true
  }
}

function resetGravity() {
  mousePosition.isActive = false
}

function activateSource(source: GravitySource) {
  source.isActive = true
}

function deactivateSource(source: GravitySource) {
  source.isActive = false
}

function updateParticleCount() {
  createParticles()
}

function updateGravityMode() {
  // Логика смены режима
}

function explode() {
  particles.value.forEach(particle => {
    const angle = Math.random() * Math.PI * 2
    const force = Math.random() * 20 + 10
    particle.vx += Math.cos(angle) * force
    particle.vy += Math.sin(angle) * force
  })
}

function implode() {
  const centerX = (container.value?.clientWidth || 1200) / 2
  const centerY = (container.value?.clientHeight || 800) / 2
  
  particles.value.forEach(particle => {
    const dx = centerX - particle.x
    const dy = centerY - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 0) {
      const force = 15
      particle.vx += (dx / distance) * force
      particle.vy += (dy / distance) * force
    }
  })
}

function resetParticles() {
  createParticles()
}

function generateMagneticPath(index: number): string {
  const points = 10
  const amplitude = 50 + index * 10
  const frequency = 0.02 + index * 0.005
  let path = 'M'
  
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * 1200
    const y = 400 + Math.sin(x * frequency + index) * amplitude
    
    if (i === 0) {
      path += ` ${x} ${y}`
    } else {
      path += ` L ${x} ${y}`
    }
  }
  
  return path
}

// Стили для элементов
function getGravitySourceStyle(source: GravitySource) {
  const pulse = 1 + Math.sin(source.pulsePhase) * 0.2
  return {
    left: source.x + 'px',
    top: source.y + 'px',
    transform: `scale(${pulse})`,
    opacity: source.isActive ? 1 : 0.6
  }
}

function getFieldStyle(field: GravityField) {
  return {
    width: field.radius * 2 + 'px',
    height: field.radius * 2 + 'px',
    opacity: field.opacity,
    animationDuration: field.speed + 's'
  }
}

function getOrbitStyle(orbit: OrbitingParticle, source: GravitySource) {
  const x = Math.cos(orbit.angle) * orbit.radius
  const y = Math.sin(orbit.angle) * orbit.radius
  
  return {
    left: x + 'px',
    top: y + 'px',
    width: orbit.size + 'px',
    height: orbit.size + 'px',
    backgroundColor: orbit.color,
    boxShadow: `0 0 ${orbit.size * 2}px ${orbit.color}`
  }
}

function getPortalStyle(portal: Portal) {
  return {
    left: portal.x + 'px',
    top: portal.y + 'px',
    width: portal.size + 'px',
    height: portal.size + 'px',
    opacity: portal.intensity
  }
}

function getPortalRingStyle(ring: PortalRing) {
  return {
    width: ring.radius * 2 + 'px',
    height: ring.radius * 2 + 'px',
    opacity: ring.opacity,
    transform: `rotate(${ring.rotation}deg)`
  }
}

function getDataParticleStyle(particle: DataParticle) {
  return {
    left: particle.x + 'px',
    top: particle.y + 'px',
    fontSize: particle.size + 'px',
    color: particle.color,
    textShadow: `0 0 10px ${particle.color}`
  }
}
</script>

<style scoped lang="scss">
.gravity-particles-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.8));
  overflow: hidden;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: crosshair;
}

.particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.gravity-sources {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gravity-source {
  position: absolute;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  
  &.primary .source-core {
    background: radial-gradient(circle, #ff6600, #ff0066);
    box-shadow: 0 0 30px #ff6600;
  }
  
  &.secondary .source-core {
    background: radial-gradient(circle, #00ff88, #0088ff);
    box-shadow: 0 0 30px #00ff88;
  }
  
  &.tertiary .source-core {
    background: radial-gradient(circle, #ff00ff, #8800ff);
    box-shadow: 0 0 30px #ff00ff;
  }
  
  &.quantum .source-core {
    background: radial-gradient(circle, #ffff00, #ff6600);
    box-shadow: 0 0 30px #ffff00;
  }
}

.source-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: sourceGlow 2s ease-in-out infinite alternate;
}

.source-field {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(255, 102, 0, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: fieldPulse linear infinite;
}

.source-particles {
  position: relative;
  width: 100%;
  height: 100%;
}

.orbiting-particle {
  position: absolute;
  border-radius: 50%;
  animation: particleOrbit 0.1s linear infinite;
}

.magnetic-fields {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.magnetic-line {
  stroke-dasharray: 5,5;
}

.energy-vortex {
  stroke-dasharray: 10,5;
}

.portals {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.portal {
  position: absolute;
  transform: translate(-50%, -50%);
  
  .portal-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 2px solid rgba(0, 255, 136, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: portalSpin linear infinite;
  }
  
  .portal-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background: radial-gradient(circle, #ffffff, transparent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: portalCore 1s ease-in-out infinite alternate;
  }
  
  .portal-distortion {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    background: conic-gradient(from 0deg, transparent, rgba(0, 255, 136, 0.2), transparent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: portalDistortion 3s linear infinite;
  }
}

.data-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.data-particle {
  position: absolute;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  transform: translate(-50%, -50%);
  
  .data-core {
    animation: dataGlow 2s ease-in-out infinite alternate;
  }
  
  .data-trail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, currentColor, transparent);
    opacity: 0.3;
    animation: trailPulse 1s ease-in-out infinite;
  }
}

.gravity-controller {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 15px;
  
  .controller-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .control-group {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #ccc;
    
    label {
      min-width: 120px;
    }
    
    .control-value {
      min-width: 40px;
      text-align: right;
      color: #fff;
      font-weight: bold;
    }
  }
  
  .gravity-slider, .gravity-select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    color: white;
    padding: 5px;
  }
  
  .explode-btn, .implode-btn, .reset-btn {
    padding: 8px 12px;
    background: rgba(255, 102, 0, 0.2);
    border: 1px solid #ff6600;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 11px;
    
    &:hover {
      background: rgba(255, 102, 0, 0.4);
      transform: translateY(-1px);
    }
  }
  
  .implode-btn {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
    
    &:hover {
      background: rgba(0, 255, 136, 0.4);
    }
  }
  
  .reset-btn {
    background: rgba(255, 0, 102, 0.2);
    border-color: #ff0066;
    
    &:hover {
      background: rgba(255, 0, 102, 0.4);
    }
  }
}

.energy-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  
  .energy-bar {
    width: 20px;
    height: 150px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    overflow: hidden;
    
    .energy-fill {
      width: 100%;
      background: linear-gradient(to top, #ff0066, #ff6600, #ffff00);
      border-radius: 8px;
      transition: height 0.3s ease;
      margin-top: auto;
    }
  }
  
  .energy-label {
    margin-top: 10px;
    font-size: 10px;
    color: #ccc;
    text-align: center;
    transform: rotate(-90deg);
    transform-origin: center;
    white-space: nowrap;
  }
}

// Анимации
@keyframes sourceGlow {
  0% { box-shadow: 0 0 20px currentColor; }
  100% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
}

@keyframes fieldPulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.2; }
}

@keyframes particleOrbit {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes portalSpin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes portalCore {
  0% { box-shadow: 0 0 10px #ffffff; }
  100% { box-shadow: 0 0 30px #00ff88, 0 0 50px #ffffff; }
}

@keyframes portalDistortion {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes dataGlow {
  0% { filter: brightness(1); }
  100% { filter: brightness(1.5) saturate(1.3); }
}

@keyframes trailPulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
</style> 