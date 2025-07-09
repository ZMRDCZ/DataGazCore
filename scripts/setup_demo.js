#!/usr/bin/env node

/**
 * KnowledgeGas AI - Demo Data Setup
 * 
 * Скрипт для создания демо-данных (1000+ документов) для демонстрации
 * поискового функционала и индексации.
 */

import fs from 'fs/promises';
import path from 'path';

// === КОНФИГУРАЦИЯ ===
const DEMO_CONFIG = {
  outputDir: './data/documents',
  totalDocuments: 1000,
  types: {
    standards: { count: 300, prefix: 'СП', prefixEn: 'SP' },
    regulations: { count: 200, prefix: 'РТП', prefixEn: 'REG' },
    drawings: { count: 100, prefix: 'ЧТЖ', prefixEn: 'DWG' },
    incidents: { count: 150, prefix: 'ИНЦ', prefixEn: 'INC' },
    maintenance: { count: 250, prefix: 'ТОР', prefixEn: 'MNT' }
  }
};

// === ШАБЛОНЫ ДОКУМЕНТОВ ===
const DOCUMENT_TEMPLATES = {
  standards: {
    titles: [
      'Газораспределительные системы',
      'Системы газоснабжения',
      'Газопроводы стальные',
      'Регуляторы давления газа',
      'Системы контроля загазованности',
      'Установки редуцирования газа',
      'Газовые котельные',
      'Системы аварийного отключения газа'
    ],
    content: `
# {title} - {documentId}

## 1. Область применения

Настоящий стандарт устанавливает требования к проектированию, монтажу и эксплуатации {title}.

## 2. Нормативные ссылки

- ГОСТ Р 54961-2012
- СП 62.13330.2011
- ПБ 12-529-03

## 3. Технические требования

### 3.1 Общие положения

Газораспределительные системы должны обеспечивать:
- Безопасную подачу газа потребителям
- Соответствие параметров качества газа
- Автоматическое отключение при аварийных ситуациях

### 3.2 Давление газа

Рабочее давление не должно превышать:
- Низкое давление: до 5 кПа
- Среднее давление: от 5 кПа до 0,3 МПа
- Высокое давление: от 0,3 до 1,2 МПа

## 4. Требования безопасности

- Установка систем контроля загазованности
- Аварийное отключение газоподачи
- Регулярные проверки герметичности

## 5. Контроль качества

Приёмочные испытания включают:
- Испытания на прочность и плотность
- Проверка систем автоматики
- Настройка регуляторов давления

Дата введения: {date}
Статус: Действующий
`
  },

  regulations: {
    titles: [
      'Технический регламент эксплуатации ГРП',
      'Регламент обслуживания газопроводов',
      'Технологический регламент УРП',
      'Регламент аварийно-восстановительных работ',
      'Регламент технического обслуживания ГРПШ'
    ],
    content: `
# {title} - {documentId}

## 1. Назначение регламента

Данный технический регламент определяет порядок эксплуатации и технического обслуживания {title}.

## 2. Периодичность обслуживания

### 2.1 Ежедневные операции
- Визуальный осмотр оборудования
- Проверка показаний манометров
- Контроль работы систем автоматики

### 2.2 Еженедельные операции
- Проверка герметичности соединений
- Очистка фильтров
- Проверка срабатывания ПЗК

### 2.3 Ежемесячные операции
- Калибровка измерительных приборов
- Проверка настройки регуляторов
- Ревизия предохранительных клапанов

## 3. Требования к персоналу

Обслуживающий персонал должен:
- Иметь соответствующую квалификацию
- Проходить аттестацию каждые 3 года
- Знать схемы газоснабжения объекта

## 4. Документооборот

Ведение следующей документации:
- Сменный журнал
- Журнал технического обслуживания
- Акты выполненных работ

Утверждён: {date}
Действует до: {endDate}
`
  },

  incidents: {
    titles: [
      'Отчёт об инциденте с утечкой газа',
      'Анализ нарушения в работе ГРП',
      'Расследование аварии на газопроводе',
      'Отчёт о срабатывании ПАЗ',
      'Инцидент с превышением давления'
    ],
    content: `
# {title} - {documentId}

## Общая информация

**Дата инцидента:** {date}
**Время:** {time}
**Объект:** {object}
**Серьёзность:** {severity}

## Описание инцидента

### Обстоятельства

{description}

### Последствия

- Прекращение газоснабжения: {affected} потребителей
- Время восстановления: {recoveryTime}
- Материальный ущерб: {damage}

## Причины инцидента

### Основные причины
1. {primaryCause}
2. {secondaryCause}

### Способствующие факторы
- {factor1}
- {factor2}

## Предпринятые меры

### Немедленные действия
- {immediateAction1}
- {immediateAction2}

### Восстановительные работы
- {recoveryAction1}
- {recoveryAction2}

## Корректирующие мероприятия

1. {correctiveAction1}
2. {correctiveAction2}
3. {correctiveAction3}

## Ответственные лица

**Расследование:** {investigator}
**Утверждение:** {approver}
**Дата отчёта:** {reportDate}

Статус: Закрыт
`
  }
};

