/**
 * @file Test Utilities - fsCaseType
 * @module tests/utils/fsCaseType
 */

/**
 * Union of file system test case types.
 */
type FileSystemCaseType = 'default' | 'only async'

/**
 * File system case types.
 *
 * @enum {FileSystemCaseType}
 */
const enum fsCaseType {
  default = 'default',
  onlyAsync = 'only async'
}

export { fsCaseType as default, type FileSystemCaseType }
