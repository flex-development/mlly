/**
 * @file Unit Tests - getSource
 * @module mlly/utils/tests/unit/getSource
 */

import { Format } from '#src/enums'
import type { GetSourceOptions } from '#src/interfaces'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import { cast } from '@flex-development/tutils'
import testSubject from '../get-source'

describe('unit:utils/getSource', () => {
  it('should return source code as Uint8Array', async () => {
    // Arrange
    const id: string = '__fixtures__/node_modules/wasm/add.wasm'
    const options: GetSourceOptions = { format: Format.WASM }

    // Act + Expect
    expect(await testSubject(id, options)).to.be.instanceof(Uint8Array)
  })

  it('should return source code as string', async () => {
    // Arrange
    const cases: [string, GetSourceOptions?][] = [
      ['data:application/javascript;base64,SGVsbG8sIFdvcmxkIQ=='],
      ['data:text/javascript,console.log("hello!");'],
      ['https://deno.land/std@0.171.0/types.d.ts'],
      [import.meta.url]
    ]

    // Act + Expect
    for (const [id, options = {}] of cases) {
      if (id.startsWith('http')) options.experimental_network_imports = true

      expect(await testSubject(id, options)).to.be.a('string')
    }
  })

  it('should return source code as undefined', async () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['fs', { format: Format.BUILTIN }],
      ['node:fs']
    ]

    // Act + Expect
    for (const [id, options] of cases) {
      expect(await testSubject(id, options)).to.be.undefined
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
        let error!: NodeError

        try {
          await testSubject(id, options)
        } catch (e: unknown) {
          error = cast(e)
        }

        expect(error).to.not.be.undefined
        expect(error).to.have.property('code', code)
      }
    })
  })
})
