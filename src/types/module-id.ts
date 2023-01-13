/**
 * @file Type Definitions - ModuleId
 * @module mlly/types/ModuleId
 */

import type { URL } from 'node:url'

/**
 * ECMAScript (ES) module identifier.
 *
 * @see {@linkcode URL}
 */
type ModuleId = URL | string

export type { ModuleId as default }
