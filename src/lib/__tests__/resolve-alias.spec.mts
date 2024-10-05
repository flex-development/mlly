/**
 * @file Unit Tests - resolveAlias
 * @module mlly/lib/tests/unit/resolveAlias
 */

import testSubject from '#lib/resolve-alias'

describe('unit:lib/resolveAlias', () => {
  it.each<Parameters<typeof testSubject>>([
    ['#tests/utils/to-package-url', { aliases: { '#tests/*': [] } }],
    ['@app']
  ])('should return `null` if path alias match is not found (%#)', (
    specifier,
    options
  ) => {
    expect(testSubject(specifier, options)).to.be.null
  })

  it.each<Parameters<typeof testSubject>>([
    ['#lib', { aliases: { '#lib': ['src/lib/index'] } }],
    ['#lib/resolve-alias', {
      aliases: { '#lib/*': ['src/lib/*.mts'] },
      parent: import.meta.url
    }],
    ['#tests/reporters/notifier.mts', {
      absolute: true,
      aliases: { '#tests/*': ['__tests__/*'] }
    }],
    ['#tests/utils/to-package-url', {
      aliases: { '#tests/*': ['__tests__/*'] }
    }]
  ])('should return specifier of aliased module (%j)', (specifier, options) => {
    // Act
    const result = testSubject(specifier, options)

    // Expect
    expect(result).to.be.a('string')
    expect(result).toMatchSnapshot()
  })
})
