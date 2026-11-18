// oracle: JSDoc of src/compact.js
import { expect } from 'chai'
import compact from '../src/compact.js'

describe('compact – specification-based unit tests', () => {
  it('CP-01 removes falsy values (JSDoc): compact([0, 1, false, 2, "", 3]) => [1, 2, 3] [R-06]', () => {
    expect(compact([0, 1, false, 2, '', 3])).to.deep.equal([1, 2, 3])
  })

  it('CP-02 removes every documented falsy value: [false, null, 0, "", undefined, NaN] => []', () => {
    expect(compact([false, null, 0, '', undefined, NaN])).to.deep.equal([])
  })

  it('CP-03 keeps all values of an array without falsy values: ["a", "b"] => ["a", "b"] [R-06]', () => {
    expect(compact(['a', 'b'])).to.deep.equal(['a', 'b'])
  })

  it('CP-04 keeps a single truthy value: ["x"] => ["x"] [R-06]', () => {
    expect(compact(['x'])).to.deep.equal(['x'])
  })

  it('CP-05 returns [] for an empty array', () => {
    expect(compact([])).to.deep.equal([])
  })

  it('CP-06 keeps truthy values that look empty: [{}, [], "0", -1] [R-06]', () => {
    const obj = {}
    const arr = []
    const result = compact([obj, arr, '0', -1])
    expect(result).to.deep.equal([obj, arr, '0', -1])
    expect(result[0]).to.equal(obj)
  })

  it('CP-07 removes the empty S3 contents entry without losing an ingredient [R-06]', () => {
    const contents = 'rye flour, water, , salt'.split(',').map((s) => s.trim())
    expect(compact(contents)).to.deep.equal(['rye flour', 'water', 'salt'])
  })

  it('CP-08 returns an array without extra properties (only indexes 0..n-1) [R-06]', () => {
    const result = compact([1, 2])
    expect(Object.keys(result)).to.deep.equal(['0', '1'])
  })

  it('CP-09 does not change the input array', () => {
    const input = [0, 'a', '', 'b']
    compact(input)
    expect(input).to.deep.equal([0, 'a', '', 'b'])
  })
})
