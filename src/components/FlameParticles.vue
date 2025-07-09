<template>
  <div class="flame-particles-container" ref="container">
    <!-- Основные газовые факелы -->
    <div class="main-flames">
      <div 
        v-for="flame in mainFlames" 
        :key="flame.id"
        class="flame-main"
        :style="getFlameStyle(flame)"
      >
        <div class="flame-core"></div>
        <div class="flame-glow"></div>
        <div class="flame-spark" v-for="spark in flame.sparks" :key="spark.id" :style="getSparkStyle(spark)"></div>
      </div>
    </div>

    <!-- Газовые частицы -->
    <div class="gas-particles">
      <div 
        v-for="particle in gasParticles" 
        :key="particle.id"
        class="gas-particle"
        :style="getParticleStyle(particle)"
      ></div>
    </div>

    <!-- Интерактивные газовые трубы -->
    <svg class="gas-pipes" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#005bbf;stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:#4d8fd9;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:#e6f3ff;stop-opacity:0.4" />
        </linearGradient>
        
        <linearGradient id="gasFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff6600;stop-opacity:0" />
          <stop offset="30%" style="stop-color:#ff8533;stop-opacity:0.6" />
          <stop offset="70%" style="stop-color:#ffcc99;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#ff6600;stop-opacity:0" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 0; 1400 0; 0 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </linearGradient>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Основная трубопроводная сеть -->
      <g class="pipe-network">
        <!-- Горизонтальные магистрали -->
        <path 
          d="M 50 200 Q 350 180 700 200 T 1350 200" 
          stroke="url(#pipeGradient)" 
          stroke-width="8" 
          fill="none"
          filter="url(#glow)"
          class="pipe-main animated-pipe"
        />
        
        <path 
          d="M 50 400 Q 350 380 700 400 T 1350 400" 
          stroke="url(#pipeGradient)" 
          stroke-width="6" 
          fill="none"
          filter="url(#glow)"
          class="pipe-secondary animated-pipe"
        />

        <path 
          d="M 50 600 Q 350 580 700 600 T 1350 600" 
          stroke="url(#pipeGradient)" 
          stroke-width="4" 
          fill="none"
          filter="url(#glow)"
          class="pipe-tertiary animated-pipe"
        />

        <!-- Вертикальные соединения -->
        <path 
          v-for="(connection, index) in verticalConnections" 
          :key="'vertical-' + index"
          :d="connection.path" 
          stroke="url(#pipeGradient)" 
          stroke-width="4" 
          fill="none"
          filter="url(#glow)"
          class="pipe-connection"
          :style="{ animationDelay: connection.delay }"
        />

        <!-- Газовые клапаны -->
        <g v-for="(valve, index) in gasValves" :key="'valve-' + index" class="gas-valve" :transform="`translate(${valve.x}, ${valve.y})`">
          <circle r="12" fill="#005bbf" stroke="#ff6600" stroke-width="3" class="valve-body"/>
          <circle r="6" fill="#ff6600" class="valve-core pulse-animation"/>
          <text x="0" y="25" text-anchor="middle" fill="#003876" font-size="10" font-weight="bold">{{ valve.label }}</text>
        </g>
      </g>

      <!-- Поток газа внутри труб -->
      <path 
        d="M 50 200 Q 350 180 700 200 T 1350 200" 
        stroke="url(#gasFlow)" 
        stroke-width="4" 
        fill="none"
        class="gas-flow"
      />
    </svg>

    <!-- Интерактивные газометры -->
    <div class="gas-meters">
      <div 
        v-for="meter in gasMeters" 
        :key="meter.id"
        class="gas-meter"
        :style="getMeterStyle(meter)"
        @mouseenter="animateMeter(meter)"
        @mouseleave="resetMeter(meter)"
      >
        <div class="meter-display">
          <div class="meter-value">{{ meter.currentValue.toFixed(1) }}</div>
          <div class="meter-unit">{{ meter.unit }}</div>
        </div>
        <div class="meter-indicator" :style="{ transform: `rotate(${meter.indicatorAngle}deg)` }"></div>
        <div class="meter-glow" :class="{ active: meter.isActive }"></div>
      </div>
    </div>

    <!-- Полноэкранные фоновые частицы -->
    <div class="background-particles">
      <div 
        v-for="bgParticle in backgroundParticles" 
        :key="bgParticle.id"
        class="bg-particle"
        :style="getBgParticleStyle(bgParticle)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Flame {
  id: number
  x: number
  y: number
  size: number
  intensity: number
  sparks: Spark[]
}

