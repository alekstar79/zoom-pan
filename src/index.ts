/**
 * Main library entry point
 * Public API only
 * Tree-shakable
 */

export type { IZoomPanInstance, IZoomPanAPI, IRenderer } from './core/types'
export { zoomPan, zoomPanWithPointer } from './helpers/zoomPan'
export { useZoomPan } from './hooks/useZoomPan'
import { Renderer } from './renderer/renderer'

export { Renderer, Renderer as default }
