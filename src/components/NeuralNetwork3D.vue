<template>
  <div class="neural-network-3d-container" ref="container">
    <!-- WebGL Canvas -->
    <canvas ref="webglCanvas" class="webgl-canvas"></canvas>
    
    <!-- Overlay элементы -->
    <div class="neural-overlay">
      <!-- Информационные панели -->
      <div class="neural-info-panels">
        <div class="info-panel" v-for="panel in infoPanels" :key="panel.id" :style="getPanelStyle(panel)">
          <div class="panel-title">{{ panel.title }}</div>
          <div class="panel-content">
            <div class="metric" v-for="metric in panel.metrics" :key="metric.id">
              <span class="metric-label">{{ metric.label }}</span>
              <span class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</span>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: metric.percentage + '%', backgroundColor: metric.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Нейронные импульсы -->
      <div class="neural-pulses">
        <div v-for="pulse in neuralPulses" 
             :key="pulse.id"
             class="neural-pulse"
             :style="getPulseStyle(pulse)">
          <div class="pulse-core"></div>
          <div class="pulse-ring"></div>
        </div>
      </div>
      
      <!-- Синапсы -->
      <svg class="synapses-overlay" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="synapseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ff6600;stop-opacity:0" />
            <stop offset="30%" style="stop-color:#ff6600;stop-opacity:0.8" />
            <stop offset="70%" style="stop-color:#00ff88;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#00ff88;stop-opacity:0" />
          </linearGradient>
          
          <filter id="synapseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Синаптические связи -->
        <g class="synaptic-connections">
          <path v-for="synapse in synapses"
                :key="synapse.id"
                :d="synapse.path"
                stroke="url(#synapseGradient)"
                stroke-width="2"
                fill="none"
                filter="url(#synapseGlow)"
                class="synapse-path"
                :style="{ opacity: synapse.activity }">
            <animate attributeName="stroke-dasharray" 
                     :values="`0,${synapse.length}; ${synapse.length},0; 0,${synapse.length}`"
                     :dur="`${synapse.speed}s`" 
                     repeatCount="indefinite"/>
          </path>
        </g>
      </svg>
      
      <!-- Контроллер сети -->
      <div class="network-controller">
        <div class="controller-header">
          <h3>🧠 Нейросеть</h3>
          <div class="status-indicator" :class="{ active: isNetworkActive }">
            {{ isNetworkActive ? 'АКТИВНА' : 'ПАУЗА' }}
          </div>
        </div>
        
        <div class="controller-body">
          <div class="control-section">
            <label>Слои нейронов</label>
            <input type="range" v-model="networkLayers" min="2" max="4" step="1" class="network-slider">
            <span class="control-value">{{ networkLayers }}</span>
          </div>
          
          <div class="control-section">
            <label>Скорость обучения</label>
            <input type="range" v-model="learningRate" min="0.01" max="1" step="0.01" class="network-slider">
            <span class="control-value">{{ learningRate }}</span>
          </div>
          
          <div class="control-section">
            <label>Активация</label>
            <select v-model="activationFunction" class="network-select">
              <option value="relu">ReLU</option>
              <option value="sigmoid">Sigmoid</option>
              <option value="tanh">Tanh</option>
              <option value="swish">Swish</option>
            </select>
          </div>
          
          <div class="control-buttons">
            <button @click="toggleNetwork" class="network-btn" :class="{ active: isNetworkActive }">
              {{ isNetworkActive ? '⏸️ Пауза' : '▶️ Запуск' }}
            </button>
            <button @click="trainNetwork" class="network-btn train">
              🎯 Обучить
            </button>
            <button @click="resetNetwork" class="network-btn reset">
              🔄 Сброс
            </button>
          </div>
        </div>
      </div>
      
      <!-- Визуализация весов -->
      <div class="weights-visualization">
        <canvas ref="weightsCanvas" width="200" height="150"></canvas>
        <div class="weights-label">Карта весов</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface NeuralNode {
  id: number
  x: number
  y: number
  z: number
  activation: number
  layer: number
  connections: Connection[]
  type: 'input' | 'hidden' | 'output'
}

