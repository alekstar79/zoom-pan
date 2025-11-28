import { clamp, lerp, throttle, debounce } from '../../src/core/utils'

describe('core/utils', () => {
  it('clamp should limit values', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('lerp should interpolate', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
    expect(lerp(0, 100, 0)).toBe(0)
  })

  it('throttle should limit calls', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    throttled()
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('throttle with immediate false', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 50)
    throttled() // 1
    vi.advanceTimersByTime(49)
    throttled()
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('debounce delays execution', async () => {
    vi.useFakeTimers()

    const fn = vi.fn()
    const debounced = debounce(fn, 50)

    debounced();
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(49)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('debounce executes once after delay', async () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 50)

    debounced() // 1
    debounced() // 2
    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(1), { timeout: 100 })
  })

  it('debounce cancels previous calls', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 50)

    debounced()
    vi.advanceTimersByTime(25)
    expect(fn).not.toHaveBeenCalled()

    debounced()
    vi.advanceTimersByTime(25)

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(25)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})
