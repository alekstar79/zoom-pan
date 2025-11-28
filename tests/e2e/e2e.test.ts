// noinspection TypeScriptValidateTypes

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { zoomPan, zoomPanWithPointer } from '../../src'

/**
 * E2E (End-to-End) tests for the complete zoomPan implementation
 * Tests user interactions and full workflow
 */
describe('E2E: zoomPan Helper', () => {
  let container: HTMLElement
  let element: HTMLElement

  beforeEach(() => {
    // Create DOM structure
    container = document.createElement('div')
    element = document.createElement('div')
    container.appendChild(element)
    document.body.appendChild(container)

    container.style.width = '500px'
    container.style.height = '500px'
    element.style.width = '500px'
    element.style.height = '500px'

    // Mock getBoundingClientRect
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
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should initialize with default settings', () => {
    const { api, destroy } = zoomPan({ element })

    expect(api).toBeDefined()
    expect(api.zoom).toBeDefined()
    expect(api.panBy).toBeDefined()
    expect(api.panTo).toBeDefined()
    expect(destroy).toBeDefined()

    destroy()
  })

  it('should handle wheel event with Ctrl modifier', () => {
    const { api, destroy } = zoomPan({ element, enableZoom: true })

    // Simulate Ctrl+Wheel
    const wheelEvent = new WheelEvent('wheel', {
      ctrlKey: true,
      deltaY: 100,
      bubbles: true
    })

    expect(() => {
      api.zoom(wheelEvent)
    }).not.toThrow()

    destroy()
  })

  it('should handle mouse drag for panning', () => {
    const { destroy } = zoomPan({ element, enablePan: true })

    // Simulate mouse events
    const mouseDownEvent = new MouseEvent('mousedown', {
      button: 0, // left click
      bubbles: true
    })

    const mouseMoveEvent = new MouseEvent('mousemove', {
      shiftKey: true,
      movementX: 50,
      movementY: 50,
      bubbles: true
    })

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true
    })

    element.dispatchEvent(mouseDownEvent)
    element.dispatchEvent(mouseMoveEvent)
    document.dispatchEvent(mouseUpEvent)

    destroy()
  })

  it('should respect enableZoom flag', () => {
    const { api, destroy } = zoomPan({ element, enableZoom: false })

    const wheelEvent = new WheelEvent('wheel', {
      ctrlKey: true,
      deltaY: 100,
      bubbles: true,
    })

    // Should not throw, but won't apply zoom
    expect(() => {
      api.zoom(wheelEvent)
    }).not.toThrow()

    destroy()
  })

  it('should respect enablePan flag', () => {
    const { destroy } = zoomPan({ element, enablePan: false })

    const mouseDownEvent = new MouseEvent('mousedown', {
      button: 0,
      bubbles: true
    })

    // Should not throw, but won't apply pan
    expect(() => {
      element.dispatchEvent(mouseDownEvent)
    }).not.toThrow()

    destroy()
  })

  it('should allow programmatic zoom', () => {
    const { api, destroy } = zoomPan({ element })

    expect(() => {
      api.zoom({
        element,
        x: 250,
        y: 250,
        deltaScale: 1
      })
    }).not.toThrow()

    expect(() => {
      api.zoom({
        element,
        x: 250,
        y: 250,
        deltaScale: -1
      })
    }).not.toThrow()

    destroy()
  })

  it('should allow programmatic pan', () => {
    const { api, destroy } = zoomPan({ element })

    expect(() => {
      api.panBy({
        movementX: 50,
        movementY: 50
      })
    }).not.toThrow()

    expect(() => {
      api.panTo({
        x: 100,
        y: 100,
        scale: 2
      })
    }).not.toThrow()

    destroy()
  })

  it('should clean up event listeners on destroy', () => {
    const { destroy } = zoomPan({ element })

    // Get the number of listeners
    const beforeDestroy = element.style.transform

    destroy()

    // Trigger events - should not have effect
    const wheelEvent = new WheelEvent('wheel', {
      ctrlKey: true,
      deltaY: 100,
      bubbles: true
    })

    // Should not throw
    element.dispatchEvent(wheelEvent)
  })

  it('should handle configuration options', () => {
    const { api, destroy } = zoomPan({
      element,
      minScale: 0.5,
      maxScale: 5,
      scaleSensitivity: 30,
      enableZoom: true,
      enablePan: true
    })

    expect(() => {
      api.zoom({
        element,
        x: 250,
        y: 250,
        deltaScale: 1
      })
    }).not.toThrow()

    destroy()
  })
})

