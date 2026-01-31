/**
 * @file Type Aliases - ModuleFormat
 * @module mlly/types/ModuleFormat
 */

import type { ModuleFormatMap } from '@flex-development/mlly'

/**
 * Union of values that can occur where a module format is expected.
 *
 * To register new formats, augment {@linkcode ModuleFormatMap}.
 * They will be added to this union automatically.
 */
type ModuleFormat = ModuleFormatMap[keyof ModuleFormatMap]

export type { ModuleFormat as default }
