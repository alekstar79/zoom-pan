/**
 * Renderer Class (Simplified)
 * Core engine for applying zoom and pan transformations to DOM elements
 * Manages transformation state and delegates mathematical calculations
 */

import * as calc from '@/renderer/transform-calculator'
import type {
  IPanByParams,
  IPanToParams,
  IRenderer,
  IRendererConfig,
  ITransformation,
  IZoomParams
} from '@/core/types'

/**
 * Renderer class for applying 2D transformations to DOM elements
 * Handles zoom and pan operations with state management
 */
export class Renderer implements IRenderer {
  // Transformation state
  public state: ITransformation

  // Configuration parameters
  public config: IRendererConfig

  // Flag to track if renderer is active
  public isActiveFlag = true

  /**
   * Initialize Renderer with configuration
   */
  constructor(config: IRendererConfig) {
    this.config = { scaleSensitivity: 10, ...config }
    this.state = this.getInitialState()
  }

  /**
   * Create initial transformation state
   * @private
   */
  private getInitialState(): ITransformation {
    return {
      originX: 0,
      originY: 0,
      translateX: 0,
      translateY: 0,
      scale: 1
    }
  }

  /**
   * Apply transformation to DOM element
   * Updates the element's transform and transformOrigin styles
   * @private
   */
  public applyTransform(element: HTMLElement): void {
    if (!calc.isValidTransformation(this.state.scale, this.state.translateX, this.state.translateY)) {
      console.warn('[Renderer] Invalid transformation values')
      return
    }

    element.style.transformOrigin = `${this.state.originX}px ${this.state.originY}px`
    element.style.transform = calc.getMatrixTransform(
      this.state.scale,
      this.state.translateX,
      this.state.translateY
    )
  }

  /**
   * Zoom in or out at a specific point
   * Calculates new scale and adjusts translation to maintain zoom point
   */
  public zoom(params: IZoomParams): void {
    if (!this.isActiveFlag) return

    const { element, deltaScale } = params
    const newScale = this.state.scale + (deltaScale / this.config.scaleSensitivity!)

    this.state.scale = Math.max(
      this.config.minScale,
      Math.min(this.config.maxScale, newScale)
    )

    this.applyTransform(element)
  }

  /**
   * Pan by relative offset
   */
  public panBy(params: IPanByParams): void {
    if (!this.isActiveFlag) return

    const { element, originX, originY } = params

    this.state.translateX += originX
    this.state.translateY += originY

    this.applyTransform(element)
  }

  /**
   * Pan to absolute coordinates with optional scale
   */
  public panTo(params: IPanToParams): void {
    if (!this.isActiveFlag) return

    const { element, originX, originY, scale } = params

    if (scale !== undefined) {
      this.state.scale = Math.max(
        this.config.minScale,
        Math.min(this.config.maxScale, scale)
      )
    }

    this.state.translateX = originX
    this.state.translateY = originY

    this.applyTransform(element)
  }

  /**
   * Reset transformation to initial state
   */
  public reset(): void {
    if (!this.isActiveFlag) return

    this.state = this.getInitialState()
  }

  /**
   * Get current transformation state
   */
  public getState(): ITransformation {
    return { ...this.state }
  }

  /**
   * Check if renderer is active
   */
  public isActive(): boolean {
    return this.isActiveFlag
  }

  /**
   * Destroy renderer and clean up resources
   */
  public destroy(): void {
    this.isActiveFlag = false
  }
}
