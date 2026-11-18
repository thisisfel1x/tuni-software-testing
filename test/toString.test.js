// oracle: JSDoc of src/toString.js, lodash docs
import { expect } from 'chai'
import toString from '../src/toString.js'

describe('toString – specification-based unit tests', () => {
  it('TS-01 returns "" for null (JSDoc) [R-07]', () => {
    expect(toString(null)).to.equal('')
  })

  it('TS-02 returns "" for undefined, e.g. an empty optional field in S3 [R-07]', () => {
    expect(toString(undefined)).to.equal('')
  })

  it('TS-03 preserves the sign of -0 (JSDoc): toString(-0) => "-0"', () => {
    expect(toString(-0)).to.equal('-0')
  })

  it('TS-04 joins an array with commas (JSDoc): toString([1, 2, 3]) => "1,2,3"', () => {
    expect(toString([1, 2, 3])).to.equal('1,2,3')
  })

  it('TS-05 returns a string unchanged, including Finnish characters: "Ruisleipä 500 g"', () => {
    expect(toString('Ruisleipä 500 g')).to.equal('Ruisleipä 500 g')
  })

  const numbers = [[4.5, '4.5'], [0, '0'], [-1, '-1'], [Infinity, 'Infinity'], [NaN, 'NaN']]
  for (const [value, expected] of numbers) {
    it(`TS-06 converts a number: toString(${value}) => "${expected}"`, () => {
      expect(toString(value)).to.equal(expected)
    })
  }

  it('TS-07 flattens nested arrays: toString([1, [2, [3]]]) => "1,2,3"', () => {
    expect(toString([1, [2, [3]]])).to.equal('1,2,3')
  })

  it('TS-08 converts null and undefined inside an array to empty entries: [null, "a", undefined] => ",a,"', () => {
    expect(toString([null, 'a', undefined])).to.equal(',a,')
  })

  it('TS-09 preserves the sign of -0 inside an array: toString([-0]) => "-0"', () => {
    expect(toString([-0])).to.equal('-0')
  })

  it('TS-10 converts a symbol: toString(Symbol("a")) => "Symbol(a)"', () => {
    expect(toString(Symbol('a'))).to.equal('Symbol(a)')
  })

  it('TS-11 converts a symbol inside an array: toString([Symbol("a")]) => "Symbol(a)"', () => {
    expect(toString([Symbol('a')])).to.equal('Symbol(a)')
  })

  const others = [['true', true, 'true'], ['{}', {}, '[object Object]']]
  for (const [label, value, expected] of others) {
    it(`TS-12 converts other values with their string form: toString(${label}) => "${expected}"`, () => {
      expect(toString(value)).to.equal(expected)
    })
  }
})
