/**
 * @file Unit Tests - toAbsoluteSpecifier
 * @module mlly/utils/tests/unit/toAbsoluteSpecifier
 */

import { URL, pathToFileURL } from 'node:url'
import testSubject from '../to-absolute-specifier'

describe('unit:utils/toAbsoluteSpecifier', () => {
  let cwd: URL
  let specifier: string
  let specifier_url: URL

  beforeEach(() => {
    cwd = pathToFileURL(process.cwd())
    specifier = 'src/utils/to-absolute-specifier.ts'
    specifier_url = new URL(specifier, cwd.href + '/')
  })

  it('should return absolute specifier if cwd is file url', () => {
    expect(testSubject(specifier, cwd)).to.equal(specifier_url.href)
  })

  it('should return absolute specifier if cwd is string', () => {
    expect(testSubject(specifier)).to.equal(specifier_url.href)
  })

  it('should return absolute specifier if specifier is file url', () => {
    expect(testSubject(specifier_url)).to.equal(specifier_url.href)
  })

  it('should return absolute specifier if specifier is string', () => {
    expect(testSubject(specifier)).to.equal(specifier_url.href)
  })
})
