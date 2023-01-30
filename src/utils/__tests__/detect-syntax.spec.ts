/**
 * @file Unit Tests - detectSyntax
 * @module mlly/utils/tests/unit/detectSyntax
 */

import aggregate_error_ponyfill from '#fixtures/aggregate-error-ponyfill.cjs'
import { dedent } from 'ts-dedent'
import testSubject from '../detect-syntax'

describe('unit:utils/detectSyntax', () => {
  it('should return cjs-only syntax result', () => {
    expect(testSubject(aggregate_error_ponyfill)).deep.equal({
      cjs: true,
      esm: false,
      mixed: false
    })
  })

  it('should return esm-only syntax result', () => {
    expect(testSubject('export const addTwo = num => num + 2')).deep.equal({
      cjs: false,
      esm: true,
      mixed: false
    })
  })

  it('should return mixed syntax result', () => {
    // Arrange
    const code = dedent`
      import { dirname } from '@flex-development/pathe'
      import { fileURLToPath } from 'node:url'

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = dirname(__filename)
    `

    // Act + Expect
    expect(testSubject(code)).deep.equal({ cjs: true, esm: true, mixed: true })
  })
})
