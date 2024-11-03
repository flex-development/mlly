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
  blob: 'blob:'
  content: 'content:'
  cvs: 'cvs:'
  data: 'data:'
  dns: 'dns:'
  file: 'file:'
  fish: 'fish:'
  ftp: 'ftp:'
  git: 'git:'
  http: 'http:'
  https: 'https:'
  mvn: 'mvn:'
  node: 'node:'
  redis: 'redis:'
  sftp: 'sftp:'
  ssh: 'ssh:'
  svn: 'svn:'
  urn: 'urn:'
  viewSource: 'view-source:'
  ws: 'ws:'
  wss: 'wss:'
}

export type { ProtocolMap as default }
