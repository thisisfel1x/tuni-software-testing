// test data for the scenarios S1–S3, built without library functions

const PRODUCERS = ['Leipomo Ruis', 'Juustola Aho', 'Tila Mäkelä']

// products with ids 1..count like a BE search result (S1)
// every third has no category, every fifth no contents
export function makeProducts(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Ruisleipä ${i + 1}`,
    price: Number((2 + (i % 9) * 0.5).toFixed(2)),
    producer: PRODUCERS[i % PRODUCERS.length],
    category: i % 3 === 0 ? undefined : 'Bakery',
    contents: i % 5 === 0 ? undefined : 'rye flour, water, salt'
  }))
}

// reference pages built with native Array#slice
export function referencePages(array, size) {
  const pages = []
  for (let i = 0; i < array.length; i += size) {
    pages.push(array.slice(i, i + size))
  }
  return pages
}
