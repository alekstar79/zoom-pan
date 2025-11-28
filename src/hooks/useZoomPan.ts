/**
 * useZoomPan Hook (Fixed imports)
 * High-level interface for programmatic zoom and pan control
 */

import type { ITransformation, IUseZoomPanConfig, IZoomPanAPI, IZoomParams } from '@/core/types'
import { Renderer } from '@/renderer/renderer'

/**
 * Create a zoom/pan controller for an element
 * Provides methods to programmatically control zoom and pan
 */
export function useZoomPan(config: IUseZoomPanConfig): IZoomPanAPI {
  const {
    element,
    minScale = 0.1,
    maxScale = 30,
    scaleSensitivity = 50
  } = config

  // Create renderer instance with configuration
  const renderer = new Renderer({
    minScale,
    maxScale,
    scaleSensitivity
  })

  /**
   * Handle zoom operation from wheel event or manual call
   */
  const zoom = (event: WheelEvent | IZoomParams): void => {
    event instanceof WheelEvent
      ? renderer.zoom({
        element,
        deltaScale: Math.sign(event.deltaY) > 0 ? -1 : 1,
        x: event.pageX,
        y: event.pageY
      })
      : renderer.zoom({
        element,
        ...event as Omit<IZoomParams, 'element'>
      })
  }

  /**
   * Handle relative pan from mouse movement
   */
  const panBy = (event: MouseEvent | { movementX: number; movementY: number }): void => {
    if (event instanceof MouseEvent) {
      renderer.panBy({
        element,
        originX: event.movementX,
        originY: event.movementY
      })
    } else {
      renderer.panBy({
        element,
        originX: event.movementX,
        originY: event.movementY
      })
    }
  }

  /**
   * Pan to absolute position with optional scale
   */
  const panTo = (params: { x: number; y: number; scale?: number }): void => {
    if (params.scale !== undefined) {
      renderer.state.scale = Math.max(
        renderer.config.minScale,
        Math.min(renderer.config.maxScale, params.scale)
      )
    }

    renderer.state.translateX = params.x
    renderer.state.translateY = params.y

    renderer.applyTransform(element)

    // renderer.panTo({
    //   element,
    //   originX: params.x,
    //   originY: params.y,
    //   scale: params.scale
    // })
  }

  const getState = (): ITransformation => {
    return renderer.getState()
  }

  return { renderer, zoom, panBy, panTo, getState }
}
