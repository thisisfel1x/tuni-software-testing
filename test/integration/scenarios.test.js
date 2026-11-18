// integration tests within the library along the scenarios S1–S3, no test doubles
// oracle: expected outcome of the scenarios in the test plan
import { expect } from 'chai'
import ceil from '../../src/ceil.js'
import chunk from '../../src/chunk.js'
import clamp from '../../src/clamp.js'
import compact from '../../src/compact.js'
import defaultTo from '../../src/defaultTo.js'
import divide from '../../src/divide.js'
import filter from '../../src/filter.js'
import isEmpty from '../../src/isEmpty.js'
import toNumber from '../../src/toNumber.js'
import toString from '../../src/toString.js'
import { makeProducts, referencePages } from '../helpers/storeData.js'

describe('Integration S1 – customer searches, filters and pages through products', () => {
  const products = makeProducts(45)

  it('IN-S1-01 converts the price range inputs "2.00" and "6.00" and keeps the products inside it', () => {
    const min = toNumber('2.00')
    const max = toNumber('6.00')
    const result = filter(products, (p) => p.price >= min && p.price <= max)
    expect(isEmpty(result)).to.equal(false)
    expect(result).to.deep.equal(products.filter((p) => p.price >= 2 && p.price <= 6))
  })

  it('IN-S1-02 shows "No products found" for a search without matches: isEmpty(filter(...)) => true [R-03]', () => {
    const result = filter(products, (p) => p.producer === 'Unknown producer')
    expect(isEmpty(result)).to.equal(true)
  })

  it('IN-S1-03 computes 3 pages for 45 products: ceil(divide(45, 20)) => 3 [R-01]', () => {
    expect(ceil(divide(products.length, 20))).to.equal(3)
  })

  it('IN-S1-04 shows the last page for ?page=99: clamp(99, 1, ceil(divide(45, 20))) => 3 [R-01, R-02]', () => {
    expect(clamp(99, 1, ceil(divide(products.length, 20)))).to.equal(3)
  })

  it('IN-S1-05 shows every product exactly once on pages of 20/20/5 [R-04, R-05]', () => {
    expect(chunk(products, 20)).to.deep.equal(referencePages(products, 20))
  })

  it('IN-S1-06 shows the unit price and "not specified" for a missing category on the product card [R-01]', () => {
    const product = { price: 4.5, weightKg: 0.5, category: undefined }
    expect(divide(product.price, product.weightKg)).to.equal(9)
    expect(defaultTo(product.category, 'not specified')).to.equal('not specified')
  })
})

describe('Integration S2 – customer adds products to the cart', () => {
  const bread = { id: 'bread', price: 4.5, quantity: 2 }
  const cheese = { id: 'cheese', price: 6.9, quantity: 1 }

  it('IN-S2-01 accepts the quantity input "2" within the stock of 10: clamp(toNumber("2"), 1, 10) => 2 [R-02]', () => {
    expect(clamp(toNumber('2'), 1, 10)).to.equal(2)
  })

  it('IN-S2-02 limits the quantity input "12" to the stock of 10 [R-02]', () => {
    expect(clamp(toNumber('12'), 1, 10)).to.equal(10)
  })

  it('IN-S2-03 keeps the bread line after removing the cheese, the cart is not empty', () => {
    const lines = filter([bread, cheese], (line) => line.id !== 'cheese')
    expect(lines).to.deep.equal([bread])
    expect(isEmpty(lines)).to.equal(false)
  })

  it('IN-S2-04 shows an empty cart after removing the only line [R-03]', () => {
    const lines = filter([cheese], (line) => line.id !== 'cheese')
    expect(isEmpty(lines)).to.equal(true)
  })

  it('IN-S2-05 rejects an empty delivery form field: isEmpty(toString(undefined)) => true [R-07]', () => {
    expect(isEmpty(toString(undefined))).to.equal(true)
  })
})

describe('Integration S3 – producer adds a product', () => {
  it('IN-S3-01 keeps all three ingredients of "rye flour, water, , salt" [R-06]', () => {
    const contents = toString('rye flour, water, , salt').split(',').map((s) => s.trim())
    expect(compact(contents)).to.deep.equal(['rye flour', 'water', 'salt'])
  })

  for (const [label, value] of [['null', null], ['undefined', undefined]]) {
    it(`IN-S3-02 detects a missing mandatory name: isEmpty(toString(${label})) => true [R-07]`, () => {
      expect(isEmpty(toString(value))).to.equal(true)
    })
  }

  it('IN-S3-03 accepts a filled mandatory name: isEmpty(toString("Ruisleipä 500 g")) => false', () => {
    expect(isEmpty(toString('Ruisleipä 500 g'))).to.equal(false)
  })

  it('IN-S3-04 accepts the price "4.50" as a positive number', () => {
    expect(toNumber('4.50') > 0).to.equal(true)
  })

  it('IN-S3-05 stores null for the blank optional category: defaultTo(undefined, null) => null', () => {
    expect(defaultTo(undefined, null)).to.equal(null)
  })
})