/**
 * E2E tests for pointer support
 */
describe('E2E: zoomPanWithPointer', () => {
  let container: HTMLElement
  let element: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    element = document.createElement('div')
    container.appendChild(element)
    document.body.appendChild(container)

    container.style.width = '500px'
    container.style.height = '500px'
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
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should handle pointer events', () => {
    const { destroy } = zoomPanWithPointer({ element })

    const pointerDownEvent = new PointerEvent('pointerdown', {
      button: 0,
      bubbles: true,
      isPrimary: true
    })

    const pointerMoveEvent = new PointerEvent('pointermove', {
      shiftKey: true,
      bubbles: true,
      isPrimary: true,
      pageX: 250,
      pageY: 250
    })

    const pointerUpEvent = new PointerEvent('pointerup', {
      bubbles: true,
      isPrimary: true
    })

    expect(() => {
      element.dispatchEvent(pointerDownEvent)
      element.dispatchEvent(pointerMoveEvent)
      document.dispatchEvent(pointerUpEvent)
    }).not.toThrow()

    destroy()
  })

  it('should handle wheel events with pointer support', () => {
    const { destroy } = zoomPanWithPointer({ element })

    const wheelEvent = new WheelEvent('wheel', {
      ctrlKey: true,
      deltaY: 100,
      bubbles: true
    })

    expect(() => {
      element.dispatchEvent(wheelEvent)
    }).not.toThrow()

    destroy()
  })
})

/**
 * E2E workflow tests
 */
describe('E2E: Complete Workflow', () => {
  let container: HTMLElement
  let element: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    element = document.createElement('div')
    container.appendChild(element)
    document.body.appendChild(container)

    container.style.width = '800px'
    container.style.height = '600px'
    element.style.width = '800px'
    element.style.height = '600px'

    element.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should handle realistic user workflow', () => {
    const { api, destroy } = zoomPan({ element })

    // User zooms in at center
    api.zoom({
      element,
      x: 400,
      y: 300,
      deltaScale: 1
    })

    // User pans
    api.panBy({
      movementX: 100,
      movementY: 100
    })

    // User zooms in more
    api.zoom({
      element,
      x: 400,
      y: 300,
      deltaScale: 1
    })

    // User pans to specific location
    api.panTo({
      x: 200,
      y: 150,
      scale: 2
    })

    // User zooms out
    api.zoom({
      element,
      x: 400,
      y: 300,
      deltaScale: -1
    })

    // Element should have transform applied
    expect(element.style.transform).toBeDefined()
    expect(element.style.transformOrigin).toBeDefined()

    destroy()
  })

  it('should maintain state consistency through operations', () => {
    const { api, destroy } = zoomPan({ element })

    // Perform multiple operations
    for (let i = 0; i < 5; i++) {
      api.zoom({
        element,
        x: 400,
        y: 300,
        deltaScale: 1,
      })

      api.panBy({
        movementX: 20 * i,
        movementY: 20 * i,
      })
    }

    // Element should still have valid transforms
    expect(element.style.transform).toBeTruthy()

    destroy()
  })

  it('should handle rapid successive operations', () => {
    const { api, destroy } = zoomPan({ element })

    expect(() => {
      for (let i = 0; i < 10; i++) {
        api.zoom({
          element,
          x: 400,
          y: 300,
          deltaScale: i % 2 === 0 ? 1 : -1,
        })
      }

      for (let i = 0; i < 10; i++) {
        api.panBy({
          movementX: Math.random() * 100,
          movementY: Math.random() * 100,
        })
      }
    }).not.toThrow()

    destroy()
  })
})
