/**
 * @file Unit Tests - resolveModule
 * @module mlly/utils/tests/unit/resolveModule
 */

import type { ResolveOptions as Options } from '#src/interfaces'
import type { ErrnoException } from 'import-meta-resolve'
import { fileURLToPath, pathToFileURL } from 'node:url'
import testSubject from '../resolve-module'

describe('unit:utils/resolveModule', () => {
  describe('resolve', () => {
    it('should resolve data url', async () => {
      // Arrange
      const specifier = 'data:text/javascript,console.log("hello!")'

      // Act + Expect
      expect(await testSubject(specifier)).to.equal(specifier)
    })

    it('should resolve file url', async () => {
      // Arrange
      const specifier = pathToFileURL('src/utils/to-absolute-specifier.ts').href

      // Act + Expect
      expect(await testSubject(specifier)).to.equal(specifier)
    })

    it('should resolve file url as directory index w/o /index*', async () => {
      // Arrange
      const specifier = pathToFileURL('src/utils')
      const expected = specifier.href + '/index.ts'

      // Act + Expect
      expect(await testSubject(specifier.href)).to.equal(expected)
    })

    it('should resolve file url w/o extension', async () => {
      // Arrange
      const specifier = pathToFileURL('src/utils/to-bare-specifier')

      // Act + Expect
      expect(await testSubject(specifier.href)).to.equal(specifier.href + '.ts')
    })

    it('should resolve http url', async () => {
      // Arrange
      const specifier = 'http://example.com/foo.mjs'

      // Act + Expect
      expect(await testSubject(specifier)).to.equal(specifier)
    })

    it('should resolve https url', async () => {
      // Arrange
      const specifier = 'https://example.com/foo.mjs'

      // Act + Expect
      expect(await testSubject(specifier)).to.equal(specifier)
    })

    it('should resolve node builtin w/o node protocol', async () => {
      expect(await testSubject('os')).to.equal('node:os')
    })

    it('should resolve node url', async () => {
      expect(await testSubject('node:module')).to.equal('node:module')
    })

    it('should resolve module', async () => {
      // Arrange
      const expected = pathToFileURL('src/index.ts').href

      // Act + Expect
      expect(await testSubject('../index.ts')).to.equal(expected)
    })

    it('should resolve module as directory index w/o /index*', async () => {
      // Arrange
      const expected = pathToFileURL('src/interfaces/index.ts').href

      // Act + Expect
      expect(await testSubject('../interfaces')).to.equal(expected)
    })

    it('should resolve module w/o extension', async () => {
      // Arrange
      const expected = pathToFileURL('src/utils/to-relative-specifier.ts').href

      // Act + Expect
      expect(await testSubject('./to-relative-specifier')).to.equal(expected)
    })

    it('should throw if intolerable error is encountered', async () => {
      // Arrange
      let error: ErrnoException

      // Act
      try {
        await testSubject('#app/interfaces')
      } catch (e: unknown) {
        error = e as ErrnoException
      }

      // Expect
      expect(error!).to.be.instanceof(Error)
    })

    it('should throw if module could not be resolved', async () => {
      // Arrange
      let error: ErrnoException

      // Act
      try {
        await testSubject('../resolve-module', { extensions: [] })
      } catch (e: unknown) {
        error = e as ErrnoException
      }

      // Expect
      expect(error!).to.be.instanceof(Error)
    })
  })

  describe('type', () => {
    it('should return bare specifier', async () => {
      // Arrange
      const specifier = '@flex-development/tutils'
      const options: Options = {
        parent: fileURLToPath(import.meta.url),
        type: 'bare'
      }

      // Act + Expect
      expect(await testSubject(specifier, options)).to.equal(specifier)
    })

    it('should return relative specifier', async () => {
      // Arrange
      const options: Options = { type: 'relative' }
      const specifier = './resolve-alias.ts'

      // Act + Expect
      expect(await testSubject(specifier, options)).to.equal(specifier)
    })

    it('should return relative specifier with replaced extension', async () => {
      // Arrange
      const options: Options = { ext: '.mjs', type: () => 'relative' }
      const specifier = './to-absolute-specifier.ts'
      const expected = './to-absolute-specifier' + options.ext

      // Act + Expect
      expect(await testSubject(specifier, options)).to.equal(expected)
    })

    it('should return relative specifier w/o /index*', async () => {
      // Arrange
      const specifier = './types/index.ts'
      const options: Options = {
        ext: () => '',
        parent: pathToFileURL('src/index.ts'),
        type: () => 'relative'
      }

      // Act + Expect
      expect(await testSubject(specifier, options)).to.equal('./types')
    })

    it('should return relative specifier w/o extension', async () => {
      // Arrange
      const options: Options = { ext: false, type: 'relative' }
      const specifier = './to-bare-specifier.ts'
      const expected = specifier.slice(0, -3)

      // Act + Expect
      expect(await testSubject(specifier, options)).to.equal(expected)
    })
  })
})
