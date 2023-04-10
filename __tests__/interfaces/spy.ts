/**
 * @file Test Environment Interfaces - Spy
 * @module tests/interfaces/Spy
 */

import type { Fn } from '@flex-development/tutils'
import type { SpyInstance } from 'vitest'

/**
 * {@linkcode SpyInstance} utility.
 *
 * @template F - Function being spied on
 *
 * @extends {SpyInstance<Parameters<F>,ReturnType<F>>}
 */
interface Spy<F extends Fn = Fn>
  extends SpyInstance<Parameters<F>, ReturnType<F>> {}

export type { Spy as default }
