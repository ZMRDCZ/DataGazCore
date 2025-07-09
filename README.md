# 🔥 KnowledgeGas AI

**Революционная поисковая платформа для газовой отрасли**

Интеллектуальный поисковик с интегрированным лендингом для мгновенного доступа к нормативным документам, чертежам и отчётам ТЭК.

## ⚡ Быстрый старт

```bash
# Установка зависимостей
npm install

# Создание демо-данных (1000+ документов)
npm run setup-demo

# Запуск dev-сервера
npm run dev

# Сборка индекса
npm run build-index
```

Откройте [http://localhost:5173](http://localhost:5173) в браузере.

## 🎯 Основные возможности

### 🔍 Умный поиск
- **Семантический поиск** с ИИ-пониманием запросов
- **Streaming результаты** — первые результаты за < 200мс
- **Полнотекстовый поиск** с поддержкой русского языка
- **Голосовой ввод** для полевых условий
- **Фильтрация** по типам документов и статусу

### 📊 Визуализация знаний
- **Интерактивный граф связей** между документами
- **3D-визуализация** на Three.js
- **Динамическая фильтрация** узлов по типам
- **Экспорт графа** в различных форматах

### 📄 Работа с документами
- **OCR для PDF** и отсканированных документов
- **Обработка DWG-чертежей** с конвертацией в PDF
- **Превью документов** с навигацией по страницам
- **Подсветка найденных терминов** в тексте

### 📈 Аналитика и KPI
- **Экономические показатели** в реальном времени
- **Метрики эффективности** поиска
- **Статистика использования** системы
- **ROI-калькулятор** для внедрения

## 🏗️ Архитектура

### Frontend Stack
- **Vue 3** с Composition API
- **TypeScript** для типобезопасности
- **Vite** для быстрой разработки
- **SCSS** с дизайн-токенами
- **Three.js** для 3D-визуализации
- **GSAP** для анимаций

### Backend Services
- **Elasticsearch** для полнотекстового поиска
- **sentence-transformers** для семантических векторов
- **Tesseract OCR** для обработки PDF
- **Open Design SDK** для чертежей DWG

### Структура проекта
```
knowledgeAI/
├── src/
│   ├── components/           # Vue компоненты
│   │   ├── sections/        # Секции лендинга
│   │   └── modals/          # Модальные окна
│   ├── views/               # Страницы приложения
│   ├── stores/              # Pinia хранилища
│   ├── styles/              # SCSS стили и токены
│   └── utils/               # Вспомогательные функции
├── scripts/                 # Скрипты сборки и деплоя
├── data/                    # Демо-данные и индексы
└── e2e/                     # End-to-end тесты
```

## 📦 Корпус документов

### Типы документов (MVP = 1000+ шт)
| Тип                      | Количество | Формат    | Источник |
|--------------------------|------------|-----------|----------|
| Нормативы (СП/ГОСТ)      | ≥ 300      | PDF + OCR | Минстрой |
| Тех. регламенты          | ≥ 200      | PDF/DOCX  | Intranet |
| Чертежи (DWG → PDF)      | ≥ 100      | PDF       | PDM      |
| Инциденты/отчёты         | ≥ 150      | Markdown  | APM      |
| Руководства по ТОиР      | ≥ 250      | PDF       | CMMS     |

### Источники данных
- **Открытые репозитории** нормативов Минстроя
- **Внутренние системы** предприятий ТЭК
- **PDM-системы** для технических чертежей
- **APM-платформы** для отчётов об инцидентах
- **CMMS-системы** для документации по ТОиР

## 🚀 Деплой и продакшн

### GitHub Pages (Автоматический деплой)

Проект настроен для автоматического деплоя на GitHub Pages при пуше в ветку `main` или `master`.

**URL проекта**: https://zmrdcz.github.io/DataGazCore/

#### Настройка GitHub Pages:

1. Перейдите в настройки репозитория на GitHub
2. В разделе "Pages" выберите источник "GitHub Actions"
3. Убедитесь, что ветка `main` или `master` активна

#### Ручной деплой:
```bash
# Установка gh-pages (если не установлен)
npm install --save-dev gh-pages

# Сборка и деплой
npm run deploy
```

#### Локальная сборка для проверки:
```bash
# Сборка для продакшна
npm run build:gh-pages

# Предварительный просмотр
npm run preview
```

### Docker развёртывание
```bash
# Сборка образа
docker build -t knowledgegas-ai .

# Запуск с Elasticsearch
docker-compose up -d

# Инициализация индекса
docker-compose exec app npm run build-index
```

### Переменные окружения
```env
# Elasticsearch
ELASTIC_HOST=http://elasticsearch:9200
ELASTIC_INDEX=knowledgegas-docs

# OCR и ML
TESSERACT_LANG=rus+eng
SENTENCE_TRANSFORMERS_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

# Файлы
DOCS_INPUT_DIR=/data/documents
INDEX_OUTPUT_DIR=/data/index
MAX_FILE_SIZE_MB=100
```

### Nginx конфигурация
```nginx
server {
    listen 80;
    server_name knowledgegas.ai;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:3000;
    }
    
    # Оптимизация для SPA
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🎨 Design System

### Газовая цветовая палитра
```scss
// Основные цвета
$color-bg-gradient-top: #f0faff;    // Светло-голубой
$color-bg-gradient-bottom: #ffffff;  // Белый
$color-accent-flame: #29b6f6;        // Голубое пламя
$color-accent-flame-end: #ffa000;    // Оранжевое пламя

// Семантические цвета
$color-text-main: #0d47a1;          // Глубокий синий
$color-text-secondary: #37474f;      // Серо-синий
$color-text-light: #78909c;         // Светло-серый
```

### Анимации и переходы
- **Максимальная длительность**: 400ms
- **Поддержка** `prefers-reduced-motion`
- **GPU-ускорение** для критичных анимаций
- **Газовые эффекты**: blur + градиенты

### Типографика
```scss
$font-family-primary: 'Inter', 'Segoe UI', -apple-system, sans-serif;
$font-weight-light: 300;      // Заголовки
$font-weight-regular: 400;    // Основной текст
$font-weight-medium: 500;     // Акценты
$font-weight-semibold: 600;   // Кнопки и метрики
```

## 📊 Performance и оптимизация

### Lighthouse цели
- **Performance**: ≥ 90
- **Accessibility**: ≥ 90  
- **Best Practices**: ≥ 95
- **SEO**: ≥ 100

### Оптимизации
- **Code splitting** по маршрутам
- **Lazy loading** изображений и компонентов
- **Service Worker** для кэширования
- **Image optimization** с WebP
- **Critical CSS** extraction
- **Bundle analysis** и tree-shaking

### Мониторинг
```bash
# Анализ bundle
npm run build && npx vite-bundle-analyzer

# Lighthouse CI
npx lhci autorun

# Performance testing
npm run test:e2e -- --reporter=performance
```

## 🧪 Тестирование

### Unit тесты (Vitest)
```bash
npm run test              # Однократный запуск
npm run test:watch        # В режиме наблюдения
npm run test:coverage     # С покрытием кода
```

### E2E тесты (Playwright)
```bash
npm run test:e2e          # Все браузеры
npm run test:e2e:chrome   # Только Chrome
npm run test:e2e:headed   # С UI
```

### Тестовые сценарии
- ✅ Поиск документов по ключевым словам
- ✅ Фильтрация результатов по типам
- ✅ Открытие и навигация в превью документов
- ✅ Работа графа знаний
- ✅ Адаптивность на мобильных устройствах
- ✅ Accessibility с клавиатурной навигацией

## 🔧 Разработка

### Команды разработчика
```bash
# Линтинг и форматирование
npm run lint              # ESLint проверка
npm run format            # Prettier форматирование

# Storybook для компонентов
npm run storybook         # Запуск Storybook
npm run build-storybook   # Сборка статики

# Индексация документов
npm run build-index       # Полная переиндексация
npm run build-index:incremental  # Инкрементальная
```

### Git workflow
```bash
# Feature branch
git checkout -b feature/search-improvements
git commit -m "feat: добавить голосовой поиск"

# Pull request
git push origin feature/search-improvements
# Создать PR в GitHub с описанием изменений
```

### Code style
- **Vue SFC** в следующем порядке: `<template>`, `<script>`, `<style>`
- **TypeScript strict mode** включён
- **ESLint + Prettier** для консистентности
- **Conventional commits** для changelog

## 📈 Roadmap

### Sprint 0 (Неделя 1) ✅
- [x] Splash-лендинг с Hero секцией
- [x] Базовые компоненты поиска
- [x] Дизайн-система и токены

### Sprint 1 (Неделя 2) ✅  
- [x] Демо-данные (1000+ документов)
- [x] Скрипт build-index для Elasticsearch
- [x] Интеграция всех секций лендинга

### Sprint 2 (Неделя 3) 🚧
- [ ] MVP-поиск с результатами ≤ 1с
- [ ] Streaming UI с v-suspense  
- [ ] Семантический поиск через miniLM-v3

### Sprint 3 (Неделя 4) 📋
- [ ] KPI-бар с одометрами-счётчиками
- [ ] Граф знаний с force-directed layout
- [ ] Lighthouse ≥ 90 + демо-видео

### Будущие версии 🔮
- [ ] Интеграция с реальными системами ТЭК
- [ ] ML-рекомендации связанных документов  
- [ ] API для внешних интеграций
- [ ] Mobile app (React Native)
- [ ] Voice-to-text на русском языке

## 🤝 Команда

- **Product Owner**: Определение требований ТЭК
- **Tech Lead**: Архитектура и интеграции
- **Frontend Developer**: Vue.js + TypeScript
- **ML Engineer**: Семантический поиск
- **DevOps Engineer**: Деплой и мониторинг

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл.

## 🔗 Полезные ссылки

- [Техническое задание](DEPLOYMENT.md)
- [API документация](docs/api.md)
- [Storybook компонентов](https://knowledgegas-ai.github.io/storybook)
- [Демо-стенд](https://demo.knowledgegas.ai)

---

*Сделано с 🔥 для газовой отрасли России* 