/**
 * @file Test Interfaces - Mock
 * @module tests/interfaces/Mock
 */

import type { Fn } from '@flex-development/tutils'
import type * as vitest from 'vitest'

/**
 * {@linkcode vitest.Mock} utility.
 *
 * @template F - Function being mocked
 *
 * @extends {vitest.Mock<Parameters<F>,ReturnType<F>>}
 */
interface Mock<F extends Fn = Fn>
  extends vitest.Mock<Parameters<F>, ReturnType<F>> {}

export type { Mock as default }
