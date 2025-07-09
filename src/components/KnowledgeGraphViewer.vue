<template>
  <div class="knowledge-graph-viewer">
    <h3>🕸️ Граф знаний Neo4j</h3>
    
    <div class="graph-controls">
      <div class="control-group">
        <label>Тип узлов</label>
        <select v-model="selectedNodeType" @change="filterNodes">
          <option value="all">Все узлы</option>
          <option value="equipment">Оборудование</option>
          <option value="standards">Нормативы</option>
          <option value="incidents">Инциденты</option>
          <option value="documents">Документы</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Глубина связей</label>
        <input 
          v-model.number="connectionDepth" 
          type="range" 
          min="1" 
          max="3" 
          @input="updateGraph"
        />
        <span class="depth-value">{{ connectionDepth }}</span>
      </div>
      
      <button class="control-btn" @click="resetView">
        🔄 Сбросить вид
      </button>
    </div>
    
    <div class="graph-container" ref="graphContainer">
      <svg 
        ref="graphSvg" 
        class="graph-svg"
        @mousedown="startPan"
        @mousemove="onPan"
        @mouseup="endPan"
        @wheel="onZoom"
      >
        <!-- Links -->
        <g class="links">
          <line
            v-for="link in visibleLinks"
            :key="link.id"
            :x1="link.source.x"
            :y1="link.source.y"
            :x2="link.target.x"
            :y2="link.target.y"
            :class="['link', `link-${link.type}`]"
            :stroke-width="getStrokeWidth(link.strength)"
          />
        </g>
        
        <!-- Nodes -->
        <g class="nodes">
          <g
            v-for="node in visibleNodes"
            :key="node.id"
            :class="['node', `node-${node.type}`, { selected: selectedNode?.id === node.id }]"
            :transform="`translate(${node.x}, ${node.y})`"
            @click="selectNode(node)"
            @mouseenter="showTooltip(node, $event)"
            @mouseleave="hideTooltip"
          >
            <circle
              :r="getNodeRadius(node.importance)"
              :class="`node-circle-${node.type}`"
            />
            <text
              class="node-label"
              :dy="getNodeRadius(node.importance) + 15"
              text-anchor="middle"
            >
              {{ node.label }}
            </text>
          </g>
        </g>
      </svg>
      
      <!-- Tooltip -->
      <div 
        v-if="tooltip.show" 
        class="graph-tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-title">{{ tooltip.node?.label }}</div>
        <div class="tooltip-type">{{ getNodeTypeName(tooltip.node?.type) }}</div>
        <div class="tooltip-description">{{ tooltip.node?.description }}</div>
        <div class="tooltip-stats">
          <span>Связей: {{ tooltip.node?.connections || 0 }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="selectedNode" class="node-details">
      <h4>{{ selectedNode.label }}</h4>
      <div class="detail-content">
        <div class="detail-section">
          <h5>Тип</h5>
          <span class="detail-badge" :class="`badge-${selectedNode.type}`">
            {{ getNodeTypeName(selectedNode.type) }}
          </span>
        </div>
        
        <div class="detail-section">
          <h5>Описание</h5>
          <p>{{ selectedNode.description }}</p>
        </div>
        
        <div class="detail-section">
          <h5>Связанные объекты</h5>
          <div class="related-nodes">
            <div
              v-for="related in getRelatedNodes(selectedNode)"
              :key="related.id"
              class="related-node"
              @click="selectNode(related)"
            >
              <span class="related-icon">{{ getNodeIcon(related.type) }}</span>
              <span class="related-label">{{ related.label }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h5>Действия</h5>
          <div class="detail-actions">
            <button class="detail-btn primary" @click="openInNeo4j">
              🔗 Открыть в Neo4j
            </button>
            <button class="detail-btn secondary" @click="exportSubgraph">
              📊 Экспорт подграфа
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="graph-stats">
      <div class="stat-item">
        <span class="stat-label">Узлов</span>
        <span class="stat-value">{{ visibleNodes.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Связей</span>
        <span class="stat-value">{{ visibleLinks.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Кластеров</span>
        <span class="stat-value">{{ clusters.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

interface GraphNode {
  id: string
  label: string
  type: 'equipment' | 'standards' | 'incidents' | 'documents'
  x: number
  y: number
  importance: number
  description: string
  connections: number
}

interface GraphLink {
  id: string
  source: GraphNode
  target: GraphNode
  type: 'relates_to' | 'contains' | 'caused_by' | 'requires'
  strength: number
}

const graphContainer = ref<HTMLElement>()
const graphSvg = ref<SVGElement>()
const selectedNodeType = ref('all')
const connectionDepth = ref(2)
const selectedNode = ref<GraphNode | null>(null)
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })
const viewBox = ref({ x: 0, y: 0, width: 800, height: 600, scale: 1 })

const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  node: null as GraphNode | null
})

// Sample graph data
const allNodes = ref<GraphNode[]>([
  {
    id: 'grs-01',
    label: 'ГРС-01 Новогиреево',
    type: 'equipment',
    x: 300,
    y: 200,
    importance: 0.9,
    description: 'Основная газорегуляторная станция района',
    connections: 8
  },
  {
    id: 'sp-62-2021',
    label: 'СП 62.13330-2021',
    type: 'standards',
    x: 150,
    y: 150,
    importance: 0.8,
    description: 'Актуальные требования к газораспределительным системам',
    connections: 12
  },
  {
    id: 'incident-001',
    label: 'Инцидент #001',
    type: 'incidents',
    x: 450,
    y: 100,
    importance: 0.6,
    description: 'Превышение давления в системе 15.03.2024',
    connections: 4
  },
  {
    id: 'tech-passport',
    label: 'Техпаспорт ГРС-01',
    type: 'documents',
    x: 200,
    y: 300,
    importance: 0.7,
    description: 'Технический паспорт оборудования',
    connections: 6
  },
  {
    id: 'pressure-regulator',
    label: 'Регулятор давления',
    type: 'equipment',
    x: 400,
    y: 250,
    importance: 0.5,
    description: 'Основной регулятор давления на входе',
    connections: 3
  }
])

const allLinks = ref<GraphLink[]>([
  {
    id: 'link-1',
    source: allNodes.value[0],
    target: allNodes.value[1],
    type: 'requires',
    strength: 0.8
  },
  {
    id: 'link-2',
    source: allNodes.value[0],
    target: allNodes.value[2],
    type: 'caused_by',
    strength: 0.6
  },
  {
    id: 'link-3',
    source: allNodes.value[0],
    target: allNodes.value[3],
    type: 'contains',
    strength: 0.9
  },
  {
    id: 'link-4',
    source: allNodes.value[0],
    target: allNodes.value[4],
    type: 'contains',
    strength: 0.7
  },
  {
    id: 'link-5',
    source: allNodes.value[1],
    target: allNodes.value[4],
    type: 'relates_to',
    strength: 0.5
  }
])

const visibleNodes = computed(() => {
  if (selectedNodeType.value === 'all') {
    return allNodes.value
  }
  return allNodes.value.filter(node => node.type === selectedNodeType.value)
})

const visibleLinks = computed(() => {
  const nodeIds = new Set(visibleNodes.value.map(n => n.id))
  return allLinks.value.filter(link => 
    nodeIds.has(link.source.id) && nodeIds.has(link.target.id)
  )
})

const clusters = computed(() => {
  // Простая кластеризация по типам узлов
  const types = [...new Set(visibleNodes.value.map(n => n.type))]
  return types.map(type => ({
    type,
    nodes: visibleNodes.value.filter(n => n.type === type)
  }))
})

function filterNodes() {
  selectedNode.value = null
}

function updateGraph() {
  // TODO: обновить граф с новой глубиной связей
  console.log('Updating graph with depth:', connectionDepth.value)
}

function resetView() {
  viewBox.value = { x: 0, y: 0, width: 800, height: 600, scale: 1 }
  updateSvgViewBox()
}

function selectNode(node: GraphNode) {
  selectedNode.value = node
}

function showTooltip(node: GraphNode, event: MouseEvent) {
  tooltip.value = {
    show: true,
    x: event.clientX + 10,
    y: event.clientY - 10,
    node
  }
}

function hideTooltip() {
  tooltip.value.show = false
}

function getNodeRadius(importance: number) {
  return 8 + importance * 12
}

function getStrokeWidth(strength: number) {
  return 1 + strength * 3
}

function getNodeTypeName(type: string) {
  const names = {
    equipment: 'Оборудование',
    standards: 'Нормативы',
    incidents: 'Инциденты',
    documents: 'Документы'
  }
  return names[type as keyof typeof names] || type
}

function getNodeIcon(type: string) {
  const icons = {
    equipment: '⚙️',
    standards: '📋',
    incidents: '⚠️',
    documents: '📄'
  }
  return icons[type as keyof typeof icons] || '⭕'
}

function getRelatedNodes(node: GraphNode) {
  const relatedIds = allLinks.value
    .filter(link => link.source.id === node.id || link.target.id === node.id)
    .map(link => link.source.id === node.id ? link.target.id : link.source.id)
  
  return allNodes.value.filter(n => relatedIds.includes(n.id))
}

function startPan(event: MouseEvent) {
  isPanning.value = true
  panStart.value = { x: event.clientX, y: event.clientY }
}

function onPan(event: MouseEvent) {
  if (!isPanning.value) return
  
  const dx = event.clientX - panStart.value.x
  const dy = event.clientY - panStart.value.y
  
  viewBox.value.x -= dx / viewBox.value.scale
  viewBox.value.y -= dy / viewBox.value.scale
  
  panStart.value = { x: event.clientX, y: event.clientY }
  updateSvgViewBox()
}

function endPan() {
  isPanning.value = false
}

function onZoom(event: WheelEvent) {
  event.preventDefault()
  const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1
  viewBox.value.scale *= scaleFactor
  updateSvgViewBox()
}

function updateSvgViewBox() {
  if (graphSvg.value) {
    const { x, y, width, height, scale } = viewBox.value
    graphSvg.value.setAttribute('viewBox', `${x} ${y} ${width/scale} ${height/scale}`)
  }
}

function openInNeo4j() {
  // TODO: открыть узел в Neo4j Browser
  console.log('Opening in Neo4j:', selectedNode.value?.id)
}

function exportSubgraph() {
  // TODO: экспорт подграфа
  console.log('Exporting subgraph for:', selectedNode.value?.id)
}

onMounted(() => {
  nextTick(() => {
    updateSvgViewBox()
  })
})
</script>

<style lang="scss" scoped>
.knowledge-graph-viewer {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e7ff;
}

.graph-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
  }
  
  select, input {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
  }
  
  input[type="range"] {
    width: 80px;
  }
}

.depth-value {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-left: 8px;
}

.control-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #e5e7eb;
  }
}

