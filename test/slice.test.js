// oracle: JSDoc of src/slice.js, lodash docs
import { expect } from 'chai'
import slice from '../src/slice.js'
import { makeProducts } from './helpers/storeData.js'

describe('slice – specification-based unit tests', () => {
  it('SL-01 slices from start to the end (JSDoc): slice([1,2,3,4], 2) => [3,4]', () => {
    expect(slice([1, 2, 3, 4], 2)).to.deep.equal([3, 4])
  })

  it('SL-02 excludes the end index: slice([1,2,3,4], 1, 3) => [2,3]', () => {
    expect(slice([1, 2, 3, 4], 1, 3)).to.deep.equal([2, 3])
  })

  it('SL-03 limits an end above the length to the length: slice([1,2,3,4], 2, 10) => [3,4] [R-04]', () => {
    expect(slice([1, 2, 3, 4], 2, 10)).to.deep.equal([3, 4])
  })

  it('SL-04 treats a negative start as offset from the end: slice([1,2,3,4], -2) => [3,4]', () => {
    expect(slice([1, 2, 3, 4], -2)).to.deep.equal([3, 4])
  })

  it('SL-05 limits a negative start beyond the length to 0: slice([1,2,3,4], -10) => [1,2,3,4]', () => {
    expect(slice([1, 2, 3, 4], -10)).to.deep.equal([1, 2, 3, 4])
  })

  it('SL-06 treats a negative end as offset from the end: slice([1,2,3,4], 0, -1) => [1,2,3]', () => {
    expect(slice([1, 2, 3, 4], 0, -1)).to.deep.equal([1, 2, 3])
  })

  it('SL-07 returns [] for a negative end beyond the length: slice([1,2,3,4], 0, -10) => []', () => {
    expect(slice([1, 2, 3, 4], 0, -10)).to.deep.equal([])
  })

  it('SL-08 returns [] when start is greater than end: slice([1,2,3,4], 3, 1) => []', () => {
    expect(slice([1, 2, 3, 4], 3, 1)).to.deep.equal([])
  })

  it('SL-09 returns [] when start is at or above the length: slice([1,2,3,4], 4) => []', () => {
    expect(slice([1, 2, 3, 4], 4)).to.deep.equal([])
  })

  for (const [label, value] of [['[]', []], ['null', null], ['undefined', undefined]]) {
    it(`SL-10 returns [] for an empty or missing array: slice(${label}, 0, 2) => []`, () => {
      expect(slice(value, 0, 2)).to.deep.equal([])
    })
  }

  for (const [label, value] of [['null', null], ['undefined', undefined]]) {
    it(`SL-11 uses start 0 for a missing start: slice([1,2,3], ${label}) => [1,2,3]`, () => {
      expect(slice([1, 2, 3], value)).to.deep.equal([1, 2, 3])
    })
  }

  it('SL-12 returns a dense array for a sparse input: slice([1, , 3]) has index 1', () => {
    const result = slice([1, , 3])
    expect(result).to.have.lengthOf(3)
    expect(1 in result).to.equal(true)
    expect(result[1]).to.equal(undefined)
  })

  it('SL-13 returns the last S1 page: products 41–45 for slice(products, 40, 60) [R-04]', () => {
    const products = makeProducts(45)
    const page = slice(products, 40, 60)
    expect(page.map((p) => p.id)).to.deep.equal([41, 42, 43, 44, 45])
  })

  it('SL-14 returns a new array and does not change the input', () => {
    const input = [1, 2, 3]
    const result = slice(input, 0)
    expect(result).to.deep.equal([1, 2, 3])
    expect(result).to.not.equal(input)
    expect(input).to.deep.equal([1, 2, 3])
  })
})
