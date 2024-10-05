/**
 * @file Unit Tests - resolveModule
 * @module mlly/lib/tests/unit/resolveModule
 */

import fixtureConditions from '#fixtures/conditions'
import parent from '#fixtures/parent'
import testSubject from '#lib/resolve-module'
import legacyMain1 from '#node_modules/legacy-main-1/package.json'
import legacyMain2 from '#node_modules/legacy-main-2/package.json'
import { isNodeError, type NodeError } from '@flex-development/errnode'
import errnode from '@flex-development/errnode/package.json'
import pkg from '@flex-development/mlly/package.json'

describe('unit:lib/resolveModule', () => {
  it.each<Parameters<typeof testSubject>>([
    ['#internal/fs', import.meta.url, { conditions: fixtureConditions }],
    ['../../../src', import.meta.url],
    ['../../lib', import.meta.url, { ext: () => 'mjs' }],
    ['../resolve-module', import.meta.url, { ext: 'mjs' }],
    ['@types/unist', import.meta.url],
    ['data:text/javascript,', import.meta.url],
    ['fs', import.meta.url],
    ['https://esm.sh/' + pkg.name, import.meta.url],
    ['node:fs/promises', import.meta.url],
    ['unist', import.meta.url],
    [errnode.name, import.meta.url],
    [legacyMain1.name, parent],
    [legacyMain2.name, parent],
    [pkg.name + '/package.json', import.meta.url]
  ])('should return resolved URL (%j)', (specifier, parent, options) => {
    // Act
    const result = testSubject(specifier, parent, options)

    // Expect
    expect(result).to.be.instanceof(URL)
    expect(result).toMatchSnapshot()
  })

  it.each<Parameters<typeof testSubject>>([
    ['#app', import.meta.url],
    ['../../src', import.meta.url]
  ])('should throw if `specifier` cannot be resolved (%#)', (
    specifier,
    parent,
    options
  ) => {
    // Arrange
    let error!: NodeError

    // Act
    try {
      testSubject(specifier, parent, options)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.satisfy(isNodeError)
  })
})
