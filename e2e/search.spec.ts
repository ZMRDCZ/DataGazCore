import { test, expect } from '@playwright/test'

test.describe('KnowledgeGas AI Search', () => {
  test('should display hero search on homepage', async ({ page }) => {
    await page.goto('/')
    
    // Проверяем наличие поисковой строки
    const searchInput = page.locator('input[aria-label="Поиск нормативных документов"]')
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toHaveAttribute('placeholder', 'Введите ГОСТ, СП, чертёж или инцидент…')
  })

  test('should perform search and show results', async ({ page }) => {
    await page.goto('/')
    
    // Выполняем поиск
    const searchInput = page.locator('input[aria-label="Поиск нормативных документов"]')
    await searchInput.fill('СП 62.13330-2021')
    await searchInput.press('Enter')
    
    // Ждём появления результатов
    await page.waitForSelector('.result-card', { timeout: 5000 })
    
    // Проверяем, что результаты отображаются
    const resultCards = page.locator('.result-card')
    await expect(resultCards).toHaveCountGreaterThan(0)
    
    // Проверяем содержимое первого результата
    const firstResult = resultCards.first()
    await expect(firstResult).toContainText('СП 62.13330-2021')
  })

  test('should show KPI bar after first search', async ({ page }) => {
    await page.goto('/')
    
    // Выполняем поиск
    const searchInput = page.locator('input[aria-label="Поиск нормативных документов"]')
    await searchInput.fill('ГОСТ')
    await searchInput.press('Enter')
    
    // Ждём появления KPI бара
    await page.waitForSelector('.kpi-bar', { timeout: 3000 })
    
    // Проверяем наличие KPI карточек
    const kpiCards = page.locator('.kpi')
    await expect(kpiCards).toHaveCount(4)
    
    // Проверяем содержимое KPI
    await expect(page.locator('.kpi-value')).toContainText(['50 мин → 5 с', '+3 ч/день'])
  })

  test('should open document preview on result click', async ({ page }) => {
    await page.goto('/')
    
    // Выполняем поиск
    const searchInput = page.locator('input[aria-label="Поиск нормативных документов"]')
    await searchInput.fill('СП')
    await searchInput.press('Enter')
    
    // Ждём результатов и кликаем по первому
    await page.waitForSelector('.result-card')
    await page.locator('.result-card').first().click()
    
    // Проверяем открытие preview
    await expect(page.locator('.doc-preview')).toBeVisible()
    await expect(page.locator('.preview-header h2')).toBeVisible()
    
    // Закрываем preview
    await page.locator('.close-btn').click()
    await expect(page.locator('.doc-preview')).not.toBeVisible()
  })

  test('should display knowledge graph after search', async ({ page }) => {
    await page.goto('/')
    
    // Выполняем поиск
    const searchInput = page.locator('input[aria-label="Поиск нормативных документов"]')
    await searchInput.fill('ГРП')
    await searchInput.press('Enter')
    
    // Ждём появления графа знаний
    await page.waitForSelector('.knowledge-graph', { timeout: 5000 })
    
    // Проверяем наличие фильтров
    const filterButtons = page.locator('.filter-btn')
    await expect(filterButtons).toHaveCountGreaterThan(0)
    
    // Тестируем переключение фильтров
    await page.locator('.filter-btn').nth(1).click()
    await expect(page.locator('.filter-btn.active')).toHaveCount(1)
  })
}) 