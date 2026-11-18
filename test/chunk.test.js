// oracle: JSDoc of src/chunk.js, native Array#slice for the S1 pages
// CH-12, CH-13: slice replaced by a test double
import { expect } from 'chai'
import * as td from 'testdouble'
import chunk from '../src/chunk.js'
import { makeProducts, referencePages } from './helpers/storeData.js'

describe('chunk – Phase 1 plan: CH-01…CH-11 with real slice (human-designed, test plan Appendix C)', () => {
  it('CH-01 splits evenly (JSDoc: ["a","b","c","d"], 2) [R-05]', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 2)).to.deep.equal([['a', 'b'], ['c', 'd']])
  })

  it('CH-02 makes the last chunk shorter (JSDoc: ["a","b","c","d"], 3) [R-04, R-05]', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 3)).to.deep.equal([['a', 'b', 'c'], ['d']])
  })

  it('CH-03 returns one chunk when size equals the length ([1,2,3], 3)', () => {
    expect(chunk([1, 2, 3], 3)).to.deep.equal([[1, 2, 3]])
  })

  it('CH-04 returns one page when size is above the length: [1,2,3], 4 => [[1,2,3]] [R-04]', () => {
    expect(chunk([1, 2, 3], 4)).to.deep.equal([[1, 2, 3]])
  })
  it('CH-04 returns one page when size is above the length: [1,2,3], 10 => [[1,2,3]] [R-04]', () => {
    expect(chunk([1, 2, 3], 10)).to.deep.equal([[1, 2, 3]])
  })

  it('CH-05 uses the default size 1 when size is omitted ([1,2,3]) [R-05]', () => {
    expect(chunk([1, 2, 3])).to.deep.equal([[1], [2], [3]])
  })

  for (const size of [0, -1, NaN]) {
    it(`CH-06 returns [] for an invalid size: [1,2,3], ${size} => []`, () => {
      expect(chunk([1, 2, 3], size)).to.deep.equal([])
    })
  }

  it('CH-07 truncates a fractional size ([1,2,3,4,5], 2.7) [R-04, R-05]', () => {
    expect(chunk([1, 2, 3, 4, 5], 2.7)).to.deep.equal([[1, 2], [3, 4], [5]])
  })

  for (const [label, value] of [['[]', []], ['null', null], ['undefined', undefined]]) {
    it(`CH-08 returns [] for an empty or missing list ("no results"): ${label}, 2 => []`, () => {
      expect(chunk(value, 2)).to.deep.equal([])
    })
  }

  it('CH-09 splits 45 products into pages of 20/20/5 without losing, doubling or reordering (S1) [R-04, R-05]', () => {
    const products = makeProducts(45)
    const pages = chunk(products, 20)
    expect(pages).to.deep.equal(referencePages(products, 20))
    expect(pages[2][0].id).to.equal(41)
    expect(pages.flat()).to.deep.equal(products)
  })

  it('CH-10 splits 21 products into pages of 20 and 1 (S1, one item over the page size) [R-04, R-05]', () => {
    const products = makeProducts(21)
    expect(chunk(products, 20)).to.deep.equal(referencePages(products, 20))
  })

  it('CH-11 keeps the object references and does not change the input', () => {
    const o1 = { id: 1 }
    const o2 = { id: 2 }
    const input = [o1, o2]
    const result = chunk(input, 2)
    expect(result).to.deep.equal([[o1, o2]])
    expect(result[0][0]).to.equal(o1)
    expect(result[0][1]).to.equal(o2)
    expect(input).to.deep.equal([o1, o2])
    expect(input).to.have.lengthOf(2)
  })
})

describe('chunk – Phase 1 plan: CH-12…CH-13 isolated, slice replaced by a test double (human-designed, test plan Appendix C)', () => {
  let slice
  let chunkUnderTest

  beforeEach(async () => {
    // import chunk after replaceEsm, so it gets the test double
    ({ default: slice } = await td.replaceEsm('../src/slice.js'))
    ;({ default: chunkUnderTest } = await import('../src/chunk.js'))
  })

  afterEach(() => td.reset())

  it('CH-12 places the result of each slice call in the next position [R-05]', () => {
    const items = ['a', 'b', 'c', 'd']
    td.when(slice(items, 0, 2)).thenReturn('P1')
    td.when(slice(items, 2, 4)).thenReturn('P2')

    expect(chunkUnderTest(items, 2)).to.deep.equal(['P1', 'P2'])
    td.verify(slice(items, 0, 2), { times: 1 })
    td.verify(slice(items, 2, 4), { times: 1 })
  })

  it('CH-13 relies on slice to cut the end: the third call for 5 items and size 2 is slice(arr, 4, 6)', () => {
    const items = [1, 2, 3, 4, 5]
    chunkUnderTest(items, 2)
    td.verify(slice(items, 4, 6), { times: 1 })
    expect(td.explain(slice).callCount).to.equal(3)
  })
})
