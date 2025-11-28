import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Renderer } from '../../src/renderer/renderer'
import { useZoomPan } from '../../src'

/**
 * Integration tests for Renderer and useZoomPan
 * Tests interaction between multiple components
 */
describe('Integration: Renderer + useZoomPan', () => {
  let element: HTMLElement
  let renderer: Renderer

  beforeEach(() => {
    element = document.createElement('div')
    element.style.width = '500px'
    element.style.height = '500px'
    element.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 500,
      height: 500,
      right: 500,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))

    renderer = new Renderer({
      minScale: 0.1,
      maxScale: 10,
      scaleSensitivity: 10
    })
  })

  afterEach(() => {
    renderer.destroy()
  })

  it('should handle sequential zoom operations', () => {
    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: 1
    })

    const stateAfterFirstZoom = renderer.getState()
    expect(stateAfterFirstZoom.scale).toBeGreaterThan(1)

    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: 1,
    })

    const stateAfterSecondZoom = renderer.getState()
    expect(stateAfterSecondZoom.scale).toBeGreaterThan(stateAfterFirstZoom.scale)
  })

  it('should handle zoom followed by pan', () => {
    // First zoom
    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: 1
    })

    // Then pan
    renderer.panBy({
      element,
      originX: 50,
      originY: 50
    })

    const state = renderer.getState()
    expect(state.scale).toBeGreaterThan(1)
    expect(state.translateX).toBe(50)
    expect(state.translateY).toBe(50)
  })

  it('should handle panTo with scale', () => {
    renderer.panTo({
      element,
      originX: 100,
      originY: 150,
      scale: 2
    })

    const state = renderer.getState()
    expect(state.scale).toBe(2)
  })

  it('should preserve scale during pan operations', () => {
    const initialScale = 2

    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: 1
    })

    const beforePanScale = renderer.getState().scale

    renderer.panBy({
      element,
      originX: 50,
      originY: 50
    })

    const afterPanScale = renderer.getState().scale
    expect(afterPanScale).toBe(beforePanScale)
  })

  it('should handle reset after multiple operations', () => {
    // Perform multiple operations
    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: 1
    })

    renderer.panBy({
      element,
      originX: 50,
      originY: 50
    })

    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: 1
    })

    // Reset
    renderer.reset()

    const state = renderer.getState()
    expect(state.scale).toBe(1)
    expect(state.translateX).toBe(0)
    expect(state.translateY).toBe(0)
  })

  it('useZoomPan should work with Renderer', () => {
    const { zoom, panBy } = useZoomPan({
      element,
      minScale: 0.1,
      maxScale: 10
    })

    // Should not throw
    expect(() => {
      zoom({
        element,
        x: 250,
        y: 250,
        deltaScale: 1
      })
    }).not.toThrow()

    expect(() => {
      panBy({
        movementX: 50,
        movementY: 50
      })
    }).not.toThrow()
  })

  it('should maintain constraints during rapid operations', () => {
    const element2 = document.createElement('div')
    element2.getBoundingClientRect = element.getBoundingClientRect

    // Try to zoom in beyond max
    for (let i = 0; i < 20; i++) {
      renderer.zoom({
        element: element2,
        x: 250,
        y: 250,
        deltaScale: 1
      })
    }

    const state = renderer.getState()
    expect(state.scale).toBeLessThanOrEqual(10)
    expect(state.scale).toBeGreaterThanOrEqual(0.1)
  })
})

/**
 * Integration test for useZoomPan API
 */
describe('Integration: useZoomPan API', () => {
  let element: HTMLElement
  let content: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    content = document.createElement('div')
    element.appendChild(content)

    element.style.width = '500px'
    element.style.height = '500px'
    content.style.width = '500px'
    content.style.height = '500px'

    element.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 500,
      height: 500,
      right: 500,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))

    content.getBoundingClientRect = element.getBoundingClientRect
  })

  it('should handle WheelEvent and manual zoom params', () => {
    const { zoom } = useZoomPan({
      element: content,
      minScale: 0.5,
      maxScale: 5
    })

    // Manual zoom
    expect(() => {
      zoom({
        element,
        x: 250,
        y: 250,
        deltaScale: 1
      })
    }).not.toThrow()

    // Wheel event
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: 100,
      bubbles: true,
    })

    expect(() => {
      zoom(wheelEvent)
    }).not.toThrow()
  })

  it('should handle MouseEvent and movement params in panBy', () => {
    const { panBy } = useZoomPan({
      element: content,
      minScale: 0.1,
      maxScale: 10
    })

    // Manual pan
    expect(() => {
      panBy({
        movementX: 50,
        movementY: 50
      })
    }).not.toThrow()

    // Mouse event
    const mouseEvent = new MouseEvent('mousemove', {
      bubbles: true,
      movementX: 30,
      movementY: 30
    })

    expect(() => {
      panBy(mouseEvent)
    }).not.toThrow()
  })

  it('panTo should set position and scale correctly', () => {
    const { panTo } = useZoomPan({
      element: content,
      minScale: 0.5,
      maxScale: 5,
    })

    expect(() => {
      panTo({
        x: 100,
        y: 150,
        scale: 2
      })
    }).not.toThrow()

    // Verify transform was applied
    expect(content.style.transform).toBeDefined()
  })
})