interface Connection {
  id: string
  fromNode: number
  toNode: number
  weight: number
  activity: number
}

interface NeuralPulse {
  id: number
  x: number
  y: number
  z: number
  intensity: number
  life: number
  color: string
}

interface Synapse {
  id: number
  path: string
  activity: number
  length: number
  speed: number
}

interface InfoPanel {
  id: string
  title: string
  x: number
  y: number
  metrics: Metric[]
}

interface Metric {
  id: string
  label: string
  value: string
  color: string
  percentage: number
}

const container = ref<HTMLElement>()
const webglCanvas = ref<HTMLCanvasElement>()
const weightsCanvas = ref<HTMLCanvasElement>()

// Состояние сети
const isNetworkActive = ref(true)
const networkLayers = ref(5)
const learningRate = ref(0.1)
const activationFunction = ref('relu')

// Нейронная сеть
const neuralNodes = ref<NeuralNode[]>([])
const connections = ref<Connection[]>([])
const neuralPulses = ref<NeuralPulse[]>([])
const synapses = ref<Synapse[]>([])

// Панели информации
const infoPanels = ref<InfoPanel[]>([
  {
    id: 'performance',
    title: 'Производительность',
    x: 20,
    y: 20,
    metrics: [
      { id: 'accuracy', label: 'Точность', value: '94.7%', color: '#00ff88', percentage: 94.7 },
      { id: 'loss', label: 'Потери', value: '0.053', color: '#ff6600', percentage: 5.3 },
      { id: 'epoch', label: 'Эпоха', value: '247', color: '#4d8fd9', percentage: 82.3 }
    ]
  },
  {
    id: 'architecture',
    title: 'Архитектура',
    x: 20,
    y: 200,
    metrics: [
      { id: 'params', label: 'Параметры', value: '1.2M', color: '#ff00ff', percentage: 75 },
      { id: 'depth', label: 'Глубина', value: '5 слоев', color: '#ffff00', percentage: 60 },
      { id: 'neurons', label: 'Нейроны', value: '2,048', color: '#00ffff', percentage: 85 }
    ]
  }
])

// WebGL контекст
let gl: WebGLRenderingContext | null = null
let shaderProgram: WebGLProgram | null = null
let animationFrame: number
let timeOffset = 0

// Матрицы трансформации
const modelMatrix = new Float32Array(16)
const viewMatrix = new Float32Array(16)
const projectionMatrix = new Float32Array(16)

onMounted(() => {
  initializeWebGL()
  initializeNeuralNetwork()
  startAnimation()
  
  // Обработчики изменений
  watch(networkLayers, rebuildNetwork)
  watch(activationFunction, updateActivation)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

function initializeWebGL() {
  if (!webglCanvas.value) return
  
  const canvas = webglCanvas.value
  const rect = container.value?.getBoundingClientRect()
  
  if (rect) {
    canvas.width = rect.width
    canvas.height = rect.height
  }
  
  gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
  
  if (!gl) {
    console.error('WebGL не поддерживается')
    return
  }
  
  // Создание шейдеров
  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    attribute float aSize;
    
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform float uTime;
    
    varying vec3 vColor;
    varying float vIntensity;
    
    void main() {
      vec3 position = aPosition;
      
      // Добавляем колебания для имитации активности нейронов
      position.y += sin(uTime * 0.01 + aPosition.x * 0.1) * 0.1;
      position.z += cos(uTime * 0.008 + aPosition.y * 0.1) * 0.05;
      
      vec4 worldPosition = uModelMatrix * vec4(position, 1.0);
      vec4 viewPosition = uViewMatrix * worldPosition;
      gl_Position = uProjectionMatrix * viewPosition;
      
      gl_PointSize = aSize * (200.0 / -viewPosition.z);
      
      vColor = aColor;
      vIntensity = sin(uTime * 0.02 + aPosition.x + aPosition.y) * 0.5 + 0.5;
    }
  `
  
  const fragmentShaderSource = `
    precision mediump float;
    
    varying vec3 vColor;
    varying float vIntensity;
    
    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) {
        discard;
      }
      
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha *= vIntensity;
      
      // Создаем эффект ядра нейрона
      float core = 1.0 - smoothstep(0.0, 0.2, dist);
      vec3 finalColor = vColor + vec3(core * 0.5);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
  
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  
  if (vertexShader && fragmentShader) {
    shaderProgram = createProgram(gl, vertexShader, fragmentShader)
  }
  
  // Настройка WebGL
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 0.0)
  
  // Инициализация матриц
  initializeMatrices()
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Ошибка компиляции шейдера:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  
  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null
  
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Ошибка линковки программы:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  
  return program
}

