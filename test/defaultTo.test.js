// oracle: JSDoc of src/defaultTo.js
import { expect } from 'chai'
import defaultTo from '../src/defaultTo.js'

describe('defaultTo – specification-based unit tests', () => {
  it('DT-01 returns a defined value (JSDoc): defaultTo(1, 10) => 1', () => {
    expect(defaultTo(1, 10)).to.equal(1)
  })

  it('DT-02 returns the default for undefined (JSDoc): defaultTo(undefined, 10) => 10', () => {
    expect(defaultTo(undefined, 10)).to.equal(10)
  })

  it('DT-03 returns the default for null: defaultTo(null, 10) => 10', () => {
    expect(defaultTo(null, 10)).to.equal(10)
  })

  it('DT-04 returns the default for NaN, e.g. a failed price conversion: defaultTo(NaN, 10) => 10 [R-08]', () => {
    expect(defaultTo(NaN, 10)).to.equal(10)
  })

  const keptFalsy = [['0', 0], ['""', ''], ['false', false]]
  for (const [label, value] of keptFalsy) {
    it(`DT-05 keeps other falsy values: defaultTo(${label}, 10) => ${label}`, () => {
      expect(defaultTo(value, 10)).to.equal(value)
    })
  }

  it('DT-06 shows "not specified" for a missing S1 category', () => {
    const product = { name: 'Ruisleipä 500 g', category: undefined }
    expect(defaultTo(product.category, 'not specified')).to.equal('not specified')
  })

  it('DT-07 stores null for a blank optional S3 field: defaultTo(undefined, null) => null', () => {
    expect(defaultTo(undefined, null)).to.equal(null)
  })

  it('DT-08 returns undefined when the default is omitted: defaultTo(null) => undefined', () => {
    expect(defaultTo(null)).to.equal(undefined)
  })

  it('DT-09 returns objects by reference', () => {
    const value = { id: 1 }
    const fallback = { id: 2 }
    expect(defaultTo(value, fallback)).to.equal(value)
    expect(defaultTo(undefined, fallback)).to.equal(fallback)
  })
})
