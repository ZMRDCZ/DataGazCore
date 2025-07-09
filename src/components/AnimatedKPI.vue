<template>
  <div class="animated-kpi-bar" ref="kpiContainer">
    <!-- Фоновые огненные эффекты -->
    <div class="flame-background">
      <div v-for="i in 15" :key="i" class="bg-flame" :style="getFlameStyle(i)"></div>
    </div>

    <!-- Основные KPI показатели -->
    <div class="kpi-grid">
      <!-- Эффективность -->
      <div class="kpi-card efficiency" @mouseenter="animateKPI('efficiency')">
        <div class="kpi-icon">⚡</div>
        <div class="kpi-content">
          <div class="kpi-label">Эффективность</div>
          <div class="kpi-value">
            <span class="animated-number" ref="efficiencyRef">{{ displayValues.efficiency }}</span>
            <span class="kpi-unit">%</span>
          </div>
          <div class="kpi-trend up">↗ +2.3%</div>
        </div>
        <div class="kpi-glow efficiency-glow"></div>
        <div class="progress-ring">
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="45" class="progress-bg"/>
            <circle cx="50" cy="50" r="45" class="progress-fill" 
              :style="{ strokeDashoffset: 283 - (283 * displayValues.efficiency / 100) }"/>
          </svg>
        </div>
      </div>

      <!-- Давление -->
      <div class="kpi-card pressure" @mouseenter="animateKPI('pressure')">
        <div class="kpi-icon">🔥</div>
        <div class="kpi-content">
          <div class="kpi-label">Давление</div>
          <div class="kpi-value">
            <span class="animated-number" ref="pressureRef">{{ displayValues.pressure }}</span>
            <span class="kpi-unit">бар</span>
          </div>
          <div class="kpi-trend stable">→ стабильно</div>
        </div>
        <div class="kpi-glow pressure-glow"></div>
        <div class="pressure-gauge">
          <div class="gauge-needle" :style="{ transform: `rotate(${displayValues.pressure * 30}deg)` }"></div>
        </div>
      </div>

      <!-- Расход газа -->
      <div class="kpi-card flow" @mouseenter="animateKPI('flow')">
        <div class="kpi-icon">💨</div>
        <div class="kpi-content">
          <div class="kpi-label">Расход газа</div>
          <div class="kpi-value">
            <span class="animated-number" ref="flowRef">{{ displayValues.flow }}</span>
            <span class="kpi-unit">тыс.м³/ч</span>
          </div>
          <div class="kpi-trend up">↗ +5.7%</div>
        </div>
        <div class="kpi-glow flow-glow"></div>
        <div class="flow-animation">
          <div v-for="i in 8" :key="i" class="flow-particle" :style="getFlowParticleStyle(i)"></div>
        </div>
      </div>

      <!-- Безопасность -->
      <div class="kpi-card safety" @mouseenter="animateKPI('safety')">
        <div class="kpi-icon">🛡️</div>
        <div class="kpi-content">
          <div class="kpi-label">Безопасность</div>
          <div class="kpi-value">
            <span class="animated-number" ref="safetyRef">{{ displayValues.safety }}</span>
            <span class="kpi-unit">%</span>
          </div>
          <div class="kpi-trend up">↗ отлично</div>
        </div>
        <div class="kpi-glow safety-glow"></div>
        <div class="safety-shield">
          <div class="shield-core"></div>
          <div class="shield-rings">
            <div v-for="i in 3" :key="i" class="shield-ring" :style="{ animationDelay: `${i * 0.3}s` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Интерактивная схема подключений -->
    <svg class="connection-lines" viewBox="0 0 1200 200">
      <defs>
        <linearGradient id="connectionGradient">
          <stop offset="0%" style="stop-color:#005bbf;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#ff6600;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#005bbf;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <path d="M 150 100 Q 300 50 450 100 T 750 100 Q 900 150 1050 100" 
        stroke="url(#connectionGradient)" 
        stroke-width="3" 
        fill="none" 
        class="main-connection"/>
      
      <circle v-for="(node, i) in connectionNodes" :key="i"
        :cx="node.x" :cy="node.y" r="6" 
        fill="#ff6600" class="connection-node"
        :style="{ animationDelay: `${i * 0.2}s` }"/>
    </svg>

    <!-- Статистика в реальном времени -->
    <div class="realtime-stats">
      <div class="stat-item" v-for="stat in realtimeStats" :key="stat.id">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface KPIValues {
  efficiency: number
  pressure: number
  flow: number
  safety: number
}

