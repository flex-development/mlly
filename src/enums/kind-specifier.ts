/**
 * @file Enums - SpecifierKind
 * @module mlly/enums/SpecifierKind
 */

/**
 * Module specifier types.
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @enum {Lowercase<string>}
 */
enum SpecifierKind {
  ABSOLUTE = 'absolute',
  BARE = 'bare',
  RELATIVE = 'relative'
}

export default SpecifierKind