interface Spark {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

interface GasParticle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  life: number
}

interface GasMeter {
  id: number
  x: number
  y: number
  targetValue: number
  currentValue: number
  unit: string
  indicatorAngle: number
  isActive: boolean
}

interface BackgroundParticle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

// Реактивные данные
const container = ref<HTMLElement>()
const mainFlames = ref<Flame[]>([])
const gasParticles = ref<GasParticle[]>([])
const gasMeters = ref<GasMeter[]>([])
const backgroundParticles = ref<BackgroundParticle[]>([])

// Статические данные для труб
const verticalConnections = [
  { path: "M 200 200 L 200 400", delay: "0.5s" },
  { path: "M 400 200 L 400 600", delay: "1s" },
  { path: "M 700 200 L 700 400", delay: "1.5s" },
  { path: "M 1000 200 L 1000 600", delay: "2s" },
  { path: "M 1200 400 L 1200 600", delay: "2.5s" }
]

const gasValves = [
  { x: 200, y: 200, label: "ГРУ-1" },
  { x: 700, y: 200, label: "ГРУ-2" },
  { x: 1200, y: 200, label: "ГРУ-3" },
  { x: 400, y: 400, label: "ГРП-1" },
  { x: 1000, y: 600, label: "ГРП-2" }
]

let animationId: number

// Создание огненных факелов
const createMainFlames = () => {
  for (let i = 0; i < 3; i++) { // было 5, стало 3
    const flame: Flame = {
      id: i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight - 100 - Math.random() * 200,
      size: 30 + Math.random() * 50,
      intensity: 0.7 + Math.random() * 0.3,
      sparks: []
    }
    // Создаем искры для каждого факела
    for (let j = 0; j < 4; j++) { // было 8, стало 4
      flame.sparks.push({
        id: j,
        x: (Math.random() - 0.5) * 60,
        y: -20 - Math.random() * 40,
        size: 2 + Math.random() * 4,
        opacity: 0.6 + Math.random() * 0.4
      })
    }
    mainFlames.value.push(flame)
  }
}

// Создание газовых частиц
const createGasParticles = () => {
  for (let i = 0; i < 50; i++) { // было 150, стало 50
    gasParticles.value.push({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 2,
      speedY: -0.5 - Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      life: 1
    })
  }
}

// Создание газометров
const createGasMeters = () => {
  const meters = [
    { x: 150, y: 150, targetValue: 2.5, unit: "бар" },
    { x: 650, y: 150, targetValue: 4.2, unit: "м³/ч" },
    { x: 1150, y: 150, targetValue: 98.7, unit: "%" },
    { x: 350, y: 350, targetValue: 1.8, unit: "бар" },
    { x: 950, y: 550, targetValue: 3.6, unit: "м³/ч" }
  ]

  meters.forEach((meter, index) => {
    gasMeters.value.push({
      id: index,
      x: meter.x,
      y: meter.y,
      targetValue: meter.targetValue,
      currentValue: 0,
      unit: meter.unit,
      indicatorAngle: -90,
      isActive: false
    })
  })
}

// Создание фоновых частиц (аналогично уменьшить)
const createBackgroundParticles = () => {
  for (let i = 0; i < 30; i++) { // уменьшено до 30
    backgroundParticles.value.push({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 2 + Math.random() * 6,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      opacity: 0.2 + Math.random() * 0.5,
      color: '#e6f3ff'
    })
  }
}

// Стили для компонентов
const getFlameStyle = (flame: Flame) => ({
  left: `${flame.x}px`,
  top: `${flame.y}px`,
  transform: `scale(${flame.size / 50})`,
  opacity: flame.intensity,
  filter: `brightness(${1 + flame.intensity * 0.3}) saturate(${1.2 + flame.intensity * 0.5})`
})

const getSparkStyle = (spark: Spark) => ({
  left: `${spark.x}px`,
  top: `${spark.y}px`,
  width: `${spark.size}px`,
  height: `${spark.size}px`,
  opacity: spark.opacity
})

const getParticleStyle = (particle: GasParticle) => ({
  left: `${particle.x}px`,
  top: `${particle.y}px`,
  width: `${particle.size}px`,
  height: `${particle.size}px`,
  opacity: particle.opacity * particle.life
})

const getMeterStyle = (meter: GasMeter) => ({
  left: `${meter.x}px`,
  top: `${meter.y}px`
})

