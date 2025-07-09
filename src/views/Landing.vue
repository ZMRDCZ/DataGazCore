<template>
  <div class="landing">
    <!-- Sticky Navigation -->
    <nav class="sticky-nav" :class="{ visible: showStickyNav }">
      <div class="nav-container">
        <div class="nav-logo">
          <span class="logo-icon">🔥</span>
          <span class="logo-text">KnowledgeGas AI</span>
        </div>
        
        <div class="nav-menu">
          <a href="#hero" @click="scrollTo('hero')" class="nav-link">Главная</a>
          <a href="#search" @click="scrollTo('search')" class="nav-link">Поиск</a>
          <a href="#features" @click="scrollTo('features')" class="nav-link">Возможности</a>
          <a href="#demo" @click="scrollTo('demo')" class="nav-link">Демо</a>
        </div>
        
        <button class="nav-cta" @click="scrollTo('search')">
          Начать поиск
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" ref="heroSection">
      <HeroSection 
        @scroll-to-search="scrollTo('search')"
        @scroll-to-demo="scrollTo('demo')"
      />
    </section>

    <!-- Search Section -->
    <section id="search" ref="searchSection" class="search-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Найдите любой документ за секунды</h2>
          <p class="section-description">
            Попробуйте поиск по нормативам, чертежам или отчётам об инцидентах
          </p>
        </div>
        
        <div class="search-container">
          <HeroSearch 
            @search="handleSearch"
            class="enhanced-search"
          />
          
          <div v-if="searchStore.hasSearched" class="search-stats">
            <span class="stats-text">
              Найдено {{ searchStore.searchStats.totalResults }} документов за {{ searchStore.searchStats.searchTime }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section v-if="searchStore.hasResults" id="results" class="results-section">
      <div class="section-container">
        <div class="results-header">
          <h3 class="results-title">Результаты поиска</h3>
          <button 
            v-if="searchStore.hasResults" 
            @click="showKnowledgeGraph = true"
            class="graph-button"
          >
            <span class="graph-icon">📊</span>
            Граф знаний
          </button>
        </div>
        
        <ResultList 
          :results="searchStore.results" 
          class="animated-results"
        />
      </div>
    </section>

    <!-- KPI Section -->
    <section v-if="searchStore.showKPI" id="kpi" class="kpi-section">
      <div class="section-container">
        <div class="kpi-header">
          <h3 class="kpi-title">Экономический эффект</h3>
          <p class="kpi-description">Реальная экономия времени и денег</p>
        </div>
        
        <KPIBar 
          :kpis="searchStore.kpis" 
          class="enhanced-kpi"
        />
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Умные возможности</h2>
          <p class="section-description">
            Технологии следующего поколения для работы с документами
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section id="demo" ref="demoSection" class="demo-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Посмотрите демо</h2>
          <p class="section-description">
            90 секунд о том, как KnowledgeGas AI изменит вашу работу
          </p>
        </div>
        
        <div class="demo-container">
          <div class="demo-video-placeholder">
            <div class="play-button">
              <span class="play-icon">▶</span>
            </div>
            <div class="video-overlay">
              <h3>Showcase Demo</h3>
              <p>От открытия лендинга до просмотра документа</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">🔥</span>
            <span class="logo-text">KnowledgeGas AI</span>
          </div>
          <p class="footer-tagline">
            Мгновенный доступ к знанию в газовой отрасли
          </p>
        </div>
        
        <div class="footer-links">
          <div class="footer-column">
            <h4 class="footer-title">Продукт</h4>
            <a href="#" class="footer-link">API документация</a>
            <a href="#" class="footer-link">Интеграции</a>
            <a href="#" class="footer-link">Roadmap</a>
          </div>
          
          <div class="footer-column">
            <h4 class="footer-title">Поддержка</h4>
            <a href="#" class="footer-link">Техподдержка</a>
            <a href="#" class="footer-link">Статус системы</a>
            <a href="#" class="footer-link">Обучение</a>
          </div>
          
          <div class="footer-column">
            <h4 class="footer-title">Контакты</h4>
            <a href="mailto:info@knowledgegas.ai" class="footer-link">info@knowledgegas.ai</a>
            <a href="tel:+7-800-555-0123" class="footer-link">+7 800 555 01 23</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-container">
          <p class="footer-copyright">
            © 2024 KnowledgeGas AI. Все права защищены.
          </p>
          <div class="footer-social">
            <a href="#" class="social-link">LinkedIn</a>
            <a href="#" class="social-link">GitHub</a>
            <a href="#" class="social-link">Telegram</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <DocPreview 
      :document="searchStore.selectedDocument" 
      :is-visible="searchStore.showDocPreview"
      @close="searchStore.closeDocPreview"
    />
    
    <KnowledgeGraphModal 
      :is-visible="showKnowledgeGraph"
      @close="showKnowledgeGraph = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import HeroSearch from '@/components/HeroSearch.vue'
import ResultList from '@/components/ResultList.vue'
import KPIBar from '@/components/KPIBar.vue'
import DocPreview from '@/components/DocPreview.vue'
import KnowledgeGraphModal from '@/components/modals/KnowledgeGraphModal.vue'
import { useSearchStore } from '@/stores/searchStore'

const searchStore = useSearchStore()

const showStickyNav = ref(false)
const showKnowledgeGraph = ref(false)
const heroSection = ref<HTMLElement>()
const searchSection = ref<HTMLElement>()
const demoSection = ref<HTMLElement>()

const features = [
  {
    id: 'semantic',
    icon: '🧠',
    title: 'Семантический поиск',
    description: 'ИИ понимает смысл запроса и находит релевантные документы даже без точного совпадения терминов'
  },
  {
    id: 'streaming',
    icon: '⚡',
    title: 'Streaming результаты',
    description: 'Первые результаты появляются менее чем за 200мс, полная выдача формируется постепенно'
  },
  {
    id: 'voice',
    icon: '🔊',
    title: 'Голосовой ввод',
    description: 'Диктуйте запросы голосом — особенно удобно при работе в полевых условиях'
  },
  {
    id: 'graph',
    icon: '📊',
    title: 'Граф знаний',
    description: 'Интерактивная визуализация связей между документами, стандартами и оборудованием'
  },
  {
    id: 'ocr',
    icon: '📄',
    title: 'OCR + индексация',
    description: 'Автоматическое распознавание и индексация PDF, чертежей DWG и отсканированных документов'
  },
  {
    id: 'versions',
    icon: '🔄',
    title: 'Управление версиями',
    description: 'Отслеживание изменений в нормативах, подсветка различий между редакциями'
  }
]

function handleSearch(query: string) {
  searchStore.search(query)
}

function scrollTo(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleScroll() {
  const heroHeight = heroSection.value?.offsetHeight || 0
  showStickyNav.value = window.scrollY > heroHeight * 0.8
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.landing {
  min-height: 100vh;
  font-family: $font-family-primary;
}

// === STICKY NAVIGATION ===
.sticky-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: $color-card-bg;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid $color-card-border;
  z-index: $z-sticky-nav;
  transform: translateY(-100%);
  transition: transform $transition-smooth;
  
  &.visible {
    transform: translateY(0);
  }
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: $font-weight-semibold;
  color: $color-text-main;
}

.nav-menu {
  display: flex;
  gap: 32px;
  
  @media (max-width: 768px) {
    display: none;
  }
}

.nav-link {
  color: $color-text-secondary;
  text-decoration: none;
  font-weight: $font-weight-medium;
  transition: color $transition-fast;
  
  &:hover {
    color: $color-accent-flame;
  }
}

.nav-cta {
  background: linear-gradient(135deg, $color-accent-flame 0%, $color-accent-flame-end 100%);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: $color-shadow-soft;
  }
}

// === SECTIONS ===
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: $font-weight-light;
  color: $color-text-main;
  margin-bottom: 16px;
}

