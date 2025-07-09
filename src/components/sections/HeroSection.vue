<template>
  <section class="hero-mega-section">
    <!-- Мощный анимированный фон -->
    <div class="hero-background">
      <!-- Движущиеся газовые облака -->
      <div class="gas-clouds">
        <div v-for="i in 12" :key="i" class="gas-cloud" :style="getCloudStyle(i)"></div>
      </div>
      
      <!-- Огненные частицы -->
      <div class="fire-particles">
        <div v-for="i in 20" :key="i" class="fire-particle" :style="getFireParticleStyle(i)"></div>
      </div>
      
      <!-- Сияющие трубопроводы -->
      <svg class="hero-pipelines" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="heroPipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#005bbf;stop-opacity:0.8" />
            <stop offset="50%" style="stop-color:#ff6600;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#005bbf;stop-opacity:0.8" />
          </linearGradient>
          
          <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Основные трубопроводы -->
        <path d="M 0 200 Q 350 180 700 200 T 1400 200" 
          stroke="url(#heroPipeGradient)" 
          stroke-width="6" 
          fill="none" 
          filter="url(#heroGlow)"
          class="hero-pipeline main"
        />
        
        <path d="M 0 400 Q 350 380 700 400 T 1400 400" 
          stroke="url(#heroPipeGradient)" 
          stroke-width="4" 
          fill="none" 
          filter="url(#heroGlow)"
          class="hero-pipeline secondary"
        />
        
        <path d="M 0 600 Q 350 580 700 600 T 1400 600" 
          stroke="url(#heroPipeGradient)" 
          stroke-width="3" 
          fill="none" 
          filter="url(#heroGlow)"
          class="hero-pipeline tertiary"
        />
      </svg>
    </div>

    <!-- Центральный контент -->
    <div class="hero-content-wrapper">
      <div class="hero-container">
        
        <!-- Логотип с эффектами -->
        <div class="hero-logo-section">
          <div class="mega-logo">
            <div class="logo-flame">🔥</div>
            <div class="logo-text">
              <span class="logo-main">DataGazCore</span>
              <span class="logo-sub">ТЭК</span>
            </div>
            <div class="logo-glow"></div>
          </div>
        </div>

        <!-- Основной заголовок -->
        <div class="hero-title-section">
          <h1 class="mega-title">
            <span class="title-line">Интеллектуальная</span>
            <span class="title-line highlight">ГАЗОВАЯ</span>
            <span class="title-line">Экосистема</span>
          </h1>
          
          <div class="title-effects">
            <div class="title-flame"></div>
            <div class="title-sparks">
              <div v-for="i in 8" :key="i" class="spark" :style="getSparkStyle(i)"></div>
            </div>
          </div>
        </div>

        <!-- Описание с анимацией -->
        <div class="hero-description">
          <p class="animated-text">
            Революционная система управления знаниями для
            <span class="text-highlight">топливно-энергетического комплекса</span>
            с ИИ-анализом, мгновенным поиском и интеллектуальной обработкой нормативных документов
          </p>
        </div>

        <!-- Супер-анимированные KPI -->
        <div class="hero-kpi-showcase">
          <div class="kpi-mega-card" v-for="kpi in heroKPIs" :key="kpi.id" 
            @mouseenter="animateKPI(kpi)" :class="kpi.class">
            <div class="kpi-icon-mega">{{ kpi.icon }}</div>
            <div class="kpi-value-mega">{{ kpi.displayValue }}</div>
            <div class="kpi-label-mega">{{ kpi.label }}</div>
            <div class="kpi-effect" :class="kpi.effectClass"></div>
          </div>
        </div>

        <!-- Интерактивные кнопки -->
        <div class="hero-actions">
          <button class="mega-cta primary" @click="$emit('scroll-to-demo')">
            <div class="btn-content">
              <span class="btn-icon">🚀</span>
              <span class="btn-text">Смотреть демо</span>
            </div>
            <div class="btn-fire-effect"></div>
            <div class="btn-glow"></div>
          </button>
          
          <button class="mega-cta secondary" @click="$emit('download-presentation')">
            <div class="btn-content">
              <span class="btn-icon">📊</span>
              <span class="btn-text">Презентация</span>
            </div>
            <div class="btn-electric-effect"></div>
          </button>
        </div>

        <!-- Интерактивная схема газовой станции -->
        <div class="hero-gas-station">
          <div class="station-visualization">
            <div class="main-building" @click="highlightBuilding">
              <div class="building-core"></div>
              <div class="building-glow"></div>
              <div class="building-label">ГРС Центральная</div>
            </div>
            
            <div class="gas-flows">
              <div v-for="i in 4" :key="i" class="gas-flow-line" :style="getFlowStyle(i)"></div>
            </div>
            
            <div class="pressure-indicators">
              <div v-for="(indicator, i) in pressureIndicators" :key="i" 
                class="pressure-indicator" :style="getIndicatorStyle(i)">
                <div class="indicator-value">{{ indicator.value }}</div>
                <div class="indicator-unit">{{ indicator.unit }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Прокрутка вниз -->
        <div class="scroll-indicator" @click="$emit('scroll-to-demo')">
          <div class="scroll-text">Узнать больше</div>
          <div class="scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 16l-6-6h12l-6 6z" fill="currentColor"/>
            </svg>
          </div>
          <div class="scroll-pulse"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Эмиты
defineEmits(['scroll-to-demo', 'download-presentation'])

// Данные для анимаций
const heroKPIs = ref([
  { 
    id: 'speed', 
    icon: '⚡', 
    label: 'Скорость поиска', 
    targetValue: 0.4, 
    displayValue: '0.0 с',
    class: 'speed-kpi',
    effectClass: 'lightning-effect'
  },
  { 
    id: 'efficiency', 
    icon: '🎯', 
    label: 'Точность', 
    targetValue: 98.7, 
    displayValue: '0%',
    class: 'accuracy-kpi',
    effectClass: 'accuracy-effect'
  },
  { 
    id: 'savings', 
    icon: '💰', 
    label: 'Экономия', 
    targetValue: 150, 
    displayValue: '0%',
    class: 'savings-kpi',
    effectClass: 'money-effect'
  }
])

const pressureIndicators = ref([
  { value: '4.2', unit: 'бар' },
  { value: '3.8', unit: 'бар' },
  { value: '2.1', unit: 'бар' },
  { value: '1.5', unit: 'бар' }
])

// Методы для стилей
const getCloudStyle = (index: number) => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${index * 0.5}s`,
  transform: `scale(${0.5 + Math.random() * 0.8})`
})

const getFireParticleStyle = (index: number) => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${index * 0.3}s`,
  transform: `scale(${0.3 + Math.random() * 0.7})`
})

