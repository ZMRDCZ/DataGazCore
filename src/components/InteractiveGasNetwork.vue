<template>
  <div class="interactive-gas-network" ref="networkContainer">
    <!-- 3D Контейнер сети -->
    <div class="network-3d-container" :class="{ 'perspective-mode': perspectiveMode }">
      
      <!-- Главная схема газовой сети -->
      <div class="network-main" @mousemove="handleMouseMove" @mouseleave="resetNetwork">
        
        <!-- Центральная газораспределительная станция -->
        <div 
          class="gas-station central" 
          :style="getStationStyle('central')"
          @click="activateStation('central')"
          :class="{ active: activeStation === 'central' }"
        >
          <div class="station-core">
            <div class="core-inner pulse-effect"></div>
            <div class="core-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
            </div>
          </div>
          <div class="station-label">ГРС "Центральная"</div>
          <div class="station-stats">
            <div class="stat">{{ centralStation.pressure }} бар</div>
            <div class="stat">{{ centralStation.flow }} м³/ч</div>
          </div>
        </div>

        <!-- Районные газораспределительные пункты -->
        <div 
          v-for="district in districtStations" 
          :key="district.id"
          class="gas-station district"
          :style="getStationStyle(district.id)"
          @click="activateStation(district.id)"
          :class="{ 
            active: activeStation === district.id,
            connected: district.connected,
            'low-pressure': district.pressure < 2
          }"
        >
          <div class="station-core">
            <div class="core-inner" :style="{ backgroundColor: district.color }"></div>
            <div class="pressure-indicator" :style="{ height: `${district.pressure * 20}%` }"></div>
          </div>
          <div class="station-label">{{ district.name }}</div>
          <div class="station-stats">
            <div class="stat">{{ district.pressure.toFixed(1) }} бар</div>
            <div class="stat">{{ district.flow }} м³/ч</div>
          </div>
        </div>

        <!-- Динамические трубопроводы -->
        <svg class="pipeline-network" :viewBox="`0 0 ${networkWidth} ${networkHeight}`">
          <defs>
            <!-- Градиенты для труб разного давления -->
            <linearGradient id="highPressure" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#005bbf;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#4d8fd9;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#005bbf;stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="mediumPressure" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ff6600;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#ff8533;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#ff6600;stop-opacity:1" />
            </linearGradient>

            <linearGradient id="lowPressure" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ffcc99;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#ffe066;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#ffcc99;stop-opacity:1" />
            </linearGradient>

            <!-- Фильтры для свечения -->
            <filter id="pipeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <!-- Анимированные маркеры потока газа -->
            <marker id="flowArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <polygon points="0,0 0,6 9,3" fill="#ff6600" opacity="0.8">
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="1;1.2;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </polygon>
            </marker>
          </defs>

          <!-- Основные магистральные трубопроводы -->
          <g class="main-pipelines">
            <path 
              v-for="pipeline in mainPipelines" 
              :key="pipeline.id"
              :d="pipeline.path"
              :stroke="pipeline.gradientUrl"
              :stroke-width="pipeline.width"
              fill="none"
              filter="url(#pipeGlow)"
              class="pipeline animated-pipeline"
              :class="pipeline.pressureClass"
              marker-end="url(#flowArrow)"
              @click="selectPipeline(pipeline)"
            />
          </g>

          <!-- Соединительные трубопроводы -->
          <g class="connection-pipes">
            <path 
              v-for="connection in connectionPipes" 
              :key="connection.id"
              :d="connection.path"
              stroke="url(#mediumPressure)"
              stroke-width="4"
              fill="none"
              filter="url(#pipeGlow)"
              class="connection-pipe"
              stroke-dasharray="10,5"
              :style="{ animationDelay: connection.delay }"
            />
          </g>

          <!-- Интерактивные клапаны -->
          <g class="valve-network">
            <g 
              v-for="valve in networkValves" 
              :key="valve.id"
              class="network-valve"
              :transform="`translate(${valve.x}, ${valve.y})`"
              @click="toggleValve(valve)"
              :class="{ open: valve.isOpen, critical: valve.isCritical }"
            >
              <circle r="8" fill="#ffffff" stroke="#005bbf" stroke-width="2" class="valve-housing"/>
              <circle r="4" :fill="valve.isOpen ? '#00ff00' : '#ff0000'" class="valve-status pulse"/>
              <rect x="-6" y="-1" width="12" height="2" :fill="valve.isOpen ? '#00ff00' : '#ff0000'" class="valve-indicator"/>
              <text x="0" y="20" text-anchor="middle" fill="#003876" font-size="8" font-weight="bold">
                {{ valve.label }}
              </text>
            </g>
          </g>

          <!-- Зоны покрытия газоснабжения -->
          <g class="coverage-zones" v-if="showCoverage">
            <circle 
              v-for="zone in coverageZones" 
              :key="zone.id"
              :cx="zone.x"
              :cy="zone.y"
              :r="zone.radius"
              :fill="zone.color"
              :opacity="zone.opacity"
              class="coverage-zone animated-zone"
              :style="{ animationDelay: zone.delay }"
            />
          </g>
        </svg>

        <!-- Информационные панели -->
        <div class="info-panels">
          <div 
            v-for="panel in infoPanels" 
            :key="panel.id"
            class="info-panel"
            :style="getPanelStyle(panel)"
            :class="{ visible: panel.visible, critical: panel.critical }"
          >
            <div class="panel-header">
              <span class="panel-icon">{{ panel.icon }}</span>
              <span class="panel-title">{{ panel.title }}</span>
            </div>
            <div class="panel-content">
              <div v-for="item in panel.data" :key="item.label" class="panel-item">
                <span class="item-label">{{ item.label }}:</span>
                <span class="item-value" :class="item.status">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Контролы интерфейса -->
      <div class="network-controls">
        <button 
          @click="togglePerspective" 
          class="control-btn perspective-btn"
          :class="{ active: perspectiveMode }"
        >
          <span class="btn-icon">🌍</span>
          3D Вид
        </button>
        
        <button 
          @click="toggleCoverage" 
          class="control-btn coverage-btn"
          :class="{ active: showCoverage }"
        >
          <span class="btn-icon">📍</span>
          Зоны покрытия
        </button>
        
        <button 
          @click="simulateEmergency" 
          class="control-btn emergency-btn"
          :class="{ active: emergencyMode }"
        >
          <span class="btn-icon">🚨</span>
          Авария
        </button>
        
        <button 
          @click="resetNetwork" 
          class="control-btn reset-btn"
        >
          <span class="btn-icon">🔄</span>
          Сброс
        </button>
      </div>

      <!-- Легенда -->
      <div class="network-legend">
        <div class="legend-item">
          <div class="legend-color high-pressure"></div>
          <span>Высокое давление (>4 бар)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color medium-pressure"></div>
          <span>Среднее давление (1-4 бар)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color low-pressure"></div>
          <span>Низкое давление (<1 бар)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Интерфейсы
