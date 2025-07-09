<template>
  <section class="hero-section" @mousemove="handleMouseMove">
    <!-- Газовые частицы на фоне -->
    <canvas 
      ref="particlesCanvas" 
      class="particles-bg"
      :width="canvasWidth"
      :height="canvasHeight"
    />
    
    <div class="hero-content">
      <div class="hero-badge">
        <span class="hero-badge-text">🔥 Революция в поиске документов ТЭК</span>
      </div>
      
      <h1 class="hero-title">
        <span class="gradient-text">KnowledgeGas AI</span>
        <br>
        Мгновенный доступ к знанию
      </h1>
      
      <p class="hero-description">
        Найдите любой ГОСТ, СП, чертёж или отчёт об инциденте за секунды. 
        Более <strong>1 000 документов</strong> с умным семантическим поиском 
        и интерактивным графом знаний.
      </p>
      
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-value">50 мин → 5 с</div>
          <div class="stat-label">Время поиска</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">+3 ч/день</div>
          <div class="stat-label">Экономия времени</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">150%+</div>
          <div class="stat-label">ROI</div>
        </div>
      </div>
      
      <div class="hero-actions">
        <button 
          class="cta-button primary" 
          @click="scrollToSearch"
          @mouseenter="ctaHover = true"
          @mouseleave="ctaHover = false"
        >
          <span class="cta-icon">🔍</span>
          Начать поиск
          <div class="cta-glow" :class="{ active: ctaHover }"></div>
        </button>
        
        <button class="cta-button secondary" @click="scrollToDemo">
          <span class="cta-icon">🎥</span>
          Посмотреть демо
        </button>
      </div>
      
      <div class="hero-features">
        <div class="feature-pill">
          <span class="feature-icon">⚡</span>
          Streaming поиск
        </div>
        <div class="feature-pill">
          <span class="feature-icon">🧠</span>
          ИИ-семантика
        </div>
        <div class="feature-pill">
          <span class="feature-icon">📊</span>
          Граф знаний
        </div>
        <div class="feature-pill">
          <span class="feature-icon">🔊</span>
          Голосовой ввод
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  scrollToSearch: []
  scrollToDemo: []
}>()

const particlesCanvas = ref<HTMLCanvasElement>()
const canvasWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
const canvasHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 1080)
const ctaHover = ref(false)

let animationId: number
let particles: GasParticle[] = []
let mouseX = 0
let mouseY = 0

class GasParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  maxOpacity: number
  color: string
  
  constructor() {
    this.x = Math.random() * canvasWidth.value
    this.y = Math.random() * canvasHeight.value
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.size = Math.random() * 3 + 1
    this.maxOpacity = Math.random() * 0.3 + 0.1
    this.opacity = this.maxOpacity
    this.color = Math.random() > 0.5 ? '#29b6f6' : '#ffa000'
  }
  
  update() {
    // Движение частиц
    this.x += this.vx
    this.y += this.vy
    
    // Отталкивание от курсора
    const dx = this.x - mouseX
    const dy = this.y - mouseY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < 100) {
      const force = (100 - distance) / 100
      this.vx += (dx / distance) * force * 0.02
      this.vy += (dy / distance) * force * 0.02
    }
    
    // Границы экрана
    if (this.x < 0 || this.x > canvasWidth.value) this.vx *= -1
    if (this.y < 0 || this.y > canvasHeight.value) this.vy *= -1
    
    // Затухание скорости
    this.vx *= 0.995
    this.vy *= 0.995
    
    // Пульсация прозрачности
    this.opacity = this.maxOpacity * (0.7 + 0.3 * Math.sin(Date.now() * 0.002 + this.x * 0.01))
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 2
    )
    gradient.addColorStop(0, this.color + Math.floor(this.opacity * 255).toString(16).padStart(2, '0'))
    gradient.addColorStop(1, this.color + '00')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function initParticles() {
  particles = []
  for (let i = 0; i < 50; i++) {
    particles.push(new GasParticle())
  }
}

function animate() {
  const canvas = particlesCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })
  
  animationId = requestAnimationFrame(animate)
}

function handleMouseMove(event: MouseEvent) {
  mouseX = event.clientX
  mouseY = event.clientY
}

function handleResize() {
  if (typeof window !== 'undefined') {
    canvasWidth.value = window.innerWidth
    canvasHeight.value = window.innerHeight
  }
}

function scrollToSearch() {
  emit('scrollToSearch')
}

function scrollToDemo() {
  emit('scrollToDemo')
}

onMounted(() => {
  initParticles()
  animate()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $color-bg-gradient-top 0%, $color-bg-gradient-bottom 100%);
  overflow: hidden;
  padding: $section-padding 20px;
}

.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  animation: fadeInUp 1s ease-out;
}

.hero-badge {
  display: inline-block;
  background: $color-card-bg;
  border: 1px solid $color-card-border;
  border-radius: 50px;
  padding: 8px 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;
}

.hero-badge-text {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: $font-weight-light;
  color: $color-text-main;
  margin-bottom: 24px;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, $color-accent-flame 0%, $color-accent-flame-end 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: $font-weight-semibold;
}

.hero-description {
  font-size: 1.25rem;
  font-weight: $font-weight-regular;
  color: $color-text-secondary;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 48px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: $font-weight-semibold;
  color: $color-text-main;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: $color-text-light;
  font-weight: $font-weight-regular;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.cta-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 1.125rem;
  font-weight: $font-weight-medium;
  border: none;
  cursor: pointer;
  transition: all $transition-smooth;
  overflow: hidden;
  
  &.primary {
    background: linear-gradient(135deg, $color-accent-flame 0%, $color-accent-flame-end 100%);
    color: white;
    box-shadow: $color-shadow-medium;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: $color-shadow-xl;
    }
  }
  
  &.secondary {
    background: $color-card-bg;
    color: $color-text-main;
    border: 1px solid $color-card-border;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(41, 182, 246, 0.1);
      border-color: $color-accent-flame;
    }
  }
}

.cta-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity $transition-fast;
  pointer-events: none;
  
  &.active {
    opacity: 1;
  }
}

.cta-icon {
  font-size: 1.25rem;
}

.hero-features {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: $color-card-bg;
  border: 1px solid $color-card-border;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
  backdrop-filter: blur(10px);
  transition: all $transition-fast;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: $color-shadow-soft;
  }
}

.feature-icon {
  font-size: 1rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-content {
    animation: none;
  }
  
  .hero-badge {
    animation: none;
  }
  
  .cta-button {
    transition: none;
  }
}
</style> 