// === ОСНОВНОЙ КЛАСС ===
class DemoDataGenerator {
  constructor(config) {
    this.config = config;
    this.generatedIds = new Set();
  }

  async generate() {
    console.log('🎭 Генерация демо-данных KnowledgeGas AI');
    console.log('=====================================');

    try {
      await this.setupDirectories();
      await this.generateDocuments();
      await this.generateStats();
      
      console.log('✅ Демо-данные созданы успешно!');
      console.log(`📁 Папка: ${this.config.outputDir}`);
      
    } catch (error) {
      console.error('❌ Ошибка генерации:', error);
      process.exit(1);
    }
  }

  async setupDirectories() {
    const dirs = [
      this.config.outputDir,
      ...Object.keys(this.config.types).map(type => 
        path.join(this.config.outputDir, type)
      )
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }

    console.log('📁 Директории созданы');
  }

  async generateDocuments() {
    let totalGenerated = 0;

    for (const [type, config] of Object.entries(this.config.types)) {
      console.log(`📄 Генерация ${type}: ${config.count} документов`);
      
      for (let i = 1; i <= config.count; i++) {
        const document = await this.generateDocument(type, i);
        const filename = this.getDocumentFilename(type, document);
        const filepath = path.join(this.config.outputDir, type, filename);
        
        await fs.writeFile(filepath, document.content, 'utf-8');
        totalGenerated++;

        if (totalGenerated % 100 === 0) {
          console.log(`   Создано: ${totalGenerated} документов`);
        }
      }
    }

    console.log(`📊 Всего создано: ${totalGenerated} документов`);
  }

  async generateDocument(type, index) {
    const template = DOCUMENT_TEMPLATES[type] || DOCUMENT_TEMPLATES.standards;
    const title = this.randomChoice(template.titles);
    const documentId = this.generateDocumentId(type, index);
    
    const document = {
      id: documentId,
      type,
      title: `${title} ${documentId}`,
      content: this.fillTemplate(template.content, {
        title,
        documentId,
        date: this.randomDate(),
        endDate: this.randomFutureDate(),
        time: this.randomTime(),
        object: this.randomObject(),
        severity: this.randomChoice(['Низкая', 'Средняя', 'Высокая']),
        description: this.randomIncidentDescription(),
        affected: Math.floor(Math.random() * 500) + 10,
        recoveryTime: `${Math.floor(Math.random() * 12) + 1} часов`,
        damage: `${Math.floor(Math.random() * 500) + 50} тыс. руб.`,
        primaryCause: this.randomChoice([
          'Износ оборудования',
          'Нарушение технологии',
          'Внешнее воздействие',
          'Отказ автоматики'
        ]),
        secondaryCause: this.randomChoice([
          'Недостаточное обслуживание',
          'Неблагоприятные погодные условия',
          'Превышение нагрузки',
          'Производственная ошибка'
        ]),
        factor1: 'Износ уплотнений',
        factor2: 'Отсутствие резервирования',
        immediateAction1: 'Отключение газоподачи',
        immediateAction2: 'Вызов аварийной службы',
        recoveryAction1: 'Замена повреждённого участка',
        recoveryAction2: 'Испытания на герметичность',
        correctiveAction1: 'Внеплановая ревизия оборудования',
        correctiveAction2: 'Обновление регламентов обслуживания',
        correctiveAction3: 'Дополнительное обучение персонала',
        investigator: 'И.И. Иванов',
        approver: 'П.П. Петров',
        reportDate: this.randomDate()
      }),
      metadata: {
        created: new Date().toISOString(),
        version: '1.0',
        status: Math.random() > 0.1 ? 'Действующий' : 'Утратил силу',
        tags: this.generateTags(type),
        fileSize: Math.floor(Math.random() * 1000000) + 50000 // 50KB - 1MB
      }
    };

    return document;
  }