const getSparkStyle = (index: number) => ({
  left: `${10 + index * 10}%`,
  animationDelay: `${index * 0.2}s`
})

const getFlowStyle = (index: number) => ({
  left: `${20 + index * 15}%`,
  animationDelay: `${index * 0.4}s`
})

const getIndicatorStyle = (index: number) => ({
  left: `${15 + index * 20}%`,
  top: `${60 + index * 8}%`
})

// Анимация KPI
const animateKPI = (kpi: any) => {
  let currentValue = 0
  const targetValue = kpi.targetValue
  const duration = 2000
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    currentValue = targetValue * easeOut
    
    if (kpi.id === 'speed') {
      kpi.displayValue = `${currentValue.toFixed(1)} с`
    } else {
      kpi.displayValue = `${Math.round(currentValue)}%`
    }
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  animate()
}

const highlightBuilding = () => {
  // Анимация подсветки здания
}

onMounted(() => {
  // Запуск анимации KPI через задержки
  heroKPIs.value.forEach((kpi, index) => {
    setTimeout(() => {
      animateKPI(kpi)
    }, index * 800)
  })
})
</script>

<style lang="scss" scoped>
@import '../../styles/tokens.scss';

.hero-mega-section {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-bg-hero;
}

// === МОЩНЫЙ АНИМИРОВАННЫЙ ФОН ===
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.gas-clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .gas-cloud {
    position: absolute;
    width: 120px;
    height: 80px;
    background: radial-gradient(ellipse, rgba(0, 91, 191, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    animation: cloudFloat 15s ease-in-out infinite;
    filter: blur(2px);
  }
}

.fire-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .fire-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, $color-accent 0%, transparent 70%);
    border-radius: 50%;
    animation: fireParticleFloat 8s linear infinite;
  }
}

