/**
 * @file Unit Tests - isDirectory
 * @module mlly/lib/tests/unit/isDirectory
 */

import cwd from '#lib/cwd'
import testSubject from '#lib/is-directory'
import type { ModuleId } from '@flex-development/mlly'
import { pathToFileURL } from '@flex-development/pathe'
import fs from 'node:fs'

describe('unit:lib/isDirectory', () => {
  it.each<ModuleId>([
    'directory',
    new URL('node:fs'),
    String(new URL('src/index.mts', cwd()))
  ])('should return `false` if `id` is not a directory (%#)', id => {
    expect(testSubject(id, fs)).to.be.false
  })

  it.each<ModuleId>([
    pathToFileURL('src'),
    String(cwd())
  ])('should return `true` if `id` is a directory (%#)', id => {
    expect(testSubject(id)).to.be.true
  })
})
