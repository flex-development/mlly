/**
 * @file Unit Tests - toBareSpecifier
 * @module mlly/lib/tests/toBareSpecifier/unit
 */

import type { Spy } from '#tests/interfaces'
import regexp from 'escape-string-regexp'
import type { ErrnoException } from 'import-meta-resolve'
import { parseModuleId } from 'node-package-exports'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { readPackageUp } from 'read-pkg-up'
import testSubject from '../to-bare-specifier'

vi.mock('node-package-exports')
vi.mock('read-pkg-up')

describe('unit:lib/toBareSpecifier', () => {
  const errno: string = 'ERR_INVALID_PACKAGE_CONFIG'

  it('should exit early if specifier is node builtin', async () => {
    // Act
    await testSubject('node:url')

    // Expect
    expect(readPackageUp).toHaveBeenCalledTimes(0)
    expect(parseModuleId).toHaveBeenCalledTimes(0)
  })

  it('should return pkg name w/o scope if @types is detected', async () => {
    expect(await testSubject('node_modules/@types/chai')).to.equal('chai')
  })

  it(`should throw ${errno} if package.json is not found`, async () => {
    // Arrange
    const specifier = 'foo-package/utils'
    const pattern = `- package.json not found while importing '${specifier}'`
    let error: ErrnoException

    // Act
    try {
      ;(readPackageUp as unknown as Spy).mockReturnValueOnce(undefined)
      await testSubject(specifier)
    } catch (e: unknown) {
      error = e as ErrnoException
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!.code).to.equal(errno)
    expect(error!.message).to.match(new RegExp(regexp(pattern)))
  })

  describe('exports', () => {
    const errno: string = 'ERR_PACKAGE_PATH_NOT_EXPORTED'

    it('should return pkg name if specifier is exports', async () => {
      // Arrange
      const specifier = pathToFileURL('node_modules/colorette/index.js')

      // Act
      const result = await testSubject(specifier)

      // Expect
      expect(result).to.equal('colorette')
    })

    it('should return pkg name if specifier is exports w/o ext', async () => {
      // Arrange
      const specifier = 'node_modules/@flex-development/mkbuild/dist/index'

      // Act
      const result = await testSubject(specifier)

      // Expect
      expect(result).to.equal('@flex-development/mkbuild')
    })

    it('should return pkg name if specifier is pkg name', async () => {
      // Act
      const result = await testSubject('node_modules/@flex-development/tutils')

      // Expect
      expect(result).to.equal('@flex-development/tutils')
    })

    it('should return specifier as bare specifier', async () => {
      // Arrange
      const specifier = 'node_modules/@flex-development/mkbuild/dist/make'

      // Act
      const result = await testSubject(path.resolve(specifier))

      // Expect
      expect(result).to.equal('@flex-development/mkbuild/make')
    })

    it(`should throw ${errno} if subpath export is not found`, async () => {
      // Arrange
      const specifier = 'node_modules/@flex-development/mkbuild/dist/cli.mjs'
      let error: ErrnoException

      // Act
      try {
        await testSubject(specifier)
      } catch (e: unknown) {
        error = e as ErrnoException
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!.code).to.equal(errno)
    })
  })

  describe('no exports', () => {
    it('should return pkg name if specifier is main', async () => {
      // Arrange
      const specifier = pathToFileURL('node_modules/esbuild/lib/main.js')

      // Act
      const result = await testSubject(specifier)

      // Expect
      expect(result).to.equal('esbuild')
    })

    it('should return pkg name if specifier is main w/o ext', async () => {
      // Arrange
      const specifier = '@cspotcode/source-map-support/source-map-support'

      // Act
      const result = await testSubject(path.join('node_modules', specifier))

      // Expect
      expect(result).to.equal('@cspotcode/source-map-support')
    })

    it('should return pkg name if specifier is pkg name', async () => {
      // Act
      const result = await testSubject('node_modules/comment-json')

      // Expect
      expect(result).to.equal('comment-json')
    })

    it('should return specifier as bare specifier', async () => {
      // Arrange
      const specifier = 'tsconfig-paths/lib/tsconfig-loader'

      // Act
      const result = await testSubject(path.resolve('node_modules', specifier))

      // Expect
      expect(result).to.equal(specifier)
    })
  })
})