.hero-pipelines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .hero-pipeline {
    stroke-dasharray: 30 15;
    
    &.main {
      animation: heroPipeFlow 4s linear infinite;
    }
    
    &.secondary {
      animation: heroPipeFlow 6s linear infinite reverse;
    }
    
    &.tertiary {
      animation: heroPipeFlow 8s linear infinite;
    }
  }
}

// === ЦЕНТРАЛЬНЫЙ КОНТЕНТ ===
.hero-content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  @include container;
}

.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 0;
}

// === МЕГА ЛОГОТИП ===
.hero-logo-section {
  margin-bottom: 40px;
}

.mega-logo {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  
  .logo-flame {
    font-size: 60px;
    animation: logoFlame $transition-flame;
    filter: drop-shadow(0 0 20px $color-accent);
  }
  
  .logo-text {
    display: flex;
    flex-direction: column;
    
    .logo-main {
      font-size: 48px;
      font-weight: $font-weight-black;
      background: linear-gradient(135deg, $color-primary 0%, $color-accent 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 30px rgba(0, 91, 191, 0.5);
    }
    
    .logo-sub {
      font-size: 24px;
      color: $color-accent;
      font-weight: $font-weight-bold;
      margin-top: -8px;
    }
  }
  
  .logo-glow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(circle, rgba(255, 102, 0, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    animation: logoGlow $transition-pulse;
  }
}

// === МЕГА ЗАГОЛОВОК ===
.hero-title-section {
  position: relative;
  margin-bottom: 40px;
}

.mega-title {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .title-line {
    font-size: $font-size-h1-desktop;
    font-weight: $font-weight-black;
    line-height: 1;
    animation: titleReveal 1.5s ease-out forwards;
    opacity: 0;
    transform: translateY(50px);
    
    &:nth-child(1) { animation-delay: 0.2s; }
    &:nth-child(2) { animation-delay: 0.4s; }
    &:nth-child(3) { animation-delay: 0.6s; }
    
    &.highlight {
      background: linear-gradient(135deg, $color-accent 0%, $color-accent-light 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, $color-accent 0%, $color-accent-light 100%);
        z-index: -1;
        opacity: 0.1;
        animation: highlightPulse $transition-pulse;
      }
    }
  }
}

.title-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  .title-flame {
    position: absolute;
    top: 50%;
    right: -50px;
    width: 40px;
    height: 60px;
    background: $color-bg-gas-flame;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    animation: titleFlame $transition-flame;
  }
  
  .title-sparks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .spark {
      position: absolute;
      width: 4px;
      height: 4px;
      background: $color-accent;
      border-radius: 50%;
      animation: sparkFly 3s linear infinite;
    }
  }
}

// === ОПИСАНИЕ ===
.hero-description {
  margin-bottom: 50px;
  max-width: 800px;
  
  .animated-text {
    font-size: $font-size-body-desktop;
    line-height: 1.6;
    color: $color-text-secondary;
    animation: textReveal 2s ease-out 0.8s forwards;
    opacity: 0;
    
    .text-highlight {
      color: $color-accent;
      font-weight: $font-weight-semibold;
      background: linear-gradient(135deg, $color-accent 0%, $color-accent-light 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, $color-accent 0%, $color-accent-light 100%);
        animation: underlineGrow 1s ease-out 1.5s forwards;
        transform: scaleX(0);
        transform-origin: left;
      }
    }
  }
}

// === KPI ВИТРИНА ===
.hero-kpi-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 50px;
  width: 100%;
  max-width: 600px;
}

