// oracle: JSDoc of src/clamp.js, lodash docs for NaN input
import { expect } from 'chai'
import clamp from '../src/clamp.js'

describe('clamp – specification-based unit tests', () => {
  it('CL-01 raises a number below the range to lower (JSDoc): clamp(-10, -5, 5) => -5', () => {
    expect(clamp(-10, -5, 5)).to.equal(-5)
  })

  it('CL-02 lowers a number above the range to upper (JSDoc): clamp(10, -5, 5) => 5 [R-02]', () => {
    expect(clamp(10, -5, 5)).to.equal(5)
  })

  it('CL-03 returns a number inside the range unchanged: clamp(3, -5, 5) => 3 [R-02]', () => {
    expect(clamp(3, -5, 5)).to.equal(3)
  })

  it('CL-04 returns a price with decimals inside the range unchanged: clamp(4.5, 0, 100) => 4.5 [R-02]', () => {
    expect(clamp(4.5, 0, 100)).to.equal(4.5)
  })

  it('CL-05 keeps a number equal to lower (inclusive bound): clamp(-5, -5, 5) => -5', () => {
    expect(clamp(-5, -5, 5)).to.equal(-5)
  })

  it('CL-06 keeps a number equal to upper (inclusive bound): clamp(5, -5, 5) => 5 [R-02]', () => {
    expect(clamp(5, -5, 5)).to.equal(5)
  })

  const pageCases = [
    [99, 3, 'page out of range (?page=99) shows the last page'],
    [0, 1, 'page 0 shows the first page'],
    [2, 2, 'valid page is kept']
  ]
  for (const [page, expected, purpose] of pageCases) {
    it(`CL-07 limits the S1 page number to 1..3, ${purpose}: clamp(${page}, 1, 3) => ${expected}${expected === 1 ? '' : ' [R-02]'}`, () => {
      expect(clamp(page, 1, 3)).to.equal(expected)
    })
  }

  it('CL-08 limits the S2 quantity to the stock: clamp(12, 1, 10) => 10 [R-02]', () => {
    expect(clamp(12, 1, 10)).to.equal(10)
  })

  it('CL-09 converts a numeric string: clamp("2", 1, 10) => 2 [R-02]', () => {
    expect(clamp('2', 1, 10)).to.equal(2)
  })

  it('CL-10 returns NaN for a NaN number: clamp(NaN, 1, 3) => NaN', () => {
    expect(clamp(NaN, 1, 3)).to.be.NaN
  })

  it('CL-11 treats a NaN lower bound as 0: clamp(-3, NaN, 5) => 0', () => {
    expect(clamp(-3, NaN, 5)).to.equal(0)
  })

  it('CL-12 treats a NaN upper bound as 0: clamp(3, -5, NaN) => 0 [R-02]', () => {
    expect(clamp(3, -5, NaN)).to.equal(0)
  })

  // added after the c8 branch report (plan, principle 1)
  for (const quantity of [0, 3]) {
    it(`CL-13 returns the bound when lower equals upper (S2, only one item in stock): clamp(${quantity}, 1, 1) => 1`, () => {
      expect(clamp(quantity, 1, 1)).to.equal(1)
    })
  }
})
