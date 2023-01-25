/**
 * @file Enums - StatementSyntaxKind
 * @module mlly/enums/StatementSyntaxKind
 */

/**
 * CommonJS and ESM statement syntax kinds.
 *
 * @enum {Lowercase<string>}
 */
enum StatementSyntaxKind {
  DECLARATION = 'declaration',
  DEFAULT = 'default',
  DEFAULT_WITH_NAMED = 'default-with-named',
  DEFAULT_WITH_NAMESPACE = 'default-with-namespace',
  DYNAMIC = 'dynamic',
  LIST = 'list',
  NAMED = 'named',
  NAMESPACE = 'namespace',
  REQUIRE = 'require',
  SIDE_EFFECT = 'side-effect'
}

export default StatementSyntaxKind
