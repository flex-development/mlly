/**
 * @file Test Environment Interfaces - Spy
 * @module tests/interfaces/Spy
 */

import type { Fn } from '@flex-development/tutils'
import type * as vitest from 'vitest'

/**
 * {@linkcode vitest.SpyInstance} utility.
 *
 * @template F - Function being spied on
 *
 * @extends {Fn<Parameters<F>,ReturnType<F>>}
 * @extends {vitest.SpyInstance<Parameters<F>,ReturnType<F>>}
 */
interface Spy<F extends Fn = Fn>
  extends Fn<Parameters<F>, ReturnType<F>>,
    vitest.SpyInstance<Parameters<F>, ReturnType<F>> {}

export type { Spy as default }
