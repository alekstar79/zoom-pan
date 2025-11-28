import { isCtrlKey } from '../src/helpers/mouse-helpers'
import { zoomPan } from '../src'

const viewerCanvas = document.getElementById("viewerCanvas")!
const viewerContent = document.getElementById("viewerContent")!

viewerContent.style.position = 'absolute'
viewerContent.style.margin = '0'
viewerContent.style.padding = '0'

const { api, destroy } = zoomPan({
  element: viewerContent,
  minScale: 0.5,
  maxScale: 5,
  scaleSensitivity: 50,
})

const canvasW = viewerCanvas.clientWidth
const canvasH = viewerCanvas.clientHeight
const contentW = viewerContent.clientWidth
const contentH = viewerContent.clientHeight
const translateX = (canvasW - contentW) / 2
const translateY = (canvasH - contentH) / 2

api.panTo({ x: translateX, y: translateY, scale: 1 })

// Update stats display
function updateStats() {
  const transform = viewerContent!.style.transform
  const match = transform.match(/matrix\((.+)\)/)

  if (match) {
    const values = match[1].split(',').map(v => parseFloat(v.trim()))
    const [scaleX, , , , tx, ty] = values

    document.getElementById('statScale')!.textContent = scaleX.toFixed(2)
    document.getElementById('statOffsetX')!.textContent = `${Math.round(tx)}`
    document.getElementById('statOffsetY')!.textContent = `${Math.round(ty)}`

    // Update zoom level slider
    const zoomPercent = Math.round(scaleX * 100);
    const zoomLevelInput = document.getElementById('zoomLevel') as HTMLInputElement
    const zoomLevel = document.getElementById('zoomLevelText') as HTMLElement

    zoomLevelInput.value = `${zoomPercent}`
    zoomLevel!.textContent = zoomPercent + '%'
  }
}

// Zoom controls
document.getElementById('zoomIn')!
  .addEventListener('click', () => {
    api.zoom({
      element: viewerContent!,
      x: viewerContent!.offsetWidth / 2,
      y: viewerContent!.offsetHeight / 2,
      deltaScale: 1
    })

    updateStats()
  })

document.getElementById('zoomOut')!
  .addEventListener('click', () => {
    api.zoom({
      element: viewerContent!,
      x: viewerContent!.offsetWidth / 2,
      y: viewerContent!.offsetHeight / 2,
      deltaScale: -1
    })

    updateStats()
  })

// Zoom slider
document.getElementById('zoomLevel')!
  .addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement
    const targetScale = parseFloat(target.value) / 100
    // This is a simplified approach; in production you'd calculate proper transforms
    const currentScale = parseFloat(viewerContent!.style.transform?.match(/\d+\.?\d*/)?.[0] || '1')
    const deltaScale = targetScale > currentScale ? 1 : -1

    api.zoom({
      element: viewerContent!,
      x: viewerContent!.offsetWidth / 2,
      y: viewerContent!.offsetHeight / 2,
      deltaScale
    })

    updateStats()
  })

// Pan controls
const panDistance = 50
document.getElementById('panUp')!.addEventListener('click', () => {
  api.panBy({ movementX: 0, movementY: -panDistance })
  updateStats()
})

document.getElementById('panDown')!.addEventListener('click', () => {
  api.panBy({ movementX: 0, movementY: panDistance })
  updateStats()
})

document.getElementById('panLeft')!.addEventListener('click', () => {
  api.panBy({ movementX: -panDistance, movementY: 0 })
  updateStats()
})

document.getElementById('panRight')!.addEventListener('click', () => {
  api.panBy({ movementX: panDistance, movementY: 0 })
  updateStats()
})

// Reset
document.getElementById('reset')!.addEventListener('click', () => {
  viewerContent!.style.transform = ''
  viewerContent!.style.transformOrigin = ''
  updateStats()
})

// Fit content
document.getElementById('fitContent')!.addEventListener('click', () => {
  const canvasW = Math.floor(viewerCanvas!.clientWidth)
  const canvasH = Math.floor(viewerCanvas!.clientHeight)
  const contentW = viewerContent!.scrollWidth
  const contentH = viewerContent!.scrollHeight

  const scale = Math.min(canvasW / contentW, canvasH / contentH)
  const translateX = (canvasW - contentW * scale) / 2  // +23
  const translateY = (canvasH - contentH * scale) / 2  // +17

  viewerContent!.style.position = 'absolute'
  viewerContent!.style.left = '0px'
  viewerContent!.style.top = '0px'
  viewerContent!.style.transformOrigin = '0 0'
  viewerContent!.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`

  api.panTo({ x: translateX, y: translateY, scale })

  updateStats()
})

viewerCanvas!.addEventListener('wheel', (event) => {
  if (!isCtrlKey(event)) return

  event.preventDefault()

  const state = api.getState()
  const zoomSpeed = 0.001
  const delta = -event.deltaY * zoomSpeed
  let newScale = Math.max(0.5, Math.min(5, state.scale + delta))

  const rect = viewerCanvas!.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  const oldMouseX = (mouseX - state.translateX) / state.scale
  const oldMouseY = (mouseY - state.translateY) / state.scale
  const newX = mouseX - oldMouseX * newScale
  const newY = mouseY - oldMouseY * newScale

  api.panTo({ x: newX, y: newY, scale: newScale })

  updateStats()
})

// Track interactions
viewerContent!.addEventListener('wheel', () => {
  setTimeout(updateStats, 10)
})

document.addEventListener('mouseup', updateStats)

// Cleanup
window.addEventListener('beforeunload', destroy)

// Initial stats
updateStats()
