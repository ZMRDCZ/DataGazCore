<template>
  <div class="mobile-navigation">
    <!-- Мобильное меню кнопка -->
    <button 
      @click="toggleMenu"
      :class="{ active: isMenuOpen }"
      class="mobile-menu-btn"
      aria-label="Открыть меню"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    
    <!-- Мобильное меню -->
    <div 
      v-if="isMenuOpen"
      class="mobile-menu-overlay"
      @click="closeMenu"
    >
      <div 
        class="mobile-menu-content"
        @click.stop
        :class="{ 'menu-open': isMenuOpen }"
      >
        <div class="menu-header">
          <div class="menu-logo">
            <span class="logo-icon">🧠</span>
            <span class="logo-text">DataGazCore</span>
          </div>
          <button @click="closeMenu" class="close-menu-btn" aria-label="Закрыть меню">
            ✕
          </button>
        </div>
        
        <nav class="mobile-nav">
          <ul class="nav-list">
            <li v-for="item in menuItems" :key="item.id">
              <a 
                :href="item.href"
                @click="handleNavClick(item.href)"
                class="nav-link"
                :class="{ active: activeSection === item.id }"
              >
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-text">{{ item.text }}</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div class="menu-footer">
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <a href="mailto:komarovda@seznam.cz" class="contact-link">
                komarovda@seznam.cz
              </a>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <a href="tel:+79951173629" class="contact-link">
                +7 995 117 36 29
              </a>
            </div>
          </div>
          
          <div class="menu-cta">
            <button @click="handleDemoRequest" class="demo-btn">
              <span class="btn-icon">🚀</span>
              <span class="btn-text">Заказать демо</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  demoRequest: []
}>()

// Состояние
const isMenuOpen = ref(false)
const activeSection = ref('hero')

// Пункты меню
const menuItems = ref([
  { id: 'hero', text: 'Главная', icon: '🏠', href: '#hero' },
  { id: 'features', text: 'Возможности', icon: '⚡', href: '#features' },
  { id: 'demo', text: 'Демо', icon: '🎯', href: '#demo' },
  { id: 'knowledge', text: 'Управление знаниями', icon: '🧠', href: '#knowledge' },
  { id: 'cta', text: 'Контакты', icon: '📞', href: '#cta' }
])

// Методы
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMenu() {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

function handleNavClick(href: string) {
  closeMenu()
  
  // Плавная прокрутка к секции
  const targetElement = document.querySelector(href)
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

function handleDemoRequest() {
  closeMenu()
  emit('demoRequest')
}

// Отслеживание активной секции
function updateActiveSection() {
  const sections = menuItems.value.map(item => ({
    id: item.id,
    element: document.querySelector(item.href)
  }))
  
  const scrollPosition = window.scrollY + 100
  
  for (const section of sections) {
    if (section.element) {
      const rect = section.element.getBoundingClientRect()
      const offsetTop = rect.top + window.scrollY
      const offsetBottom = offsetTop + rect.height
      
      if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
        activeSection.value = section.id
        break
      }
    }
  }
}

// Жизненный цикл
onMounted(() => {
  window.addEventListener('scroll', updateActiveSection)
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.mobile-navigation {
  position: fixed;
  top: 0;
  right: 0;
  z-index: $z-mobile-menu;
  padding: 16px;
  
  @include tablet-up {
    display: none;
  }
}

.mobile-menu-btn {
  position: relative;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: all $transition-fast;
  backdrop-filter: blur(10px);
  box-shadow: $color-shadow-soft;
  
  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.active {
    background: $color-accent;
    
    .hamburger-line {
      background: white;
      
      &:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      &:nth-child(2) {
        opacity: 0;
      }
      
      &:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  }
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: $color-text-main;
  border-radius: 1px;
  transition: all $transition-fast;
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: $z-mobile-menu - 1;
  animation: fadeIn $transition-smooth;
}

.mobile-menu-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: white;
  box-shadow: $color-shadow-xl;
  transform: translateX(100%);
  transition: transform $transition-smooth;
  display: flex;
  flex-direction: column;
  
  &.menu-open {
    transform: translateX(0);
  }
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
  border-bottom: 1px solid #e5e7eb;
  
  .menu-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .logo-icon {
      font-size: 1.5rem;
    }
    
    .logo-text {
      font-size: 1.2rem;
      font-weight: $font-weight-bold;
      color: $color-primary;
    }
  }
  
  .close-menu-btn {
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: $color-text-light;
    cursor: pointer;
    border-radius: 8px;
    transition: all $transition-fast;
    
    &:hover {
      background: #f3f4f6;
      color: $color-text-main;
    }
  }
}

.mobile-nav {
  flex: 1;
  padding: 20px 0;
  
  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    color: $color-text-main;
    text-decoration: none;
    transition: all $transition-fast;
    border-left: 3px solid transparent;
    
    &:hover {
      background: #f8fafc;
      border-left-color: $color-primary-light;
    }
    
    &.active {
      background: #eff6ff;
      border-left-color: $color-primary;
      color: $color-primary;
      
      .nav-icon {
        color: $color-primary;
      }
    }
    
    .nav-icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
      color: $color-text-light;
    }
    
    .nav-text {
      font-size: 1rem;
      font-weight: $font-weight-medium;
    }
  }
}

