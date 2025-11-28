import { calculateScale, isValidTransformation, getMatrixTransform } from '../../src/renderer/transform-calculator'

describe('transform-calculator', () => {
  it('isValidTransformation checks finite values', () => {
    expect(isValidTransformation(1, 0, 0)).toBe(true)
    expect(isValidTransformation(NaN, 0, 0)).toBe(false)
  })

  it('getMatrixTransform creates matrix', () => {
    expect(getMatrixTransform(2, 10, 20)).toBe('matrix(2, 0, 0, 2, 10, 20)')
  })

  it('calculateScale applies limits', () => {
    const [old, newScale] = calculateScale(1, -1000, 0.1, 10, 10)
    expect(old).toBe(1)
    expect(newScale).toBeCloseTo(0.1)
  })
})
