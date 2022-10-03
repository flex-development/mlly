/**
 * @file Test Environment Interfaces - Spy
 * @module tests/interfaces/Spy
 */

import type { SpyInstance } from 'vitest'

/**
 * {@link SpyInstance} utility.
 *
 * @template Fn - Function being spied on
 *
 * @extends {SpyInstance<Parameters<Fn>, ReturnType<Fn>>}
 */
interface Spy<Fn extends (...args: any) => any = (...args: any) => any>
  extends SpyInstance<Parameters<Fn>, ReturnType<Fn>> {}

export { type Spy as default }
