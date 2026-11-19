import { expect } from 'chai'
import chunk from '../../src/chunk.js'

const PAGE_SIZE = 20

/**
 * Builds a list of `count` search results (food products) with ids 1..count.
 */
function makeProducts(count) {
  const products = []
  for (let i = 1; i <= count; i++) {
    products.push({
      id: i,
      name: `Product ${i}`,
      producer: `Farm ${(i % 5) + 1}`,
      category: 'food'
    })
  }
  return products
}

describe('chunk', () => {
  describe('normal cases', () => {
    it('AI-CH-01 splits an array evenly into chunks of the given size (JSDoc example 1)', () => {
      expect(chunk(['a', 'b', 'c', 'd'], 2)).to.deep.equal([['a', 'b'], ['c', 'd']])
    })

    it('AI-CH-02 puts the remaining elements into the final chunk (JSDoc example 2)', () => {
      expect(chunk(['a', 'b', 'c', 'd'], 3)).to.deep.equal([['a', 'b', 'c'], ['d']])
    })

    it('AI-CH-03 uses the default size 1 when size is omitted', () => {
      expect(chunk(['a', 'b', 'c'])).to.deep.equal([['a'], ['b'], ['c']])
    })

    it('AI-CH-04 uses the default size 1 when size is explicitly undefined', () => {
      expect(chunk(['a', 'b', 'c'], undefined)).to.deep.equal([['a'], ['b'], ['c']])
    })

    it('AI-CH-05 keeps the original order of the elements across all chunks', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      expect(chunk(input, 3)).to.deep.equal([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
    })

    it('AI-CH-06 keeps the same object references inside the chunks', () => {
      const a = { id: 1 }
      const b = { id: 2 }
      const c = { id: 3 }
      const result = chunk([a, b, c], 2)
      expect(result).to.have.lengthOf(2)
      expect(result[0][0]).to.equal(a)
      expect(result[0][1]).to.equal(b)
      expect(result[1][0]).to.equal(c)
    })

    it('AI-CH-07 keeps falsy elements such as 0, empty string, null, undefined and false', () => {
      expect(chunk([0, '', null, undefined, false], 2)).to.deep.equal([
        [0, ''],
        [null, undefined],
        [false]
      ])
    })

    it('AI-CH-08 does not modify the input array', () => {
      const input = ['a', 'b', 'c', 'd', 'e']
      const copy = [...input]
      chunk(input, 2)
      expect(input).to.deep.equal(copy)
    })

    it('AI-CH-09 returns a new array of new chunk arrays, not the input array itself', () => {
      const input = ['a', 'b', 'c']
      const result = chunk(input, 5)
      expect(result).to.not.equal(input)
      expect(result[0]).to.not.equal(input)
      expect(result[0]).to.deep.equal(input)
    })
  })

  describe('boundary values', () => {
    it('AI-CH-10 returns an empty array for an empty input array', () => {
      expect(chunk([], 2)).to.deep.equal([])
    })

    it('AI-CH-11 returns one chunk for a single element array with the default size', () => {
      expect(chunk(['a'])).to.deep.equal([['a']])
    })

    it('AI-CH-12 returns one chunk when size equals the array length', () => {
      expect(chunk(['a', 'b', 'c'], 3)).to.deep.equal([['a', 'b', 'c']])
    })

    it('AI-CH-13 returns one chunk when size is one greater than the array length', () => {
      expect(chunk(['a', 'b', 'c'], 4)).to.deep.equal([['a', 'b', 'c']])
    })

    it('AI-CH-14 returns two chunks when size is one less than the array length', () => {
      expect(chunk(['a', 'b', 'c'], 2)).to.deep.equal([['a', 'b'], ['c']])
    })

    it('AI-CH-15 returns no empty slots: every chunk is a non-empty array and together they hold all elements', () => {
      const input = [1, 2, 3, 4, 5, 6, 7]
      const result = chunk(input, 3)
      expect(result).to.have.lengthOf(3)
      for (let i = 0; i < result.length; i++) {
        expect(result[i], `chunk at index ${i}`).to.be.an('array').that.is.not.empty
      }
      expect(result.flat()).to.deep.equal(input)
    })

    it('AI-CH-16 returns an empty array when size is 0', () => {
      // A chunk of length 0 cannot hold any element, so no chunks are expected.
      expect(chunk(['a', 'b', 'c'], 0)).to.deep.equal([])
    })

    it('AI-CH-17 returns an empty array when size is negative', () => {
      expect(chunk(['a', 'b', 'c'], -1)).to.deep.equal([])
    })

    it('AI-CH-18 returns one chunk with all elements when size is Infinity', () => {
      expect(chunk(['a', 'b', 'c'], Infinity)).to.deep.equal([['a', 'b', 'c']])
    })
  })

  describe('invalid input', () => {
    // The JSDoc does not define the behaviour for these inputs. We expect the
    // safe outcome for a caller: no exception and no chunks.

    it('AI-CH-19 returns an empty array when array is null', () => {
      expect(() => chunk(null, 2)).to.not.throw()
      expect(chunk(null, 2)).to.deep.equal([])
    })

    it('AI-CH-20 returns an empty array when called without any arguments', () => {
      expect(() => chunk()).to.not.throw()
      expect(chunk()).to.deep.equal([])
    })

    it('AI-CH-21 returns an empty array for values that are not arrays and have no length', () => {
      expect(chunk(42, 2)).to.deep.equal([])
      expect(chunk({ a: 1, b: 2 }, 2)).to.deep.equal([])
    })

    it('AI-CH-22 returns an empty array when size is NaN', () => {
      // NaN is not a valid length, treated like size 0.
      expect(chunk(['a', 'b', 'c'], NaN)).to.deep.equal([])
    })

    it('AI-CH-23 converts a fractional size to an integer', () => {
      // Assumption: a fractional length is converted to an integer (2.4 -> 2).
      expect(chunk(['a', 'b', 'c', 'd', 'e'], 2.4)).to.deep.equal([['a', 'b'], ['c', 'd'], ['e']])
    })
  })

  describe('store use case: pagination of search results with 20 products per page', () => {
    it('AI-CH-24 splits 45 search results into 3 pages with 20, 20 and 5 products', () => {
      const pages = chunk(makeProducts(45), PAGE_SIZE)
      expect(pages).to.have.lengthOf(3)
      expect(pages.map((page) => page.length)).to.deep.equal([20, 20, 5])
    })

    it('AI-CH-25 puts products 1–20 on page 1, 21–40 on page 2 and 41–45 on page 3', () => {
      const products = makeProducts(45)
      const pages = chunk(products, PAGE_SIZE)
      expect(pages[0]).to.deep.equal(products.slice(0, 20))
      expect(pages[1]).to.deep.equal(products.slice(20, 40))
      expect(pages[2]).to.deep.equal(products.slice(40, 45))
      expect(pages[2].map((p) => p.id)).to.deep.equal([41, 42, 43, 44, 45])
    })

    it('AI-CH-26 creates exactly 2 full pages and no empty extra page for 40 results', () => {
      const products = makeProducts(40)
      const pages = chunk(products, PAGE_SIZE)
      expect(pages).to.deep.equal([products.slice(0, 20), products.slice(20, 40)])
    })

    it('AI-CH-27 shows all products on a single page when there are exactly 20 results', () => {
      const products = makeProducts(20)
      expect(chunk(products, PAGE_SIZE)).to.deep.equal([products])
    })

    it('AI-CH-28 creates a second page with a single product for 21 results', () => {
      const products = makeProducts(21)
      const pages = chunk(products, PAGE_SIZE)
      expect(pages).to.deep.equal([products.slice(0, 20), [products[20]]])
    })

    it('AI-CH-29 creates no pages when the search has no results', () => {
      expect(chunk([], PAGE_SIZE)).to.deep.equal([])
    })

    it('AI-CH-30 loses or duplicates no product when 1000 results are paginated', () => {
      const products = makeProducts(1000)
      const pages = chunk(products, PAGE_SIZE)
      expect(pages).to.have.lengthOf(50)
      for (let i = 0; i < pages.length; i++) {
        expect(pages[i], `page ${i + 1}`).to.have.lengthOf(PAGE_SIZE)
      }
      expect(pages.flat().map((p) => p.id)).to.deep.equal(products.map((p) => p.id))
    })

    it('AI-CH-31 keeps the product objects identical and unchanged on the pages', () => {
      const products = makeProducts(25)
      const pages = chunk(products, PAGE_SIZE)
      expect(pages[0][0]).to.equal(products[0])
      expect(pages[1][4]).to.equal(products[24])
      expect(products).to.deep.equal(makeProducts(25))
    })
  })
})
