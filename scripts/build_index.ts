#!/usr/bin/env tsx

/**
 * KnowledgeGas AI - Index Builder Script
 * 
 * Скрипт для офлайн-сборки поискового индекса из корпуса документов ТЭК:
 * - Нормативы (СП/ГОСТ) ≥ 300 документов
 * - Тех. регламенты ≥ 200 документов  
 * - Чертежи (DWG → PDF-preview) ≥ 100 документов
 * - Инциденты/отчёты ≥ 150 документов
 * - Руководства по ТОиР ≥ 250 документов
 * 
 * Формат выполнения: npm run build-index
 * Результат: индекс в формате Elastic/Lucene
 */

import fs from 'fs/promises'
import path from 'path'
import { createHash } from 'crypto'

// === КОНФИГУРАЦИЯ ===
interface BuildConfig {
  inputDir: string
  outputDir: string
  elastic: {
    host: string
    index: string
    mappings: Record<string, any>
  }
  processing: {
    batchSize: number
    maxFileSize: number // MB
    ocr: {
      enabled: boolean
      languages: string[]
    }
  }
}

const CONFIG: BuildConfig = {
  inputDir: process.env.DOCS_INPUT_DIR || './data/documents',
  outputDir: process.env.INDEX_OUTPUT_DIR || './data/index',
  elastic: {
    host: process.env.ELASTIC_HOST || 'http://localhost:9200',
    index: 'knowledgegas-docs',
    mappings: {
      properties: {
        title: { type: 'text', analyzer: 'russian' },
        content: { type: 'text', analyzer: 'russian' },
        type: { type: 'keyword' },
        tags: { type: 'keyword' },
        version: { type: 'keyword' },
        status: { type: 'keyword' }, // Действующий, Утратил силу
        updated: { type: 'date' },
        file_path: { type: 'keyword' },
        file_size: { type: 'integer' },
        checksum: { type: 'keyword' },
        embedding: { type: 'dense_vector', dims: 384 } // miniLM-v3
      }
    }
  },
  processing: {
    batchSize: 50,
    maxFileSize: 100, // MB
    ocr: {
      enabled: true,
      languages: ['rus', 'eng']
    }
  }
}

// === ТИПЫ ДОКУМЕНТОВ ===
interface DocumentType {
  id: string
  name: string
  patterns: string[]
  expectedCount: number
  processor: string
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'standards',
    name: 'Нормативы (СП/ГОСТ)',
    patterns: ['**/*СП*.pdf', '**/*ГОСТ*.pdf', '**/SP*.pdf', '**/GOST*.pdf'],
    expectedCount: 300,
    processor: 'pdf_ocr'
  },
  {
    id: 'regulations',
    name: 'Тех. регламенты',
    patterns: ['**/регламент*.pdf', '**/regulation*.pdf', '**/*РТП*.pdf'],
    expectedCount: 200,
    processor: 'pdf_text'
  },
  {
    id: 'drawings',
    name: 'Чертежи',
    patterns: ['**/*.dwg', '**/*.pdf'],
    expectedCount: 100,
    processor: 'dwg_to_pdf'
  },
  {
    id: 'incidents',
    name: 'Инциденты/отчёты',
    patterns: ['**/incident*.md', '**/report*.md', '**/отчет*.md'],
    expectedCount: 150,
    processor: 'markdown'
  },
  {
    id: 'maintenance',
    name: 'Руководства по ТОиР',
    patterns: ['**/maintenance*.pdf', '**/то*.pdf', '**/repair*.pdf'],
    expectedCount: 250,
    processor: 'pdf_ocr'
  }
]

// === ОСНОВНОЙ КЛАСС ИНДЕКСАТОРА ===
class DocumentIndexer {
  private stats = {
    processed: 0,
    skipped: 0,
    errors: 0,
    startTime: Date.now()
  }

  constructor(private config: BuildConfig) {}

  async build(): Promise<void> {
    console.log('🔥 KnowledgeGas AI - Index Builder')
    console.log('===================================')
    
    try {
      await this.setupDirectories()
      await this.validateInput()
      
      const documents = await this.scanDocuments()
      console.log(`📄 Найдено ${documents.length} документов для индексации`)
      
      await this.processDocuments(documents)
      await this.buildSearchIndex()
      await this.generateStats()
      
      console.log('✅ Индексация завершена успешно!')
      
    } catch (error) {
      console.error('❌ Ошибка при построении индекса:', error)
      process.exit(1)
    }
  }