.menu-footer {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
  
  .contact-info {
    margin-bottom: 20px;
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      
      .contact-icon {
        font-size: 1rem;
        width: 20px;
        text-align: center;
      }
      
      .contact-link {
        font-size: 0.9rem;
        color: $color-text-main;
        text-decoration: none;
        
        &:hover {
          color: $color-primary;
        }
      }
    }
  }
  
  .menu-cta {
    .demo-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      background: $color-accent;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: $font-weight-semibold;
      cursor: pointer;
      transition: all $transition-fast;
      
      &:hover {
        background: $color-accent-light;
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      .btn-icon {
        font-size: 1.1rem;
      }
    }
  }
}

// Анимации
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Мобильные оптимизации
@include mobile {
  .mobile-menu-content {
    width: 100%;
    max-width: 320px;
    
    // Улучшенная поддержка для очень маленьких экранов
    @media (max-width: 320px) {
      max-width: 280px;
    }
  }
  
  .mobile-nav .nav-link {
    padding: 18px 20px;
    
    .nav-text {
      font-size: 1.1rem;
    }
    
    // Улучшенная поддержка для очень маленьких экранов
    @media (max-width: 320px) {
      padding: 14px 16px;
      
      .nav-text {
        font-size: 1rem;
      }
    }
  }
  
  .menu-footer {
    .contact-info .contact-item {
      margin-bottom: 16px;
      
      .contact-link {
        font-size: 1rem;
      }
    }
    
    .demo-btn {
      padding: 16px 20px;
      font-size: 1.1rem;
      
      // Улучшенная поддержка для очень маленьких экранов
      @media (max-width: 320px) {
        padding: 14px 16px;
        font-size: 1rem;
      }
    }
  }
  
  // Улучшенная поддержка для устройств с вырезами
  @supports (padding: max(0px)) {
    .mobile-menu-content {
      padding-top: max(0px, env(safe-area-inset-top));
      padding-bottom: max(0px, env(safe-area-inset-bottom));
      height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    }
    
    .mobile-navigation {
      padding-top: max(16px, env(safe-area-inset-top));
      padding-right: max(16px, env(safe-area-inset-right));
      padding-bottom: max(16px, env(safe-area-inset-bottom));
    }
  }
}

// Улучшенная доступность
.mobile-menu-btn:focus,
.close-menu-btn:focus,
.nav-link:focus,
.demo-btn:focus {
  outline: 2px solid $color-accent;
  outline-offset: 2px;
}

// Поддержка prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  .mobile-menu-content,
  .hamburger-line,
  .nav-link,
  .demo-btn {
    transition: none;
  }
}
</style> 