interface GasStation {
  id: string
  name: string
  x: number
  y: number
  pressure: number
  flow: number
  color: string
  connected: boolean
}

interface Pipeline {
  id: string
  path: string
  width: number
  gradientUrl: string
  pressureClass: string
}

interface NetworkValve {
  id: string
  x: number
  y: number
  label: string
  isOpen: boolean
  isCritical: boolean
}

interface InfoPanel {
  id: string
  x: number
  y: number
  title: string
  icon: string
  visible: boolean
  critical: boolean
  data: Array<{ label: string; value: string; status: string }>
}

// Реактивные переменные
const networkContainer = ref<HTMLElement>()
const activeStation = ref<string>('')
const perspectiveMode = ref(false)
const showCoverage = ref(false)
const emergencyMode = ref(false)
const networkWidth = ref(1200)
const networkHeight = ref(800)

// Центральная станция
const centralStation = ref({
  pressure: 6.2,
  flow: 15000
})

// Районные станции
const districtStations = ref<GasStation[]>([
  { id: 'north', name: 'ГРП Север', x: 600, y: 150, pressure: 3.8, flow: 4200, color: '#005bbf', connected: true },
  { id: 'south', name: 'ГРП Юг', x: 600, y: 650, pressure: 3.2, flow: 3800, color: '#4d8fd9', connected: true },
  { id: 'east', name: 'ГРП Восток', x: 950, y: 400, pressure: 2.9, flow: 3200, color: '#ff6600', connected: true },
  { id: 'west', name: 'ГРП Запад', x: 250, y: 400, pressure: 1.8, flow: 2100, color: '#ff8533', connected: true }
])