  private async setupDirectories(): Promise<void> {
    const dirs = [this.config.outputDir, path.join(this.config.outputDir, 'embeddings')]
    
    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true })
    }
    
    console.log('📁 Рабочие директории созданы')
  }

  private async validateInput(): Promise<void> {
    try {
      await fs.access(this.config.inputDir)
      console.log(`📂 Исходная директория: ${this.config.inputDir}`)
    } catch {
      throw new Error(`Директория с документами не найдена: ${this.config.inputDir}`)
    }
  }

  private async scanDocuments(): Promise<Array<{ path: string; type: DocumentType }>> {
    const documents: Array<{ path: string; type: DocumentType }> = []
    
    for (const docType of DOCUMENT_TYPES) {
      console.log(`🔍 Сканирование: ${docType.name}`)
      
      const found = await this.findFilesByPatterns(docType.patterns)
      
      for (const filePath of found) {
        documents.push({ path: filePath, type: docType })
      }
      
      console.log(`   Найдено: ${found.length} (ожидалось: ${docType.expectedCount})`)
      
      if (found.length < docType.expectedCount * 0.5) {
        console.warn(`⚠️  Мало документов типа "${docType.name}": ${found.length} < ${docType.expectedCount}`)
      }
    }
    
    return documents
  }

  private async findFilesByPatterns(patterns: string[]): Promise<string[]> {
    // Упрощённая реализация для демо
    // В реальности использовать glob или fast-glob
    const files: string[] = []
    
    async function scanDir(dirPath: string): Promise<void> {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true })
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name)
          
          if (entry.isDirectory()) {
            await scanDir(fullPath)
          } else {
            // Простая проверка расширений
            const ext = path.extname(entry.name).toLowerCase()
            if (['.pdf', '.dwg', '.md', '.docx'].includes(ext)) {
              files.push(fullPath)
            }
          }
        }
      } catch (error) {
        // Игнорируем ошибки доступа к директориям
      }
    }
    
    await scanDir(this.config.inputDir)
    return files
  }

  private async processDocuments(documents: Array<{ path: string; type: DocumentType }>): Promise<void> {
    console.log('⚙️  Обработка документов...')
    
    const batches = this.chunkArray(documents, this.config.processing.batchSize)
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`📦 Батч ${i + 1}/${batches.length} (${batch.length} документов)`)
      
      await Promise.allSettled(
        batch.map(doc => this.processDocument(doc))
      )
      
      // Прогресс-бар
      const progress = Math.round(((i + 1) / batches.length) * 100)
      console.log(`⏳ Прогресс: ${progress}%`)
    }
  }

  private async processDocument({ path: filePath, type }: { path: string; type: DocumentType }): Promise<void> {
    try {
      const stats = await fs.stat(filePath)
      
      // Проверка размера файла
      if (stats.size > this.config.processing.maxFileSize * 1024 * 1024) {
        this.stats.skipped++
        return
      }
      
      const content = await this.extractContent(filePath, type.processor)
      const embedding = await this.generateEmbedding(content.text)
      
      const document = {
        id: this.generateDocumentId(filePath),
        title: content.title || path.basename(filePath),
        content: content.text,
        type: type.id,
        tags: content.tags || [],
        version: content.version || '1.0',
        status: content.status || 'Действующий',
        updated: stats.mtime,
        file_path: filePath,
        file_size: stats.size,
        checksum: await this.calculateChecksum(filePath),
        embedding
      }
      
      // Сохраняем в JSON для последующей загрузки в Elastic
      const outputPath = path.join(
        this.config.outputDir, 
        'documents', 
        `${document.id}.json`
      )
      
      await fs.mkdir(path.dirname(outputPath), { recursive: true })
      await fs.writeFile(outputPath, JSON.stringify(document, null, 2))
      
      this.stats.processed++
      
    } catch (error) {
      console.error(`❌ Ошибка обработки ${filePath}:`, error)
      this.stats.errors++
    }
  }

  private async extractContent(filePath: string, processor: string): Promise<{
    title?: string
    text: string
    tags?: string[]
    version?: string
    status?: string
  }> {
    const ext = path.extname(filePath).toLowerCase()
    
    switch (processor) {
      case 'pdf_ocr':
        return await this.extractPdfWithOcr(filePath)
      
      case 'pdf_text':
        return await this.extractPdfText(filePath)
      
      case 'dwg_to_pdf':
        return await this.extractDwgContent(filePath)
      
      case 'markdown':
        return await this.extractMarkdownContent(filePath)
      
      default:
        throw new Error(`Неизвестный процессор: ${processor}`)
    }
  }

  private async extractPdfWithOcr(filePath: string): Promise<any> {
    // TODO: Интеграция с Tesseract или Azure OCR
    // Заглушка для демо
    return {
      title: path.basename(filePath, path.extname(filePath)),
      text: `Содержимое PDF файла ${filePath} (OCR)`,
      tags: ['pdf', 'ocr'],
      version: '1.0',
      status: 'Действующий'
    }
  }

  private async extractPdfText(filePath: string): Promise<any> {
    // TODO: Интеграция с pdf2pic или pdf-parse
    return {
      title: path.basename(filePath, path.extname(filePath)),
      text: `Текстовое содержимое PDF файла ${filePath}`,
      tags: ['pdf', 'text']
    }
  }

  private async extractDwgContent(filePath: string): Promise<any> {
    // TODO: Интеграция с AutoCAD API или Open Design SDK
    return {
      title: path.basename(filePath, path.extname(filePath)),
      text: `Описание чертежа ${filePath}`,
      tags: ['dwg', 'drawing']
    }
  }

  private async extractMarkdownContent(filePath: string): Promise<any> {
    const content = await fs.readFile(filePath, 'utf-8')
    const lines = content.split('\n')
    const title = lines.find(line => line.startsWith('# '))?.slice(2) || 
                  path.basename(filePath, '.md')
    
    return {
      title,
      text: content,
      tags: ['markdown', 'incident']
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // TODO: Интеграция с sentence-transformers (miniLM-v3)
    // Заглушка - возвращаем вектор из 384 случайных чисел
    return Array.from({ length: 384 }, () => Math.random() - 0.5)
  }

  private generateDocumentId(filePath: string): string {
    return createHash('md5').update(filePath).digest('hex').slice(0, 16)
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath)
    return createHash('md5').update(content).digest('hex')
  }

  private async buildSearchIndex(): Promise<void> {
    console.log('🔍 Сборка поискового индекса...')
    
    // TODO: Загрузка в Elasticsearch
    // Пока создаём локальный JSON-индекс
    const documentsDir = path.join(this.config.outputDir, 'documents')
    const files = await fs.readdir(documentsDir)
    
    const index = {
      version: '1.0',
      created: new Date().toISOString(),
      documents_count: files.length,
      mappings: this.config.elastic.mappings
    }
    
    const indexPath = path.join(this.config.outputDir, 'index.json')
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2))
    
    console.log(`📇 Индекс создан: ${indexPath}`)
  }

  private async generateStats(): Promise<void> {
    const duration = Date.now() - this.stats.startTime
    
    const stats = {
      ...this.stats,
      duration_ms: duration,
      duration_human: this.formatDuration(duration),
      documents_per_second: Math.round(this.stats.processed / (duration / 1000))
    }
    
    console.log('\n📊 Статистика индексации:')
    console.log(`   Обработано: ${stats.processed}`)
    console.log(`   Пропущено: ${stats.skipped}`)
    console.log(`   Ошибок: ${stats.errors}`)
    console.log(`   Время: ${stats.duration_human}`)
    console.log(`   Скорость: ${stats.documents_per_second} док/сек`)
    
    const statsPath = path.join(this.config.outputDir, 'stats.json')
    await fs.writeFile(statsPath, JSON.stringify(stats, null, 2))
  }

  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}м ${seconds}с`
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}

// === ТОЧКА ВХОДА ===
async function main() {
  const indexer = new DocumentIndexer(CONFIG)
  await indexer.build()
}

if (require.main === module) {
  main().catch(console.error)
}

export default DocumentIndexer 