/**
 * @file Unit Tests - isFile
 * @module mlly/lib/tests/unit/isFile
 */

import cwd from '#lib/cwd'
import testSubject from '#lib/is-file'
import type { ModuleId } from '@flex-development/mlly'
import { pathToFileURL } from '@flex-development/pathe'
import fs from 'node:fs/promises'

describe('unit:lib/isFile', () => {
  it.each<ModuleId>([
    'file.mjs',
    new URL('node:fs'),
    String(cwd())
  ])('should return `false` if `id` is not a file (%#)', async id => {
    expect(await testSubject(id, fs)).to.be.false
  })

  it.each<ModuleId>([
    pathToFileURL('package.json'),
    String(new URL('vitest.config.mts', cwd()))
  ])('should return `true` if `id` is a file (%#)', async id => {
    expect(await testSubject(id)).to.be.true
  })
})
