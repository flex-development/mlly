/**
 * @file Unit Tests - findDynamicImports
 * @module mlly/lib/tests/findDynamicImports/unit
 */

import dedent from 'ts-dedent'
import testSubject from '../find-dynamic-imports'

describe('unit:lib/findDynamicImports', () => {
  it('should find dynamic import', () => {
    // Act
    const results = testSubject('await import("bar")')

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find dynamic import with dynamic specifier', () => {
    // Act
    const results = testSubject('await import(bar)')

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find dynamic import declaration', () => {
    // Act
    const results = testSubject('const foo = await import("./bar")')

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find dynamic import declaration with dynamic specifier', () => {
    // Act
    const results = testSubject('const foo = await import(./bar)')

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find dynamic import declaration without await', () => {
    // Act
    const results = testSubject('const promise = import("./foo")')

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find named dynamic imports in multi-line statement', () => {
    // Arrange
    const code = dedent`
      const {
        addFive,
        addFour,
        addThree,
        addTwo,
        squareFive,
        squareFour,
        squareThree,
        squareTwo
      } = await import('./lib')
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find named dynamic imports in single-line statement', () => {
    // Arrange
    const code = 'const { foo, bar } = await import("foobar")'

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find transpiled dynamic import', () => {
    // Arrange
    const code = dedent`
      await import('buzz').then(() => console.log(res)).catch(() => ({}))
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should ignore dynamic import in multi-line comment', () => {
    // Arrange
    const code = dedent`
      /**
       * @example
       *  const { readPackage } = await import('read-pkg')
       */
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(0)
  })

  it('should ignore dynamic import in single-line comment', () => {
    expect(testSubject('// await import("foo")')).to.be.an('array').of.length(0)
  })
})
