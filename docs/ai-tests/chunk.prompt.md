Answer from this message only. Do not use any tools and do not read any files.

You are helping a two-person student group test a JavaScript utility library for a course on software testing. The library is used by an e-commerce store that sells food products from small producers. For example, `chunk` is used to split a list of search results into pages of 20 products.

Write a complete Mocha test file for the function `chunk` shown below.

Setup:
- Node.js 24, ES modules (`"type": "module"` in package.json)
- Mocha 12 and Chai 6 (`import { expect } from 'chai'`)
- The test file will be saved as `test/ai/chunk.ai.test.js`, so import the function with `import chunk from '../../src/chunk.js'`
- `chunk` imports `slice` and `toInteger` from the same library

Rules:
- Take the expected values from the JSDoc comment and the documented purpose of the function, not from what the implementation does. The library may contain defects. A test that finds a defect must fail, it must not be skipped or adapted to the wrong behaviour.
- Cover normal cases, boundary values, invalid input and the use case in the store.
- Start every test title with an ID: AI-CH-01, AI-CH-02, ...
- Answer with the complete test file in one code block, followed by a short list of the defects you expect the tests to find, if any.

Source of src/chunk.js:

```js
import slice from './slice.js'
import toInteger from './toInteger.js'

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size = 1) {
  size = Math.max(toInteger(size), 0)
  const length = array == null ? 0 : array.length
  if (!length || size < 1) {
    return []
  }
  let index = 0
  let resIndex = 0
  const result = new Array(Math.ceil(length / size))

  while (index < length) {
    result[resIndex] = slice(array, index, (index += size))
  }
  return result
}

export default chunk
```
