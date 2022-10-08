/**
 * @file Library
 * @module mlly/lib
 */

export { default as detectSyntax } from './detect-syntax'
export { default as extractStatements } from './extract-statements'
export { default as findDynamicImports } from './find-dynamic-imports'
export { default as findExports } from './find-exports'
export { default as findRequires } from './find-requires'
export { default as findStaticImports } from './find-static-imports'
export { default as hasCJSSyntax } from './has-cjs-syntax'
export { default as hasESMSyntax } from './has-esm-syntax'
export { default as isBuiltin } from './is-builtin'
export { default as resolveAlias } from './resolve-alias'
export { default as resolveAliases } from './resolve-aliases'
export { default as toAbsoluteSpecifier } from './to-absolute-specifier'
export { default as toRelativeSpecifier } from './to-relative-specifier'