.section-description {
  font-size: 1.25rem;
  color: $color-text-secondary;
  max-width: 600px;
  margin: 0 auto;
}

// === SEARCH SECTION ===
.search-section {
  padding: $section-padding 0;
  background: linear-gradient(180deg, $color-bg-gradient-bottom 0%, $color-bg-gradient-top 100%);
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.enhanced-search {
  :deep(.search-oval) {
    box-shadow: $color-glow-blue, $color-shadow-soft;
    transition: box-shadow $transition-smooth;
    
    &:focus-within {
      box-shadow: $color-glow-blue, $color-shadow-xl;
    }
  }
}

.search-stats {
  background: $color-card-bg;
  border: 1px solid $color-card-border;
  border-radius: 16px;
  padding: 12px 24px;
  backdrop-filter: blur(10px);
}

.stats-text {
  font-size: 0.875rem;
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
}

// === RESULTS SECTION ===
.results-section {
  padding: $section-padding 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.results-title {
  font-size: 1.5rem;
  font-weight: $font-weight-medium;
  color: $color-text-main;
}

.graph-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: $color-card-bg;
  border: 1px solid $color-card-border;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    background: rgba(41, 182, 246, 0.1);
    border-color: $color-accent-flame;
  }
}

.animated-results {
  :deep(.result-list) {
    > * {
      animation: slideInUp 0.5s ease-out;
      animation-fill-mode: both;
    }
    
    @for $i from 1 through 10 {
      > *:nth-child(#{$i}) {
        animation-delay: #{($i - 1) * 0.1}s;
      }
    }
  }
}

