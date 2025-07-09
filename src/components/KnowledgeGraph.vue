<template>
  <div class="knowledge-graph">
    <div class="graph-controls">
      <button 
        v-for="filter in filters" 
        :key="filter.key"
        @click="activeFilter = filter.key"
        :class="{ active: activeFilter === filter.key }"
        class="filter-btn"
      >
        {{ filter.label }}
      </button>
    </div>
    <div ref="containerRef" class="graph-container" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

interface Node {
  id: string
  label: string
  type: 'standard' | 'drawing' | 'incident' | 'equipment'
  x?: number
  y?: number
  z?: number
}

interface Link {
  source: string
  target: string
  strength: number
}

const containerRef = ref<HTMLDivElement>()
const activeFilter = ref<string>('all')

const filters = [
  { key: 'all', label: 'Все' },
  { key: 'standards', label: 'Нормативы' },
  { key: 'equipment', label: 'Объекты' },
  { key: 'incidents', label: 'Инциденты' }
]

// Мок данные для графа знаний
const mockNodes: Node[] = [
  { id: '1', label: 'СП 62.13330-2021', type: 'standard' },
  { id: '2', label: 'ГОСТ Р 58310-2018', type: 'standard' },
  { id: '3', label: 'УРП-50', type: 'equipment' },
  { id: '4', label: 'ГРП-12', type: 'equipment' },
  { id: '5', label: 'Инцидент #2024-041', type: 'incident' },
  { id: '6', label: 'Чертёж УРП-50', type: 'drawing' }
]

const mockLinks: Link[] = [
  { source: '1', target: '3', strength: 0.8 },
  { source: '2', target: '4', strength: 0.6 },
  { source: '3', target: '6', strength: 0.9 },
  { source: '4', target: '5', strength: 0.7 },
  { source: '1', target: '2', strength: 0.5 }
]

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let nodeObjects: THREE.Mesh[] = []

function getNodeColor(type: string): number {
  switch (type) {
    case 'standard': return 0x29b6f6
    case 'drawing': return 0x66bb6a
    case 'incident': return 0xff7043
    case 'equipment': return 0xffa726
    default: return 0x90caf9
  }
}

function initThreeJS() {
  const container = containerRef.value
  if (!container) return
  
  // Сцена
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f5f5)
  
  // Камера
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.z = 5
  
  // Рендерер
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)
  
  // Создаём узлы
  mockNodes.forEach((node, index) => {
    const geometry = new THREE.SphereGeometry(0.1, 16, 16)
    const material = new THREE.MeshBasicMaterial({ 
      color: getNodeColor(node.type),
      transparent: true,
      opacity: 0.8
    })
    const sphere = new THREE.Mesh(geometry, material)
    
    // Размещаем узлы по кругу
    const angle = (index / mockNodes.length) * Math.PI * 2
    sphere.position.x = Math.cos(angle) * 1.5
    sphere.position.y = Math.sin(angle) * 1.5
    sphere.position.z = (Math.random() - 0.5) * 0.5
    
    sphere.userData = { node }
    nodeObjects.push(sphere)
    scene.add(sphere)
  })
  
  // Создаём связи
  mockLinks.forEach(link => {
    const sourceNode = nodeObjects.find(obj => obj.userData.node.id === link.source)
    const targetNode = nodeObjects.find(obj => obj.userData.node.id === link.target)
    
    if (sourceNode && targetNode) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        sourceNode.position,
        targetNode.position
      ])
      const material = new THREE.LineBasicMaterial({ 
        color: 0x90caf9, 
        transparent: true, 
        opacity: link.strength * 0.6 
      })
      const line = new THREE.Line(geometry, material)
      scene.add(line)
    }
  })
  
  animate()
}

function animate() {
  // Медленное вращение сцены
  scene.rotation.y += 0.005
  
  // Пульсация узлов
  nodeObjects.forEach((node, index) => {
    const scale = 1 + Math.sin(Date.now() * 0.001 + index) * 0.1
    node.scale.setScalar(scale)
  })
  
  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

function filterNodes() {
  nodeObjects.forEach(nodeObj => {
    const node = nodeObj.userData.node
    const visible = activeFilter.value === 'all' || 
                   (activeFilter.value === 'standards' && node.type === 'standard') ||
                   (activeFilter.value === 'equipment' && node.type === 'equipment') ||
                   (activeFilter.value === 'incidents' && node.type === 'incident')
    
    nodeObj.visible = visible
  })
}

onMounted(() => {
  initThreeJS()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})

watch(activeFilter, filterNodes)
</script>

<style scoped>
.knowledge-graph {
  width: 100%;
  height: 400px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 32px 0 rgba(41, 182, 246, 0.18);
  overflow: hidden;
  margin-top: 32px;
}

.graph-controls {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e3f2fd;
}

.filter-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #e3f2fd;
  color: #29b6f6;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #29b6f6;
  color: #fff;
}

.graph-container {
  height: calc(100% - 64px);
  position: relative;
}
</style> 