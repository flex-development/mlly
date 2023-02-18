/**
 * @file Unit Tests - resolveAlias
 * @module mlly/utils/tests/unit/resolveAlias
 */

import type { MapLike } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import testSubject from '../resolve-alias'

describe('unit:utils/resolveAlias', () => {
  let aliases: MapLike<string[]>

  beforeAll(() => {
    aliases = {
      '#mkbuild': ['node_modules/@flex-development/mkbuild'],
      '#mkbuild/*': ['node_modules/@flex-development/mkbuild/*'],
      '#src': ['src/index.ts'],
      '#src/*': ['src/*'],
      '@flex-development/mkbuild/*': [
        'node_modules/@flex-development/mkbuild/dist/*'
      ],
      '@flex-development/pkg-types': [
        'node_modules/@flex-development/pkg-types/dist'
      ]
    }
  })

  it('should return new specifier if path alias was resolved', async () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, string][] = [
      ['#mkbuild', { absolute: false }, '@flex-development/mkbuild'],
      ['#src', undefined, pathToFileURL('src/index.ts').href],
      ['#src', { absolute: false }, '../../index.ts'],
      ['#src/index', undefined, pathToFileURL('src/index.ts').href],
      [
        '#src/internal/validate-boolean',
        { parent: pathToFileURL('src/utils/resolve-alias.ts') },
        pathToFileURL('src/internal/validate-boolean.ts').href
      ],
      [
        '#src/internal/validate-set',
        {
          absolute: false,
          parent: pathToFileURL('src/utils/resolve-alias.ts')
        },
        '../internal/validate-set.ts'
      ],
      [
        '#src/types',
        { parent: pathToFileURL('src/utils/to-bare-specifier.ts') },
        pathToFileURL('src/types/index.ts').href
      ],
      [
        '@flex-development/mkbuild/plugins/dts/plugin',
        undefined,
        pathToFileURL(
          'node_modules/@flex-development/mkbuild/dist/plugins/dts/plugin.mjs'
        ).href
      ],
      [
        '@flex-development/pkg-types',
        { parent: pathToFileURL('src/utils/validate-exports.ts') },
        pathToFileURL(
          'node_modules/@flex-development/pkg-types/dist/index.d.mts'
        ).href
      ]
    ]

    // Act + Expect
    for (const [specifier, options = {}, expected] of cases) {
      options.aliases = aliases
      if (options.parent === undefined) options.parent = import.meta.url

      expect(await testSubject(specifier, options)).to.equal(expected)
    }
  })

  it('should return specifier if path alias was not resolved', async () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['#src/internal/validate-boolean'],
      ['#src/internal/validate-string.mjs', { aliases }]
    ]

    // Act + Expect
    for (const [specifier, options = {}] of cases) {
      if (options.parent === undefined) options.parent = import.meta.url

      expect(await testSubject(specifier, options)).to.equal(specifier)
    }
  })
})
