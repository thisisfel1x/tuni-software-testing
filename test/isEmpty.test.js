// oracle: JSDoc of src/isEmpty.js, lodash docs
// IE-15, IE-16: isBuffer (suspect R-13) replaced by a test double
import { expect } from 'chai'
import * as td from 'testdouble'
import isEmpty from '../src/isEmpty.js'

describe('isEmpty – specification-based unit tests (real dependencies)', () => {
  const jsdocExamples = [
    ['null', null, true],
    ['true', true, true],
    ['1', 1, true],
    ['[1, 2, 3]', [1, 2, 3], false],
    ['"abc"', 'abc', false],
    ['{ a: 1 }', { a: 1 }, false]
  ]
  for (const [label, value, expected] of jsdocExamples) {
    it(`IE-01 JSDoc example: isEmpty(${label}) => ${expected}`, () => {
      expect(isEmpty(value)).to.equal(expected)
    })
  }

  it('IE-02 returns true for undefined', () => {
    expect(isEmpty(undefined)).to.equal(true)
  })

  for (const [label, value] of [['""', ''], ['[]', []], ['{}', {}]]) {
    it(`IE-03 returns true for an empty string, array or object: isEmpty(${label}) => true`, () => {
      expect(isEmpty(value)).to.equal(true)
    })
  }

  it('IE-04 returns false for a string of spaces, so S3 validators must trim first: isEmpty("   ") => false', () => {
    expect(isEmpty('   ')).to.equal(false)
  })

  it('IE-05 checks the size of maps: empty Map => true, Map with one entry => false', () => {
    expect(isEmpty(new Map())).to.equal(true)
    expect(isEmpty(new Map([['a', 1]]))).to.equal(false)
  })

  it('IE-06 checks the size of sets: empty Set => true, Set with one value => false', () => {
    expect(isEmpty(new Set())).to.equal(true)
    expect(isEmpty(new Set([1]))).to.equal(false)
  })

  it('IE-07 checks the length of arguments objects', function () {
    const args = (function () { return arguments })
    expect(isEmpty(args())).to.equal(true)
    expect(isEmpty(args(1, 2))).to.equal(false)
  })

  it('IE-08 checks the length of typed arrays and buffers', () => {
    expect(isEmpty(new Uint8Array(0))).to.equal(true)
    expect(isEmpty(new Float64Array(2))).to.equal(false)
    expect(isEmpty(Buffer.alloc(0))).to.equal(true)
    expect(isEmpty(Buffer.from('a'))).to.equal(false)
  })

  it('IE-09 checks the length of jQuery-like collections (array-like with splice)', () => {
    expect(isEmpty({ length: 0, splice() {} })).to.equal(true)
    expect(isEmpty({ 0: 'a', length: 1, splice() {} })).to.equal(false)
  })

  it('IE-10 treats an object with a length property but no splice as a plain object: isEmpty({ length: 0 }) => false', () => {
    expect(isEmpty({ length: 0 })).to.equal(false)
  })

  it('IE-11 considers only own enumerable properties: inherited properties => true', () => {
    expect(isEmpty(Object.create({ inherited: 1 }))).to.equal(true)
  })

  it('IE-12 checks the own keys of prototype objects', () => {
    function Product() {}
    expect(isEmpty(Product.prototype)).to.equal(true)
    Product.prototype.price = 4.5
    expect(isEmpty(Product.prototype)).to.equal(false)
  })

  for (const [label, value] of [['0', 0], ['4.5', 4.5]]) {
    it(`IE-13 returns true for every number, so isEmpty cannot check a numeric price (S3): isEmpty(${label}) => true`, () => {
      expect(isEmpty(value)).to.equal(true)
    })
  }

  it('IE-14 detects the empty S2 cart: isEmpty([]) => true, cart with one line => false', () => {
    expect(isEmpty([])).to.equal(true)
    expect(isEmpty([{ id: 'bread', quantity: 2 }])).to.equal(false)
  })
})

describe('isEmpty – isolated unit tests, isBuffer replaced by a test double', () => {
  let isBuffer
  let isEmptyUnderTest

  beforeEach(async () => {
    ({ default: isBuffer } = await td.replaceEsm('../src/isBuffer.js'))
    ;({ default: isEmptyUnderTest } = await import('../src/isEmpty.js'))
  })

  afterEach(() => td.reset())

  it('IE-15 checks the length of a value that isBuffer reports as buffer (length 0 => true)', () => {
    const fakeBuffer = { length: 0 }
    td.when(isBuffer(fakeBuffer)).thenReturn(true)
    expect(isEmptyUnderTest(fakeBuffer)).to.equal(true)
  })

  it('IE-16 checks the length of a value that isBuffer reports as buffer (length 2 => false)', () => {
    const fakeBuffer = { length: 2 }
    td.when(isBuffer(fakeBuffer)).thenReturn(true)
    expect(isEmptyUnderTest(fakeBuffer)).to.equal(false)
  })
})
