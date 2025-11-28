import { describe, it, expect, beforeEach } from 'vitest'
import { zoomPan } from '../../src'

describe('zoomPan edge cases', () => {
  let element: HTMLElement
  let instance: any

  beforeEach(() => {
    element = document.createElement('div')
    element.style.width = '500px'
    element.style.height = '500px'
    element.style.position = 'relative'
    document.body.appendChild(element)

    instance = zoomPan({ element, minScale: 0.1, maxScale: 10 })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should handle minScale limit', () => {
    instance.api.zoom({ element, x: 250, y: 250, deltaScale: -1000 })
    expect(instance.api.getState().scale).toBeGreaterThanOrEqual(0.09)
  })

  it('should handle maxScale limit', () => {
    instance.api.zoom({ element, x: 250, y: 250, deltaScale: 1000 })
    expect(instance.api.getState().scale).toBeGreaterThanOrEqual(9)
  })
})