const getBgParticleStyle = (particle: BackgroundParticle) => ({
  left: `${particle.x}px`,
  top: `${particle.y}px`,
  width: `${particle.size}px`,
  height: `${particle.size}px`,
  backgroundColor: particle.color,
  opacity: particle.opacity
})

// Анимация газометра
const animateMeter = (meter: GasMeter) => {
  meter.isActive = true
  const interval = setInterval(() => {
    if (meter.currentValue < meter.targetValue) {
      meter.currentValue += meter.targetValue / 30
      meter.indicatorAngle = -90 + (meter.currentValue / meter.targetValue) * 180
    } else {
      clearInterval(interval)
    }
  }, 50)
}

const resetMeter = (meter: GasMeter) => {
  meter.isActive = false
}

// Ограничение FPS до 30
let lastFrameTime = 0;
const FPS_LIMIT = 30;
const FRAME_DURATION = 1000 / FPS_LIMIT;

const animate = (time: number) => {
  if (time - lastFrameTime < FRAME_DURATION) {
    animationId = requestAnimationFrame(animate);
    return;
  }
  lastFrameTime = time;
  // Анимация газовых частиц
  gasParticles.value.forEach(particle => {
    particle.x += particle.speedX
    particle.y += particle.speedY
    particle.life -= 0.002
    
    if (particle.life <= 0 || particle.y < 0 || particle.x < 0 || particle.x > window.innerWidth) {
      particle.x = Math.random() * window.innerWidth
      particle.y = window.innerHeight + 50
      particle.life = 1
      particle.speedX = (Math.random() - 0.5) * 2
      particle.speedY = -0.5 - Math.random() * 2
    }
  })

  // Анимация фоновых частиц
  backgroundParticles.value.forEach(particle => {
    particle.x += particle.speedX
    particle.y += particle.speedY
    
    if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1
    if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1
  })

  // Анимация факелов
  mainFlames.value.forEach(flame => {
    flame.intensity = 0.7 + Math.sin(Date.now() * 0.005 + flame.id) * 0.2
    
    flame.sparks.forEach(spark => {
      spark.y -= 1
      spark.opacity = 0.6 + Math.sin(Date.now() * 0.01 + spark.id) * 0.3
      
      if (spark.y < -60) {
        spark.y = 0
        spark.x = (Math.random() - 0.5) * 60
      }
    })
  })

  animationId = requestAnimationFrame(animate);
}

onMounted(() => {
  createMainFlames();
  createGasParticles();
  createBackgroundParticles();
  animationId = requestAnimationFrame(animate);
})

onUnmounted(() => {
  cancelAnimationFrame(animationId);
})
</script>

<style lang="scss" scoped>
@import '../styles/tokens.scss';

.flame-particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: $z-flame-particles;
  overflow: hidden;
}

// === ОСНОВНЫЕ ГАЗОВЫЕ ФАКЕЛЫ ===
.main-flames {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.flame-main {
  position: absolute;
  transform-origin: bottom center;
  animation: flameMainFlicker 2s ease-in-out infinite alternate;
  
  .flame-core {
    width: 40px;
    height: 80px;
    background: linear-gradient(to top, 
      $color-accent 0%,
      $color-accent-light 40%,
      $color-accent-glow 70%,
      transparent 100%
    );
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    position: relative;
    filter: blur(2px);
    animation: flameCoreFlicker 1.5s ease-in-out infinite;
  }

  .flame-glow {
    position: absolute;
    top: -20px;
    left: -30px;
    width: 100px;
    height: 120px;
    background: radial-gradient(ellipse at center bottom,
      rgba(255, 102, 0, 0.4) 0%,
      rgba(255, 133, 51, 0.2) 50%,
      transparent 70%
    );
    border-radius: 50%;
    animation: flameGlowPulse 2.5s ease-in-out infinite alternate;
  }

  .flame-spark {
    position: absolute;
    background: $color-accent;
    border-radius: 50%;
    box-shadow: $color-flame-glow;
    animation: sparkFloat 3s linear infinite;
  }
}

// === ГАЗОВЫЕ ЧАСТИЦЫ ===
.gas-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gas-particle {
  position: absolute;
  background: radial-gradient(circle, 
    rgba(0, 91, 191, 0.6) 0%, 
    rgba(77, 143, 217, 0.3) 50%, 
    transparent 100%
  );
  border-radius: 50%;
  animation: particleFloat 4s linear infinite;
}

// === ИНТЕРАКТИВНЫЕ ТРУБОПРОВОДЫ ===
.gas-pipes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-particles;
  
  .pipe-main {
    stroke-dasharray: 20 10;
    animation: pipeFlow 3s linear infinite;
  }
  
  .pipe-secondary {
    stroke-dasharray: 15 8;
    animation: pipeFlow 4s linear infinite reverse;
  }
  
  .pipe-tertiary {
    stroke-dasharray: 10 5;
    animation: pipeFlow 5s linear infinite;
  }
  
  .pipe-connection {
    stroke-dasharray: 8 4;
    animation: connectionPulse 2s ease-in-out infinite;
  }
}

