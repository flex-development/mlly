/**
 * @file Unit Tests - parseSubpath
 * @module mlly/utils/tests/unit/parseSubpath
 */

import type { ParseSubpathOptions, ParsedSubpath } from '#src/interfaces'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import type { Exports, Imports, PackageJson } from '@flex-development/pkg-types'
import fs from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import testSubject from '../parse-subpath'

describe('unit:utils/parseSubpath', () => {
  type Expected = Omit<ParsedSubpath, 'internal' | 'specifier'>

  let options: ParseSubpathOptions
  let pkgjson: PackageJson & { name: string }

  beforeEach(async () => {
    options = { dir: pathToFileURL('./'), parent: import.meta.url }
    pkgjson = JSON.parse(await fs.readFile('package.json', 'utf8'))
  })

  it('should return package import as ParsedSubpath object', () => {
    // Arrange
    const cases: [Parameters<typeof testSubject>[0], Expected][] = [
      [
        '#src',
        {
          base: '',
          key: '#src',
          raw: '#src'
        }
      ],
      [
        '#src/utils',
        {
          base: 'utils',
          key: '#src/*',
          raw: '#src/utils'
        }
      ],
      [
        '#src/utils/parse-subpath',
        {
          base: 'utils/parse-subpath',
          key: '#src/*',
          raw: '#src/utils/parse-subpath'
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, expected]) => {
      expect(testSubject(specifier, pkgjson.imports, options)).to.deep.equal({
        ...expected,
        internal: true,
        specifier
      })
    })
  })

  it('should return package path as ParsedSubpath object', () => {
    // Arrange
    const cases: [string, Exports | Imports | undefined, Expected][] = [
      [pkgjson.name, pkgjson.exports, { base: '', key: '.', raw: '.' }],
      [pkgjson.name, './dist/index.mjs', { base: '', key: '.', raw: '.' }],
      [
        pkgjson.name + '/package.json',
        pkgjson.exports,
        {
          base: '',
          key: './package.json',
          raw: './package.json'
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, context, expected]) => {
      expect(testSubject(specifier, context, options)).to.deep.equal({
        ...expected,
        internal: false,
        specifier
      })
    })
  })

  describe('throws', () => {
    let message_regex: RegExp

    beforeEach(() => {
      message_regex = /\/package\.json/
    })

    it('should throw if package import is not defined', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_PACKAGE_IMPORT_NOT_DEFINED
      let error: NodeError<TypeError>

      // Act
      try {
        testSubject('#src', undefined, options)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(message_regex)
    })

    it('should throw if package path is not exported', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_PACKAGE_PATH_NOT_EXPORTED
      const specifier: string = `${pkgjson.name}/utils`
      let error: NodeError

      // Act
      try {
        testSubject(specifier, pkgjson.exports, options)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(message_regex)
    })
  })
})
