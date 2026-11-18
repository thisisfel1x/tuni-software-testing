// oracle: JSDoc of src/divide.js, JavaScript semantics for division by zero
import { expect } from 'chai'
import divide from '../src/divide.js'

describe('divide – specification-based unit tests', () => {
  it('DV-01 returns the quotient of the JSDoc example: divide(6, 4) => 1.5 [R-01]', () => {
    expect(divide(6, 4)).to.equal(1.5)
  })

  it('DV-02 computes the S1 page count before rounding: divide(45, 20) => 2.25 [R-01]', () => {
    expect(divide(45, 20)).to.equal(2.25)
  })

  it('DV-03 computes the S1 unit price per kilogram: divide(4.5, 0.5) => 9 [R-01]', () => {
    expect(divide(4.5, 0.5)).to.equal(9)
  })

  it('DV-04 returns 0 for a zero dividend: divide(0, 5) => 0 [R-01]', () => {
    expect(divide(0, 5)).to.equal(0)
  })

  it('DV-05 keeps the sign for a negative dividend: divide(-9, 3) => -3 [R-01]', () => {
    expect(divide(-9, 3)).to.equal(-3)
  })

  it('DV-06 returns 1 for equal operands: divide(5, 5) => 1 (passes despite R-01, a weak test on its own)', () => {
    expect(divide(5, 5)).to.equal(1)
  })

  it('DV-07 follows JavaScript semantics for division by zero: divide(6, 0) => Infinity [R-01]', () => {
    expect(divide(6, 0)).to.equal(Infinity)
  })

  it('DV-08 divides numeric strings, e.g. prices from a form: divide("6", "4") => 1.5 [R-01]', () => {
    expect(divide('6', '4')).to.equal(1.5)
  })
})
