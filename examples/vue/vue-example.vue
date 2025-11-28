<!--
  Vue Example Component
  Shows how to use zoom-pan library in a Vue 3 application with Composition API
-->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { zoomPan } from 'zoom-pan'
import type { IZoomPanInstance } from 'zoom-pan'

interface Props {
  minScale?: number
  maxScale?: number
  scaleSensitivity?: number
}

const props = withDefaults(defineProps<Props>(), {
  minScale: 0.1,
  maxScale: 30,
  scaleSensitivity: 50
})

// Template refs
const containerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()

// State
const scale = ref(1);
const translateX = ref(0)
const translateY = ref(0)

// Internal state
let zoomPanInstance: IZoomPanInstance | null = null

/**
 * Update displayed statistics from transform
 */
const updateStats = () => {
  if (!contentRef.value) return

  const transform = contentRef.value.style.transform
  const match = transform.match(/matrix\((.+)\)/)

  if (match) {
    const values = match[1].split(',').map(v => parseFloat(v.trim()))
    const [s, , , , tx, ty] = values

    scale.value = s
    translateX.value = tx
    translateY.value = ty
  }
}

/**
 * Handle zoom in button
 */
const zoomIn = () => {
  if (!contentRef.value || !zoomPanInstance) return

  zoomPanInstance.api.zoom({
    element: contentRef.value,
    x: contentRef.value.offsetWidth / 2,
    y: contentRef.value.offsetHeight / 2,
    deltaScale: 1,
  });

  updateStats()
}

/**
 * Handle zoom out button
 */
const zoomOut = () => {
  if (!contentRef.value || !zoomPanInstance) return;

  zoomPanInstance.api.zoom({
    element: contentRef.value,
    x: contentRef.value.offsetWidth / 2,
    y: contentRef.value.offsetHeight / 2,
    deltaScale: -1
  })

  updateStats()
}

/**
 * Handle reset button
 */
const resetView = () => {
  if (!contentRef.value) return;

  contentRef.value.style.transform = ''
  contentRef.value.style.transformOrigin = ''

  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

/**
 * Initialize zoom/pan on mount
 */
onMounted(() => {
  if (!contentRef.value) return

  // Create zoom/pan instance
  zoomPanInstance = zoomPan({
    element: contentRef.value,
    minScale: props.minScale,
    maxScale: props.maxScale,
    scaleSensitivity: props.scaleSensitivity
  })

  // Listen for interactions
  contentRef.value.addEventListener('wheel', updateStats)
  document.addEventListener('mouseup', updateStats)

  // Set initial stats
  updateStats()
})

/**
 * Cleanup on unmount
 */
onBeforeUnmount(() => {
  if (!contentRef.value || !zoomPanInstance) return

  contentRef.value.removeEventListener('wheel', updateStats)
  document.removeEventListener('mouseup', updateStats)

  zoomPanInstance.destroy()
  zoomPanInstance = null
})
</script>

<template>
  <div ref="containerRef" class="zoom-pan-container">
    <div ref="contentRef" class="zoom-pan-content">
      <!-- Slot for user content -->
      <slot>
        <div class="default-content">🔍 Zoom & Pan Content</div>
      </slot>
    </div>

    <!-- Statistics -->
    <div class="stats">
      <div class="stat-line">Scale: {{ scale.toFixed(2) }}x</div>
      <div class="stat-line">X: {{ Math.round(translateX) }}px</div>
      <div class="stat-line">Y: {{ Math.round(translateY) }}px</div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <button @click="zoomIn" class="btn">+ Zoom In</button>
      <button @click="zoomOut" class="btn">- Zoom Out</button>
      <button @click="resetView" class="btn btn-primary">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.zoom-pan-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.zoom-pan-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.zoom-pan-content:active {
  cursor: grabbing;
}

.default-content {
  font-size: 2rem;
  font-weight: bold;
  color: #666;
}

.stats {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 0.75rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  min-width: 150px;
}

.stat-line {
  line-height: 1.6;
}

.controls {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background-color: #764ba2;
}

.btn-primary:hover {
  background-color: #654a93;
}

@media (max-width: 640px) {
  .controls {
    width: 100%;
    bottom: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
  }

  .btn {
    flex: 1;
  }
}
</style>

<!-- Usage in a Vue app:

<script setup>
  import ZoomPanCanvas from '@/components/ZoomPanCanvas.vue';
</script>

<template>
  <div class="app">
    <ZoomPanCanvas :min-scale="0.5" :max-scale="5">
      <img src="image.jpg" alt="Zoomable content" />
    </ZoomPanCanvas>
  </div>
</template>

<style scoped>
  .app {
    width: 800px;
    height: 600px;
  }
</style>
-->
