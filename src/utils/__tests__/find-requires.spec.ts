/**
 * @file Unit Tests - findRequires
 * @module mlly/utils/tests/unit/findRequires
 */

import { dedent } from 'ts-dedent'
import testSubject from '../find-requires'

describe('unit:utils/findRequires', () => {
  it('should return RequireStatement object array', () => {
    // Arrange
    const code: string = dedent`
      require('./side-effect.cjs');const mod=require('./lib');
      const{createPathMatch}=require('tsconfig-paths');
      const mod = require('lib');
      require(id)
      require('#src/utils/resolve-aliases')
      const {
        default: myDefault,
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
    expect(results).to.be.an('array').of.length(7)
    expect(results).toMatchSnapshot()
  })

  describe('comments', () => {
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
})
