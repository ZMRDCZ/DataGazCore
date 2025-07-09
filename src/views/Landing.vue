<template>
  <div class="landing">
    <!-- Development Banner -->
    <div class="dev-banner">
      <div class="dev-banner-content">
        <div class="dev-icon">🚧</div>
        <div class="dev-text">
          <span class="dev-title">Сайт в разработке</span>
          <span class="dev-subtitle">Мы работаем над улучшением функционала</span>
        </div>
        <div class="dev-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <span class="progress-text">75% готово</span>
        </div>
      </div>
    </div>

    <!-- Hero Section with Search -->
    <section class="hero-section" id="hero">
      <div class="hero-background">
        <div class="grid-pattern"></div>
      </div>
      
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🧠</span>
            <span class="badge-text">DataGazCore</span>
            <span class="badge-version">v0.0</span>
          </div>
          
          <h1 class="hero-title">
            Интеллектуальная система
            <span class="title-highlight">управления знаниями</span>
            в газовой отрасли
          </h1>
          
          <p class="hero-description">
            Мгновенный поиск по ГОСТ, СП, инцидентам и документации. 
            Автоматическое создание чек-листов для ТОиР. 
            ИИ-анализ соответствия нормативам.
          </p>
          
          <div class="hero-search-container">
            <HeroSearch @search="handleSearch" />
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">0.4с</div>
              <div class="stat-label">поиск документа</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">15,000+</div>
              <div class="stat-label">документов в базе</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">95%</div>
              <div class="stat-label">точность ИИ</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Section -->
    <section class="features-section" id="features">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Ключевые возможности</h2>
          <p class="section-subtitle">
            Комплексное решение для работы с нормативно-технической документацией
          </p>
        </div>
        
        <div class="features-grid">
          <div 
            v-for="feature in keyFeatures" 
            :key="feature.id"
            class="feature-card"
            @click="selectFeature(feature)"
            :class="{ active: selectedFeature?.id === feature.id }"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-benefits">
              <span 
                v-for="benefit in feature.benefits" 
                :key="benefit"
                class="benefit-tag"
              >
                {{ benefit }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Контейнер коллаборации -->
    <section class="collaboration-section">
      <div class="section-container collaboration-container">
        <div class="collab-header">
          <h2>Коллаборация DataGazCore и GazNetCAD</h2>
          <p>Единая экосистема для автоматизации проектирования, анализа и управления газораспределительными сетями.</p>
        </div>
        
        <div class="collab-network">
          <!-- DataGazCore блок с огненными эффектами -->
          <div class="collab-block datagazcore-block">
            <div class="flame-bg">
              <div class="flame flame-1"></div>
              <div class="flame flame-2"></div>
              <div class="flame flame-3"></div>
            </div>
            <div class="collab-content-inner">
              <div class="collab-logo">🧠</div>
              <div class="collab-title">DataGazCore</div>
              <div class="collab-desc">ИИ-поиск, анализ нормативов, управление знаниями</div>
            </div>
            <div class="flame-particles">
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
            </div>
          </div>

          <!-- Переплетающиеся связи -->
          <div class="connection-web">
            <svg class="connection-svg" viewBox="0 0 400 300">
              <defs>
                <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
                  <stop offset="50%" style="stop-color:#4338ca;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <!-- Главные соединительные линии -->
              <path class="connection-line main-line" d="M 50 150 Q 200 50 350 150" stroke="url(#connection-gradient)" />
              <path class="connection-line alt-line" d="M 50 150 Q 200 250 350 150" stroke="url(#connection-gradient)" />
              
              <!-- Вспомогательные переплетения -->
              <path class="connection-line weave-1" d="M 100 100 Q 200 150 300 200" stroke="url(#connection-gradient)" />
              <path class="connection-line weave-2" d="M 100 200 Q 200 150 300 100" stroke="url(#connection-gradient)" />
              
              <!-- Центральный узел синергии -->
              <circle class="synergy-node" cx="200" cy="150" r="15" fill="url(#connection-gradient)" />
              
              <!-- Пульсирующие точки -->
              <circle class="pulse-dot dot-1" cx="125" cy="100" r="3" fill="#ff6b35" />
              <circle class="pulse-dot dot-2" cx="275" cy="200" r="3" fill="#1e3a8a" />
              <circle class="pulse-dot dot-3" cx="125" cy="200" r="3" fill="#ff6b35" />
              <circle class="pulse-dot dot-4" cx="275" cy="100" r="3" fill="#1e3a8a" />
            </svg>
            
            <div class="energy-flow">
              <div class="energy-particle ep-1"></div>
              <div class="energy-particle ep-2"></div>
              <div class="energy-particle ep-3"></div>
              <div class="energy-particle ep-4"></div>
            </div>
          </div>

          <!-- GazNetCAD блок с неоновыми эффектами -->
          <div class="collab-block gaznetcad-block">
            <div class="neon-bg">
              <div class="neon-ring ring-1"></div>
              <div class="neon-ring ring-2"></div>
              <div class="neon-ring ring-3"></div>
            </div>
            <div class="collab-content-inner">
              <div class="collab-logo">🛠️</div>
              <div class="collab-title">GazNetCAD</div>
              <div class="collab-desc">Автоматизированное проектирование газовых сетей</div>
            </div>
            <div class="circuit-lines">
              <div class="circuit-line cl-1"></div>
              <div class="circuit-line cl-2"></div>
              <div class="circuit-line cl-3"></div>
              <div class="circuit-line cl-4"></div>
            </div>
          </div>

          <!-- Результат синергии -->
          <div class="synergy-result">
            <div class="result-glow"></div>
            <div class="collab-logo synergy-icon">🚀</div>
            <div class="collab-title">Синергия</div>
            <div class="collab-desc">Быстрое проектирование, интеллектуальный анализ, полная цифровизация процессов</div>
            <div class="sparkles">
              <div class="sparkle s-1">✨</div>
              <div class="sparkle s-2">✨</div>
              <div class="sparkle s-3">✨</div>
              <div class="sparkle s-4">✨</div>
            </div>
          </div>
        </div>
        
        <div class="collab-footer">
          <p>Интеграция DataGazCore и GazNetCAD позволяет проектировать, анализировать и сопровождать газовые сети в единой цифровой среде.</p>
        </div>
      </div>
    </section>

    <!-- Interactive Search Demo -->
    <section class="search-demo-section" id="demo">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Демонстрация поиска</h2>
          <p class="section-subtitle">
            Посмотрите как работает интеллектуальный поиск документов
          </p>
        </div>
        
        <div class="demo-container">
          <SearchDemo @create-maintenance-task="handleMaintenanceTask" />
        </div>
      </div>
    </section>

    <!-- Knowledge Management Section -->
    <section class="knowledge-section" id="knowledge">
      <div class="section-container">
        <div class="section-header" style="text-align:center; margin-bottom: 2.5rem;">
          <h2 class="section-title" style="font-size:2.4rem; font-weight:800; letter-spacing:-1px;">
            Управление знаниями <span class="highlight" style="color:#ff6b35;">в DataGazCore</span>
          </h2>
          <p class="section-subtitle" style="color:#666; font-size:1.15rem; max-width:600px; margin:0 auto;">
            DataGazCore — интеллектуальная система поиска и анализа технических знаний, а <b>GaznetCAD</b> — современная платформа для автоматизированного проектирования газовых сетей с интеграцией управления инженерной и проектной документацией.
          </p>
        </div>
        <div class="knowledge-features-flex" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:2.5rem; margin-bottom:2.5rem;">
          <!-- Граф знаний -->
          <div class="knowledge-feature-card" style="background:#fff; border-radius:1.5rem; box-shadow:0 4px 24px 0 rgba(41,182,246,0.10); padding:2rem 1.5rem; display:flex; flex-direction:column; align-items:center; transition:box-shadow .2s;">
            <div class="feature-icon-block" style="margin-bottom:1.2rem;">
              <div class="graph-nodes-row" style="display:flex; gap:0.7rem;">
                <span class="node" style="background:#e3f2fd; color:#1976d2; border-radius:8px; padding:0.4em 1em; font-weight:600; font-size:1.1em;">ГОСТ</span>
                <span class="node" style="background:#fce4ec; color:#d81b60; border-radius:8px; padding:0.4em 1em; font-weight:600; font-size:1.1em;">СП</span>
                <span class="node" style="background:#e8f5e9; color:#388e3c; border-radius:8px; padding:0.4em 1em; font-weight:600; font-size:1.1em;">Оборудование</span>
                <span class="node" style="background:#fff3e0; color:#f57c00; border-radius:8px; padding:0.4em 1em; font-weight:600; font-size:1.1em;">ТОиР</span>
              </div>
            </div>
            <div class="feature-content-block" style="text-align:center;">
              <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:0.5rem; color:#2a4d8f;">График знаний</h3>
              <p style="color:#888; margin-bottom:0.7rem;">Визуализация связей между документами, оборудованием и процедурами</p>
              <ul style="list-style:none; padding:0; margin:0; color:#444;">
                <li style="margin-bottom:0.3em;">Автоматическое выявление зависимостей</li>
                <li style="margin-bottom:0.3em;">Карта влияния изменений</li>
                <li>Поиск по семантическим связям</li>
              </ul>
            </div>
          </div>
          <!-- Чек-листы -->
          <div class="knowledge-feature-card" style="background:#fff; border-radius:1.5rem; box-shadow:0 4px 24px 0 rgba(255,107,53,0.10); padding:2rem 1.5rem; display:flex; flex-direction:column; align-items:center; transition:box-shadow .2s;">
            <div class="feature-icon-block" style="margin-bottom:1.2rem;">
              <div class="checklist-preview" style="background:#f9fbe7; border-radius:1rem; padding:1rem 1.2rem; box-shadow:0 2px 8px 0 rgba(255,193,7,0.08);">
                <div class="checklist-header" style="display:flex; align-items:center; gap:0.7em; margin-bottom:0.7em;">
                  <span class="checklist-icon" style="font-size:1.5em;">📋</span>
                  <span class="checklist-title" style="font-weight:700; color:#f57c00;">Чек-лист ТОиР #2024-041</span>
                </div>
                <div class="checklist-items">
                  <div class="checklist-item completed" style="display:flex; align-items:center; gap:0.5em; color:#388e3c; font-weight:600;">
                    <span class="check">✓</span>
                    <span class="item-text">Проверка давления по ГОСТ</span>
                  </div>
                  <div class="checklist-item" style="display:flex; align-items:center; gap:0.5em; color:#888;">
                    <span class="check">◯</span>
                    <span class="item-text">Замена фильтров</span>
                  </div>
                  <div class="checklist-item" style="display:flex; align-items:center; gap:0.5em; color:#888;">
                    <span class="check">◯</span>
                    <span class="item-text">Калибровка датчиков</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="feature-content-block" style="text-align:center;">
              <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:0.5rem; color:#f57c00;">Умные чек-листы</h3>
              <p style="color:#888; margin-bottom:0.7rem;">Автоматическая генерация процедур на основе нормативов</p>
              <ul style="list-style:none; padding:0; margin:0; color:#444;">
                <li style="margin-bottom:0.3em;">Создание из любого документа</li>
                <li style="margin-bottom:0.3em;">Актуализация при изменении ГОСТ</li>
                <li>Интеграция с системами ТОиР</li>
              </ul>
            </div>
          </div>
          <!-- Анализ изменений -->
          <div class="knowledge-feature-card" style="background:#fff; border-radius:1.5rem; box-shadow:0 4px 24px 0 rgba(67,56,202,0.10); padding:2rem 1.5rem; display:flex; flex-direction:column; align-items:center; transition:box-shadow .2s;">
            <div class="feature-icon-block" style="margin-bottom:1.2rem;">
              <div class="diff-preview" style="background:#ede7f6; border-radius:1rem; padding:1rem 1.2rem; box-shadow:0 2px 8px 0 rgba(67,56,202,0.08);">
                <div class="diff-header" style="font-weight:700; color:#5e35b1; margin-bottom:0.7em;">
                  <span class="diff-title">СП 62.13330-2021 vs 2011</span>
                </div>
                <div class="diff-content">
                  <div class="diff-line added" style="color:#388e3c; font-weight:600;">+ Требования к автоматизации ГРС</div>
                  <div class="diff-line modified" style="color:#fbc02d; font-weight:600;">~ Пункт 5.2.1 - нормы давления</div>
                  <div class="diff-line removed" style="color:#d32f2f; font-weight:600;">- Устаревшие требования</div>
                </div>
              </div>
            </div>
            <div class="feature-content-block" style="text-align:center;">
              <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:0.5rem; color:#5e35b1;">Анализ изменений</h3>
              <p style="color:#888; margin-bottom:0.7rem;">Автоматическое сравнение версий документов</p>
              <ul style="list-style:none; padding:0; margin:0; color:#444;">
                <li style="margin-bottom:0.3em;">Подсветка всех изменений</li>
                <li style="margin-bottom:0.3em;">Оценка влияния на проекты</li>
                <li>Уведомления о критичных правках</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="gaznetcad-note" style="background:#fff7e6; border-left:4px solid #ff6b35; padding:1.2rem 2rem; border-radius:1rem; font-size:1.1rem; margin:0 auto; max-width:700px; color:#a65b2e;">
          <strong>DataGazCore</strong> помогает инженерам быстро находить нужные знания, автоматизировать рутинные задачи и принимать обоснованные проектные решения на основе актуальных нормативов и анализа изменений.
        </div>
      </div>
    </section>

    <!-- GaznetCAD Advantages Section -->
    <section class="gaznetcad-advantages-section" style="background:#f8fafc; padding:3rem 0;">
      <div class="section-container">
        <div class="section-header" style="text-align:center; margin-bottom:2.2rem;">
          <h2 class="section-title" style="font-size:2.1rem; font-weight:800; color:#2a4d8f;">Преимущества использования GaznetCAD для проектировщиков</h2>
          <p class="section-subtitle" style="color:#666; font-size:1.1rem; max-width:600px; margin:0 auto;">
            GaznetCAD — это не просто САПР, а цифровая среда для оптимизации работы с инженерной и проектной документацией.
          </p>
        </div>
        <div class="gaznetcad-advantages-grid" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:2rem;">
          <div class="advantage-card" style="background:#fff; border-radius:1.2rem; box-shadow:0 2px 12px 0 rgba(41,182,246,0.08); padding:1.5rem 1.2rem;">
            <h3 style="color:#1976d2; font-size:1.15rem; font-weight:700; margin-bottom:0.7rem;">Автоматизация рутинных операций</h3>
            <ul style="color:#444; padding-left:1.2em;">
              <li>Генерация проектной документации по шаблонам и нормативам</li>
              <li>Автоматическое обновление при изменении стандартов</li>
              <li>Интеграция с системами хранения и согласования</li>
            </ul>
          </div>
          <div class="advantage-card" style="background:#fff; border-radius:1.2rem; box-shadow:0 2px 12px 0 rgba(255,107,53,0.08); padding:1.5rem 1.2rem;">
            <h3 style="color:#ff6b35; font-size:1.15rem; font-weight:700; margin-bottom:0.7rem;">Управление инженерными знаниями</h3>
            <ul style="color:#444; padding-left:1.2em;">
              <li>Централизованный доступ к актуальным нормативам, чертежам и спецификациям</li>
              <li>Поиск и анализ связей между объектами и требованиями</li>
              <li>Семантический поиск по всей проектной базе</li>
            </ul>
          </div>
          <div class="advantage-card" style="background:#fff; border-radius:1.2rem; box-shadow:0 2px 12px 0 rgba(67,56,202,0.08); padding:1.5rem 1.2rem;">
            <h3 style="color:#5e35b1; font-size:1.15rem; font-weight:700; margin-bottom:0.7rem;">Оптимизация работы проектировщика</h3>
            <ul style="color:#444; padding-left:1.2em;">
              <li>Сокращение времени на подготовку и согласование проектов</li>
              <li>Снижение количества ошибок за счет автоматических проверок</li>
              <li>Уведомления о критичных изменениях и контроль версий</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" id="cta">
      <div class="section-container">
        <div class="cta-wrapper">
          <div class="cta-background">
            <div class="cta-gradient-bg"></div>
            <div class="cta-particles">
              <div class="particle p-1"></div>
              <div class="particle p-2"></div>
              <div class="particle p-3"></div>
              <div class="particle p-4"></div>
            </div>
          </div>
          
          <div class="cta-content">
            <div class="cta-header">
              <div class="cta-icon">
                <span class="icon-flame">🔥</span>
                <span class="icon-main">💬</span>
              </div>
              <h2 class="cta-title">Свяжитесь с нашей командой</h2>
              <p class="cta-description">
                Готовы внедрить интеллектуальную систему управления знаниями в вашей компании? 
                Обсудим возможности GaznetCAD и DataGazCore для вашего бизнеса.
              </p>
            </div>
            
            <div class="contact-grid">
              <div class="contact-card email-card">
                <div class="card-glow"></div>
                <div class="contact-icon">
                  <span class="icon-bg"></span>
                  📧
                </div>
                <div class="contact-info">
                  <div class="contact-label">Email</div>
                  <a href="mailto:komarovda@seznam.cz" class="contact-value">komarovda@seznam.cz</a>
                </div>
              </div>
              
              <div class="contact-card phone-card">
                <div class="card-glow"></div>
                <div class="contact-icon">
                  <span class="icon-bg"></span>
                  📞
                </div>
                <div class="contact-info">
                  <div class="contact-label">Телефон</div>
                  <a href="tel:+79951173629" class="contact-value">+7 995 117 36 29</a>
                </div>
              </div>
              
              <div class="contact-card telegram-card">
                <div class="card-glow"></div>
                <div class="contact-icon">
                  <span class="icon-bg"></span>
                  📱
                </div>
                <div class="contact-info">
                  <div class="contact-label">Telegram</div>
                  <a href="https://t.me/zmrdcz" class="contact-value">@zmrdcz</a>
                </div>
              </div>
            </div>
            
            <div class="cta-footer">
              <div class="response-time">
                <span class="response-icon">⚡</span>
                <span class="response-text">Ответим в течение 24 часов</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Document Preview Modal -->
    <DocPreview 
      :document="previewDocument" 
      :is-visible="showDocPreview"
      @close="closeDocPreview"
    />
    
    <!-- Mobile Navigation -->
    <MobileNavigation @demo-request="handleDemoRequest" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSearch from '@/components/HeroSearch.vue'
import SearchDemo from '@/components/SearchDemo.vue'
import DocPreview from '@/components/DocPreview.vue'
import KnowledgeManagementDemo from '@/components/KnowledgeManagementDemo.vue'
import MobileNavigation from '@/components/MobileNavigation.vue'

interface Feature {
  id: string
  icon: string
  title: string
  description: string
  benefits: string[]
}

interface ContactForm {
  email: string
  company: string
}

// Реактивные данные
const selectedFeature = ref<Feature | null>(null)
const showDocPreview = ref(false)
const previewDocument = ref(null)
const contactForm = ref<ContactForm>({
  email: '',
  company: ''
})

// Примеры поиска
const searchExamples = ref([
  'СП 62.13330-2021',
  'ГОСТ 5542-2014',
  'Инцидент ГРС-12'
])

// Ключевые функции
const keyFeatures = ref<Feature[]>([
  {
    id: 'search',
    icon: '🔍',
    title: 'Интеллектуальный поиск',
    description: 'ИИ-поиск по содержанию документов, а не только по названиям. Полная интеграция с GazNetCAD для поиска по проектам газовых сетей.',
    benefits: ['Семантический поиск', 'Поиск по изображениям', 'Голосовые запросы', 'Интеграция с GazNetCAD']
  },
  {
    id: 'analysis',
    icon: '📊',
    title: 'Анализ соответствия',
    description: 'Автоматическая проверка проектов на соответствие нормативам. Совместная работа с GazNetCAD для анализа проектных решений.',
    benefits: ['Проверка ГОСТ/СП', 'Выявление нарушений', 'Рекомендации', 'Анализ проектов из GazNetCAD']
  },
  {
    id: 'maintenance',
    icon: '🔧',
    title: 'Управление ТОиР',
    description: 'Генерация чек-листов и процедур обслуживания с учётом данных из GazNetCAD.',
    benefits: ['Автоматические чек-листы', 'Планирование ТОиР', 'Учёт изменений', 'Синхронизация с GazNetCAD']
  },
  {
    id: 'knowledge',
    icon: '🧠',
    title: 'База знаний',
    description: 'Структурированное хранение и связывание информации, включая данные из GazNetCAD.',
    benefits: ['График знаний', 'Версионность', 'История изменений', 'Импорт данных из GazNetCAD']
  }
])

// Методы
function handleSearch(query: string) {
  console.log('Поиск:', query)
  // TODO: Реализовать поиск
}

function performExampleSearch(example: string) {
  handleSearch(example)
}

function selectFeature(feature: Feature) {
  selectedFeature.value = selectedFeature.value?.id === feature.id ? null : feature
}

function handleMaintenanceTask(checklist: any[]) {
  console.log('Создание задачи ТОиР:', checklist)
  // TODO: Реализовать создание задачи
}

function openKnowledgeDemo() {
  console.log('Открытие демо управления знаниями')
  // TODO: Открыть интерактивное демо
}

function requestDemo() {
  if (!contactForm.value.email) return
  
  console.log('Запрос демо:', contactForm.value)
  // TODO: Отправить запрос на демо
  
  // Показать уведомление об успехе
  alert('Спасибо! Мы свяжемся с вами в течение 24 часов.')
  
  // Очистить форму
  contactForm.value = { email: '', company: '' }
}

function closeDocPreview() {
  showDocPreview.value = false
  previewDocument.value = null
}

function handleDemoRequest() {
  // Прокрутка к секции контактов
  const ctaSection = document.querySelector('#cta')
  if (ctaSection) {
    ctaSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Жизненный цикл
onMounted(() => {
  // Инициализация
})

onUnmounted(() => {
  // Очистка
})
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.landing {
  min-height: 100vh;
  background: $color-bg-gradient-top;
}

// === DEVELOPMENT BANNER ===
.dev-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-sticky-nav + 10;
  background: linear-gradient(90deg, $color-accent 0%, $color-accent-light 100%);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(255, 102, 0, 0.3);
  animation: bannerSlideDown 0.6s ease-out;
  
  .dev-banner-content {
    @include container;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 24px;
    
    @include mobile {
      flex-direction: column;
      gap: 12px;
      padding: 16px 20px;
    }
  }
  
  .dev-icon {
    font-size: 1.5rem;
    animation: constructionPulse 2s ease-in-out infinite;
    
    @include mobile {
      font-size: 1.2rem;
    }
  }
  
  .dev-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    @include mobile {
      text-align: center;
    }
    
    .dev-title {
      font-weight: $font-weight-bold;
      color: white;
      font-size: 1rem;
      
      @include mobile {
        font-size: 0.9rem;
      }
    }
    
    .dev-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.85rem;
      
      @include mobile {
        font-size: 0.8rem;
      }
    }
  }
  
  .dev-progress {
    display: flex;
    align-items: center;
    gap: 12px;
    
    @include mobile {
      width: 100%;
      justify-content: center;
    }
    
    .progress-bar {
      width: 120px;
      height: 8px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      
      @include mobile {
        width: 100px;
        height: 6px;
      }
      
      .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 75%;
        background: linear-gradient(90deg, white, rgba(255, 255, 255, 0.8));
        border-radius: 4px;
        animation: progressGlow 2s ease-in-out infinite;
      }
    }
    
    .progress-text {
      color: white;
      font-size: 0.8rem;
      font-weight: $font-weight-medium;
      white-space: nowrap;
      
      @include mobile {
        font-size: 0.75rem;
      }
    }
  }
}

