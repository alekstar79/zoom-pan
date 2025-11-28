/**
 * Utility functions for the zoom-pan library
 * Includes type guards, comparisons, and helper functions
 */

/**
 * Type guard to check if a value is an object
 * @param value - Value to check
 * @returns True if value is a non-null object
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object'
}

/**
 * Generate a random string identifier
 * Used for unique key generation in collections
 * @param length - Length of the generated string (default: 7)
 * @returns Random string of specified length
 */
export function generateId(length: number = 7): string {
  return Math.random()
    .toString(36)
    .replace('.', '')
    .substring(0, length)
}

/**
 * Perform deep equality comparison between two values
 * Recursively compares objects and arrays by value
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) {
      return false
    }

    for (const key of keysA) {
      if (!deepEqual(a[key], b[key])) {
        return false
      }
    }

    return true
  }

  return false
}

/**
 * Clamp a value between min and max bounds
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t
}

/**
 * Check if a position changed between two measurements
 * @param pos - Current position
 * @param prevPos - Previous position
 * @returns True if position changed
 */
export function hasPositionChanged(pos: number, prevPos: number): boolean {
  return pos !== prevPos
}

/**
 * Validate if a scale value is within acceptable range
 * @param scale - Scale value to validate
 * @param minScale - Minimum allowed scale
 * @param maxScale - Maximum allowed scale
 * @returns True if scale is within range
 */
export function isScaleInRange(
  scale: number,
  minScale: number,
  maxScale: number
): boolean {
  return scale >= minScale && scale <= maxScale
}

/**
 * Calculate CSS matrix transform string
 * Used for applying transformations to DOM elements
 * @param scale - Zoom level
 * @param translateX - Horizontal translation
 * @param translateY - Vertical translation
 * @returns CSS matrix() function string
 */
export function getMatrixTransform(
  scale: number,
  translateX: number,
  translateY: number
): string {
  return `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`
}

/**
 * Safely execute a function with error handling
 * Prevents exceptions from breaking the update cycle
 * @param fn - Function to execute
 * @param context - Optional error context for logging
 */
export function safeExecute(
  fn: () => void,
  context?: string
): void {
  try {
    fn()
  } catch (error) {
    console.error(
      `[zoom-pan${context ? `: ${context}` : ''}] Error:`,
      error
    )
  }
}

/**
 * Request animation frame wrapper with TypeScript support
 * @param callback - Function to call on next frame
 * @returns Animation frame ID
 */
export const requestFrame = (callback: FrameRequestCallback): number => {
  return requestAnimationFrame(callback)
}

/**
 * Cancel animation frame wrapper with TypeScript support
 * @param frameId - Animation frame ID to cancel
 */
export const cancelFrame = (frameId: number): void => {
  cancelAnimationFrame(frameId)
}

/**
 * Debounce function execution
 * Delays execution until specified time has passed without calls
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Throttle function execution
 * Limits execution frequency to once per specified interval
 * @param fn - Function to throttle
 * @param interval - Minimum interval between executions in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCallTime >= interval) {
      fn(...args)
      lastCallTime = now
    }
  }
}
