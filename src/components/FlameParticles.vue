<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    class="flame-canvas"
    :class="{ active: isActive }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  width?: number
  height?: number
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 64,
  height: 64,
  isActive: false
})

const canvasRef = ref<HTMLCanvasElement>()
let animationId: number
let particles: Particle[] = []

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 2
    this.vy = -Math.random() * 3 - 1
    this.life = 1
    this.maxLife = Math.random() * 60 + 30
    this.size = Math.random() * 4 + 2
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.05 // гравитация
    this.life -= 1 / this.maxLife
    
    return this.life > 0
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.life
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
    gradient.addColorStop(0, `rgba(255, 160, 0, ${alpha * 0.8})`)
    gradient.addColorStop(0.5, `rgba(41, 182, 246, ${alpha * 0.4})`)
    gradient.addColorStop(1, `rgba(41, 182, 246, 0)`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = 'screen'
  
  // Создаём новые частицы, если активно
  if (props.isActive && Math.random() < 0.7) {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    particles.push(new Particle(
      centerX + (Math.random() - 0.5) * 20,
      centerY + Math.random() * 10
    ))
  }
  
  // Обновляем и рисуем частицы
  particles = particles.filter(particle => {
    particle.draw(ctx)
    return particle.update()
  })
  
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

watch(() => props.isActive, (newVal) => {
  if (!newVal) {
    particles = []
  }
})
</script>

<style scoped>
.flame-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.flame-canvas.active {
  opacity: 1;
}
</style> 