// Анимации для баннера
@keyframes bannerSlideDown {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes constructionPulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(5deg);
  }
  50% {
    transform: scale(0.95) rotate(-3deg);
  }
  75% {
    transform: scale(1.05) rotate(2deg);
  }
}

@keyframes progressGlow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 16px rgba(255, 255, 255, 0.8);
  }
}

// === HERO SECTION ===
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #005bbf 0%, #4d8fd9 50%, #e6f3ff 100%);
  padding-top: 80px; // Отступ для баннера разработки
  
  @include mobile {
    padding-top: 120px; // Больше отступа на мобильных
  }
}

.hero-background {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  
  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(90deg, $color-primary 1px, transparent 1px),
      linear-gradient(0deg, $color-primary 1px, transparent 1px);
    background-size: 50px 50px;
  }
}

.hero-container {
  @include container;
  position: relative;
  z-index: $z-content;
}

.hero-content {
  max-width: 800px;
  text-align: center;
  
  @include mobile {
    padding: 0 20px;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 20px;
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: $color-shadow-soft;
  
  .badge-icon {
    font-size: 1.2rem;
  }
  
  .badge-text {
    font-weight: $font-weight-semibold;
    color: $color-primary;
  }
  
  .badge-version {
    background: $color-accent;
    color: white;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: $font-weight-bold;
  }
}

.hero-title {
  font-size: $font-size-h1-desktop;
  font-weight: $font-weight-bold;
  color: white;
  margin-bottom: 24px;
  line-height: 1.2;
  
  @include mobile {
    font-size: $font-size-h1-mobile;
  }
  
  .title-highlight {
    background: linear-gradient(45deg, #ff6600, #ffcc99);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.hero-description {
  font-size: $font-size-body-desktop;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 48px;
  line-height: 1.6;
  
  @include mobile {
    font-size: $font-size-body-mobile;
    margin-bottom: 32px;
  }
}

.hero-search-container {
  margin-bottom: 48px;
}

.search-examples {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  
  .examples-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }
  
  .example-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 6px 16px;
    border-radius: 16px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: $transition-fast;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
  }
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  
  @include mobile {
    flex-direction: column;
    gap: 24px;
    align-items: center;
  }
  
  .stat-item {
    text-align: center;
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: $font-weight-bold;
      color: white;
      display: block;
      
      @include mobile {
        font-size: 2rem;
      }
    }
    
    .stat-label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin-top: 4px;
    }
  }
}

