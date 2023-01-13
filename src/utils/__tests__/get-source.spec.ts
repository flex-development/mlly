/**
 * @file Unit Tests - getSource
 * @module mlly/utils/tests/unit/getSource
 */

import { Format } from '#src/enums'
import type { GetSourceOptions } from '#src/interfaces'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import testSubject from '../get-source'

describe('unit:utils/getSource', () => {
  it('should return source code as Uint8Array', async () => {
    // Arrange
    const id: string = '__fixtures__/add.wasm'
    const options: GetSourceOptions = { format: Format.WASM }

    // Act + Expect
    expect(await testSubject(id, options)).to.be.instanceof(Uint8Array)
  })

  it('should return source code as string', async () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['data:application/javascript;base64,SGVsbG8sIFdvcmxkIQ=='],
      ['data:text/javascript,console.log("hello!");'],
      ['https://deno.land/std@0.171.0/types.d.ts'],
      [import.meta.url]
    ]

    // Act + Expect
    for (const [id, options = {}] of cases) {
      if ((id as string).startsWith('http')) {
        options.experimental_network_imports = true
      }

      expect(await testSubject(id, options)).to.be.a('string')
    }
  })

  describe('unknown protocol', () => {
    let id: string

    beforeEach(() => {
      id = 'git://github.com/flex-development/mlly.git'
    })

    it('should return source code as empty string', async () => {
      expect(await testSubject(id, { ignore_errors: true })).to.equal('')
    })

    it('should throw if module url has unknown protocol', async () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_UNSUPPORTED_ESM_URL_SCHEME
      const cases: Parameters<typeof testSubject>[] = [
        ['http://deno.land/std@0.171.0/version.ts'],
        [id, { experimental_network_imports: true }]
      ]

      // Act + Expect
      for (const [id, options] of cases) {
        let error: NodeError

        try {
          await testSubject(id, options)
        } catch (e: unknown) {
          error = e as typeof error
        }

        expect(error!).to.not.be.undefined
        expect(error!).to.have.property('code').equal(code)
      }
    })
  })
})
