/**
 * @file Enums - SyntaxKind
 * @module mlly/enums/SyntaxKind
 */

/**
 * CommonJS and ESM statement syntax kinds.
 *
 * @enum {Lowercase<string>}
 */
enum SyntaxKind {
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

export default SyntaxKind
