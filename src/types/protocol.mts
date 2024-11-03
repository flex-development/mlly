/**
 * @file Type Aliases - Protocol
 * @module mlly/types/Protocol
 */

import type { ProtocolMap } from '@flex-development/mlly'

/**
 * Union of values that can occur where a URL protocol is expected.
 *
 * To register new protocols, augment {@linkcode ProtocolMap}. They will be
 * added to this union automatically.
 */
type Protocol = ProtocolMap[keyof ProtocolMap]

export type { Protocol as default }
