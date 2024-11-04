/**
 * @file Unit Tests - toUrl
 * @module mlly/lib/tests/unit/toUrl
 */

import cwd from '#lib/cwd'
import testSubject from '#lib/to-url'
import pathe from '@flex-development/pathe'

describe('unit:lib/toUrl', () => {
  it.each<Parameters<typeof testSubject>>([
    ['os'],
    ['path', cwd()],
    [import.meta.url],
    [new URL('node:test')],
    [pathe.resolve('tsconfig.build.json')]
  ])('should return `id` as `URL` (%#)', (id, parent) => {
    expect(testSubject(id, parent)).toMatchSnapshot()
  })
})