// Основные трубопроводы
const mainPipelines = ref<Pipeline[]>([
  { id: 'central-north', path: 'M 600 400 Q 600 300 600 150', width: 8, gradientUrl: 'url(#highPressure)', pressureClass: 'high-pressure' },
  { id: 'central-south', path: 'M 600 400 Q 600 500 600 650', width: 8, gradientUrl: 'url(#highPressure)', pressureClass: 'high-pressure' },
  { id: 'central-east', path: 'M 600 400 Q 750 400 950 400', width: 6, gradientUrl: 'url(#mediumPressure)', pressureClass: 'medium-pressure' },
  { id: 'central-west', path: 'M 600 400 Q 450 400 250 400', width: 6, gradientUrl: 'url(#mediumPressure)', pressureClass: 'medium-pressure' }
])

// Соединительные трубопроводы
const connectionPipes = ref([
  { id: 'north-east', path: 'M 600 150 Q 775 275 950 400', delay: '0.5s' },
  { id: 'north-west', path: 'M 600 150 Q 425 275 250 400', delay: '1s' },
  { id: 'south-east', path: 'M 600 650 Q 775 525 950 400', delay: '1.5s' },
  { id: 'south-west', path: 'M 600 650 Q 425 525 250 400', delay: '2s' }
])

// Клапаны
const networkValves = ref<NetworkValve[]>([
  { id: 'v1', x: 600, y: 275, label: 'K-001', isOpen: true, isCritical: false },
  { id: 'v2', x: 600, y: 525, label: 'K-002', isOpen: true, isCritical: false },
  { id: 'v3', x: 775, y: 400, label: 'K-003', isOpen: true, isCritical: true },
  { id: 'v4', x: 425, y: 400, label: 'K-004', isOpen: true, isCritical: false },
  { id: 'v5', x: 775, y: 275, label: 'K-005', isOpen: true, isCritical: false }
])

// Зоны покрытия
const coverageZones = ref([
  { id: 'zone1', x: 600, y: 150, radius: 80, color: 'rgba(0, 91, 191, 0.2)', opacity: 0.6, delay: '0s' },
  { id: 'zone2', x: 600, y: 650, radius: 75, color: 'rgba(77, 143, 217, 0.2)', opacity: 0.6, delay: '0.5s' },
  { id: 'zone3', x: 950, y: 400, radius: 70, color: 'rgba(255, 102, 0, 0.2)', opacity: 0.6, delay: '1s' },
  { id: 'zone4', x: 250, y: 400, radius: 65, color: 'rgba(255, 133, 51, 0.2)', opacity: 0.6, delay: '1.5s' }
])

// Информационные панели
const infoPanels = ref<InfoPanel[]>([
  {
    id: 'main-stats',
    x: 50,
    y: 50,
    title: 'Общие показатели',
    icon: '📊',
    visible: true,
    critical: false,
    data: [
      { label: 'Общий расход', value: '13.3 тыс. м³/ч', status: 'normal' },
      { label: 'Среднее давление', value: '3.2 бар', status: 'normal' },
      { label: 'Эффективность', value: '98.5%', status: 'good' }
    ]
  }
])

// Методы
const getStationStyle = (stationId: string) => {
  if (stationId === 'central') {
    return {
      left: '600px',
      top: '400px',
      transform: perspectiveMode.value ? 'translateZ(20px) scale(1.2)' : 'translate(-50%, -50%)'
    }
  }
  
  const station = districtStations.value.find(s => s.id === stationId)
  if (!station) return {}
  
  return {
    left: `${station.x}px`,
    top: `${station.y}px`,
    transform: perspectiveMode.value ? 'translateZ(10px)' : 'translate(-50%, -50%)'
  }
}

const getPanelStyle = (panel: InfoPanel) => ({
  left: `${panel.x}px`,
  top: `${panel.y}px`
})

const activateStation = (stationId: string) => {
  activeStation.value = activeStation.value === stationId ? '' : stationId
  
  // Обновляем информационные панели
  if (stationId === 'central') {
    infoPanels.value[0].visible = true
  } else {
    const station = districtStations.value.find(s => s.id === stationId)
    if (station) {
      infoPanels.value.push({
        id: `panel-${stationId}`,
        x: station.x + 100,
        y: station.y - 50,
        title: station.name,
        icon: '🏭',
        visible: true,
        critical: station.pressure < 2,
        data: [
          { label: 'Давление', value: `${station.pressure} бар`, status: station.pressure < 2 ? 'critical' : 'normal' },
          { label: 'Расход', value: `${station.flow} м³/ч`, status: 'normal' },
          { label: 'Статус', value: station.connected ? 'Подключен' : 'Отключен', status: station.connected ? 'good' : 'critical' }
        ]
      })
    }
  }
}