.gas-valve {
  cursor: pointer;
  transition: $transition-smooth;
  
  &:hover {
    transform: scale(1.2);
    
    .valve-body {
      stroke-width: 4;
      filter: drop-shadow(0 0 15px rgba(255, 102, 0, 0.8));
    }
  }
  
  .valve-core {
    animation: valvePulse 1.5s ease-in-out infinite alternate;
  }
}

.gas-flow {
  animation: gasFlowAnimation 4s linear infinite;
}

// === ГАЗОМЕТРЫ ===
.gas-meters {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.gas-meter {
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid $color-primary;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: $transition-bounce;
  box-shadow: $color-shadow-medium;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: $color-shadow-xl, $color-glow-blue;
  }
  
  .meter-display {
    text-align: center;
    z-index: 2;
    
    .meter-value {
      font-size: 14px;
      font-weight: $font-weight-bold;
      color: $color-text-main;
      line-height: 1;
    }
    
    .meter-unit {
      font-size: 10px;
      color: $color-text-secondary;
      margin-top: 2px;
    }
  }
  
  .meter-indicator {
    position: absolute;
    top: 10px;
    left: 50%;
    width: 2px;
    height: 25px;
    background: $color-accent;
    transform-origin: bottom center;
    transition: transform 0.5s $transition-bounce;
    border-radius: 2px;
    box-shadow: 0 0 10px $color-accent;
  }
  
  .meter-glow {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, 
      rgba(255, 102, 0, 0.2) 0%, 
      transparent 60%
    );
    opacity: 0;
    transition: $transition-smooth;
    
    &.active {
      opacity: 1;
      animation: meterGlowPulse 1.5s ease-in-out infinite alternate;
    }
  }
}

// === ФОНОВЫЕ ЧАСТИЦЫ ===
.background-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-particles;
}

.bg-particle {
  position: absolute;
  border-radius: 50%;
  animation: bgParticleFloat 8s linear infinite;
}

// === АНИМАЦИИ ===
@keyframes flameMainFlicker {
  0% { transform: scale(1) rotate(-1deg); }
  25% { transform: scale(1.05) rotate(1deg); }
  50% { transform: scale(0.95) rotate(-0.5deg); }
  75% { transform: scale(1.02) rotate(0.8deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes flameCoreFlicker {
  0%, 100% { filter: blur(2px) brightness(1); }
  50% { filter: blur(1px) brightness(1.3); }
}

@keyframes flameGlowPulse {
  0% { transform: scale(1) opacity(0.4); }
  100% { transform: scale(1.2) opacity(0.6); }
}

@keyframes sparkFloat {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-80px) rotate(360deg); opacity: 0; }
}

@keyframes particleFloat {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-100vh) scale(0.5); }
}

@keyframes pipeFlow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 30; }
}

@keyframes connectionPulse {
  0%, 100% { opacity: 0.6; stroke-width: 4; }
  50% { opacity: 1; stroke-width: 6; }
}

@keyframes valvePulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

@keyframes gasFlowAnimation {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 100; }
}

@keyframes meterGlowPulse {
  0% { transform: scale(1); opacity: 0.2; }
  100% { transform: scale(1.3); opacity: 0.4; }
}

@keyframes bgParticleFloat {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(10px, -10px) rotate(360deg); }
}

.pulse-animation {
  animation: valvePulse $transition-pulse;
}

// === МОБИЛЬНАЯ АДАПТАЦИЯ ===
@include mobile {
  .gas-meter {
    width: 60px;
    height: 60px;
    
    .meter-display .meter-value {
      font-size: 12px;
    }
    
    .meter-display .meter-unit {
      font-size: 8px;
    }
    
    .meter-indicator {
      height: 20px;
    }
  }
  
  .flame-main {
    transform: scale(0.7);
  }
}
</style> 