// === SECTIONS ===
.section-container {
  @include container;
  padding-top: $section-padding;
  padding-bottom: $section-padding;
  
  @include mobile {
    padding-top: $section-padding-mobile;
    padding-bottom: $section-padding-mobile;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
  
  @include mobile {
    margin-bottom: 48px;
  }
}

.section-title {
  font-size: $font-size-h2-desktop;
  font-weight: $font-weight-bold;
  color: $color-text-main;
  margin-bottom: 16px;
  
  @include mobile {
    font-size: $font-size-h2-mobile;
  }
}

.section-subtitle {
  font-size: 1.25rem;
  color: $color-text-light;
  max-width: 600px;
  margin: 0 auto;
  
  @include mobile {
    font-size: 1.125rem;
  }
}

// === FEATURES SECTION ===
.features-section {
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  
  @include mobile {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.feature-card {
  background: white;
  border: 2px solid transparent;
  border-radius: $card-radius;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: $transition-smooth;
  box-shadow: $color-shadow-soft;
  
  &:hover {
    border-color: $color-primary-light;
    transform: translateY(-4px);
    box-shadow: $color-shadow-medium;
  }
  
  &.active {
    border-color: $color-primary;
    box-shadow: $color-glow-blue;
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 24px;
  }
  
  .feature-title {
    font-size: 1.5rem;
    font-weight: $font-weight-semibold;
    color: $color-text-main;
    margin-bottom: 16px;
  }
  
  .feature-description {
    color: $color-text-light;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  
  .feature-benefits {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  
  .benefit-tag {
    background: $color-bg-gradient-top;
    color: $color-primary;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: $font-weight-medium;
  }
}

// === DEMO SECTION ===
.search-demo-section {
  background: #f8fafe;
}

.demo-container {
  max-width: 900px;
  margin: 0 auto;
}

// === KNOWLEDGE SECTION ===
.knowledge-section {
  background: white;
}

.knowledge-grid {
  display: grid;
  gap: 48px;
  
  @include mobile {
    gap: 32px;
  }
}

.knowledge-feature {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  
  @include mobile {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  &:nth-child(even) {
    .feature-visual {
      order: 2;
    }
    
    @include mobile {
      .feature-visual {
        order: 1;
      }
    }
  }
}

.feature-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.knowledge-graph-preview {
  position: relative;
  width: 300px;
  height: 200px;
  background: #f8fafe;
  border-radius: 16px;
  padding: 20px;
  
  .graph-nodes {
    position: relative;
    height: 100%;
    
    .node {
      position: absolute;
      background: $color-primary;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: $font-weight-medium;
      
      &.node-1 { top: 0; left: 0; }
      &.node-2 { top: 0; right: 0; }
      &.node-3 { bottom: 0; left: 0; }
      &.node-4 { bottom: 0; right: 0; }
    }
  }
  
  .graph-connections {
    position: absolute;
    top: 20px;
    left: 20px;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    pointer-events: none;
    z-index: 1;
  }
}

.checklist-preview {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: $color-shadow-soft;
  border: 1px solid #e0e7ff;
  width: 320px;
  
  .checklist-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    .checklist-icon {
      font-size: 1.2rem;
    }
    
    .checklist-title {
      font-weight: $font-weight-semibold;
      color: $color-text-main;
      font-size: 0.9rem;
    }
  }
  
  .checklist-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .checklist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    
    &.completed {
      .check {
        color: #10b981;
      }
      
      .item-text {
        color: $color-text-light;
        text-decoration: line-through;
      }
    }
    
    .check {
      color: #d1d5db;
      font-weight: bold;
    }
    
    .item-text {
      font-size: 0.9rem;
      color: $color-text-main;
    }
  }
}

.diff-preview {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: $color-shadow-soft;
  border: 1px solid #e0e7ff;
  width: 320px;
  
  .diff-header {
    margin-bottom: 20px;
    
    .diff-title {
      font-weight: $font-weight-semibold;
      color: $color-text-main;
      font-size: 0.9rem;
    }
  }
  
  .diff-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .diff-line {
    font-size: 0.85rem;
    padding: 6px 12px;
    border-radius: 6px;
    
    &.added {
      background: #ecfdf5;
      color: #059669;
    }
    
    &.modified {
      background: #fef3c7;
      color: #d97706;
    }
    
    &.removed {
      background: #fef2f2;
      color: #dc2626;
    }
  }
}

.feature-content {
  h3 {
    font-size: 1.75rem;
    font-weight: $font-weight-semibold;
    color: $color-text-main;
    margin-bottom: 16px;
  }
  
  p {
    color: $color-text-light;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      position: relative;
      padding-left: 24px;
      margin-bottom: 8px;
      color: $color-text-light;
      
      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: $color-accent;
        font-weight: bold;
      }
    }
  }
}

.knowledge-demo-container {
  margin-top: 48px;
}

// === CTA SECTION ===

// === COLLABORATION SECTION ===
.collaboration-section {
  background: radial-gradient(ellipse at center, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(30, 58, 138, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.collaboration-container {
  position: relative;
  z-index: 2;
}

.collab-header {
  text-align: center;
  margin-bottom: 80px;
  
  h2 {
    color: white;
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 20px;
    background: linear-gradient(45deg, #ff6b35, #4338ca, #1e3a8a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto;
  }
}

.collab-network {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  @include mobile {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.collab-block {
  position: relative;
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  transition: all 0.6s ease;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &:hover {
    transform: translateY(-10px) scale(1.05);
  }
}

// === DATAGAZCORE BLOCK (Огненные эффекты) ===
.datagazcore-block {
  background: linear-gradient(135deg, 
    rgba(255, 107, 53, 0.2) 0%, 
    rgba(67, 56, 202, 0.3) 50%, 
    rgba(255, 107, 53, 0.2) 100%);
  border-color: #ff6b35;
  box-shadow: 
    0 0 30px rgba(255, 107, 53, 0.4),
    inset 0 0 30px rgba(255, 107, 53, 0.1);
  
  &:hover {
    box-shadow: 
      0 0 50px rgba(255, 107, 53, 0.6),
      inset 0 0 50px rgba(255, 107, 53, 0.2);
  }
}

.flame-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  overflow: hidden;
  z-index: 1;
}

.flame {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, 
    transparent 0%, 
    rgba(255, 107, 53, 0.3) 30%, 
    rgba(67, 56, 202, 0.2) 60%, 
    transparent 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flame-dance 3s ease-in-out infinite;
  
  &.flame-1 {
    animation-delay: 0s;
    transform: scale(1) rotate(0deg);
  }
  
  &.flame-2 {
    animation-delay: 1s;
    transform: scale(0.8) rotate(120deg);
  }
  
  &.flame-3 {
    animation-delay: 2s;
    transform: scale(0.6) rotate(240deg);
  }
}

.flame-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ff6b35;
  border-radius: 50%;
  animation: particle-float 4s ease-in-out infinite;
  
  &:nth-child(1) { top: 80%; left: 20%; animation-delay: 0s; }
  &:nth-child(2) { top: 70%; left: 70%; animation-delay: 0.8s; }
  &:nth-child(3) { top: 60%; left: 50%; animation-delay: 1.6s; }
  &:nth-child(4) { top: 85%; left: 80%; animation-delay: 2.4s; }
  &:nth-child(5) { top: 75%; left: 30%; animation-delay: 3.2s; }
}

// === GAZNETCAD BLOCK (Неоновые эффекты) ===
.gaznetcad-block {
  background: linear-gradient(135deg, 
    rgba(30, 58, 138, 0.3) 0%, 
    rgba(15, 23, 42, 0.5) 50%, 
    rgba(30, 58, 138, 0.3) 100%);
  border-color: #1e3a8a;
  box-shadow: 
    0 0 30px rgba(30, 58, 138, 0.6),
    inset 0 0 30px rgba(30, 58, 138, 0.2);
  
  &:hover {
    box-shadow: 
      0 0 50px rgba(30, 58, 138, 0.8),
      inset 0 0 50px rgba(30, 58, 138, 0.3);
  }
}

.neon-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  z-index: 1;
}

.neon-ring {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 50%;
  animation: neon-pulse 2s linear infinite;
  
  &.ring-1 {
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    border-color: rgba(30, 58, 138, 0.8);
    animation-delay: 0s;
  }
  
  &.ring-2 {
    top: 30%;
    left: 30%;
    width: 40%;
    height: 40%;
    border-color: rgba(67, 56, 202, 0.6);
    animation-delay: 0.7s;
  }
  
  &.ring-3 {
    top: 40%;
    left: 40%;
    width: 20%;
    height: 20%;
    border-color: rgba(30, 58, 138, 0.4);
    animation-delay: 1.4s;
  }
}

.circuit-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

.circuit-line {
  position: absolute;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(30, 58, 138, 0.8) 50%, 
    transparent 100%);
  animation: circuit-flow 3s linear infinite;
  
  &.cl-1 {
    top: 20%;
    left: 0;
    width: 100%;
    height: 2px;
    animation-delay: 0s;
  }
  
  &.cl-2 {
    top: 0;
    left: 20%;
    width: 2px;
    height: 100%;
    animation-delay: 0.75s;
    background: linear-gradient(0deg, 
      transparent 0%, 
      rgba(30, 58, 138, 0.8) 50%, 
      transparent 100%);
  }
  
  &.cl-3 {
    bottom: 20%;
    left: 0;
    width: 100%;
    height: 2px;
    animation-delay: 1.5s;
  }
  
  &.cl-4 {
    top: 0;
    right: 20%;
    width: 2px;
    height: 100%;
    animation-delay: 2.25s;
    background: linear-gradient(0deg, 
      transparent 0%, 
      rgba(30, 58, 138, 0.8) 50%, 
      transparent 100%);
  }
}

// === CONNECTION WEB ===
.connection-web {
  grid-column: 1 / -1;
  grid-row: 1;
  position: relative;
  z-index: 5;
  height: 300px;
  
  @include mobile {
    grid-row: 2;
    height: 200px;
  }
}

.connection-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.connection-line {
  fill: none;
  stroke-width: 3;
  stroke-dasharray: 10, 5;
  animation: connection-flow 3s linear infinite;
  filter: url(#glow);
  
  &.main-line { animation-delay: 0s; }
  &.alt-line { animation-delay: 1s; }
  &.weave-1 { 
    animation-delay: 2s; 
    stroke-width: 2;
    opacity: 0.7;
  }
  &.weave-2 { 
    animation-delay: 2.5s; 
    stroke-width: 2;
    opacity: 0.7;
  }
}

.synergy-node {
  animation: synergy-pulse 2s ease-in-out infinite;
  filter: url(#glow);
}

.pulse-dot {
  animation: dot-pulse 1.5s ease-in-out infinite;
  
  &.dot-1 { animation-delay: 0s; }
  &.dot-2 { animation-delay: 0.4s; }
  &.dot-3 { animation-delay: 0.8s; }
  &.dot-4 { animation-delay: 1.2s; }
}

.energy-flow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.energy-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff6b35 0%, #4338ca 100%);
  animation: energy-flow 4s linear infinite;
  
  &.ep-1 { 
    top: 50%; 
    left: 12%; 
    animation-delay: 0s; 
  }
  &.ep-2 { 
    top: 25%; 
    left: 25%; 
    animation-delay: 1s; 
  }
  &.ep-3 { 
    top: 75%; 
    left: 25%; 
    animation-delay: 2s; 
  }
  &.ep-4 { 
    top: 50%; 
    right: 12%; 
    animation-delay: 3s; 
  }
}

// === SYNERGY RESULT ===
.synergy-result {
  grid-column: 1 / -1;
  grid-row: 2;
  position: relative;
  text-align: center;
  padding: 40px;
  margin-top: 40px;
  
  @include mobile {
    grid-row: 4;
    margin-top: 20px;
  }
}

.result-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, 
    rgba(255, 107, 53, 0.3) 0%, 
    rgba(67, 56, 202, 0.2) 50%, 
    transparent 100%);
  border-radius: 50%;
  animation: result-glow 3s ease-in-out infinite;
}

.sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1.5rem;
  animation: sparkle-twinkle 2s ease-in-out infinite;
  
  &.s-1 { top: 20%; left: 20%; animation-delay: 0s; }
  &.s-2 { top: 20%; right: 20%; animation-delay: 0.5s; }
  &.s-3 { bottom: 20%; left: 20%; animation-delay: 1s; }
  &.s-4 { bottom: 20%; right: 20%; animation-delay: 1.5s; }
}

// === CONTENT STYLING ===
.collab-content-inner {
  position: relative;
  z-index: 4;
  text-align: center;
}

.collab-logo {
  font-size: 4rem;
  margin-bottom: 20px;
  display: block;
}

.datagazcore-block .collab-title {
  color: #ff6b35;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(255, 107, 53, 0.6);
}

.gaznetcad-block .collab-title {
  color: #1e3a8a;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(30, 58, 138, 0.8);
}

.synergy-result .collab-title {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  background: linear-gradient(45deg, #ff6b35, #4338ca);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.collab-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 300px;
  margin: 0 auto;
}

.collab-footer {
  text-align: center;
  margin-top: 80px;
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

// === ANIMATIONS ===
@keyframes flame-dance {
  0%, 100% { 
    transform: scale(1) rotate(0deg); 
    opacity: 0.8;
  }
  33% { 
    transform: scale(1.1) rotate(5deg); 
    opacity: 1;
  }
  66% { 
    transform: scale(0.9) rotate(-5deg); 
    opacity: 0.9;
  }
}

@keyframes particle-float {
  0%, 100% { 
    transform: translateY(0px) scale(1); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-20px) scale(1.2); 
    opacity: 1;
  }
}

@keyframes neon-pulse {
  0%, 100% { 
    box-shadow: 0 0 5px currentColor;
    opacity: 0.8;
  }
  50% { 
    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
    opacity: 1;
  }
}

@keyframes circuit-flow {
  0% { 
    opacity: 0;
    transform: translateX(-100%);
  }
  50% { 
    opacity: 1;
  }
  100% { 
    opacity: 0;
    transform: translateX(100%);
  }
}

@keyframes connection-flow {
  0% { 
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
  50% { 
    opacity: 1;
  }
  100% { 
    stroke-dashoffset: 30;
    opacity: 0.8;
  }
}

@keyframes synergy-pulse {
  0%, 100% { 
    r: 15;
    opacity: 0.8;
  }
  50% { 
    r: 20;
    opacity: 1;
  }
}

@keyframes dot-pulse {
  0%, 100% { 
    r: 3;
    opacity: 0.6;
  }
  50% { 
    r: 6;
    opacity: 1;
  }
}

@keyframes energy-flow {
  0% { 
    transform: translateX(-20px) scale(0);
    opacity: 0;
  }
  25% { 
    transform: translateX(0px) scale(1);
    opacity: 1;
  }
  75% { 
    transform: translateX(380px) scale(1);
    opacity: 1;
  }
  100% { 
    transform: translateX(400px) scale(0);
    opacity: 0;
  }
}

@keyframes result-glow {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.6;
  }
}

@keyframes sparkle-twinkle {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    opacity: 0.6;
  }
  25% { 
    transform: scale(1.3) rotate(90deg);
    opacity: 1;
  }
  50% { 
    transform: scale(0.8) rotate(180deg);
    opacity: 0.8;
  }
  75% { 
    transform: scale(1.1) rotate(270deg);
    opacity: 1;
  }
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

// Плавные появления для секций
.features-section,
.search-demo-section,
.knowledge-section,
.cta-section,
.collaboration-section {
  animation: fadeInUp 0.8s ease-out;
}
    .cta-section {
      padding: $section-padding 0;
      position: relative;
      overflow: hidden;
      
      @include mobile {
        padding: $section-padding-mobile 0;
      }
    }
    
    .cta-wrapper {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .cta-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      
      .cta-gradient-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: $color-bg-gas-flame;
        border-radius: $card-radius;
        opacity: 0.1;
        animation: pulseGlow $transition-pulse;
        
        @include mobile {
          border-radius: $card-radius-mobile;
        }
      }
      
      .cta-particles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: $color-accent;
          border-radius: 50%;
          animation: floatUpDown $transition-float;
          
          &.p-1 {
            top: 20%;
            left: 10%;
            animation-delay: 0s;
          }
          
          &.p-2 {
            top: 60%;
            right: 15%;
            animation-delay: 0.5s;
          }
          
          &.p-3 {
            bottom: 30%;
            left: 20%;
            animation-delay: 1s;
          }
          
          &.p-4 {
            top: 40%;
            right: 30%;
            animation-delay: 1.5s;
          }
        }
      }
    }
    
    .cta-content {
      position: relative;
      z-index: 2;
      background: $color-card-bg;
      backdrop-filter: blur(10px);
      border-radius: $card-radius;
      padding: 3rem 2.5rem;
      border: 1px solid $color-card-border;
      box-shadow: $color-shadow-xl;
      
      @include mobile {
        padding: 2rem 1.5rem;
        border-radius: $card-radius-mobile;
      }
    }
    
    .cta-header {
      text-align: center;
      margin-bottom: 2.5rem;
      
      .cta-icon {
        position: relative;
        display: inline-block;
        margin-bottom: 1rem;
        
        .icon-flame {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 1.2rem;
          animation: flameFlicker $transition-flame;
          z-index: 2;
        }
        
        .icon-main {
          font-size: 3rem;
          display: block;
          filter: drop-shadow(0 4px 12px rgba(0, 91, 191, 0.3));
        }
      }
      
      .cta-title {
        font-size: 2.5rem;
        font-weight: $font-weight-bold;
        color: $color-primary;
        margin-bottom: 1rem;
        letter-spacing: -1px;
        
        @include mobile {
          font-size: 2rem;
        }
      }
      
      .cta-description {
        font-size: 1.2rem;
        color: $color-text-light;
        line-height: 1.6;
        max-width: 600px;
        margin: 0 auto;
        
        @include mobile {
          font-size: 1.1rem;
        }
      }
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
      
      @include mobile {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
    
    .contact-card {
      position: relative;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      padding: 1.5rem;
      border: 1px solid rgba(0, 91, 191, 0.1);
      transition: all $transition-smooth;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: $color-shadow-medium;
        
        .card-glow {
          opacity: 1;
        }
        
        .contact-icon {
          transform: scale(1.1);
        }
      }
      
      .card-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, $color-primary, $color-accent);
        opacity: 0;
        transition: opacity $transition-smooth;
        z-index: 1;
      }
      
      .contact-icon {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        font-size: 1.8rem;
        margin-bottom: 1rem;
        transition: transform $transition-smooth;
        
        .icon-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: $color-primary;
          border-radius: 50%;
          opacity: 0.1;
          z-index: -1;
        }
      }
      
      .contact-info {
        position: relative;
        z-index: 3;
        
        .contact-label {
          font-size: 0.9rem;
          color: $color-text-light;
          margin-bottom: 0.5rem;
          font-weight: $font-weight-medium;
        }
        
        .contact-value {
          font-size: 1.1rem;
          font-weight: $font-weight-semibold;
          color: $color-primary;
          text-decoration: none;
          transition: color $transition-fast;
          
          &:hover {
            color: $color-accent;
          }
        }
      }
      
      &.email-card:hover .card-glow {
        background: linear-gradient(45deg, #1e40af, #3b82f6);
      }
      
      &.phone-card:hover .card-glow {
        background: linear-gradient(45deg, #059669, #10b981);
      }
      
      &.telegram-card:hover .card-glow {
        background: linear-gradient(45deg, #7c3aed, #a855f7);
      }
    }
    
    .cta-footer {
      text-align: center;
      
      .response-time {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 102, 0, 0.1);
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        border: 1px solid rgba(255, 102, 0, 0.2);
        
        .response-icon {
          font-size: 1.2rem;
          animation: pulseGlow $transition-pulse;
        }
        
        .response-text {
          font-size: 0.95rem;
          color: $color-accent;
          font-weight: $font-weight-medium;
        }
      }
    }
    
    // Keyframes для анимаций
    @keyframes pulseGlow {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(255, 102, 0, 0.3);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 40px rgba(255, 102, 0, 0.6);
        transform: scale(1.02);
      }
    }
    
    @keyframes flameFlicker {
      0% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(5deg); }
      50% { transform: scale(0.9) rotate(-3deg); }
      75% { transform: scale(1.05) rotate(2deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    
    @keyframes floatUpDown {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
    
    // === МОБИЛЬНАЯ АДАПТАЦИЯ ===
    @include mobile {
      // Общие мобильные стили
      .landing {
        overflow-x: hidden;
      }
      
      // Улучшенная навигация для мобильных
      .dev-banner {
        position: sticky;
        top: 0;
        z-index: $z-sticky-nav + 10;
      }
      
      // Hero секция для мобильных
      .hero-section {
        min-height: 100vh;
        padding: 120px 0 60px;
        
        .hero-content {
          padding: 0 16px;
        }
        
        .hero-title {
          font-size: clamp(1.8rem, 8vw, 2.5rem);
          line-height: 1.1;
          margin-bottom: 20px;
        }
        
        .hero-description {
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 32px;
          padding: 0 8px;
        }
        
        .hero-stats {
          flex-direction: column;
          gap: 20px;
          
          .stat-item {
            .stat-number {
              font-size: 1.8rem;
            }
            
            .stat-label {
              font-size: 0.8rem;
            }
          }
        }
      }
      
      // Секции для мобильных
      .section-container {
        padding: 40px 16px;
      }
      
      .section-header {
        margin-bottom: 32px;
        
        .section-title {
          font-size: clamp(1.5rem, 6vw, 2rem);
          line-height: 1.2;
        }
        
        .section-subtitle {
          font-size: 1rem;
          line-height: 1.5;
          padding: 0 8px;
        }
      }
      
      // Карточки функций для мобильных
      .features-grid {
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 0 8px;
      }
      
      .feature-card {
        padding: 24px 20px;
        border-radius: 16px;
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }
        
        .feature-title {
          font-size: 1.3rem;
          margin-bottom: 12px;
        }
        
        .feature-description {
          font-size: 0.95rem;
          margin-bottom: 20px;
        }
        
        .feature-benefits {
          gap: 6px;
          
          .benefit-tag {
            font-size: 0.8rem;
            padding: 3px 10px;
          }
        }
      }
      
      // Коллаборация для мобильных
      .collaboration-section {
        .collaboration-container {
          padding: 40px 16px;
        }
        
        .collab-header {
          text-align: center;
          margin-bottom: 32px;
          
          h2 {
            font-size: clamp(1.5rem, 6vw, 2rem);
            line-height: 1.2;
            margin-bottom: 12px;
          }
          
          p {
            font-size: 1rem;
            line-height: 1.5;
          }
        }
        
        .collab-network {
          flex-direction: column;
          gap: 24px;
          
          .collab-block {
            width: 100%;
            padding: 24px 20px;
            border-radius: 16px;
            
            .collab-content-inner {
              .collab-logo {
                font-size: 2rem;
                margin-bottom: 12px;
              }
              
              .collab-title {
                font-size: 1.3rem;
                margin-bottom: 8px;
              }
              
              .collab-desc {
                font-size: 0.9rem;
              }
            }
          }
          
          .connection-web {
            height: 120px;
            margin: 16px 0;
            
            .connection-svg {
              width: 100%;
              height: 100%;
            }
          }
          
          .synergy-result {
            padding: 20px;
            border-radius: 16px;
            
            .collab-logo {
              font-size: 2rem;
              margin-bottom: 12px;
            }
            
            .collab-title {
              font-size: 1.3rem;
              margin-bottom: 8px;
            }
            
            .collab-desc {
              font-size: 0.9rem;
            }
          }
        }
        
        .collab-footer {
          margin-top: 24px;
          padding: 16px;
          border-radius: 12px;
          
          p {
            font-size: 0.9rem;
            line-height: 1.5;
          }
        }
      }
      
      // Демо секция для мобильных
      .search-demo-section {
        .demo-container {
          padding: 0 8px;
        }
      }
      
      // Управление знаниями для мобильных
      .knowledge-section {
        .knowledge-features-flex {
          grid-template-columns: 1fr;
          gap: 20px;
          padding: 0 8px;
          
          .knowledge-feature-card {
            padding: 20px 16px;
            border-radius: 16px;
            
            .feature-icon-block {
              margin-bottom: 16px;
              
              .graph-nodes-row {
                flex-wrap: wrap;
                gap: 6px;
                
                .node {
                  font-size: 0.9rem;
                  padding: 0.3em 0.8em;
                }
              }
            }
            
            .feature-content-block {
              h3 {
                font-size: 1.2rem;
                margin-bottom: 8px;
              }
              
              p {
                font-size: 0.9rem;
                margin-bottom: 12px;
              }
              
              ul {
                font-size: 0.85rem;
                
                li {
                  margin-bottom: 0.4em;
                }
              }
            }
          }
        }
        
        .gaznetcad-note {
          margin: 24px 16px 0;
          padding: 16px;
          border-radius: 12px;
          font-size: 0.9rem;
        }
      }
      
      // Преимущества GaznetCAD для мобильных
      .gaznetcad-advantages-section {
        padding: 40px 0;
        
        .gaznetcad-advantages-grid {
          grid-template-columns: 1fr;
          gap: 20px;
          padding: 0 16px;
          
          .advantage-card {
            padding: 20px 16px;
            border-radius: 16px;
            
            h3 {
              font-size: 1.1rem;
              margin-bottom: 12px;
            }
            
            ul {
              font-size: 0.9rem;
              padding-left: 1em;
              
              li {
                margin-bottom: 0.5em;
                line-height: 1.4;
              }
            }
          }
        }
      }
      
      // CTA секция для мобильных
      .cta-section {
        .cta-wrapper {
          padding: 40px 16px;
          border-radius: 20px;
          margin: 0 16px;
        }
        
        .cta-content {
          .cta-header {
            margin-bottom: 32px;
            
            .cta-icon {
              margin-bottom: 16px;
              
              .icon-flame {
                font-size: 2rem;
              }
              
              .icon-main {
                font-size: 1.5rem;
              }
            }
            
            .cta-title {
              font-size: clamp(1.5rem, 6vw, 2rem);
              line-height: 1.2;
              margin-bottom: 12px;
            }
            
            .cta-description {
              font-size: 1rem;
              line-height: 1.5;
            }
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            
            .contact-card {
              padding: 20px 16px;
              border-radius: 16px;
              
              .contact-icon {
                margin-right: 16px;
                
                .icon-bg {
                  width: 40px;
                  height: 40px;
                }
              }
              
              .contact-info {
                .contact-label {
                  font-size: 0.8rem;
                  margin-bottom: 4px;
                }
                
                .contact-value {
                  font-size: 1rem;
                }
              }
            }
          }
          
          .cta-footer {
            margin-top: 24px;
            
            .response-time {
              font-size: 0.9rem;
              
              .response-icon {
                font-size: 1rem;
              }
            }
          }
        }
      }
    }
    
    // === ПЛАНШЕТНАЯ АДАПТАЦИЯ ===
    @include tablet {
      .hero-section {
        padding: 100px 0 80px;
        
        .hero-content {
          max-width: 600px;
        }
        
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
        }
      }
      
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
      }
      
      .collaboration-section {
        .collab-network {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 20px;
          
          .collab-block {
            flex: 1;
            min-width: 280px;
          }
          
          .connection-web {
            flex: 0 0 200px;
          }
        }
      }
      
      .knowledge-features-flex {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      
      .gaznetcad-advantages-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      
      .contact-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
    }
    
    // === МОБИЛЬНЫЕ ЖЕСТЫ И АНИМАЦИИ ===
    @include mobile {
      // Улучшенные touch события
      .feature-card,
      .example-chip,
      .contact-card {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        
        &:active {
          transform: scale(0.98);
        }
      }
      
      // Плавная прокрутка
      html {
        scroll-behavior: smooth;
      }
      
      // Оптимизация для мобильных браузеров
      .hero-section,
      .section-container {
        -webkit-overflow-scrolling: touch;
      }
      
      // Улучшенные анимации для мобильных
      .hero-badge,
      .hero-title,
      .hero-description {
        animation-duration: 0.8s;
      }
      
      // Оптимизация производительности
      .flame-particles,
      .energy-flow,
      .circuit-lines {
        will-change: transform;
      }
      
      // Уменьшение сложности анимаций на мобильных
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    }
    
    // === ДОПОЛНИТЕЛЬНЫЕ МОБИЛЬНЫЕ УЛУЧШЕНИЯ ===
    @include mobile {
      // Улучшенная типографика для мобильных
      .hero-title,
      .section-title {
        word-break: break-word;
        hyphens: auto;
      }
      
      // Оптимизация изображений
      .feature-icon,
      .collab-logo {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      
      // Улучшенная доступность
      .search-input,
      .example-chip,
      .contact-card {
        &:focus {
          outline: 2px solid $color-accent;
          outline-offset: 2px;
        }
      }
      
      // Оптимизация для landscape ориентации
      @media (orientation: landscape) and (max-height: 500px) {
        .hero-section {
          min-height: 100vh;
          padding: 80px 0 40px;
        }
        
        .hero-stats {
          flex-direction: row;
          gap: 32px;
        }
      }
    }
    </style>
