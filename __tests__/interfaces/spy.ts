/**
 * @file Test Interfaces - Spy
 * @module tests/interfaces/Spy
 */

import type { Fn } from '@flex-development/tutils'
import type * as vitest from 'vitest'

/**
 * {@linkcode vitest.SpyInstance} utility.
 *
 * @template F - Function being spied on
 *
 * @extends {vitest.SpyInstance<Parameters<F>,ReturnType<F>>}
 */
interface Spy<F extends Fn = Fn>
  extends vitest.SpyInstance<Parameters<F>, ReturnType<F>> {}

export type { Spy as default }
