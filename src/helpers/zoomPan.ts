/**
 * zoomPan Helper Function (Fixed imports)
 * Simple one-liner setup for automatic event binding
 */

import type { IZoomPanHelperConfig, IZoomPanInstance } from '@/core/types'
import { useZoomPan } from '@/hooks/useZoomPan'
import {
  isCtrlKey,
  isShiftKey,
  isLeftButton
} from './mouse-helpers'

/**
 * Setup zoom/pan functionality with automatic event binding
 *
 * Default keybindings:
 * - Ctrl + Scroll: Zoom in/out
 * - Shift + Left Mouse Drag: Pan
 */
export function zoomPan(config: IZoomPanHelperConfig): IZoomPanInstance {
  const {
    element,
    enableZoom = true,
    enablePan = true,
    enableMouseWheel = false,
    minScale = 0.1,
    maxScale = 30,
    scaleSensitivity = 50,
  } = config

  // Get the zoom/pan API
  const api = useZoomPan({
    element,
    minScale,
    maxScale,
    scaleSensitivity
  })

  // Track active pan state
  let isPanning = false

  /**
   * Handle mouse wheel for zoom
   * @private
   */
  const handleWheel = (event: WheelEvent): void => {
    if (!enableZoom) return

    // Allow zoom with Ctrl key
    if (!isCtrlKey(event)) {
      if (!enableMouseWheel) return
    } else {
      // Prevent page zoom when using Ctrl+Wheel
      event.preventDefault()
    }

    api.zoom(event)
  }

  /**
   * Handle mouse down to start panning
   * @private
   */
  const handleMouseDown = (event: MouseEvent): void => {
    if (!enablePan || !isLeftButton(event)) return

    isPanning = true
    element.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  /**
   * Handle mouse move for panning
   * @private
   */
  const handleMouseMove = (event: MouseEvent): void => {
    if (!isPanning || !enablePan || !isShiftKey(event)) return

    event.preventDefault()
    api.panBy(event)
  }

  /**
   * Handle mouse up to stop panning
   * @private
   */
  const handleMouseUp = (): void => {
    isPanning = false
    element.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  // Attach event listeners
  element.addEventListener('wheel', handleWheel, { passive: false })
  element.addEventListener('mousedown', handleMouseDown)

  /**
   * Cleanup function to remove all event listeners
   */
  const destroy = (): void => {
    element.removeEventListener('wheel', handleWheel)
    element.removeEventListener('mousedown', handleMouseDown)
    element.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  return { api, destroy }
}

/**
 * Enhanced zoom/pan setup with pointer support
 * Handles touch and mouse events uniformly
 */
export function zoomPanWithPointer(config: IZoomPanHelperConfig): IZoomPanInstance {
  const { element, ...restConfig } = config
  const api = useZoomPan({ element, ...restConfig })

  let isPointerDown = false
  let lastPointerPosition = { x: 0, y: 0 }

  /**
   * Handle pointer down
   * @private
   */
  const handlePointerDown = (event: PointerEvent): void => {
    if (!isLeftButton(event)) return

    isPointerDown = true
    lastPointerPosition = { x: event.pageX, y: event.pageY }
    element.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }

  /**
   * Handle pointer move
   * @private
   */
  const handlePointerMove = (event: PointerEvent): void => {
    if (!isPointerDown || !isShiftKey(event as any)) return

    const currentPosition = { x: event.pageX, y: event.pageY }
    const movementX = currentPosition.x - lastPointerPosition.x
    const movementY = currentPosition.y - lastPointerPosition.y

    api.panBy({ movementX, movementY })

    lastPointerPosition = currentPosition
  }

  /**
   * Handle pointer up
   * @private
   */
  const handlePointerUp = (): void => {
    isPointerDown = false
    element.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  }

  /**
   * Handle wheel
   * @private
   */
  const handleWheel = (event: WheelEvent): void => {
    if (!isCtrlKey(event)) return

    event.preventDefault()
    api.zoom(event)
  }

  element.addEventListener('pointerdown', handlePointerDown)
  element.addEventListener('wheel', handleWheel, { passive: false })

  /**
   * Cleanup
   */
  const destroy = (): void => {
    element.removeEventListener('wheel', handleWheel)
    element.removeEventListener('pointerdown', handlePointerDown)
    element.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  }

  return { api, destroy }
}