// === KPI SECTION ===
.kpi-section {
  padding: $section-padding 0;
  background: linear-gradient(135deg, rgba(41, 182, 246, 0.05) 0%, rgba(255, 160, 0, 0.05) 100%);
}

.kpi-header {
  text-align: center;
  margin-bottom: 48px;
}

.kpi-title {
  font-size: 2rem;
  font-weight: $font-weight-medium;
  color: $color-text-main;
  margin-bottom: 16px;
}

.kpi-description {
  font-size: 1.125rem;
  color: $color-text-secondary;
}

// === FEATURES SECTION ===
.features-section {
  padding: $section-padding 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

.feature-card {
  background: $color-card-bg;
  border: 1px solid $color-card-border;
  border-radius: $card-radius;
  padding: 32px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all $transition-smooth;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $color-shadow-xl;
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: $font-weight-semibold;
  color: $color-text-main;
  margin-bottom: 12px;
}

.feature-description {
  color: $color-text-secondary;
  line-height: 1.6;
}

// === DEMO SECTION ===
.demo-section {
  padding: $section-padding 0;
  background: linear-gradient(180deg, $color-bg-gradient-top 0%, $color-bg-gradient-bottom 100%);
}

.demo-container {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

.demo-video-placeholder {
  position: relative;
  width: 800px;
  height: 450px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: $card-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all $transition-smooth;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: $color-shadow-xl;
  }
}

.play-button {
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all $transition-fast;
}

.play-icon {
  font-size: 32px;
  color: $color-text-main;
  margin-left: 4px;
}

.video-overlay {
  position: absolute;
  bottom: 32px;
  left: 32px;
  color: white;
  
  h3 {
    font-size: 1.5rem;
    font-weight: $font-weight-semibold;
    margin-bottom: 8px;
  }
  
  p {
    opacity: 0.8;
  }
}

// === FOOTER ===
.footer {
  background: #0f172a;
  color: #e2e8f0;
  padding: 64px 0 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-brand {
  margin-bottom: 48px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: $font-weight-semibold;
  margin-bottom: 16px;
}

.footer-tagline {
  color: #94a3b8;
  max-width: 400px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
}

.footer-title {
  font-weight: $font-weight-semibold;
  margin-bottom: 16px;
  color: white;
}

.footer-link {
  display: block;
  color: #94a3b8;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color $transition-fast;
  
  &:hover {
    color: $color-accent-flame;
  }
}

.footer-bottom {
  border-top: 1px solid #334155;
  padding: 24px 0;
  
  .footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
    }
  }
}

.footer-copyright {
  color: #64748b;
  font-size: 0.875rem;
}

.footer-social {
  display: flex;
  gap: 24px;
}

.social-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: $font-weight-medium;
  transition: color $transition-fast;
  
  &:hover {
    color: $color-accent-flame;
  }
}

// === ANIMATIONS ===
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-results :deep(*),
  .feature-card,
  .demo-video-placeholder {
    animation: none !important;
    transition: none !important;
  }
}
</style> 