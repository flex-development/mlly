/**
 * @file Unit Tests - getSource
 * @module mlly/lib/tests/unit/getSource
 */

import testSubject from '#lib/get-source'
import {
  codes,
  isNodeError,
  type NodeError
} from '@flex-development/errnode'
import pathe from '@flex-development/pathe'

describe('unit:lib/getSource', () => {
  it.each<Parameters<typeof testSubject>>([
    ['os'],
    [new URL('node:test')]
  ])('should return `undefined` if `id` is builtin module (%j)', async id => {
    expect(await testSubject(id)).to.be.undefined
  })

  it.each<Parameters<typeof testSubject>>([
    ['data:application/javascript;base64,SGVsbG8sIFdvcmxkIQ=='],
    ['data:text/javascript,console.log("hello!");'],
    ['https://esm.sh/@flex-development/mlly'],
    [pathe.fileURLToPath(import.meta.url)],
    [pathe.pathToFileURL('build.config.mts')]
  ])('should return source code for `id` (%#)', async (id, options) => {
    expect(await testSubject(id, options)).to.be.a('string')
  })

  it('should throw on unsupported url scheme (%#)', async () => {
    // Arrange
    let error!: NodeError

    // Act
    try {
      await testSubject('git://github.com/flex-development/mlly.git', {
        schemes: ['file']
      })
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.satisfy(isNodeError)
    expect(error).to.have.property('code', codes.ERR_UNSUPPORTED_ESM_URL_SCHEME)
    expect(error).toMatchSnapshot()
  })
})
