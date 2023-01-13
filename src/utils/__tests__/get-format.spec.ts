/**
 * @file Unit Tests - getFormat
 * @module mlly/utils/tests/unit/getFormat
 */

import { Format } from '#src/enums'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import type { Nilable } from '@flex-development/tutils'
import testSubject from '../get-format'

describe('unit:utils/getFormat', () => {
  it('should return null if id has unknown protocol', async () => {
    // Arrange
    const id: string = 'git://github.com/flex-development/mlly.git'

    // Act + Expect
    expect(await testSubject(id)).to.be.null
  })

  describe('data urls', () => {
    it('should return Nilable<Format> based on mime type', async () => {
      // Arrange
      const experimental_wasm_modules: boolean = true
      const cases: [...Parameters<typeof testSubject>, Nilable<Format>?][] = [
        ['data:,Hello%2C%20World%21', undefined, null],
        ['data:,Hello%2C%20World%21', { ignore_errors: true }],
        ['data:application/javascript,', undefined, Format.MODULE],
        ['data:application/json,', undefined, Format.JSON],
        ['data:application/json,', { experimental_json_modules: false }, null],
        ['data:application/wasm,', { experimental_wasm_modules }, Format.WASM],
        ['data:application/wasm,', { experimental_wasm_modules: false }, null],
        ['data:text/javascript,', {}, Format.MODULE],
        ['data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==', undefined, null]
      ]

      // Act + Expect
      for (const [id, options, expected] of cases) {
        expect(await testSubject(id, options)).to.equal(expected)
      }
    })
  })

  describe('file urls', () => {
    it('should return Nilable<Format> based on file extension', async () => {
      // Arrange
      const experimental_json_modules: boolean = false
      const ignore_errors: boolean = true
      const cases: [...Parameters<typeof testSubject>, Nilable<Format>?][] = [
        ['file.json', { experimental_json_modules }, null],
        ['file.json', { experimental_json_modules, ignore_errors }],
        ['file.wasm', undefined, null],
        ['file.wasm', { ignore_errors }],
        [import.meta.url, undefined, Format.MODULE],
        [import.meta.url.slice(0, -3), { ignore_errors }]
      ]

      // Act + Expect
      for (const [id, options, expected] of cases) {
        expect(await testSubject(id, options)).to.equal(expected)
      }
    })

    it('should return Nilable<Format> based on package type', async () => {
      // Arrange
      const cases: [...Parameters<typeof testSubject>, Nilable<Format>?][] = [
        ['node_modules/yaml/index.js', undefined, Format.COMMONJS],
        [
          'node_modules/@flex-development/mkbuild/node_modules/pretty-bytes/index.js',
          undefined,
          Format.MODULE
        ]
      ]

      // Act + Expect
      for (const [id, options, expected] of cases) {
        expect(await testSubject(id, options)).to.equal(expected)
      }
    })

    it('should throw if file extension is unknown', async () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_UNKNOWN_FILE_EXTENSION
      const message_regex: RegExp =
        /Loading extensionless files is not supported inside of "type":"module" package.json contexts. The package.json file \S+ caused this "type":"module" context. Try changing \S+ to have a file extension. Note the "bin" field of package.json can point to a file with an extension, for example {"type":"module","bin":{"\S+":"\S+\.js"}}$/
      let error: NodeError<TypeError>

      // Act
      try {
        await testSubject('src/utils/get-format')
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(message_regex)
    })
  })

  describe('node urls', () => {
    it('should return Format if module is builtin module', async () => {
      expect(await testSubject('node:os')).to.equal(Format.BUILTIN)
    })

    it('should return null if module is not builtin module', async () => {
      expect(await testSubject('node:foo')).to.be.null
    })
  })

  describe('remote urls', () => {
    it('should return Nilable<Format> based on content-type', async () => {
      // Arrange
      const id: string = 'https://deno.land/std@0.171.0/types.d.ts'
      const cases: [...Parameters<typeof testSubject>, Nilable<Format>?][] = [
        [id, undefined, null],
        [id.replace('s:', ':'), { ignore_errors: true }],
        [id, { experimental_network_imports: true }, Format.MODULE]
      ]

      // Act + Expect
      for (const [id, options, expected] of cases) {
        expect(await testSubject(id, options)).to.equal(expected)
      }
    })
  })
})
