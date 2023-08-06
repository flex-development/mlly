/**
 * @file Functional Tests - extractStatements
 * @module mlly/utils/tests/functional/extractStatements
 */

import fs from 'node:fs'
import testSubject from '../extract-statements'
import findDynamicImports from '../find-dynamic-imports'
import findExports from '../find-exports'
import findRequires from '../find-requires'
import findStaticImports from '../find-static-imports'

vi.mock('../find-dynamic-imports')
vi.mock('../find-exports')
vi.mock('../find-requires')
vi.mock('../find-static-imports')

describe('functional:utils/extractStatements', () => {
  it('should exit early if no code to evaluate', () => {
    // Act
    const result = testSubject(' ')

    // Expect
    expect(result).to.be.an('array').of.length(0)
    expect(findDynamicImports).toHaveBeenCalledTimes(0)
    expect(findExports).toHaveBeenCalledTimes(0)
    expect(findRequires).toHaveBeenCalledTimes(0)
    expect(findStaticImports).toHaveBeenCalledTimes(0)
  })

  it('should extract statements from code', () => {
    // Arrange
    const code = fs.readFileSync('src/utils/extract-statements.ts', 'utf8')

    // Act
    const result = testSubject(code)

    // Expect
    expect(result).to.be.an('array').that.is.not.empty
    expect(findDynamicImports).toHaveBeenCalledOnce()
    expect(findExports).toHaveBeenCalledOnce()
    expect(findRequires).toHaveBeenCalledOnce()
    expect(findStaticImports).toHaveBeenCalledOnce()
  })
})
