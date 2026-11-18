// oracle: JSDoc of src/toNumber.js, lodash docs
import { expect } from 'chai'
import toNumber from '../src/toNumber.js'

describe('toNumber – Phase 1 plan: TN-01…TN-16 (human-designed, test plan Appendix C)', () => {
  it('TN-01 returns a number unchanged (JSDoc: 3.2 => 3.2)', () => {
    expect(toNumber(3.2)).to.equal(3.2)
  })

  it('TN-02 boundary (JSDoc): Number.MIN_VALUE => 5e-324', () => {
    expect(toNumber(Number.MIN_VALUE)).to.equal(5e-324)
  })
  it('TN-02 non-finite number (JSDoc): Infinity => Infinity', () => {
    expect(toNumber(Infinity)).to.equal(Infinity)
  })
  it('TN-02 non-finite number: NaN => NaN', () => {
    expect(toNumber(NaN)).to.be.NaN
  })

  it('TN-03 keeps the sign of zero (-0 => -0)', () => {
    expect(Object.is(toNumber(-0), -0)).to.equal(true)
  })

  it('TN-04 converts a price as typed in S1 and S3 ("12.50" => 12.5)', () => {
    expect(toNumber('12.50')).to.equal(12.5)
  })

  it('TN-05 trims white space including tab and line break (" \\t12.50 \\n" => 12.5)', () => {
    expect(toNumber(' \t12.50 \n')).to.equal(12.5)
  })

  it('TN-06 does not parse a decimal comma ("12,50" => NaN), the FE must replace it first', () => {
    expect(toNumber('12,50')).to.be.NaN
  })

  it('TN-07 empty input becomes 0, validators must check emptiness first: "" => 0', () => {
    expect(toNumber('')).to.equal(0)
  })
  it('TN-07 empty input becomes 0, validators must check emptiness first: "   " => 0', () => {
    expect(toNumber('   ')).to.equal(0)
  })

  it('TN-08 text with non-numeric characters: "4.50 €" => NaN', () => {
    expect(toNumber('4.50 €')).to.be.NaN
  })
  it('TN-08 text with non-numeric characters: "abc" => NaN', () => {
    expect(toNumber('abc')).to.be.NaN
  })

  it('TN-09 signed string (negative prices are a validator task): "-5" => -5', () => {
    expect(toNumber('-5')).to.equal(-5)
  })
  it('TN-09 signed string: "+5" => 5', () => {
    expect(toNumber('+5')).to.equal(5)
  })

  it('TN-10 accepts exponent notation ("1e3" => 1000)', () => {
    expect(toNumber('1e3')).to.equal(1000)
  })

  it('TN-11 binary string: "0b101" => 5', () => {
    expect(toNumber('0b101')).to.equal(5)
  })
  it('TN-11 octal string: "0o17" => 15', () => {
    expect(toNumber('0o17')).to.equal(15)
  })
  it('TN-11 invalid binary string: "0b102" => NaN', () => {
    expect(toNumber('0b102')).to.be.NaN
  })

  it('TN-12 hexadecimal string: "0x1F" => 31', () => {
    expect(toNumber('0x1F')).to.equal(31)
  })
  it('TN-12 signed hexadecimal string is rejected: "-0x1f" => NaN', () => {
    expect(toNumber('-0x1f')).to.be.NaN
  })

  it('TN-13 missing value (absent field in a BE response): null => 0', () => {
    expect(toNumber(null)).to.equal(0)
  })
  it('TN-13 missing value: undefined => NaN', () => {
    expect(toNumber(undefined)).to.be.NaN
  })

  it('TN-14 boolean: true => 1', () => {
    expect(toNumber(true)).to.equal(1)
  })
  it('TN-14 boolean: false => 0', () => {
    expect(toNumber(false)).to.equal(0)
  })

  it('TN-15 returns NaN for a symbol (Symbol("p") => NaN)', () => {
    expect(toNumber(Symbol('p'))).to.be.NaN
  })

  it('TN-16 object converted through valueOf: new Number(4.5) => 4.5', () => {
    expect(toNumber(new Number(4.5))).to.equal(4.5)
  })
  it('TN-16 object converted through valueOf: { valueOf: () => "7" } => 7', () => {
    expect(toNumber({ valueOf: () => '7' })).to.equal(7)
  })
  it('TN-16 array converted through its string form: [5] => 5', () => {
    expect(toNumber([5])).to.equal(5)
  })
  it('TN-16 array converted through its string form: [1, 2] => NaN', () => {
    expect(toNumber([1, 2])).to.be.NaN
  })
})

// not in the phase 1 plan, added after the c8 branch report (plan, principle 1)
describe('toNumber – additional unit tests from the coverage analysis (not in the phase 1 plan)', () => {
  it('TN-17 converts an object without a valueOf function through its string form: { valueOf: null, toString: () => "8" } => 8', () => {
    expect(toNumber({ valueOf: null, toString: () => '8' })).to.equal(8)
  })

  it('TN-18 keeps the sign of a boxed zero: new Number(-0) => -0', () => {
    expect(Object.is(toNumber(new Number(-0)), -0)).to.equal(true)
  })
})
