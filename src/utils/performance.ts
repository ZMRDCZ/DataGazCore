// Performance management utility

export interface PerformanceSettings {
  shouldShowHeavyEffects: boolean
  maxParticles: number
  fps: number
  isHighPerformance: boolean
  isMobile: boolean
}

let settings: PerformanceSettings = {
  shouldShowHeavyEffects: false,
  maxParticles: 50,
  fps: 30,
  isHighPerformance: false,
  isMobile: false
}

// Performance detection
export function detectPerformance(): PerformanceSettings {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobile|tablet|android|iphone|ipad/i.test(userAgent)
  
  // Проверяем количество ядер процессора
  const cores = navigator.hardwareConcurrency || 2
  
  // Проверяем доступную память (если поддерживается)
  const memory = (navigator as any).deviceMemory || 4
  
  // Определяем производительность устройства
  const isHighPerformance = !isMobile && cores >= 4 && memory >= 4
  const isMediumPerformance = !isMobile && cores >= 2
  
  // Настройки в зависимости от производительности
  if (isHighPerformance) {
    settings = {
      shouldShowHeavyEffects: true,
      maxParticles: 200,
      fps: 60,
      isHighPerformance: true,
      isMobile: false
    }
  } else if (isMediumPerformance) {
    settings = {
      shouldShowHeavyEffects: true,
      maxParticles: 100,
      fps: 30,
      isHighPerformance: false,
      isMobile: false
    }
  } else {
    settings = {
      shouldShowHeavyEffects: false,
      maxParticles: 30,
      fps: 15,
      isHighPerformance: false,
      isMobile
    }
  }
  
  return settings
}

// FPS monitoring
let frameCount = 0
let lastTime = performance.now()
let averageFPS = 60

export function monitorFPS(callback?: (fps: number) => void): void {
  function checkFPS() {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime - lastTime >= 1000) {
      averageFPS = frameCount
      frameCount = 0
      lastTime = currentTime
      
      // Автоматическое снижение качества при низком FPS
      if (averageFPS < 20 && settings.shouldShowHeavyEffects) {
        console.log('Low FPS detected, reducing performance settings')
        settings.shouldShowHeavyEffects = false
        settings.maxParticles = Math.max(20, settings.maxParticles * 0.5)
        settings.fps = Math.max(15, settings.fps * 0.75)
      }
      
      if (callback) {
        callback(averageFPS)
      }
    }
    
    requestAnimationFrame(checkFPS)
  }
  
  requestAnimationFrame(checkFPS)
}

// Get current settings
export function getPerformanceSettings(): PerformanceSettings {
  return { ...settings }
}

// Override settings manually
export function setPerformanceSettings(newSettings: Partial<PerformanceSettings>): void {
  settings = { ...settings, ...newSettings }
}

// Utility for throttling animations
export function createThrottledAnimation(fps: number, callback: (time: number) => void): (time: number) => void {
  let lastFrameTime = 0
  const frameDuration = 1000 / fps
  
  return function(currentTime: number) {
    if (currentTime - lastFrameTime >= frameDuration) {
      lastFrameTime = currentTime
      callback(currentTime)
    }
  }
}

// Initialize performance detection
let initialized = false

export function initializePerformance(): PerformanceSettings {
  if (!initialized) {
    detectPerformance()
    monitorFPS()
    initialized = true
  }
  return settings
} 