.kpi-mega-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid transparent;
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: $transition-dramatic;
  backdrop-filter: blur(15px);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-15px) scale(1.1);
    box-shadow: $color-shadow-xl, $color-glow-blue;
    border-color: $color-primary;
  }
  
  .kpi-icon-mega {
    font-size: 36px;
    margin-bottom: 15px;
    animation: iconBounce $transition-float;
  }
  
  .kpi-value-mega {
    font-size: 28px;
    font-weight: $font-weight-black;
    color: $color-primary;
    margin-bottom: 8px;
    transition: $transition-smooth;
  }
  
  .kpi-label-mega {
    font-size: 12px;
    color: $color-text-secondary;
    font-weight: $font-weight-medium;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .kpi-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    opacity: 0;
    transition: $transition-smooth;
    pointer-events: none;
    
    &.lightning-effect {
      background: radial-gradient(circle, rgba(255, 255, 0, 0.2) 0%, transparent 70%);
    }
    
    &.accuracy-effect {
      background: radial-gradient(circle, rgba(0, 255, 0, 0.2) 0%, transparent 70%);
    }
    
    &.money-effect {
      background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
    }
  }
  
  &:hover .kpi-effect {
    opacity: 1;
    animation: effectPulse $transition-pulse;
  }
}

// === МЕГА КНОПКИ ===
.hero-actions {
  display: flex;
  gap: 25px;
  margin-bottom: 60px;
}

.mega-cta {
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 30px;
  padding: 20px 40px;
  font-size: 18px;
  font-weight: $font-weight-bold;
  cursor: pointer;
  transition: $transition-dramatic;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  .btn-content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 2;
    
    .btn-icon {
      font-size: 20px;
    }
  }
  
  &.primary {
    background: linear-gradient(135deg, $color-accent 0%, $color-accent-light 100%);
    color: $color-text-white;
    box-shadow: $color-shadow-medium;
    
    &:hover {
      transform: translateY(-5px) scale(1.08);
      box-shadow: $color-shadow-xl, $color-flame-glow;
      
      .btn-fire-effect {
        opacity: 1;
        animation: fireEffect 1s ease-out infinite;
      }
      
      .btn-glow {
        opacity: 1;
        animation: btnGlow $transition-pulse;
      }
    }
    
    .btn-fire-effect {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: radial-gradient(circle, rgba(255, 102, 0, 0.4) 0%, transparent 70%);
      border-radius: 30px;
      opacity: 0;
      transition: $transition-smooth;
    }
    
    .btn-glow {
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      background: radial-gradient(circle, rgba(255, 102, 0, 0.3) 0%, transparent 70%);
      border-radius: 50px;
      opacity: 0;
      transition: $transition-smooth;
    }
  }
  
  &.secondary {
    background: transparent;
    color: $color-primary;
    border: 3px solid $color-primary;
    
    &:hover {
      background: $color-primary;
      color: $color-text-white;
      transform: translateY(-5px) scale(1.08);
      box-shadow: $color-shadow-xl, $color-glow-blue;
      
      .btn-electric-effect {
        opacity: 1;
        animation: electricEffect 0.8s ease-out infinite;
      }
    }
    
    .btn-electric-effect {
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid transparent;
      border-radius: 30px;
      background: linear-gradient(45deg, $color-primary 0%, $color-primary-light 100%);
      background-clip: border-box;
      opacity: 0;
      transition: $transition-smooth;
    }
  }
}

// === ГАЗОВАЯ СТАНЦИЯ ===
.hero-gas-station {
  margin-bottom: 50px;
  width: 100%;
  max-width: 500px;
}

