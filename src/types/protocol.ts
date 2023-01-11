/**
 * @file Type Definitions - Protocol
 * @module mlly/types/Protocol
 */

import type { LiteralUnion } from '@flex-development/tutils'

/**
 * URL protocols.
 *
 * @see https://nodejs.org/api/url.html#urlprotocol
 * @see https://iana.org/assignments/uri-schemes/uri-schemes.xhtml
 * @see https://url.spec.whatwg.org/#special-scheme
 */
type Protocol = LiteralUnion<
  `${
    | 'blob'
    | 'content'
    | 'cvs'
    | 'data'
    | 'dns'
    | 'file'
    | 'fish'
    | 'ftp'
    | 'git'
    | 'http'
    | 'https'
    | 'mvn'
    | 'redis'
    | 'sftp'
    | 'ssh'
    | 'svn'
    | 'urn'
    | 'view-source'
    | 'ws'
    | 'wss'}:`,
  `${string}:`
>

export type { Protocol as default }
