// oracle: JSDoc of src/filter.js
import { expect } from 'chai'
import filter from '../src/filter.js'
import { makeProducts } from './helpers/storeData.js'

describe('filter – specification-based unit tests', () => {
  it('FI-01 returns the matching objects of the JSDoc example (active users)', () => {
    const barney = { user: 'barney', active: true }
    const fred = { user: 'fred', active: false }
    const result = filter([barney, fred], ({ active }) => active)
    expect(result).to.deep.equal([barney])
    expect(result[0]).to.equal(barney)
  })

  it('FI-02 returns [] when no element matches [R-03]', () => {
    expect(filter([1, 2, 3], (n) => n > 10)).to.deep.equal([])
  })

  it('FI-03 returns [] for an empty array [R-03]', () => {
    expect(filter([], () => true)).to.deep.equal([])
  })

  for (const [label, value] of [['null', null], ['undefined', undefined]]) {
    it(`FI-04 returns [] for a missing array: filter(${label}, p) => [] [R-03]`, () => {
      expect(filter(value, () => true)).to.deep.equal([])
    })
  }

  it('FI-05 returns all elements in a new array when every element matches', () => {
    const input = [1, 2, 3]
    const result = filter(input, () => true)
    expect(result).to.deep.equal([1, 2, 3])
    expect(result).to.not.equal(input)
  })

  it('FI-06 invokes the predicate with (value, index, array)', () => {
    const input = ['a', 'b']
    const calls = []
    filter(input, (...args) => { calls.push(args); return true })
    expect(calls).to.deep.equal([['a', 0, input], ['b', 1, input]])
    expect(calls[0][2]).to.equal(input)
  })

  it('FI-07 treats truthy and falsy predicate results like true and false', () => {
    const results = [1, '', 'yes', 0, null, {}]
    expect(filter(['a', 'b', 'c', 'd', 'e', 'f'], (_, i) => results[i])).to.deep.equal(['a', 'c', 'f'])
  })

  it('FI-08 refines the S1 results by producer and keeps the BE order', () => {
    const products = makeProducts(45)
    const result = filter(products, (p) => p.producer === 'Juustola Aho')
    expect(result).to.have.lengthOf(15)
    expect(result.map((p) => p.id)).to.deep.equal(products.filter((p) => p.producer === 'Juustola Aho').map((p) => p.id))
  })

  it('FI-09 removes one line from the S2 cart (2 lines => 1 line)', () => {
    const bread = { id: 'bread', quantity: 2 }
    const cheese = { id: 'cheese', quantity: 1 }
    expect(filter([bread, cheese], (line) => line.id !== 'cheese')).to.deep.equal([bread])
  })

  it('FI-10 removes the only line from the S2 cart, the cart becomes [] [R-03]', () => {
    const cheese = { id: 'cheese', quantity: 1 }
    expect(filter([cheese], (line) => line.id !== 'cheese')).to.deep.equal([])
  })

  it('FI-11 does not change the input array', () => {
    const input = [1, 2, 3, 4]
    filter(input, (n) => n % 2 === 0)
    expect(input).to.deep.equal([1, 2, 3, 4])
  })
})