interface RealtimeStat {
  id: string
  icon: string
  value: string
  label: string
}

const kpiContainer = ref<HTMLElement>()
const efficiencyRef = ref<HTMLElement>()
const pressureRef = ref<HTMLElement>()
const flowRef = ref<HTMLElement>()
const safetyRef = ref<HTMLElement>()

const targetValues: KPIValues = {
  efficiency: 98.7,
  pressure: 4.2,
  flow: 15.8,
  safety: 100
}

const displayValues = ref<KPIValues>({
  efficiency: 0,
  pressure: 0,
  flow: 0,
  safety: 0
})

const connectionNodes = [
  { x: 150, y: 100 }, { x: 300, y: 75 }, { x: 450, y: 100 },
  { x: 600, y: 100 }, { x: 750, y: 100 }, { x: 900, y: 125 }, { x: 1050, y: 100 }
]

const realtimeStats = ref<RealtimeStat[]>([
  { id: 'temp', icon: '🌡️', value: '18°C', label: 'Температура' },
  { id: 'humidity', icon: '💧', value: '65%', label: 'Влажность' },
  { id: 'speed', icon: '💨', value: '2.3м/с', label: 'Скорость' },
  { id: 'pressure', icon: '📊', value: '1.2МПа', label: 'Давление' }
])

let animationId: number

