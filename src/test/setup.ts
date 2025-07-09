import { vi } from 'vitest'

// Mock Web Speech API
Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    continuous: false,
    interimResults: false,
    lang: 'ru-RU',
    start: vi.fn(),
    stop: vi.fn(),
    onstart: null,
    onresult: null,
    onerror: null,
    onend: null
  }))
})

// Mock Canvas API для FlameParticles
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  createRadialGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn()
  })
})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn().mockImplementation((cb) => {
  setTimeout(cb, 16)
  return 1
})

global.cancelAnimationFrame = vi.fn() 