function initializeMatrices() {
  if (!gl || !webglCanvas.value) return
  
  const canvas = webglCanvas.value
  const aspect = canvas.width / canvas.height
  
  // Матрица проекции (перспективная)
  const fov = Math.PI / 4
  const near = 0.1
  const far = 100.0
  
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fov)
  const rangeInv = 1.0 / (near - far)
  
  projectionMatrix[0] = f / aspect
  projectionMatrix[5] = f
  projectionMatrix[10] = (near + far) * rangeInv
  projectionMatrix[11] = -1
  projectionMatrix[14] = near * far * rangeInv * 2
  projectionMatrix[15] = 0
  
  // Матрица вида
  const eye = [0, 0, 5]
  
  lookAt(viewMatrix, eye)
  
  // Матрица модели (единичная)
  identity(modelMatrix)
}

function initializeNeuralNetwork() {
  neuralNodes.value = []
  connections.value = []
  
  const layerSizes = [8, 12, 16, 12, 8] // Размеры слоев
  let nodeId = 0
  
  // Создание узлов по слоям
  for (let layer = 0; layer < networkLayers.value; layer++) {
    const nodesInLayer = layerSizes[layer] || 10
    const layerZ = (layer - networkLayers.value / 2) * 2
    
    for (let node = 0; node < nodesInLayer; node++) {
      const angle = (node / nodesInLayer) * Math.PI * 2
      const radius = 1.5 + Math.sin(layer * 0.5) * 0.5
      
      neuralNodes.value.push({
        id: nodeId++,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: layerZ,
        activation: Math.random(),
        layer,
        connections: [],
        type: layer === 0 ? 'input' : layer === networkLayers.value - 1 ? 'output' : 'hidden'
      })
    }
  }
  
  // Создание связей между слоями
  createConnections()
  
  // Создание синапсов для SVG
  createSynapses()
}

function createConnections() {
  connections.value = []
  
  for (let layer = 0; layer < networkLayers.value - 1; layer++) {
    const currentLayerNodes = neuralNodes.value.filter(node => node.layer === layer)
    const nextLayerNodes = neuralNodes.value.filter(node => node.layer === layer + 1)
    
    currentLayerNodes.forEach(fromNode => {
      nextLayerNodes.forEach(toNode => {
        const connectionId = `${fromNode.id}-${toNode.id}`
        
        const connection: Connection = {
          id: connectionId,
          fromNode: fromNode.id,
          toNode: toNode.id,
          weight: (Math.random() - 0.5) * 2,
          activity: 0
        }
        
        connections.value.push(connection)
        fromNode.connections.push(connection)
      })
    })
  }
}

