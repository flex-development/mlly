/**
 * @file Unit Tests - resolveModule
 * @module mlly/utils/tests/unit/resolveModule
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import { URL, pathToFileURL } from 'node:url'
import testSubject from '../resolve-module'

vi.mock('#src/utils/lookup-package-scope')

describe('unit:utils/resolveModule', () => {
  it('should return module URL', async () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, URL][] = [
      ['#src', undefined, pathToFileURL('src/index.ts')],
      ['#src/index', undefined, pathToFileURL('src/index.ts')],
      ['#src/interfaces', undefined, pathToFileURL('src/interfaces/index.ts')],
      ['#src/types/index', undefined, pathToFileURL('src/types/index.ts')],
      ['data:text/javascript,', undefined, new URL('data:text/javascript,')],
      ['fs', undefined, new URL('node:fs')],
      ['https://deno.land', undefined, new URL('https://deno.land')],
      ['node:fs/promises', undefined, new URL('node:fs/promises')],
      ['../../types', undefined, pathToFileURL('src/types/index.ts')],
      ['../conditions', undefined, pathToFileURL('src/utils/conditions.ts')],
      [
        '../lookup-package-scope',
        { ext: () => 'd.mts' },
        pathToFileURL('src/utils/lookup-package-scope.d.mts')
      ],
      [
        '../resolve-extensions',
        { ext: 'mjs' },
        pathToFileURL('src/utils/resolve-extensions.mjs')
      ],
      [
        './package.json',
        { parent: pathToFileURL('build.config.ts') },
        pathToFileURL('package.json')
      ],
      [import.meta.url, undefined, new URL(import.meta.url)]
    ]

    // Act + Expect
    for (const [specifier, options = {}, expected] of cases) {
      const result = await testSubject(specifier, {
        ...options,
        parent: options.parent ?? import.meta.url
      })

      expect(result).to.deep.equal(expected)
    }
  })

  it('should throw if intolerable error is encountered', async () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_PACKAGE_IMPORT_NOT_DEFINED
    let error: NodeError

    // Act
    try {
      await testSubject('#app')
    } catch (e: unknown) {
      error = e as NodeError
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('code').equal(code)
  })

  it('should throw if module was not resolved', async () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_MODULE_NOT_FOUND
    let error: NodeError

    // Act
    try {
      await testSubject('../resolve-module', {
        extensions: new Set(),
        parent: import.meta.url
      })
    } catch (e: unknown) {
      error = e as NodeError
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('code').equal(code)
  })
})
