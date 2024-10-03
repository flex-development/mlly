/**
 * @file Interfaces - ProtocolMap
 * @module mlly/interfaces/ProtocolMap
 */

/**
 * URL protocol registry.
 *
 * @see https://nodejs.org/api/url.html#urlprotocol
 * @see https://iana.org/assignments/uri-schemes/uri-schemes.xhtml
 * @see https://url.spec.whatwg.org/#special-scheme
 */
interface ProtocolMap {
  'blob:': true
  'content:': true
  'cvs:': true
  'data:': true
  'dns:': true
  'file:': true
  'fish:': true
  'ftp:': true
  'git:': true
  'http:': true
  'https:': true
  'mvn:': true
  'redis:': true
  'sftp:': true
  'ssh:': true
  'svn:': true
  'urn:': true
  'view-source:': true
  'ws:': true
  'wss:': true
}

export type { ProtocolMap as default }