function createSynapses() {
  synapses.value = []
  
  connections.value.forEach((connection, index) => {
    const fromNode = neuralNodes.value.find(n => n.id === connection.fromNode)
    const toNode = neuralNodes.value.find(n => n.id === connection.toNode)
    
    if (fromNode && toNode) {
      // Проецируем 3D координаты в 2D для SVG
      const fromX = (fromNode.x + 3) * 200
      const fromY = (fromNode.y + 2) * 150 + 100
      const toX = (toNode.x + 3) * 200
      const toY = (toNode.y + 2) * 150 + 100
      
      const path = `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2 - 50} ${toX} ${toY}`
      const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2))
      
      synapses.value.push({
        id: index,
        path,
        activity: Math.random(),
        length,
        speed: 2 + Math.random() * 3
      })
    }
  })
}

function startAnimation() {
  function animate() {
    timeOffset += 1
    
    if (isNetworkActive.value) {
      updateNeuralNetwork()
      updatePulses()
      updateSynapses()
      renderWebGL()
      renderWeights()
      updateInfoPanels()
    }
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}

function updateNeuralNetwork() {
  // Обновление активации нейронов
  neuralNodes.value.forEach(node => {
    if (node.type === 'input') {
      // Входной слой - случайные данные
      node.activation = Math.sin(timeOffset * 0.01 + node.id) * 0.5 + 0.5
    } else {
      // Скрытые и выходные слои - вычисляем активацию
      let sum = 0
      let connectionCount = 0
      
      connections.value.forEach(conn => {
        if (conn.toNode === node.id) {
          const fromNode = neuralNodes.value.find(n => n.id === conn.fromNode)
          if (fromNode) {
            sum += fromNode.activation * conn.weight
            connectionCount++
          }
        }
      })
      
      if (connectionCount > 0) {
        sum /= connectionCount
        
        // Применение функции активации
        switch (activationFunction.value) {
          case 'relu':
            node.activation = Math.max(0, sum)
            break
          case 'sigmoid':
            node.activation = 1 / (1 + Math.exp(-sum))
            break
          case 'tanh':
            node.activation = Math.tanh(sum)
            break
          case 'swish':
            node.activation = sum / (1 + Math.exp(-sum))
            break
        }
      }
    }
  })
  
  // Обновление активности связей
  connections.value.forEach(conn => {
    const fromNode = neuralNodes.value.find(n => n.id === conn.fromNode)
    const toNode = neuralNodes.value.find(n => n.id === conn.toNode)
    
    if (fromNode && toNode) {
      conn.activity = fromNode.activation * Math.abs(conn.weight) * toNode.activation
    }
  })
}

function updatePulses() {
  // Создание новых импульсов
  if (Math.random() < 0.1) {
    const activeNodes = neuralNodes.value.filter(node => node.activation > 0.7)
    
    if (activeNodes.length > 0) {
      const node = activeNodes[Math.floor(Math.random() * activeNodes.length)]
      
      neuralPulses.value.push({
        id: Date.now() + Math.random(),
        x: node.x,
        y: node.y,
        z: node.z,
        intensity: node.activation,
        life: 1,
        color: getNodeColor(node)
      })
    }
  }
  
  // Обновление существующих импульсов
  neuralPulses.value = neuralPulses.value.filter(pulse => {
    pulse.life -= 0.02
    pulse.intensity *= 0.98
    return pulse.life > 0
  })
}

function updateSynapses() {
  synapses.value.forEach(synapse => {
    const connection = connections.value[synapse.id]
    if (connection) {
      synapse.activity = connection.activity
    }
  })
}

function renderWebGL() {
  if (!gl || !shaderProgram) return
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.useProgram(shaderProgram)
  
  // Обновление матрицы модели (вращение)
  const rotation = timeOffset * 0.005
  rotateY(modelMatrix, rotation)
  
  // Передача uniform переменных
  const uModelMatrix = gl.getUniformLocation(shaderProgram, 'uModelMatrix')
  const uViewMatrix = gl.getUniformLocation(shaderProgram, 'uViewMatrix')
  const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
  const uTime = gl.getUniformLocation(shaderProgram, 'uTime')
  
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix)
  gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)
  gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix)
  gl.uniform1f(uTime, timeOffset)
  
  // Подготовка данных вершин
  const positions: number[] = []
  const colors: number[] = []
  const sizes: number[] = []
  
  neuralNodes.value.forEach(node => {
    positions.push(node.x, node.y, node.z)
    
    const color = hexToRgb(getNodeColor(node))
    colors.push(color.r, color.g, color.b)
    
    sizes.push(5 + node.activation * 10)
  })
  
  // Создание и заполнение буферов
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  
  const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition')
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
  
  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
  
  const aColor = gl.getAttribLocation(shaderProgram, 'aColor')
  gl.enableVertexAttribArray(aColor)
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)
  
  const sizeBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.STATIC_DRAW)
  
  const aSize = gl.getAttribLocation(shaderProgram, 'aSize')
  gl.enableVertexAttribArray(aSize)
  gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)
  
  // Рендеринг точек
  gl.drawArrays(gl.POINTS, 0, neuralNodes.value.length)
}