.graph-container {
  position: relative;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  overflow: hidden;
  margin-bottom: 20px;
}

.graph-svg {
  width: 100%;
  height: 400px;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.link {
  stroke: #d1d5db;
  stroke-opacity: 0.6;
  
  &.link-requires { stroke: #3b82f6; }
  &.link-contains { stroke: #10b981; }
  &.link-caused_by { stroke: #ef4444; }
  &.link-relates_to { stroke: #8b5cf6; }
}

.node {
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.selected {
    transform: scale(1.2);
  }
}

.node-circle-equipment { fill: #3b82f6; }
.node-circle-standards { fill: #10b981; }
.node-circle-incidents { fill: #ef4444; }
.node-circle-documents { fill: #f59e0b; }

.node-label {
  font-size: 12px;
  font-weight: 600;
  fill: #374151;
  pointer-events: none;
}

.graph-tooltip {
  position: absolute;
  background: #1f2937;
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  max-width: 200px;
  z-index: 1000;
  pointer-events: none;
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.tooltip-type {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.tooltip-description {
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 8px;
}

.tooltip-stats {
  font-size: 11px;
  color: #d1d5db;
}

.node-details {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.detail-content {
  margin-top: 16px;
}

.detail-section {
  margin-bottom: 16px;
  
  h5 {
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  p {
    color: #6b7280;
    margin: 0;
    font-size: 14px;
  }
}

.detail-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  
  &.badge-equipment { background: #dbeafe; color: #1e40af; }
  &.badge-standards { background: #d1fae5; color: #065f46; }
  &.badge-incidents { background: #fee2e2; color: #991b1b; }
  &.badge-documents { background: #fef3c7; color: #92400e; }
}

.related-nodes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.related-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
}

.related-icon {
  font-size: 16px;
}

.related-label {
  font-size: 14px;
  color: #374151;
}

.detail-actions {
  display: flex;
  gap: 8px;
}

.detail-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
}

.graph-stats {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}
</style> 