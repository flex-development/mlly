/**
 * @file Unit Tests - hasCJSSyntax
 * @module mlly/utils/tests/unit/hasCJSSyntax
 */

import aggregate_error_ponyfill from '#fixtures/aggregate-error-ponyfill.cjs'
import { dedent } from 'ts-dedent'
import testSubject from '../has-cjs-syntax'

describe('unit:utils/hasCJSSyntax', () => {
  describe('__dirname', () => {
    it('should detect __dirname', () => {
      // Arrange
      const code = dedent`
        const piscina = new Piscina({
          filename: path.resolve(__dirname, 'worker.js')
        })
      `

      // Act + Expect
      expect(testSubject(code)).to.be.true
    })

    it('should ignore __dirname in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  const piscina = new Piscina({
         *    filename: path.resolve(__dirname, 'worker.js')
         *  })
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore __dirname in single-line comment', () => {
      expect(testSubject('// path.resolve(__dirname, "worker.js")')).to.be.false
    })
  })

  describe('__filename', () => {
    it('should detect __filename', () => {
      expect(testSubject('path.dirname(__filename)')).to.be.true
    })

    it('should ignore __filename in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  run({ root: path.dirname(__filename) })
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore __filename in single-line comment', () => {
      expect(testSubject('// path.dirname(__filename)')).to.be.false
    })
  })

  describe('await import', () => {
    it('should detect await import', () => {
      expect(testSubject('await import("read-pkg")')).to.be.true
    })

    it('should ignore await import in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  await import('read-pkg')
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore await import in single-line comment', () => {
      expect(testSubject('// await import("read-pkg")')).to.be.false
    })
  })

  describe('exports', () => {
    it('should detect default export', () => {
      expect(testSubject('exports = {}')).to.be.true
    })

    it('should detect named export', () => {
      expect(testSubject('exports.bar = 2')).to.be.true
    })

    it('should ignore default export in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  \`\`\`js
         *    exports = {}
         *  \`\`\`
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore default export in single-line comment', () => {
      expect(testSubject('// exports = {}')).to.be.false
    })

    it('should ignore named export in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  \`\`\`js
         *    exports.bar = 2
         *  \`\`\`
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore named export in single-line comment', () => {
      expect(testSubject('// exports.bar = 2')).to.be.false
    })
  })

  describe('module.exports', () => {
    it('should detect default export', () => {
      expect(testSubject('module.exports = { foo: 1 }')).to.be.true
    })

    it('should detect named export', () => {
      expect(testSubject('module.exports.bar = 3')).to.be.true
    })

    it('should ignore default export in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  \`\`\`js
         *    module.exports = { foo: 1 }
         *  \`\`\`
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore default export in single-line comment', () => {
      expect(testSubject('// module.exports = { foo: 1 }')).to.be.false
    })

    it('should ignore named export in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  \`\`\`js
         *    module.exports.bar = 3
         *  \`\`\`
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore named export in single-line comment', () => {
      expect(testSubject('// module.exports.bar = 3')).to.be.false
    })
  })

  describe('require', () => {
    it('should detect require statement', () => {
      expect(testSubject(aggregate_error_ponyfill)).to.be.true
    })

    it('should detect require.resolve statement', () => {
      expect(testSubject('require.resolve("ts-loader")')).to.be.true
    })

    it('should ignore require statement in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  require('fs')
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore require statement in single-line comment', () => {
      expect(testSubject('// require("path")')).to.be.false
    })

    it('should ignore require.resolve statement in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  { test: /\.([cm]?ts|tsx)$/, loader: require.resolve("ts-loader") }
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.false
    })

    it('should ignore require.resolve statement in single-line comment', () => {
      expect(testSubject('// require.resolve("ts-loader")')).to.be.false
    })
  })
})