function renderWeights() {
  const canvas = weightsCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Рисование карты весов
  const cellSize = 4
  const cols = Math.floor(canvas.width / cellSize)
  const rows = Math.floor(canvas.height / cellSize)
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const connectionIndex = (y * cols + x) % connections.value.length
      const connection = connections.value[connectionIndex]
      
      if (connection) {
        const weight = connection.weight
        const intensity = Math.abs(weight)
        const hue = weight > 0 ? 120 : 0 // Зеленый для положительных, красный для отрицательных
        
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${intensity * 0.8})`
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
  }
}

function updateInfoPanels() {
  // Обновление метрик производительности
  const accuracyPanel = infoPanels.value.find(p => p.id === 'performance')
  if (accuracyPanel) {
    const accuracy = accuracyPanel.metrics.find(m => m.id === 'accuracy')
    if (accuracy) {
      const variation = Math.sin(timeOffset * 0.01) * 2
      accuracy.percentage = Math.max(90, Math.min(99, 94.7 + variation))
      accuracy.value = `${accuracy.percentage.toFixed(1)}%`
    }
  }
}

// Утилиты
function getNodeColor(node: NeuralNode): string {
  switch (node.type) {
    case 'input': return '#00ff88'
    case 'output': return '#ff6600'
    default: return '#4d8fd9'
  }
}

function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 1, g: 1, b: 1 }
}

function identity(matrix: Float32Array) {
  matrix.fill(0)
  matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1
}

function rotateY(matrix: Float32Array, angle: number) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  
  const temp = new Float32Array(16)
  temp.set(matrix)
  
  matrix[0] = temp[0] * cos + temp[8] * sin
  matrix[2] = -temp[0] * sin + temp[8] * cos
  matrix[8] = temp[0] * sin + temp[8] * cos
  matrix[10] = -temp[0] * sin + temp[8] * cos
}

function lookAt(out: Float32Array, eye: number[]) {
  // Упрощенная реализация lookAt матрицы
  identity(out)
  out[12] = -eye[0]
  out[13] = -eye[1]
  out[14] = -eye[2]
}

// Обработчики событий
function toggleNetwork() {
  isNetworkActive.value = !isNetworkActive.value
}

function trainNetwork() {
  // Имитация обучения сети
  connections.value.forEach(conn => {
    conn.weight += (Math.random() - 0.5) * learningRate.value * 0.1
    conn.weight = Math.max(-2, Math.min(2, conn.weight))
  })
}

function resetNetwork() {
  initializeNeuralNetwork()
}

function rebuildNetwork() {
  initializeNeuralNetwork()
}

function updateActivation() {
  // Активация обновится автоматически в следующем кадре
}

// Стили для элементов
function getPanelStyle(panel: InfoPanel) {
  return {
    left: panel.x + 'px',
    top: panel.y + 'px'
  }
}

function getPulseStyle(pulse: NeuralPulse) {
  // Проекция 3D в 2D для overlay
  const x = (pulse.x + 3) * 200
  const y = (pulse.y + 2) * 150 + 100
  
  return {
    left: x + 'px',
    top: y + 'px',
    opacity: pulse.life,
    transform: `scale(${pulse.intensity * 2})`
  }
}
</script>

<style scoped lang="scss">
.neural-network-3d-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: radial-gradient(circle at center, rgba(0, 20, 40, 0.9), rgba(0, 0, 0, 0.95));
  overflow: hidden;
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.webgl-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.neural-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.neural-info-panels {
  .info-panel {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 8px;
    padding: 12px;
    pointer-events: auto;
    min-width: 180px;
    
    .panel-title {
      font-size: 14px;
      font-weight: bold;
      color: #00ff88;
      margin-bottom: 8px;
      text-align: center;
    }
    
    .panel-content {
      .metric {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        font-size: 11px;
        
        .metric-label {
          flex: 1;
          color: #ccc;
        }
        
        .metric-value {
          margin-left: 8px;
          font-weight: bold;
          min-width: 50px;
          text-align: right;
        }
        
        .metric-bar {
          width: 60px;
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          margin-left: 8px;
          overflow: hidden;
          
          .metric-fill {
            height: 100%;
            border-radius: 2px;
            transition: width 0.3s ease;
          }
        }
      }
    }
  }
}

.neural-pulses {
  .neural-pulse {
    position: absolute;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    
    .pulse-core {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      background: radial-gradient(circle, #ffffff, currentColor);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: pulseCore 1s ease-in-out infinite;
    }
    
    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border: 1px solid currentColor;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: pulseRing 1.5s ease-out infinite;
    }
  }
}

.synapses-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .synapse-path {
    stroke-linecap: round;
  }
}

.network-controller {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 10px;
  padding: 15px;
  pointer-events: auto;
  
  .controller-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    h3 {
      margin: 0;
      color: #00ff88;
      font-size: 16px;
    }
    
    .status-indicator {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: bold;
      background: rgba(255, 0, 0, 0.2);
      color: #ff6666;
      border: 1px solid #ff6666;
      
      &.active {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
        border-color: #00ff88;
      }
    }
  }
  
  .controller-body {
    .control-section {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-size: 12px;
      color: #ccc;
      
      label {
        min-width: 100px;
        margin-right: 10px;
      }
      
      .control-value {
        min-width: 40px;
        text-align: right;
        color: #fff;
        font-weight: bold;
        margin-left: 8px;
      }
    }
    
    .network-slider, .network-select {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      border-radius: 4px;
      color: white;
      padding: 4px 8px;
      font-size: 11px;
    }
    
    .control-buttons {
      display: flex;
      gap: 8px;
      margin-top: 15px;
      
      .network-btn {
        padding: 8px 12px;
        background: rgba(0, 255, 136, 0.2);
        border: 1px solid #00ff88;
        border-radius: 6px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 10px;
        
        &:hover {
          background: rgba(0, 255, 136, 0.4);
          transform: translateY(-1px);
        }
        
        &.active {
          background: rgba(0, 255, 136, 0.6);
        }
        
        &.train {
          background: rgba(255, 102, 0, 0.2);
          border-color: #ff6600;
          
          &:hover {
            background: rgba(255, 102, 0, 0.4);
          }
        }
        
        &.reset {
          background: rgba(255, 0, 102, 0.2);
          border-color: #ff0066;
          
          &:hover {
            background: rgba(255, 0, 102, 0.4);
          }
        }
      }
    }
  }
}

.weights-visualization {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  pointer-events: auto;
  
  canvas {
    display: block;
    border-radius: 4px;
  }
  
  .weights-label {
    text-align: center;
    font-size: 10px;
    color: #ccc;
    margin-top: 5px;
  }
}

// Анимации
@keyframes pulseCore {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.3); }
}

@keyframes pulseRing {
  0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.5); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
}
</style> 