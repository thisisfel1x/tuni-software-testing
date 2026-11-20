Answer from this message only. Do not use any tools and do not read any files.

You are helping a two-person student group test a JavaScript utility library for a course on software testing. The library is used by an e-commerce store that sells food products from small producers. For example, `toNumber` is used to convert prices and quantities that users and producers type into forms, such as "12.50" or "2".

Write a complete Mocha test file for the function `toNumber` shown below.

Setup:
- Node.js 24, ES modules (`"type": "module"` in package.json)
- Mocha 12 and Chai 6 (`import { expect } from 'chai'`)
- The test file will be saved as `test/ai/toNumber.ai.test.js`, so import the function with `import toNumber from '../../src/toNumber.js'`
- `toNumber` imports `isObject` and `isSymbol` from the same library

Rules:
- Take the expected values from the JSDoc comment and the documented purpose of the function, not from what the implementation does. The library may contain defects. A test that finds a defect must fail, it must not be skipped or adapted to the wrong behaviour.
- Cover normal cases, boundary values, invalid input and the use case in the store.
- Start every test title with an ID: AI-TN-01, AI-TN-02, ...
- Answer with the complete test file in one code block, followed by a short list of the defects you expect the tests to find, if any.

Source of src/toNumber.js:

```js
import isObject from './isObject.js'
import isSymbol from './isSymbol.js'

/** Used as references for various `Number` constants. */
const NAN = 0 / 0

/** Used to match leading and trailing whitespace. */
const reTrim = /^\s+|\s+$/g

/** Used to detect bad signed hexadecimal string values. */
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i

/** Used to detect binary string values. */
const reIsBinary = /^0b[01]+$/i

/** Used to detect octal string values. */
const reIsOctal = /^0o[0-7]+$/i

/** Built-in method references without a dependency on `root`. */
const freeParseInt = parseInt

/**
 * Converts `value` to a number.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @see isInteger, toInteger, isNumber
 * @example
 *
 * toNumber(3.2)
 * // => 3.2
 *
 * toNumber(Number.MIN_VALUE)
 * // => 5e-324
 *
 * toNumber(Infinity)
 * // => Infinity
 *
 * toNumber('3.2')
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value === 'number') {
    return value
  }
  if (isSymbol(value)) {
    return NAN
  }
  if (isObject(value)) {
    const other = typeof value.valueOf === 'function' ? value.valueOf() : value
    value = isObject(other) ? `${other}` : other
  }
  if (typeof value !== 'string') {
    return value === 0 ? value : +value
  }
  value = value.replace(reTrim, '')
  const isBinary = reIsBinary.test(value)
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value)
}

export default toNumber
```