.station-visualization {
  position: relative;
  height: 150px;
  background: rgba(230, 243, 255, 0.3);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
  
  .main-building {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 60px;
    cursor: pointer;
    transition: $transition-bounce;
    
    &:hover {
      transform: translate(-50%, -50%) scale(1.1);
      
      .building-glow {
        opacity: 1;
        animation: buildingGlow $transition-pulse;
      }
    }
    
    .building-core {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
      border-radius: 12px;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 20%;
        left: 20%;
        width: 60%;
        height: 60%;
        background: $color-accent;
        border-radius: 50%;
        animation: coreEnergy $transition-pulse;
      }
    }
    
    .building-glow {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: radial-gradient(circle, rgba(0, 91, 191, 0.4) 0%, transparent 70%);
      border-radius: 20px;
      opacity: 0;
      transition: $transition-smooth;
    }
    
    .building-label {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 8px;
      font-size: 12px;
      font-weight: $font-weight-semibold;
      color: $color-text-main;
      white-space: nowrap;
    }
  }
  
  .gas-flows {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .gas-flow-line {
      position: absolute;
      top: 50%;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, $color-accent 0%, transparent 100%);
      animation: gasFlow 2s linear infinite;
    }
  }
  
  .pressure-indicators {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .pressure-indicator {
      position: absolute;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid $color-primary-light;
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 10px;
      backdrop-filter: blur(5px);
      
      .indicator-value {
        font-weight: $font-weight-bold;
        color: $color-primary;
      }
      
      .indicator-unit {
        color: $color-text-light;
      }
    }
  }
}

// === ИНДИКАТОР ПРОКРУТКИ ===
.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: $transition-smooth;
  
  &:hover {
    transform: translateY(-5px);
    
    .scroll-pulse {
      animation-duration: 0.8s;
    }
  }
  
  .scroll-text {
    font-size: 14px;
    color: $color-text-secondary;
    font-weight: $font-weight-medium;
  }
  
  .scroll-arrow {
    color: $color-accent;
    animation: scrollBounce 2s ease-in-out infinite;
  }
  
  .scroll-pulse {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    border: 2px solid $color-accent;
    border-radius: 50%;
    animation: scrollPulse $transition-pulse;
  }
}

// === АНИМАЦИИ ===
@keyframes cloudFloat {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(20px) translateY(-10px); }
  50% { transform: translateX(-10px) translateY(15px); }
  75% { transform: translateX(15px) translateY(-5px); }
}

@keyframes fireParticleFloat {
  0% { transform: translateY(100vh) scale(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-20px) scale(0.3); opacity: 0; }
}

@keyframes heroPipeFlow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 45; }
}

@keyframes logoFlame {
  0%, 100% { transform: scale(1) rotate(-2deg); }
  50% { transform: scale(1.1) rotate(2deg); }
}

@keyframes logoGlow {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

@keyframes titleReveal {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes highlightPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}

@keyframes titleFlame {
  0%, 100% { transform: scale(1) skewY(-2deg); }
  50% { transform: scale(1.1) skewY(2deg); }
}

@keyframes sparkFly {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
  100% { transform: translateY(-100px) translateX(50px) scale(0.3); opacity: 0; }
}

@keyframes textReveal {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes underlineGrow {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes effectPulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

@keyframes fireEffect {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.1); opacity: 0.7; }
}

@keyframes btnGlow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.6; }
}

@keyframes electricEffect {
  0% { border-color: $color-primary; }
  25% { border-color: $color-primary-light; }
  50% { border-color: $color-accent; }
  75% { border-color: $color-primary-light; }
  100% { border-color: $color-primary; }
}

@keyframes buildingGlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes coreEnergy {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.1); filter: brightness(1.3); }
}

@keyframes gasFlow {
  0% { transform: translateX(-100px); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateX(100px); opacity: 0; }
}

@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

@keyframes scrollPulse {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
  50% { transform: translateX(-50%) scale(1.5); opacity: 0.5; }
}

// === МОБИЛЬНАЯ АДАПТАЦИЯ ===
@include mobile {
  .hero-container {
    padding: 60px 0;
  }
  
  .mega-logo {
    gap: 15px;
    
    .logo-flame {
      font-size: 40px;
    }
    
    .logo-text .logo-main {
      font-size: 32px;
    }
    
    .logo-text .logo-sub {
      font-size: 18px;
    }
  }
  
  .mega-title .title-line {
    font-size: $font-size-h1-mobile;
  }
  
  .hero-description .animated-text {
    font-size: $font-size-body-mobile;
  }
  
  .hero-kpi-showcase {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 300px;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 15px;
    
    .mega-cta {
      padding: 15px 30px;
      font-size: 16px;
    }
  }
  
  .station-visualization {
    height: 120px;
    
    .main-building {
      width: 60px;
      height: 45px;
    }
  }
}
</style> 