const getFlameStyle = (index: number) => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${index * 0.3}s`,
  transform: `scale(${0.5 + Math.random() * 0.5})`
})

const getFlowParticleStyle = (index: number) => ({
  animationDelay: `${index * 0.2}s`,
  left: `${10 + index * 10}%`
})

const animateKPI = (type: keyof KPIValues) => {
  const target = targetValues[type]
  const duration = 2000
  const startTime = Date.now()
  const startValue = displayValues.value[type]

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    displayValues.value[type] = Number((startValue + (target - startValue) * easeOut).toFixed(1))
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  animate()
}

const startRealtimeUpdates = () => {
  const updateStats = () => {
    realtimeStats.value.forEach(stat => {
      switch (stat.id) {
        case 'temp':
          stat.value = `${(16 + Math.random() * 4).toFixed(1)}°C`
          break
        case 'humidity':
          stat.value = `${(60 + Math.random() * 10).toFixed(0)}%`
          break
        case 'speed':
          stat.value = `${(2 + Math.random() * 0.6).toFixed(1)}м/с`
          break
        case 'pressure':
          stat.value = `${(1.1 + Math.random() * 0.2).toFixed(1)}МПа`
          break
      }
    })
    
    setTimeout(updateStats, 3000)
  }
  
  updateStats()
}

onMounted(() => {
  // Запускаем анимацию всех KPI
  Object.keys(targetValues).forEach((key, index) => {
    setTimeout(() => {
      animateKPI(key as keyof KPIValues)
    }, index * 500)
  })
  
  startRealtimeUpdates()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style lang="scss" scoped>
@import '../styles/tokens.scss';

.animated-kpi-bar {
  position: relative;
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, $color-bg-gradient-top 0%, $color-bg-gradient-bottom 100%);
  border-radius: $card-radius;
  overflow: hidden;
  padding: 30px;
  box-shadow: $color-shadow-xl;
}

// === ФОНОВЫЕ ОГНЕННЫЕ ЭФФЕКТЫ ===
.flame-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-particles;
  pointer-events: none;
}

.bg-flame {
  position: absolute;
  bottom: 0;
  width: 20px;
  height: 40px;
  background: linear-gradient(to top, $color-accent 0%, $color-accent-light 60%, transparent 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: backgroundFlame 4s ease-in-out infinite alternate;
  opacity: 0.6;
}

// === СЕТКА KPI ===
.kpi-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  height: 180px;
  z-index: $z-content;
}

.kpi-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid transparent;
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: $transition-dramatic;
  backdrop-filter: blur(10px);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px) scale(1.05);
    border-color: $color-primary-light;
    box-shadow: $color-shadow-xl, $color-glow-blue;
  }
  
  .kpi-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 24px;
    animation: iconFloat $transition-float;
  }
  
  .kpi-content {
    position: relative;
    z-index: 2;
    
    .kpi-label {
      font-size: 12px;
      color: $color-text-secondary;
      font-weight: $font-weight-medium;
      margin-bottom: 8px;
    }
    
    .kpi-value {
      display: flex;
      align-items: baseline;
      margin-bottom: 8px;
      
      .animated-number {
        font-size: 32px;
        font-weight: $font-weight-black;
        color: $color-primary;
        transition: $transition-smooth;
      }
      
      .kpi-unit {
        font-size: 14px;
        color: $color-text-light;
        margin-left: 4px;
      }
    }
    
    .kpi-trend {
      font-size: 11px;
      font-weight: $font-weight-semibold;
      
      &.up { color: #00aa00; }
      &.down { color: #ff4444; }
      &.stable { color: $color-text-secondary; }
    }
  }
  
  .kpi-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    opacity: 0;
    transition: $transition-smooth;
    pointer-events: none;
  }
}

// === СПЕЦИФИЧНЫЕ СТИЛИ KPI ===
.efficiency {
  .kpi-glow.efficiency-glow {
    background: radial-gradient(circle at center, rgba(0, 170, 0, 0.2) 0%, transparent 70%);
  }
  
  &:hover .efficiency-glow {
    opacity: 1;
    animation: efficiencyPulse $transition-pulse;
  }
}

.pressure {
  .kpi-glow.pressure-glow {
    background: radial-gradient(circle at center, rgba(255, 102, 0, 0.2) 0%, transparent 70%);
  }
  
  &:hover .pressure-glow {
    opacity: 1;
    animation: pressurePulse $transition-pulse;
  }
}

.flow {
  .kpi-glow.flow-glow {
    background: radial-gradient(circle at center, rgba(0, 91, 191, 0.2) 0%, transparent 70%);
  }
  
  &:hover .flow-glow {
    opacity: 1;
    animation: flowPulse $transition-pulse;
  }
}

.safety {
  .kpi-glow.safety-glow {
    background: radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  }
  
  &:hover .safety-glow {
    opacity: 1;
    animation: safetyPulse $transition-pulse;
  }
}

// === ПРОГРЕСС КОЛЬЦА ===
.progress-ring {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 60px;
  height: 60px;
  transform: rotate(-90deg);
  
  .progress-bg {
    stroke: rgba(0, 91, 191, 0.1);
    stroke-width: 4;
    fill: none;
  }
  
  .progress-fill {
    stroke: $color-primary;
    stroke-width: 4;
    fill: none;
    stroke-dasharray: 283;
    stroke-linecap: round;
    transition: stroke-dashoffset $transition-dramatic;
    animation: progressFill 2s ease-out;
  }
}

// === МАНОМЕТР ===
.pressure-gauge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 20px;
  border: 2px solid $color-primary-light;
  border-radius: 20px 20px 0 0;
  background: rgba(255, 255, 255, 0.8);
  
  .gauge-needle {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 2px;
    height: 15px;
    background: $color-accent;
    transform-origin: bottom center;
    transition: transform $transition-bounce;
    border-radius: 1px;
  }
}

// === АНИМАЦИЯ ПОТОКА ===
.flow-animation {
  position: absolute;
  bottom: 5px;
  left: 5px;
  width: calc(100% - 10px);
  height: 8px;
  
  .flow-particle {
    position: absolute;
    bottom: 0;
    width: 4px;
    height: 4px;
    background: $color-primary-light;
    border-radius: 50%;
    animation: flowParticle 3s linear infinite;
  }
}

// === ЩИТ БЕЗОПАСНОСТИ ===
.safety-shield {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  
  .shield-core {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: shieldCore $transition-pulse;
  }
  
  .shield-rings {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .shield-ring {
      position: absolute;
      border: 2px solid rgba(255, 215, 0, 0.4);
      border-radius: 50%;
      animation: shieldRing 3s ease-out infinite;
      
      &:nth-child(1) { width: 80%; height: 80%; top: 10%; left: 10%; }
      &:nth-child(2) { width: 90%; height: 90%; top: 5%; left: 5%; }
      &:nth-child(3) { width: 100%; height: 100%; top: 0%; left: 0%; }
    }
  }
}

// === ЛИНИИ СОЕДИНЕНИЯ ===
.connection-lines {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: $z-particles;
  
  .main-connection {
    stroke-dasharray: 20 10;
    animation: connectionFlow 4s linear infinite;
  }
  
  .connection-node {
    animation: nodesPulse $transition-pulse;
  }
}

// === СТАТИСТИКА В РЕАЛЬНОМ ВРЕМЕНИ ===
.realtime-stats {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 15px;
  z-index: $z-content;
  
  .stat-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: $transition-smooth;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: $color-shadow-medium;
    }
    
    .stat-icon {
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 11px;
      font-weight: $font-weight-bold;
      color: $color-primary;
      margin-bottom: 2px;
    }
    
    .stat-label {
      font-size: 8px;
      color: $color-text-light;
    }
    
    .stat-pulse {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 6px;
      height: 6px;
      background: #00ff00;
      border-radius: 50%;
      animation: statPulse $transition-pulse;
    }
  }
}

// === АНИМАЦИИ ===
@keyframes backgroundFlame {
  0% { transform: scale(1) rotate(-1deg); }
  50% { transform: scale(1.1) rotate(1deg); }
  100% { transform: scale(0.9) rotate(-0.5deg); }
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes efficiencyPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 170, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 170, 0, 0.6); }
}

@keyframes pressurePulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 102, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 102, 0, 0.6); }
}

@keyframes flowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 91, 191, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 91, 191, 0.6); }
}

@keyframes safetyPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
}

@keyframes progressFill {
  0% { stroke-dashoffset: 283; }
  100% { stroke-dashoffset: 0; }
}

@keyframes flowParticle {
  0% { transform: translateX(0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(200px) scale(0.5); opacity: 0; }
}

@keyframes shieldCore {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes shieldRing {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes connectionFlow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 30; }
}

@keyframes nodesPulse {
  0%, 100% { opacity: 1; r: 6; }
  50% { opacity: 0.6; r: 8; }
}

@keyframes statPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.3); }
}

// === МОБИЛЬНАЯ АДАПТАЦИЯ ===
@include mobile {
  .animated-kpi-bar {
    height: 400px;
    padding: 20px;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    height: 280px;
  }
  
  .kpi-card {
    padding: 15px;
    
    .kpi-icon {
      font-size: 20px;
    }
    
    .kpi-content .kpi-value .animated-number {
      font-size: 24px;
    }
  }
  
  .realtime-stats {
    top: 10px;
    right: 10px;
    gap: 10px;
    
    .stat-item {
      padding: 6px;
      
      .stat-icon {
        font-size: 14px;
      }
      
      .stat-value {
        font-size: 9px;
      }
      
      .stat-label {
        font-size: 7px;
      }
    }
  }
}
</style> 