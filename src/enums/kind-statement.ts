/**
 * @file Enums - StatementKind
 * @module mlly/enums/StatementKind
 */

/**
 * CommonJS and ESM statement kinds.
 *
 * @enum {Lowercase<string>}
 */
enum StatementKind {
  EXPORT = 'export',
  IMPORT = 'import',
  REQUIRE = 'require'
}

export default StatementKind