const toggleValve = (valve: NetworkValve) => {
  valve.isOpen = !valve.isOpen
  
  // Симуляция влияния на систему
  if (valve.isCritical && !valve.isOpen) {
    // Критический клапан закрыт - снижаем давление
    districtStations.value.forEach(station => {
      station.pressure *= 0.7
      station.connected = false
    })
    emergencyMode.value = true
  }
}

const togglePerspective = () => {
  perspectiveMode.value = !perspectiveMode.value
}

const toggleCoverage = () => {
  showCoverage.value = !showCoverage.value
}

const simulateEmergency = () => {
  emergencyMode.value = !emergencyMode.value
  
  if (emergencyMode.value) {
    // Симуляция аварийной ситуации
    districtStations.value.forEach(station => {
      station.pressure *= 0.5
      station.flow *= 0.3
    })
    
    // Добавляем критическую панель
    infoPanels.value.push({
      id: 'emergency',
      x: 50,
      y: 200,
      title: 'АВАРИЯ',
      icon: '🚨',
      visible: true,
      critical: true,
      data: [
        { label: 'Статус', value: 'Критический', status: 'critical' },
        { label: 'Давление', value: 'Падает', status: 'critical' },
        { label: 'Действие', value: 'Требуется', status: 'critical' }
      ]
    })
  } else {
    // Восстановление
    districtStations.value.forEach(station => {
      station.pressure = station.pressure / 0.5
      station.flow = station.flow / 0.3
      station.connected = true
    })
    
    infoPanels.value = infoPanels.value.filter(p => p.id !== 'emergency')
  }
}

const resetNetwork = () => {
  activeStation.value = ''
  emergencyMode.value = false
  showCoverage.value = false
  perspectiveMode.value = false
  
  // Сброс состояния станций
  districtStations.value.forEach(station => {
    station.connected = true
  })
  
  // Сброс клапанов
  networkValves.value.forEach(valve => {
    valve.isOpen = true
  })
  
  // Очистка панелей
  infoPanels.value = [infoPanels.value[0]]
}

const handleMouseMove = (event: MouseEvent) => {
  const rect = networkContainer.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Параллакс эффект
  const moveX = (x - rect.width / 2) * 0.01
  const moveY = (y - rect.height / 2) * 0.01
  
  if (perspectiveMode.value) {
    const network = networkContainer.value?.querySelector('.network-main') as HTMLElement
    if (network) {
      network.style.transform = `perspective(1000px) rotateX(${moveY}deg) rotateY(${moveX}deg)`
    }
  }
}

onMounted(() => {
  // Инициализация
})
</script>

<style lang="scss" scoped>
@import '../styles/tokens.scss';

.interactive-gas-network {
  position: relative;
  width: 100%;
  height: 800px;
  background: linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%);
  border-radius: $card-radius;
  overflow: hidden;
  box-shadow: $color-shadow-xl;
}

.network-3d-container {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  
  &.perspective-mode {
    .network-main {
      transform-style: preserve-3d;
      transition: transform $transition-smooth;
    }
  }
}

