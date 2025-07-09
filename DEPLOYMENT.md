# 🚀 Руководство по деплою на GitHub Pages

## 📋 Предварительные требования

1. **GitHub репозиторий**: https://github.com/ZMRDCZ/DataGazCore.git
2. **Node.js**: версия 18 или выше
3. **npm**: для установки зависимостей

## 🔧 Настройка проекта

### 1. Клонирование репозитория
```bash
git clone https://github.com/ZMRDCZ/DataGazCore.git
cd DataGazCore
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Проверка конфигурации
Убедитесь, что в `package.json` указан правильный homepage:
```json
{
  "homepage": "https://zmrdcz.github.io/DataGazCore/"
}
```

## 🌐 Настройка GitHub Pages

### 1. Настройка в GitHub
1. Перейдите в репозиторий на GitHub
2. Откройте **Settings** → **Pages**
3. В разделе **Source** выберите **GitHub Actions**
4. Сохраните настройки

### 2. Настройка ветки
Убедитесь, что основная ветка называется `main` или `master`:
```bash
# Проверка текущей ветки
git branch

# Если нужно переименовать
git branch -M main
```

## 🔄 Автоматический деплой

### GitHub Actions Workflow
Проект уже настроен с автоматическим деплоем через GitHub Actions (`.github/workflows/deploy.yml`).

**Триггеры деплоя:**
- Пуш в ветку `main` или `master`
- Pull Request в ветку `main` или `master`

**Процесс деплоя:**
1. Checkout кода
2. Установка Node.js 18
3. Установка зависимостей (`npm ci`)
4. Сборка проекта (`npm run build:gh-pages`)
5. Деплой в GitHub Pages

### Проверка статуса деплоя
1. Перейдите в **Actions** в репозитории
2. Найдите workflow "Deploy to GitHub Pages"
3. Проверьте статус выполнения

## 🛠️ Ручной деплой

### 1. Локальная сборка
```bash
# Сборка для продакшна
npm run build:gh-pages

# Проверка сборки
npm run preview
```

### 2. Деплой через gh-pages
```bash
# Установка gh-pages (если не установлен)
npm install --save-dev gh-pages

# Деплой
npm run deploy
```

### 3. Альтернативный способ
```bash
# Прямой вызов gh-pages
npx gh-pages -d dist
```

## 🔍 Проверка деплоя

### 1. Основной URL
После успешного деплоя сайт будет доступен по адресу:
**https://zmrdcz.github.io/DataGazCore/**

### 2. Проверка функциональности
- [ ] Главная страница загружается
- [ ] Поиск работает корректно
- [ ] Навигация между страницами работает
- [ ] Все ассеты (CSS, JS, изображения) загружаются

### 3. Проверка консоли браузера
Откройте Developer Tools и проверьте:
- Нет ли ошибок в Console
- Все ли ресурсы загружаются (Network tab)
- Правильно ли работает роутинг

## 🐛 Устранение проблем

### Проблема: 404 ошибки при навигации
**Решение**: Убедитесь, что используется hash routing в `src/router.ts`:
```typescript
import { createWebHashHistory } from 'vue-router'
// ...
history: createWebHashHistory()
```

### Проблема: Неправильные пути к ассетам
**Решение**: Проверьте настройку `base` в `vite.config.ts`:
```typescript
base: process.env.NODE_ENV === 'production' ? '/DataGazCore/' : '/'
```

### Проблема: GitHub Actions не запускается
**Решение**:
1. Проверьте права доступа к репозиторию
2. Убедитесь, что файл `.github/workflows/deploy.yml` существует
3. Проверьте синтаксис YAML файла

### Проблема: Сайт не обновляется после деплоя
**Решение**:
1. Очистите кэш браузера (Ctrl+F5)
2. Проверьте, что деплой завершился успешно
3. Подождите 5-10 минут (GitHub Pages может кэшировать)

## 📝 Полезные команды

### Разработка
```bash
# Запуск dev-сервера
npm run dev

# Сборка для продакшна
npm run build

# Предварительный просмотр
npm run preview
```

### Тестирование
```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e
```

### Линтинг и форматирование
```bash
# Проверка кода
npm run lint

# Форматирование
npm run format
```

## 🔗 Полезные ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vue Router Hash Mode](https://router.vuejs.org/guide/essentials/history-mode.html#hash-mode)
- [Vite Configuration](https://vitejs.dev/config/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 