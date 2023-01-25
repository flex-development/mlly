/**
 * @file Enums - SpecifierKind
 * @module mlly/enums/SpecifierKind
 */

/**
 * Types of module specifiers.
 *
 * @enum {Lowercase<string>}
 */
enum SpecifierKind {
  ABSOLUTE = 'absolute',
  BARE = 'bare',
  RELATIVE = 'relative'
}

export default SpecifierKind