.network-main {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

// === ГАЗОВЫЕ СТАНЦИИ ===
.gas-station {
  position: absolute;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: $transition-dramatic;
  z-index: $z-content;
  
  &.central {
    width: 120px;
    height: 120px;
    z-index: $z-content + 1;
    
    .station-core {
      background: radial-gradient(circle, $color-primary 0%, $color-primary-dark 100%);
      box-shadow: $color-glow-blue, $color-shadow-xl;
      
      .core-inner {
        background: $color-accent;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin: 20px auto;
        position: relative;
        
        &.pulse-effect {
          animation: centralPulse $transition-pulse;
        }
      }
      
      .core-rings {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        
        .ring {
          position: absolute;
          border: 2px solid rgba(255, 102, 0, 0.3);
          border-radius: 50%;
          animation: ringExpand 3s ease-out infinite;
          
          &.ring-1 {
            width: 80%;
            height: 80%;
            top: 10%;
            left: 10%;
            animation-delay: 0s;
          }
          
          &.ring-2 {
            width: 90%;
            height: 90%;
            top: 5%;
            left: 5%;
            animation-delay: 1s;
          }
          
          &.ring-3 {
            width: 100%;
            height: 100%;
            top: 0%;
            left: 0%;
            animation-delay: 2s;
          }
        }
      }
    }
  }
  
  &.district {
    .station-core {
      background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(0, 91, 191, 0.1) 100%);
      border: 3px solid $color-primary;
      
      .core-inner {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: 20px auto;
        transition: $transition-smooth;
      }
      
      .pressure-indicator {
        position: absolute;
        bottom: 5px;
        left: 5px;
        width: 6px;
        background: linear-gradient(to top, #ff0000 0%, #ffff00 50%, #00ff00 100%);
        border-radius: 3px;
        transition: $transition-smooth;
      }
    }
    
    &.low-pressure {
      .station-core {
        border-color: $color-accent;
        animation: lowPressureWarning 2s ease-in-out infinite;
      }
    }
    
    &.connected {
      .station-core::after {
        content: '';
        position: absolute;
        top: -5px;
        right: -5px;
        width: 12px;
        height: 12px;
        background: #00ff00;
        border-radius: 50%;
        border: 2px solid white;
        animation: connectionPulse $transition-pulse;
      }
    }
  }
  
  .station-core {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    transition: $transition-bounce;
  }
  
  .station-label {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
    font-size: 12px;
    font-weight: $font-weight-semibold;
    color: $color-text-main;
    text-align: center;
    white-space: nowrap;
  }
  
  .station-stats {
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat {
      font-size: 10px;
      color: $color-text-secondary;
      margin: 1px 0;
    }
  }
  
  &:hover {
    transform: scale(1.15) translateZ(20px);
    
    .station-core {
      box-shadow: $color-glow-orange, $color-shadow-xl;
      filter: brightness(1.1);
    }
  }
  
  &.active {
    transform: scale(1.2) translateZ(30px);
    
    .station-core {
      box-shadow: $color-flame-glow, $color-shadow-xl;
      animation: activeStation $transition-pulse;
    }
  }
}

// === ТРУБОПРОВОДНАЯ СЕТЬ ===
.pipeline-network {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-particles;
}

.pipeline {
  transition: $transition-smooth;
  cursor: pointer;
  
  &.high-pressure {
    stroke-dasharray: 20 5;
    animation: highPressureFlow 2s linear infinite;
  }
  
  &.medium-pressure {
    stroke-dasharray: 15 8;
    animation: mediumPressureFlow 3s linear infinite;
  }
  
  &.low-pressure {
    stroke-dasharray: 10 10;
    animation: lowPressureFlow 4s linear infinite;
  }
  
  &:hover {
    stroke-width: 10;
    filter: url(#pipeGlow) brightness(1.3);
  }
}

.connection-pipe {
  animation: connectionFlow 4s linear infinite;
  
  &:hover {
    stroke-width: 6;
  }
}

.network-valve {
  cursor: pointer;
  transition: $transition-bounce;
  
  .valve-housing {
    transition: $transition-smooth;
  }
  
  .valve-status {
    animation: valveStatusPulse 2s ease-in-out infinite;
    
    &.pulse {
      animation-duration: 1s;
    }
  }
  
  .valve-indicator {
    transition: $transition-smooth;
  }
  
  &:hover {
    transform: scale(1.3);
    
    .valve-housing {
      stroke-width: 3;
      filter: drop-shadow(0 0 10px rgba(0, 91, 191, 0.8));
    }
  }
  
  &.open {
    .valve-indicator {
      transform: rotate(90deg);
    }
  }
  
  &.critical {
    .valve-housing {
      stroke: $color-accent;
      animation: criticalValve 1.5s ease-in-out infinite;
    }
  }
}

.coverage-zone {
  animation: zoneExpand 4s ease-in-out infinite;
  
  &.animated-zone {
    animation: zoneExpandDelayed 6s ease-in-out infinite;
  }
}

// === ИНФОРМАЦИОННЫЕ ПАНЕЛИ ===
.info-panels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: $z-content + 2;
}

.info-panel {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid $color-primary-light;
  border-radius: 12px;
  padding: 16px;
  min-width: 200px;
  backdrop-filter: blur(10px);
  box-shadow: $color-shadow-medium;
  transform: translateY(20px) scale(0.8);
  opacity: 0;
  transition: $transition-dramatic;
  pointer-events: auto;
  
  &.visible {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  
  &.critical {
    border-color: $color-accent;
    background: rgba(255, 102, 0, 0.1);
    animation: criticalPanel 2s ease-in-out infinite;
  }
  
  .panel-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    .panel-icon {
      font-size: 18px;
      margin-right: 8px;
    }
    
    .panel-title {
      font-weight: $font-weight-bold;
      color: $color-text-main;
    }
  }
  
  .panel-content {
    .panel-item {
      display: flex;
      justify-content: space-between;
      margin: 6px 0;
      
      .item-label {
        color: $color-text-secondary;
        font-size: 12px;
      }
      
      .item-value {
        font-weight: $font-weight-semibold;
        font-size: 12px;
        
        &.normal { color: $color-text-main; }
        &.good { color: #00aa00; }
        &.critical { color: $color-accent; animation: criticalBlink 1s ease-in-out infinite; }
      }
    }
  }
}

// === КОНТРОЛЫ ===
.network-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: $z-content + 3;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid $color-primary-light;
  border-radius: 25px;
  color: $color-text-main;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: $transition-bounce;
  backdrop-filter: blur(10px);
  font-size: 14px;
  
  .btn-icon {
    font-size: 16px;
  }
  
  &:hover {
    background: rgba(0, 91, 191, 0.1);
    transform: translateY(-2px) scale(1.05);
    box-shadow: $color-shadow-medium;
  }
  
  &.active {
    background: $color-primary;
    color: white;
    border-color: $color-primary-dark;
    
    &:hover {
      background: $color-primary-dark;
    }
  }
  
  &.emergency-btn {
    &.active {
      background: $color-accent;
      border-color: $color-accent-light;
      animation: emergencyButton 1s ease-in-out infinite;
    }
  }
}

// === ЛЕГЕНДА ===
.network-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  box-shadow: $color-shadow-medium;
  z-index: $z-content + 3;
  
  .legend-item {
    display: flex;
    align-items: center;
    margin: 8px 0;
    font-size: 12px;
    color: $color-text-main;
    
    .legend-color {
      width: 20px;
      height: 4px;
      margin-right: 10px;
      border-radius: 2px;
      
      &.high-pressure { background: linear-gradient(to right, $color-primary, $color-primary-light); }
      &.medium-pressure { background: linear-gradient(to right, $color-accent, $color-accent-light); }
      &.low-pressure { background: linear-gradient(to right, $color-accent-glow, #ffe066); }
    }
  }
}

// === АНИМАЦИИ ===
@keyframes centralPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 102, 0, 0.5); }
  50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(255, 102, 0, 0.8); }
}

