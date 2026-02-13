/**
 * @file Type Aliases - ExtensionRewrites
 * @module mlly/types/ExtensionRewrites
 */

import type { EmptyString, Ext } from '@flex-development/mlly'

/**
 * Record, where each key is the file extension of a module specifier and
 * each value is a replacement file extension.
 *
 * > 👉 **Note**: Replacement file extensions are normalized and do not need to
 * > begin with a dot character (`'.'`); falsy values will remove an extension.
 *
 * @see {@linkcode EmptyString}
 * @see {@linkcode Ext}
 */
type ExtensionRewrites = {
  [K in EmptyString | Ext]?: string | false | null | undefined
}

export type { ExtensionRewrites as default }
