/**
 * Core type definitions for the zoom-pan library
 * Includes interfaces for state, transformations, and configuration
 */

/**
 * Represents a 2D transformation state
 * Tracks position and scale of the transformed element
 */
export interface ITransformation {
  /** X coordinate of the transformation origin */
  originX: number;
  /** Y coordinate of the transformation origin */
  originY: number;
  /** Horizontal translation in pixels */
  translateX: number;
  /** Vertical translation in pixels */
  translateY: number;
  /** Current zoom level (scale factor) */
  scale: number;
}

/**
 * Configuration options for the Renderer class
 * Defines constraints and sensitivity for zoom/pan operations
 */
export interface IRendererConfig {
  /** Minimum allowed zoom level */
  minScale: number;
  /** Maximum allowed zoom level */
  maxScale: number;
  /** Sensitivity multiplier for zoom wheel events (higher = less sensitive) */
  scaleSensitivity?: number;
}

/**
 * Zoom parameters for applying zoom transformation
 */
export interface IZoomParams {
  /** DOM element to zoom */
  element: HTMLElement;
  /** X coordinate in page coordinates */
  x: number;
  /** Y coordinate in page coordinates */
  y: number;
  /** Scale delta (-1 to 1, where 1 = zoom in, -1 = zoom out) */
  deltaScale: number;
}

/**
 * Pan by parameters for relative panning
 */
export interface IPanByParams {
  /** DOM element to pan */
  element: HTMLElement;
  /** Horizontal movement in pixels */
  originX: number;
  /** Vertical movement in pixels */
  originY: number;
}

/**
 * Pan to parameters for absolute positioning
 */
export interface IPanToParams {
  /** DOM element to pan */
  element: HTMLElement;
  /** Target X coordinate */
  originX: number;
  /** Target Y coordinate */
  originY: number;
  /** Optional target scale */
  scale?: number;
}

/**
 * Public API of the Renderer class
 * Core functionality for applying transformations
 */
export interface IRenderer {
  state: ITransformation;
  config: IRendererConfig;
  isActiveFlag: boolean;

  applyTransform(element: HTMLElement): void;

  /**
   * Zoom in or out at a specific point
   */
  zoom(params: IZoomParams): void;

  /**
   * Pan by relative offset
   */
  panBy(params: IPanByParams): void;

  /**
   * Pan to absolute coordinates with optional scale
   */
  panTo(params: IPanToParams): void;

  /**
   * Reset transformation to initial state
   */
  reset(): void;

  /**
   * Get current transformation state
   */
  getState(): ITransformation;

  /**
   * Check if renderer is active and processing
   */
  isActive(): boolean;

  /**
   * Destroy renderer and clean up resources
   */
  destroy(): void;
}

/**
 * Configuration for the useZoomPan hook
 */
export interface IUseZoomPanConfig extends IRendererConfig {
  /** DOM element to apply transformations to */
  element: HTMLElement;
}

export interface IZoomState {
  element: HTMLElement;
  translateX: number;
  translateY: number;
  scale: number;
}

/**
 * Public API returned by useZoomPan hook
 * Provides methods to control zoom and pan programmatically
 */
export interface IZoomPanAPI {
  renderer: IRenderer;

  /**
   * Zoom in or out at a specific point
   * @param event - Wheel event or object with coordinates and scale delta
   */
  zoom: (event: WheelEvent | IZoomParams) => void;
  /**
   * Pan by relative offset
   * @param event - Mouse move event or object with movement deltas
   */
  panBy: (event: MouseEvent | { movementX: number; movementY: number }) => void;
  /**
   * Pan to absolute coordinates with optional scale
   * @param params - Target position and optional scale
   */
  panTo: (params: { x: number; y: number; scale?: number }) => void;
  /**
   * Get state of zoom
   */
  getState: () => ITransformation;
}

/**
 * Configuration for the helper function
 * Extended options for automatic event binding
 */
export interface IZoomPanHelperConfig extends IUseZoomPanConfig {
  /** Enable Ctrl+Wheel for zoom (default: true) */
  enableZoom?: boolean;
  /** Enable Shift+MouseDown for pan (default: true) */
  enablePan?: boolean;
  /** Enable mouse wheel without Ctrl for scroll (default: false) */
  enableMouseWheel?: boolean;
}

/**
 * Return type of zoomPan() helper function
 * Provides cleanup capability
 */
export interface IZoomPanInstance {
  /** API for programmatic control */
  api: IZoomPanAPI;
  /** Function to detach all event listeners and clean up */
  destroy(): void;
}
