import { getEventPoint, isMiddleClick, getMovementDelta } from '../../src/helpers/mouse-helpers'

describe('mouse-helpers', () => {
  it('getEventPoint should extract coordinates', () => {
    const event = new MouseEvent('click', { clientX: 100, clientY: 200 })
    expect(getEventPoint(event)).toEqual({ x: 100, y: 200 })
  })

  it('isMiddleClick should detect middle button', () => {
    const event = new MouseEvent('click', { button: 1 })
    expect(isMiddleClick(event)).toBe(true)
  })

  it('getMovementDelta returns movement', () => {
    const event = new MouseEvent('mousemove', { movementX: 5, movementY: 10 })
    expect(getMovementDelta(event)).toEqual({ movementX: 5, movementY: 10 })
  })

  it('getEventPoint from TouchEvent', () => {
    const touchEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 200 }] as unknown as TouchList
    })

    expect(getEventPoint(touchEvent)).toEqual({ x: 100, y: 200 })
  })

  it('getEventPoint handles TouchEvent', () => {
    const touch = { clientX: 100, clientY: 200 } as Touch
    const touchEvent = { touches: [touch] } as unknown as TouchEvent
    expect(getEventPoint(touchEvent)).toEqual({ x: 100, y: 200 })
  })
})
