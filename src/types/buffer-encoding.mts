/**
 * @file Type Aliases - BufferEncoding
 * @module mlly/types/BufferEncoding
 */

import type { BufferEncodingMap } from '@flex-development/mlly'

/**
 * Union of values that can occur where a buffer encoding is expected.
 *
 * To register new encodings, augment {@linkcode BufferEncodingMap}.
 * They will be added to this union automatically.
 */
type BufferEncoding = BufferEncodingMap[keyof BufferEncodingMap]

export type { BufferEncoding as default }
