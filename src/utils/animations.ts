import { gsap } from 'gsap'

// Анимация пламени для поисковой строки
export function animateFlame(element: HTMLElement, active: boolean) {
  if (active) {
    gsap.to(element, {
      scale: 1.08,
      filter: 'blur(2px) brightness(1.4)',
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    })
  } else {
    gsap.to(element, {
      scale: 1,
      filter: 'blur(0.5px) brightness(1.1)',
      duration: 0.6,
      ease: 'power2.out'
    })
  }
}

// Анимация появления KPI карточек
export function animateKPICards(elements: HTMLElement[]) {
  gsap.fromTo(elements, 
    {
      opacity: 0,
      y: 32,
      scale: 0.8
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: 'back.out(1.7)'
    }
  )
}

// Анимация появления результатов поиска
export function animateSearchResults(elements: HTMLElement[]) {
  gsap.fromTo(elements,
    {
      opacity: 0,
      y: 48,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    }
  )
}

// Анимация газовых потоков (SVG path)
export function animateGasFlows(svgPaths: SVGPathElement[]) {
  svgPaths.forEach((path, index) => {
    const pathLength = path.getTotalLength()
    
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    })
    
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      delay: index * 0.5,
      repeat: -1,
      ease: 'none'
    })
  })
}

// Пульсация при hover для карточек
export function addHoverAnimation(element: HTMLElement) {
  const onEnter = () => {
    gsap.to(element, {
      y: -4,
      boxShadow: '0 12px 32px rgba(41, 182, 246, 0.3)',
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  const onLeave = () => {
    gsap.to(element, {
      y: 0,
      boxShadow: '0 8px 32px rgba(41, 182, 246, 0.18)',
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  element.addEventListener('mouseenter', onEnter)
  element.addEventListener('mouseleave', onLeave)
  
  // Возвращаем функцию очистки
  return () => {
    element.removeEventListener('mouseenter', onEnter)
    element.removeEventListener('mouseleave', onLeave)
  }
}

// Эффект печатной машинки для текста
export function typewriterEffect(element: HTMLElement, text: string, speed: number = 50) {
  element.textContent = ''
  
  const chars = text.split('')
  chars.forEach((char, index) => {
    setTimeout(() => {
      element.textContent += char
    }, index * speed)
  })
}

// Easter egg - конами код анимация
export function easterEggFlameAnimation(element: HTMLElement) {
  gsap.to(element, {
    rotation: 360,
    scale: 1.5,
    filter: 'hue-rotate(180deg) brightness(1.5)',
    duration: 2,
    ease: 'elastic.out(1, 0.3)'
  })
  
  setTimeout(() => {
    gsap.to(element, {
      rotation: 0,
      scale: 1,
      filter: 'hue-rotate(0deg) brightness(1.1)',
      duration: 1,
      ease: 'power2.out'
    })
  }, 2000)
} 