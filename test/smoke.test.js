// basic test if toolchain works
import { expect } from 'chai'
import * as td from 'testdouble'

describe('Smoke test: tool chain', () => {
  afterEach(() => td.reset())

  it('SM-01 runs a Chai assertion', () => {
    expect([1, 2]).to.deep.equal([1, 2])
  })

  it('SM-02 imports a library module as ES module', async () => {
    const { default: isObject } = await import('../src/isObject.js')
    expect(isObject({})).to.equal(true)
  })

  it('SM-03 replaces an ES module with testdouble', async () => {
    const { default: isObjectStub } = await td.replaceEsm('../src/isObject.js')
    td.when(isObjectStub('x')).thenReturn('stubbed')
    const { default: isObject } = await import('../src/isObject.js')
    expect(isObject('x')).to.equal('stubbed')
  })
})
