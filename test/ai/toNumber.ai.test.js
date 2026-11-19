/**
 * AI-generated unit tests for src/toNumber.js (Mocha 12, Chai 6, ES modules).
 *
 * Where the expected values come from, in order of priority:
 *   1. The JSDoc of toNumber: the four @example values, `@param {*} value`
 *      (any value may be passed) and `@returns {number}` (a number is always
 *      returned, so the function must not throw).
 *   2. The documented purpose "Converts `value` to a number", read as the
 *      standard JavaScript numeric conversion `Number(value)`. This defines
 *      whitespace trimming and the handling of hex, binary and octal strings.
 *   3. Where `Number(value)` itself would throw (symbols, objects without
 *      valueOf and toString), rule 1 applies and the expected result is NaN.
 *
 * The expected values were not taken from the implementation. A failing test
 * reports a deviation from this contract and must not be skipped or adapted.
 */
/* eslint-disable no-unused-expressions, no-new-wrappers */
import { expect } from 'chai'
import toNumber from '../../src/toNumber.js'

const isNegativeZero = (x) => Object.is(x, -0)

describe('toNumber', () => {
  describe('examples from the JSDoc', () => {
    it('AI-TN-01 returns the number 3.2 unchanged', () => {
      expect(toNumber(3.2)).to.equal(3.2)
    })

    it('AI-TN-02 returns Number.MIN_VALUE unchanged (5e-324)', () => {
      expect(toNumber(Number.MIN_VALUE)).to.equal(5e-324)
    })

    it('AI-TN-03 returns Infinity unchanged', () => {
      expect(toNumber(Infinity)).to.equal(Infinity)
    })

    it("AI-TN-04 converts the string '3.2' to 3.2", () => {
      expect(toNumber('3.2')).to.equal(3.2)
    })
  })

  describe('normal cases', () => {
    it("AI-TN-05 converts an integer string '42' to 42", () => {
      expect(toNumber('42')).to.equal(42)
    })

    it("AI-TN-06 converts a negative decimal string '-7.25' to -7.25", () => {
      expect(toNumber('-7.25')).to.equal(-7.25)
    })

    it("AI-TN-07 converts a string with an explicit plus sign '+5' to 5", () => {
      expect(toNumber('+5')).to.equal(5)
    })

    it('AI-TN-08 converts strings in exponent notation', () => {
      expect(toNumber('1.5e3')).to.equal(1500)
      expect(toNumber('2E-2')).to.equal(0.02)
    })

    it('AI-TN-09 converts decimals without leading or trailing digits', () => {
      expect(toNumber('.5')).to.equal(0.5)
      expect(toNumber('5.')).to.equal(5)
    })

    it('AI-TN-10 ignores leading and trailing whitespace', () => {
      expect(toNumber(' 12.50 ')).to.equal(12.5)
      expect(toNumber('\t2\n')).to.equal(2)
    })

    it("AI-TN-11 treats leading zeros as decimal, not octal ('007' is 7)", () => {
      expect(toNumber('007')).to.equal(7)
      expect(toNumber('010')).to.equal(10)
    })

    it('AI-TN-12 converts unsigned hexadecimal strings', () => {
      expect(toNumber('0x1A')).to.equal(26)
      expect(toNumber('0XFF')).to.equal(255)
    })

    it('AI-TN-13 converts binary strings with a case-insensitive prefix', () => {
      expect(toNumber('0b101')).to.equal(5)
      expect(toNumber('0B101')).to.equal(5)
    })

    it('AI-TN-14 converts octal strings with a case-insensitive prefix', () => {
      expect(toNumber('0o17')).to.equal(15)
      expect(toNumber('0O17')).to.equal(15)
    })

    it('AI-TN-15 trims whitespace around binary and octal strings', () => {
      expect(toNumber('  0b11  ')).to.equal(3)
      expect(toNumber('\n0o10\t')).to.equal(8)
    })

    it('AI-TN-16 converts booleans to 1 and 0', () => {
      expect(toNumber(true)).to.equal(1)
      expect(toNumber(false)).to.equal(0)
    })

    it('AI-TN-17 converts null to 0', () => {
      expect(toNumber(null)).to.equal(0)
    })

    it('AI-TN-18 unwraps a Number object', () => {
      expect(toNumber(new Number(3.2))).to.equal(3.2)
    })

    it("AI-TN-19 unwraps and trims a String object (new String(' 12.50 ') is 12.5)", () => {
      expect(toNumber(new String(' 12.50 '))).to.equal(12.5)
    })

    it('AI-TN-20 unwraps Boolean objects to 1 and 0', () => {
      expect(toNumber(new Boolean(true))).to.equal(1)
      expect(toNumber(new Boolean(false))).to.equal(0)
    })

    it('AI-TN-21 converts a Date to its timestamp in milliseconds', () => {
      const date = new Date('2024-01-01T00:00:00.000Z')
      expect(toNumber(date)).to.equal(1704067200000)
    })

    it('AI-TN-22 uses the result of a custom valueOf method', () => {
      expect(toNumber({ valueOf: () => 42 })).to.equal(42)
      expect(toNumber({ valueOf: () => '12.50' })).to.equal(12.5)
    })

    it('AI-TN-23 uses toString when valueOf returns the object itself', () => {
      expect(toNumber({ toString: () => '7' })).to.equal(7)
    })

    it('AI-TN-24 converts arrays with exactly one numeric element', () => {
      expect(toNumber([5])).to.equal(5)
      expect(toNumber(['7'])).to.equal(7)
    })
  })

  describe('boundary values', () => {
    it('AI-TN-25 keeps the sign of negative zero', () => {
      expect(isNegativeZero(toNumber(-0)), 'expected -0').to.equal(true)
    })

    it("AI-TN-26 converts the string '-0' to negative zero", () => {
      expect(isNegativeZero(toNumber('-0')), 'expected -0').to.equal(true)
    })

    it("AI-TN-27 converts 0 and '0' to positive zero", () => {
      expect(Object.is(toNumber(0), 0), 'expected +0 for 0').to.equal(true)
      expect(Object.is(toNumber('0'), 0), "expected +0 for '0'").to.equal(true)
    })

    it('AI-TN-28 returns the largest finite numbers unchanged', () => {
      expect(toNumber(Number.MAX_SAFE_INTEGER)).to.equal(Number.MAX_SAFE_INTEGER)
      expect(toNumber(Number.MAX_VALUE)).to.equal(Number.MAX_VALUE)
      expect(toNumber(-Number.MAX_VALUE)).to.equal(-Number.MAX_VALUE)
    })

    it('AI-TN-29 converts strings at and beyond the largest finite number', () => {
      expect(toNumber('1.7976931348623157e308')).to.equal(Number.MAX_VALUE)
      expect(toNumber('1e309')).to.equal(Infinity)
    })

    it("AI-TN-30 converts the string '5e-324' to Number.MIN_VALUE", () => {
      expect(toNumber('5e-324')).to.equal(Number.MIN_VALUE)
    })

    it('AI-TN-31 handles -Infinity and the strings Infinity and -Infinity', () => {
      expect(toNumber(-Infinity)).to.equal(-Infinity)
      expect(toNumber('Infinity')).to.equal(Infinity)
      expect(toNumber('-Infinity')).to.equal(-Infinity)
    })

    it('AI-TN-32 returns NaN for NaN', () => {
      expect(toNumber(NaN)).to.be.NaN
    })

    // Number('') is 0. In the store this means an empty field becomes 0,
    // so the form has to reject empty input before or after converting.
    it('AI-TN-33 converts the empty string to 0', () => {
      expect(toNumber('')).to.equal(0)
    })

    it('AI-TN-34 converts whitespace-only strings to 0', () => {
      expect(toNumber('   ')).to.equal(0)
      expect(toNumber('\t\n')).to.equal(0)
    })

    it('AI-TN-35 converts an empty array to 0', () => {
      expect(toNumber([])).to.equal(0)
    })
  })

  describe('invalid input', () => {
    it('AI-TN-36 returns NaN for non-numeric strings', () => {
      for (const input of ['abc', 'twelve', 'NaN']) {
        expect(toNumber(input), `input '${input}'`).to.be.NaN
      }
    })

    it('AI-TN-37 returns NaN for strings that only start with a number', () => {
      for (const input of ['12abc', '12.50EUR', '0x1G']) {
        expect(toNumber(input), `input '${input}'`).to.be.NaN
      }
    })

    it('AI-TN-38 returns NaN for malformed numbers', () => {
      for (const input of ['1.2.3', '--5', '+-5', '1e', 'e5']) {
        expect(toNumber(input), `input '${input}'`).to.be.NaN
      }
    })

    it('AI-TN-39 returns NaN for signed hexadecimal, binary and octal strings', () => {
      for (const input of ['-0x1A', '+0x1A', '-0b101', '-0o17']) {
        expect(toNumber(input), `input '${input}'`).to.be.NaN
      }
    })

    it('AI-TN-40 returns NaN for binary and octal strings with invalid digits', () => {
      for (const input of ['0b102', '0o78']) {
        expect(toNumber(input), `input '${input}'`).to.be.NaN
      }
    })

    it('AI-TN-41 returns NaN for undefined', () => {
      expect(toNumber(undefined)).to.be.NaN
    })

    it('AI-TN-42 returns NaN for a plain object', () => {
      expect(toNumber({})).to.be.NaN
    })

    it('AI-TN-43 returns NaN for an array with several elements', () => {
      expect(toNumber([1, 2])).to.be.NaN
    })

    it('AI-TN-44 returns NaN for a function', () => {
      expect(toNumber(() => 1)).to.be.NaN
    })

    it('AI-TN-45 returns NaN for an invalid Date', () => {
      expect(toNumber(new Date('not a date'))).to.be.NaN
    })

    it('AI-TN-46 returns NaN for a symbol instead of throwing', () => {
      const symbol = Symbol('price')
      expect(() => toNumber(symbol)).to.not.throw()
      expect(toNumber(symbol)).to.be.NaN
    })

    it('AI-TN-47 returns NaN for a boxed symbol object instead of throwing', () => {
      const boxed = Object(Symbol('price'))
      expect(() => toNumber(boxed)).to.not.throw()
      expect(toNumber(boxed)).to.be.NaN
    })

    it('AI-TN-48 converts a BigInt to the equal number instead of throwing', () => {
      expect(() => toNumber(10n)).to.not.throw()
      expect(toNumber(10n)).to.equal(10)
    })

    it('AI-TN-49 returns NaN for an object without valueOf and toString instead of throwing', () => {
      const bare = Object.create(null)
      expect(() => toNumber(bare)).to.not.throw()
      expect(toNumber(bare)).to.be.NaN
    })
  })

  describe('use case: prices and quantities typed into store forms', () => {
    it("AI-TN-50 converts the price '12.50' to 12.5 and the quantity '2' to 2", () => {
      expect(toNumber('12.50')).to.equal(12.5)
      expect(toNumber('2')).to.equal(2)
    })

    it('AI-TN-51 allows computing a line total from price and quantity strings', () => {
      expect(toNumber('12.50') * toNumber('2')).to.equal(25)
    })

    it('AI-TN-52 returns numbers that add up instead of concatenating', () => {
      const sum = toNumber('12.50') + toNumber('2')
      expect(sum).to.be.a('number')
      expect(sum).to.equal(14.5)
    })

    it("AI-TN-53 returns NaN for a decimal comma ('12,50') instead of a wrong price", () => {
      expect(toNumber('12,50')).to.be.NaN
      expect(toNumber('0,99')).to.be.NaN
    })

    it('AI-TN-54 returns NaN for prices and quantities with currency or unit text', () => {
      for (const input of ['€12.50', '12.50 €', '$3', '2 kg', '2kg', '500g']) {
        expect(toNumber(input), `input '${input}'`).to.be.NaN
      }
    })

    it('AI-TN-55 returns NaN for thousands separators but converts plain 1000', () => {
      expect(toNumber('1,000')).to.be.NaN
      expect(toNumber('1 000')).to.be.NaN
      expect(toNumber('1000')).to.equal(1000)
    })

    it('AI-TN-56 keeps the decimals of a price without rounding', () => {
      expect(toNumber('0.99')).to.equal(0.99)
      expect(toNumber('0.01')).to.equal(0.01)
      expect(toNumber('12.505')).to.equal(12.505)
    })

    it('AI-TN-57 ignores non-breaking spaces from copy and paste', () => {
      expect(toNumber(' 12.50 ')).to.equal(12.5)
    })

    it('AI-TN-58 passes zero and negative quantities through unchanged', () => {
      // toNumber only converts. Rejecting 0 or negative quantities is the store's job.
      expect(toNumber('0')).to.equal(0)
      expect(toNumber('-2')).to.equal(-2)
    })

    it('AI-TN-59 always returns a value of type number for typical form input', () => {
      for (const input of ['12.50', '2', ' 3 ', '', 'abc', '12,50']) {
        expect(toNumber(input), `input '${input}'`).to.be.a('number')
      }
    })
  })
})
