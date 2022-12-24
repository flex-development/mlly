/**
 * @file Functional Tests - extractStatements
 * @module mlly/lib/tests/extractStatements/functional
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

describe('functional:lib/extractStatements', () => {
  it('should exit early if no code to evaluate', () => {
    // Act
    const results = testSubject(' ')

    // Expect
    expect(results).to.be.an('array').of.length(0)
    expect(findDynamicImports).toHaveBeenCalledTimes(0)
    expect(findExports).toHaveBeenCalledTimes(0)
    expect(findRequires).toHaveBeenCalledTimes(0)
    expect(findStaticImports).toHaveBeenCalledTimes(0)
  })

  it('should extract statements from code', () => {
    // Arrange
    const code = fs.readFileSync('src/lib/extract-statements.ts', 'utf8')

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').that.is.not.empty
    expect(findDynamicImports).toHaveBeenCalledOnce()
    expect(findExports).toHaveBeenCalledOnce()
    expect(findRequires).toHaveBeenCalledOnce()
    expect(findStaticImports).toHaveBeenCalledOnce()
  })
})
