/**
 * @file Unit Tests - findRequires
 * @module mlly/lib/tests/findRequires/unit
 */

import dedent from 'ts-dedent'
import testSubject from '../find-requires'

describe('unit:lib/findRequires', () => {
  describe('require', () => {
    it('should find require', () => {
      // Act
      const results = testSubject('require("./lib")')

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should find require declaration', () => {
      // Act
      const results = testSubject('const lib = require("./lib")')

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should find require with named imports', () => {
      // Act
      const results = testSubject('const { addFive } = require("./lib")')

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should find require with named imports in multi-line statement', () => {
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
        } = require('./lib')
      `

      // Act
      const results = testSubject(code)

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should ignore require in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  require('foo')
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.an('array').of.length(0)
    })

    it('should ignore require in single-line comment', () => {
      expect(testSubject('// require("foo")')).to.be.an('array').of.length(0)
    })
  })

  describe('require.resolve', () => {
    it('should find require.resolve', () => {
      // Act
      const results = testSubject('require.resolve("tsconfig-loader")')

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should find require.resolve declaration', () => {
      // Arrange
      const code = 'const loader = require.resolve("tsconfig-loader")'

      // Act
      const results = testSubject(code)

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should ignore require.resolve in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  require.resolve('tsconfig-loader')
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.an('array').of.length(0)
    })

    it('should ignore require.resolve in single-line comment', () => {
      // Arrange
      const code = '// require.resolve("tsconfig-loader")'

      // Act + Expect
      expect(testSubject(code)).to.be.an('array').of.length(0)
    })
  })
})