  generateDocumentId(type, index) {
    const config = this.config.types[type];
    const year = new Date().getFullYear();
    const id = `${config.prefix}-${year}-${String(index).padStart(3, '0')}`;
    
    // Избегаем дубликатов
    if (this.generatedIds.has(id)) {
      return this.generateDocumentId(type, index + 1000);
    }
    
    this.generatedIds.add(id);
    return id;
  }

  getDocumentFilename(type, document) {
    const extensions = {
      standards: '.pdf',
      regulations: '.pdf',
      drawings: '.dwg',
      incidents: '.md',
      maintenance: '.pdf'
    };

    const ext = extensions[type] || '.pdf';
    const safeName = document.id.replace(/[^a-zA-Z0-9-]/g, '_');
    return `${safeName}${ext}`;
  }

  fillTemplate(template, variables) {
    let content = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, value);
    }
    
    return content;
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  randomDate() {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('ru-RU');
  }

  randomFutureDate() {
    const start = new Date();
    const end = new Date(2030, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('ru-RU');
  }

  randomTime() {
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  randomObject() {
    const objects = [
      'ГРП-12 "Северный"',
      'УРП-50 "Промышленный"',
      'ГРПШ-400 "Центральный"',
      'ГРП-25 "Восточный"',
      'УРП-100 "Западный"'
    ];
    return this.randomChoice(objects);
  }

  randomIncidentDescription() {
    const descriptions = [
      'Обнаружена утечка газа на соединении входного газопровода',
      'Зафиксировано превышение рабочего давления в газопроводе',
      'Срабатывание ПАЗ по сигналу загазованности помещения',
      'Отказ регулятора давления, рост давления в сети',
      'Механическое повреждение газопровода экскаватором'
    ];
    return this.randomChoice(descriptions);
  }

  generateTags(type) {
    const baseTags = {
      standards: ['ГОСТ', 'СП', 'норматив', 'стандарт'],
      regulations: ['регламент', 'ТО', 'эксплуатация'],
      drawings: ['чертёж', 'схема', 'DWG'],
      incidents: ['инцидент', 'авария', 'отчёт'],
      maintenance: ['ТОиР', 'обслуживание', 'ремонт']
    };

    const commonTags = ['газ', 'безопасность', 'ТЭК'];
    const typeTags = baseTags[type] || [];
    
    return [...typeTags, ...this.randomChoice([commonTags.slice(0, 1), commonTags.slice(0, 2)])];
  }

  async generateStats() {
    const stats = {
      generated: new Date().toISOString(),
      totalDocuments: Object.values(this.config.types).reduce((sum, type) => sum + type.count, 0),
      byType: this.config.types,
      estimatedIndexSize: '45 MB',
      estimatedBuildTime: '2-3 минуты'
    };

    const statsPath = path.join(this.config.outputDir, 'generation_stats.json');
    await fs.writeFile(statsPath, JSON.stringify(stats, null, 2));

    console.log('\n📊 Статистика генерации:');
    console.log(`   Всего документов: ${stats.totalDocuments}`);
    console.log(`   Предполагаемый размер индекса: ${stats.estimatedIndexSize}`);
    console.log(`   Время индексации: ${stats.estimatedBuildTime}`);
  }
}

// === ТОЧКА ВХОДА ===
async function main() {
  const generator = new DemoDataGenerator(DEMO_CONFIG);
  await generator.generate();
}

// Запуск если файл выполняется напрямую
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1].includes('setup_demo.js')) {
  main().catch(console.error);
}

export { DemoDataGenerator, DEMO_CONFIG }; 