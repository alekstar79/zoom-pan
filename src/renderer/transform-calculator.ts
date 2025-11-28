/**
 * Transform Calculator
 * Calculates and manages zoom/pan transformations
 * Handles mathematical operations for scale and position changes
 */

import { clamp, isScaleInRange, hasPositionChanged } from '@/core/utils'

/**
 * Calculate new scale value considering constraints and sensitivity
 * Clamps result between min and max scale values
 *
 * @param scale - Current zoom level
 * @param deltaScale - Change in scale (-1 for zoom out, 1 for zoom in)
 * @param minScale - Minimum allowed scale
 * @param maxScale - Maximum allowed scale
 * @param scaleSensitivity - Sensitivity multiplier (higher = less sensitive)
 * @returns Tuple of [oldScale, newScale]
 */
export function calculateScale(
  scale: number,
  deltaScale: number,
  minScale: number,
  maxScale: number,
  scaleSensitivity: number
): [number, number] {
  const oldScale = scale
  // Apply sensitivity to delta and calculate new scale
  let newScale = scale + deltaScale / (scaleSensitivity / scale)
  // Clamp to allowed range
  newScale = clamp(newScale, minScale, maxScale)

  return [oldScale, newScale]
}

/**
 * Calculate translation adjustment for pan operation
 * Ensures smooth panning within scale constraints
 *
 * @param pos - Current position
 * @param prevPos - Previous position
 * @param translate - Current translation value
 * @param scale - Current scale
 * @param minScale - Minimum scale
 * @param maxScale - Maximum scale
 * @returns Adjusted translation value
 */
export function calculateTranslate(
  pos: number,
  prevPos: number,
  translate: number,
  scale: number,
  minScale: number,
  maxScale: number
): number {
  // Check if position changed and scale is in valid range
  const isValid =
    isScaleInRange(scale, minScale, maxScale) &&
    hasPositionChanged(pos, prevPos)

  if (!isValid) {
    return translate
  }

  // Apply translation adjustment based on scale
  return translate + (pos - prevPos * scale) * (1 - 1 / scale)
}

/**
 * Generate CSS matrix transform string
 * Format: matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)
 * For simple 2D zoom/pan: matrix(scale, 0, 0, scale, tx, ty)
 *
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
 * Calculate transform origin for zoom operation
 * Ensures zoom happens from the cursor position
 *
 * @param pos - Cursor position
 * @param scale - Current scale
 * @returns Origin coordinate relative to element
 */
export function calculateTransformOrigin(pos: number, scale: number): number {
  return pos / scale
}

/**
 * Validate transformation parameters
 * Checks if all transformation values are valid numbers
 *
 * @param scale - Scale value
 * @param translateX - X translation
 * @param translateY - Y translation
 * @returns True if all parameters are valid
 */
export function isValidTransformation(
  scale: number,
  translateX: number,
  translateY: number
): boolean {
  return (
    Number.isFinite(scale) &&
    Number.isFinite(translateX) &&
    Number.isFinite(translateY)
  )
}
