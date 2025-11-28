/**
 * Mouse Helper Functions
 * Provides utilities for mouse button detection and event handling
 * Cross-browser compatible button detection
 */

export interface MouseState {
  button: number
  buttons: number
  leftPressed: boolean
  rightPressed: boolean
  middlePressed: boolean
}

export type TButtons = 'Left' | 'Middle' | 'Right' | 'Back' | 'Forward'

export interface IButtons extends Record<number, TButtons> {
  [MouseButton.Left]: 'Left';
  [MouseButton.Middle]: 'Middle';
  [MouseButton.Right]: 'Right';
  [MouseButton.Back]: 'Back';
  [MouseButton.Forward]: 'Forward';
}

/**
 * Checking specific buttons
 */
export const MouseButton = {
  Left: 0,
  Middle: 1,
  Right: 2,
  Back: 3,
  Forward: 4
} as const

export const buttons: IButtons = {
  [MouseButton.Left]: 'Left',
  [MouseButton.Middle]: 'Middle',
  [MouseButton.Right]: 'Right',
  [MouseButton.Back]: 'Back',
  [MouseButton.Forward]: 'Forward',
} as const

/**
 * Defining mouse buttons
 */
export function whichMouseButton(event: MouseEvent): number {
  return event.button
}

export function isLeftButton(event: MouseEvent): boolean {
  return event.button === MouseButton.Left
}

export function isMiddleButton(event: MouseEvent): boolean {
  return event.button === MouseButton.Middle
}

export function isRightButton(event: MouseEvent): boolean {
  return event.button === MouseButton.Right
}

export function isBackButton(event: MouseEvent): boolean {
  return event.button === MouseButton.Back
}

export function isForwardButton(event: MouseEvent): boolean {
  return event.button === MouseButton.Forward
}

/**
 * Detect which mouse button was pressed
 * Handles modern event attributes
 * event.buttons - битовая маска для состояний всех кнопок (mousemove/mousedown)
 * 1=left, 2=right, 4=middle, 8=back, 16=forward
 *
 * @param {MouseEvent} event - Mouse event object
 * @param {number} button - Mouse button to detect (0=left, 1=middle, 2=right, 3=back, 4=forward)
 * @returns {boolean} - true if specified button was pressed
 *
 * @see [MouseEventButtons](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
 *
 * @example
 * // Check if left mouse button was pressed
 * if (isButtonPressed(event, 0)) {
 *   // Handle left click
 * }
 */
export function isButtonPressed(event: MouseEvent, button: number): boolean {
  return Boolean(event.buttons & (1 << button))
}

/**
 * Button states (mousemove)
 */
export function isLeftPressed(event: MouseEvent): boolean {
  return isButtonPressed(event, 0)
}

export function isRightPressed(event: MouseEvent): boolean {
  return isButtonPressed(event, 2)
}

export function isMiddlePressed(event: MouseEvent): boolean {
  return isButtonPressed(event, 1)
}

export function getMouseState(event: MouseEvent): MouseState {
  return {
    button: event.button,
    buttons: event.buttons,
    leftPressed: isLeftPressed(event),
    rightPressed: isRightPressed(event),
    middlePressed: isMiddlePressed(event)
  }
}

/**
 * Get mouse button name from which code
 * Useful for debugging and logging
 *
 * @param {number} which - Mouse button code (0=left, 1=middle, 2=right)
 * @returns {'Left' | 'Middle' | 'Right' | 'Back' | 'Forward' | 'Unknown'} - Human-readable button name
 */
export function getButtonName(which: keyof IButtons): TButtons | 'Unknown' {
  return Reflect.get<IButtons, keyof IButtons>(buttons, which) ?? 'Unknown'
}

/**
 * Check if pointer is primary (main) button
 * Important for multi-touch scenarios
 *
 * @param event - Pointer or mouse event
 * @returns True if event is from primary pointer
 */
export function isPrimaryButton(event: MouseEvent | PointerEvent): boolean {
  if ('isPrimary' in event) {
    return (event as PointerEvent).isPrimary
  }

  return isButtonPressed(event, MouseButton.Left)
}

/**
 * Get mouse position relative to viewport
 * Takes into account scrolling
 *
 * @param event - Mouse event
 * @returns Object with x and y coordinates
 */
export function getMousePosition(event: MouseEvent): { x: number; y: number } {
  return {
    x: event.clientX,
    y: event.clientY,
  }
}

/**
 * Get mouse position relative to page
 * Takes into account scrolling offset
 *
 * @param event - Mouse event
 * @returns Object with x and y coordinates
 */
export function getMousePagePosition(event: MouseEvent): { x: number; y: number } {
  return {
    x: event.pageX,
    y: event.pageY,
  }
}

/**
 * Get mouse movement delta
 * Useful for pan operations
 *
 * @param event - Mouse move event
 * @returns Object with movementX and movementY deltas
 */
export function getMouseMovement(event: MouseEvent): {
  movementX: number;
  movementY: number;
} {
  return {
    movementX: event.movementX,
    movementY: event.movementY,
  }
}

/**
 * Get scroll wheel delta
 * Normalizes between browsers
 *
 * @param event - Wheel event
 * @returns Normalized delta value (positive=down, negative=up)
 */
export function getWheelDelta(event: WheelEvent): number {
  return event.deltaY
}

/**
 * Check if Ctrl key is pressed
 * Used for zoom modifier
 *
 * @param event - Keyboard or mouse event
 * @returns True if Ctrl key is pressed
 */
export function isCtrlKey(event: KeyboardEvent | MouseEvent | WheelEvent): boolean {
  return event.ctrlKey
}

/**
 * Check if Shift key is pressed
 * Used for pan modifier
 *
 * @param event - Keyboard or mouse event
 * @returns True if Shift key is pressed
 */
export function isShiftKey(event: KeyboardEvent | MouseEvent): boolean {
  return event.shiftKey
}

/**
 * Check if Alt key is pressed
 * Can be used for alternative behaviors
 *
 * @param event - Keyboard or mouse event
 * @returns True if Alt key is pressed
 */
export function isAltKey(event: KeyboardEvent | MouseEvent | WheelEvent): boolean {
  return event.altKey
}

/**
 * Check if Meta key is pressed (Cmd on Mac, Win on Windows)
 *
 * @param event - Keyboard or mouse event
 * @returns True if Meta key is pressed
 */
export function isMetaKey(event: KeyboardEvent | MouseEvent | WheelEvent): boolean {
  return event.metaKey
}

export function isMiddleClick(event: MouseEvent): boolean {
  return isMiddleButton(event)
}

export function getEventPoint(
  event: MouseEvent | TouchEvent
): { x: number; y: number } {
  if ('touches' in event && event.touches.length > 0) {
    const touch = event.touches[0]
    return { x: touch.clientX, y: touch.clientY }
  }

  return {
    x: (event as MouseEvent).clientX,
    y: (event as MouseEvent).clientY
  }
}

export function getMovementDelta(event: MouseEvent): {
  movementX: number;
  movementY: number;
} {
  return {
    movementX: event.movementX || 0,
    movementY: event.movementY || 0,
  }
}