@keyframes ringExpand {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes lowPressureWarning {
  0%, 100% { border-color: $color-primary; }
  50% { border-color: $color-accent; }
}

@keyframes connectionPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

@keyframes activeStation {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

@keyframes highPressureFlow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 25; }
}

@keyframes mediumPressureFlow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 23; }
}

@keyframes lowPressureFlow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 20; }
}

@keyframes connectionFlow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 30; }
}

@keyframes valveStatusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes criticalValve {
  0%, 100% { stroke-width: 2; }
  50% { stroke-width: 4; }
}

@keyframes zoneExpand {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes zoneExpandDelayed {
  0%, 100% { transform: scale(0.9); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

@keyframes criticalPanel {
  0%, 100% { border-color: $color-accent; }
  50% { border-color: $color-accent-light; }
}

@keyframes criticalBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes emergencyButton {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 102, 0, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 102, 0, 0.9); }
}

// === МОБИЛЬНАЯ АДАПТАЦИЯ ===
@include mobile {
  .interactive-gas-network {
    height: 600px;
  }
  
  .gas-station {
    width: 60px;
    height: 60px;
    
    &.central {
      width: 80px;
      height: 80px;
    }
    
    .station-label {
      font-size: 10px;
    }
    
    .station-stats .stat {
      font-size: 8px;
    }
  }
  
  .network-controls {
    top: 10px;
    right: 10px;
    
    .control-btn {
      padding: 8px 12px;
      font-size: 12px;
      
      .btn-icon {
        font-size: 14px;
      }
    }
  }
  
  .network-legend {
    bottom: 10px;
    left: 10px;
    padding: 12px;
    
    .legend-item {
      font-size: 10px;
      margin: 6px 0;
    }
  }
  
  .info-panel {
    min-width: 150px;
    padding: 12px;
    
    .panel-header .panel-icon {
      font-size: 16px;
    }
    
    .panel-content .panel-item {
      .item-label,
      .item-value {
        font-size: 10px;
      }
    }
  }
}
</style> 