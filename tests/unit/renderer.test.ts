import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Renderer } from '../../src'

describe('Renderer', () => {
  let renderer: Renderer
  let element: HTMLElement

  beforeEach(() => {
    // Create mock element
    element = document.createElement('div')
    element.style.width = '500px';
    element.style.height = '500px';
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
      scaleSensitivity: 10,
      minScale: 0.1,
      maxScale: 10
    })
  })

  afterEach(() => {
    renderer.destroy()
  })

  it('should create renderer instance', () => {
    expect(renderer).toBeDefined()
    expect(renderer.isActive()).toBe(true)
  })

  it('should get initial state', () => {
    const state = renderer.getState()
    expect(state.scale).toBe(1)
    expect(state.translateX).toBe(0)
    expect(state.translateY).toBe(0)
  })

  it('should zoom in at cursor position', () => {
    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: 1
    })

    const state = renderer.getState()
    expect(state.scale).toBeGreaterThan(1)
  })

  it('should zoom out at cursor position', () => {
    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: -1
    })

    const state = renderer.getState();
    expect(state.scale).toBeLessThan(1);
  });

  it('should respect zoom constraints', () => {
    // Zoom in beyond max
    for (let i = 0; i < 20; i++) {
      renderer.zoom({
        element,
        x: 250,
        y: 250,
        deltaScale: 1
      })
    }

    let state = renderer.getState();
    expect(state.scale).toBeLessThanOrEqual(10);

    renderer.reset();

    // Zoom out beyond min
    for (let i = 0; i < 20; i++) {
      renderer.zoom({
        element,
        x: 250,
        y: 250,
        deltaScale: -1
      })
    }

    state = renderer.getState();
    expect(state.scale).toBeGreaterThanOrEqual(0.1)
  })

  it('should pan by offset', () => {
    renderer.panBy({
      element,
      originX: 50,
      originY: 50
    })

    const state = renderer.getState()
    expect(state.translateX).toBe(50)
    expect(state.translateY).toBe(50)
  })

  it('should pan to absolute position', () => {
    renderer.panTo({
      element,
      originX: 100,
      originY: 150,
      scale: 2
    })

    const state = renderer.getState()
    expect(state.scale).toBe(2)
  })

  it('should reset to initial state', () => {
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

    renderer.reset()

    const state = renderer.getState()
    expect(state.scale).toBe(1)
    expect(state.translateX).toBe(0)
    expect(state.translateY).toBe(0)
  })

  it('should apply transform to element', () => {
    renderer.zoom({
      element,
      x: 250,
      y: 250,
      deltaScale: 1
    })

    expect(element.style.transform).toBeTruthy()
    expect(element.style.transformOrigin).toBeTruthy()
  })

  it('should destroy renderer', () => {
    renderer.destroy()
    expect(renderer.isActive()).toBe(false)
  })
})
