# \:gear: mlly

[![github release](https://img.shields.io/github/v/release/flex-development/mlly.svg?include_prereleases\&sort=semver)](https://github.com/flex-development/mlly/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/mlly.svg)](https://npmjs.com/package/@flex-development/mlly)
[![codecov](https://codecov.io/gh/flex-development/mlly/graph/badge.svg?token=36NUNRH6FW)](https://codecov.io/gh/flex-development/mlly)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/mlly.svg)](LICENSE.md)
[![conventional commits](https://img.shields.io/badge/-conventional%20commits-fe5196?logo=conventional-commits\&logoColor=ffffff)](https://conventionalcommits.org)
[![typescript](https://img.shields.io/badge/-typescript-3178c6?logo=typescript\&logoColor=ffffff)](https://typescriptlang.org)
[![vitest](https://img.shields.io/badge/-vitest-6e9f18?style=flat\&logo=vitest\&logoColor=ffffff)](https://vitest.dev)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat\&logo=yarn\&logoColor=ffffff)](https://yarnpkg.com)

[ECMAScript module][node-esm] utilities.

## Contents

- [What is this?](#what-is-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`canParseUrl(input[, base])`](#canparseurlinput-base)
  - [`cwd()`](#cwd)
  - [`defaultConditions`](#defaultconditions)
  - [`defaultExtensions`](#defaultextensions)
  - [`defaultMainFields`](#defaultmainfields)
  - [`extensionFormatMap`](#extensionformatmap)
  - [`formats`](#formats)
  - [`getSource<T>(id[, options])`](#getsourcetid-options)
  - [`isAbsoluteSpecifier(value)`](#isabsolutespecifiervalue)
  - [`isArrayIndex(value)`](#isarrayindexvalue)
  - [`isBareSpecifier(value)`](#isbarespecifiervalue)
  - [`isDirectory<T>(id[, fs])`](#isdirectorytid-fs)
  - [`isFile<T>(id[, fs])`](#isfiletid-fs)
  - [`isImportsSubpath(value)`](#isimportssubpathvalue)
  - [`isModuleId(value)`](#ismoduleidvalue)
  - [`isRelativeSpecifier(value)`](#isrelativespecifiervalue)
  - [`legacyMainResolve<T>(packageUrl[, manifest][, mainFields][, parent][, fs])`](#legacymainresolvetpackageurl-manifest-mainfields-parent-fs)
  - [`lookupPackageScope<T>(url[, end][, fs])`](#lookuppackagescopeturl-end-fs)
  - [`moduleResolve<T>(specifier, parent[, conditions][, mainFields][, preserveSymlinks][, fs])`](#moduleresolvetspecifier-parent-conditions-mainfields-preservesymlinks-fs)
  - [`packageExportsResolve<T>(packageUrl, subpath, exports[, conditions][, parent][, fs])`](#packageexportsresolvetpackageurl-subpath-exports-conditions-parent-fs)
  - [`packageImportsExportsResolve<T>(matchKey, matchObject, packageUrl[, isImports][, conditions][, mainFields][, parent][, fs])`](#packageimportsexportsresolvetmatchkey-matchobject-packageurl-isimports-conditions-mainfields-parent-fs)
  - [`packageImportsResolve<T>(specifier, parent[, conditions][, mainFields][, fs])`](#packageimportsresolvetspecifier-parent-conditions-mainfields-fs)
  - [`packageResolve<T>(specifier, parent[, conditions][, mainFields][, fs])`](#packageresolvetspecifier-parent-conditions-mainfields-fs)
  - [`packageSelfResolve<T>(name, subpath, parent[, conditions][, fs])`](#packageselfresolvetname-subpath-parent-conditions-fs)
  - [`packageTargetResolve<T>(packageUrl, target, subpath[, patternMatch][, isImports][, conditions][, mainFields][, parent][, fs])`](#packagetargetresolvetpackageurl-target-subpath-patternmatch-isimports-conditions-mainfields-parent-fs)
  - [`patternKeyCompare(a, b)`](#patternkeycomparea-b)
  - [`patternMatch(matchKey, matchObject)`](#patternmatchmatchkey-matchobject)
  - [`readPackageJson<T>(id[, specifier][, parent][, fs])`](#readpackagejsontid-specifier-parent-fs)
  - [`resolveAlias(specifier[, options])`](#resolvealiasspecifier-options)
  - [`resolveModule<T>(specifier, parent[, options])`](#resolvemoduletspecifier-parent-options)
  - [`resolver`](#resolver)
  - [`root`](#root)
  - [`toRelativeSpecifier(url, parent)`](#torelativespecifierurl-parent)
  - [`toUrl(id[, parent])`](#tourlid-parent)
- [Types](#types)
  - [`Aliases`](#aliases)
  - [`Awaitable<T>`](#awaitablet)
  - [`ChangeExtFn`](#changeextfnext)
  - [`EmptyArray`](#emptyarray)
  - [`EmptyObject`](#emptyobject)
  - [`EmptyString`](#emptystring)
  - [`FileSystem`](#filesystem)
  - [`GetSourceContext`](#getsourcecontext)
  - [`GetSourceHandler`](#getsourcehandler)
  - [`GetSourceHandlers`](#getsourcehandlers)
  - [`GetSourceOptions`](#getsourceoptions)
  - [`List<[T]>`](#listt)
  - [`MainFieldMap`](#mainfieldmap)
  - [`MainField`](#mainfield)
  - [`ModuleFormatMap`](#moduleformatmap)
  - [`ModuleFormat`](#moduleformat)
  - [`ModuleId`](#moduleid)
  - [`Numeric`](#numeric)
  - [`PatternKeyComparisonMap`](#patternkeycomparsionmap)
  - [`PatternKeyComparison`](#patternkeycomparsion)
  - [`PatternMatch`](#patternmatch)
  - [`ProtocolMap`](#protocolmap)
  - [`Protocol`](#protocol)
  - [`ResolveAliasOptions`](#resolvealiasoptions)
  - [`ResolveModuleOptions`](#resolvemoduleoptions)
  - [`Stats`](#stats)
- [Contribute](#contribute)

## What is this?

`mlly` is a set of [ECMAScript module][node-esm] (ESM) utilities.\
It exposes several tools to bridge the gap between developer experience and the current state of ECMAScript modules.

## Install

This package is [ESM only][esm].

In Node.js (version 18+) with [yarn][]:

```sh
yarn add @flex-development/mlly
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { resolveModule } from 'https://esm.sh/@flex-development/mlly'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { resolveModule } from 'https://esm.sh/@flex-development/mlly'
</script>
```

## Use

**TODO**: use

## API

**TODO**: api

### `canParseUrl(input[, base])`

**TODO**: `canParseUrl`

### `cwd()`

**TODO**: `cwd`

### `defaultConditions`

**TODO**: `defaultConditions`

### `defaultExtensions`

**TODO**: `defaultExtensions`

### `defaultMainFields`

**TODO**: `defaultMainFields`

### `extensionFormatMap`

**TODO**: `extensionFormatMap`

### `formats`

**TODO**: `formats`

### `getSource<T>(id[, options])`

**TODO**: `getSource`

### `isAbsoluteSpecifier(value)`

**TODO**: `isAbsoluteSpecifier`

### `isArrayIndex(value)`

**TODO**: `isArrayIndex`

### `isBareSpecifier(value)`

**TODO**: `isBareSpecifier`

### `isDirectory<T>(id[, fs])`

**TODO**: `isDirectory`

### `isFile<T>(id[, fs])`

**TODO**: `isFile`

### `isImportsSubpath(value)`

**TODO**: `isImportsSubpath`

### `isModuleId(value)`

**TODO**: `isModuleId`

### `isRelativeSpecifier(value)`

**TODO**: `isRelativeSpecifier`

<!--lint disable-->

### `legacyMainResolve<T>(packageUrl[, manifest][, mainFields][, parent][, fs])`

<!--lint enable-->

**TODO**: `legacyMainResolve`

### `lookupPackageScope<T>(url[, end][, fs])`

**TODO**: `lookupPackageScope`

<!--lint disable-->

### `moduleResolve<T>(specifier, parent[, conditions][, mainFields][, preserveSymlinks][, fs])`

<!--lint enable-->

**TODO**: `moduleResolve`

<!--lint disable-->

### `packageExportsResolve<T>(packageUrl, subpath, exports[, conditions][, parent][, fs])`

<!--lint enable-->

**TODO**: `packageExportsResolve`

<!--lint disable-->

### `packageImportsExportsResolve<T>(matchKey, matchObject, packageUrl[, isImports][, conditions][, mainFields][, parent][, fs])`

<!--lint enable-->

**TODO**: `packageImportsExportsResolve`

<!--lint disable-->

### `packageImportsResolve<T>(specifier, parent[, conditions][, mainFields][, fs])`

<!--lint enable-->

**TODO**: `packageImportsResolve`

<!--lint disable-->

### `packageResolve<T>(specifier, parent[, conditions][, mainFields][, fs])`

<!--lint enable-->

**TODO**: `packageResolve`

<!--lint disable-->

### `packageSelfResolve<T>(name, subpath, parent[, conditions][, fs])`

<!--lint enable-->

**TODO**: `packageSelfResolve`

<!--lint disable-->

### `packageTargetResolve<T>(packageUrl, target, subpath[, patternMatch][, isImports][, conditions][, mainFields][, parent][, fs])`

<!--lint enable-->

**TODO**: `packageTargetResolve`

### `patternKeyCompare(a, b)`

**TODO**: `patternKeyCompare`

### `patternMatch(matchKey, matchObject)`

**TODO**: `patternMatch`

### `readPackageJson<T>(id[, specifier][, parent][, fs])`

**TODO**: `readPackageJson`

### `resolveAlias(specifier[, options])`

**TODO**: `resolveAlias`

### `resolveModule<T>(specifier, parent[, options])`

**TODO**: `resolveModule`

### `resolver`

An object containing resolution algorithm implementations.

- [`legacyMainResolve`](#legacymainresolvetpackageurl-manifest-mainfields-parent-fs)
- [`moduleResolve`](#moduleresolvetspecifier-parent-conditions-mainfields-preservesymlinks-fs)
- [`packageExportsResolve`](#packageexportsresolvetpackageurl-subpath-exports-conditions-parent-fs)
- [`packageImportsExportsResolve`](#packageimportsexportsresolvetmatchkey-matchobject-packageurl-isimports-conditions-mainfields-parent-fs)
- [`packageImportsResolve`](#packageimportsresolvetspecifier-parent-conditions-mainfields-fs)
- [`packageResolve`](#packageresolvetspecifier-parent-conditions-mainfields-fs)
- [`packageSelfResolve`](#packageselfresolvetname-subpath-parent-conditions-fs)
- [`packageTargetResolve`](#packagetargetresolvetpackageurl-target-subpath-patternmatch-isimports-conditions-mainfields-parent-fs)

### `root`

**TODO**: `root`

### `toRelativeSpecifier(url, parent)`

**TODO**: `toRelativeSpecifier`

### `toUrl(id[, parent])`

**TODO**: `toUrl`

## Types

This package is fully typed with [TypeScript][].

### `Aliases`

**TODO**: `Aliases`

### `Awaitable<T>`

**TODO**: `Awaitable<T>`

### `ChangeExtFn<[Ext]>`

**TODO**: `ChangeExtFn<[Ext]>`

### `EmptyArray`

**TODO**: `EmptyArray`

### `EmptyObject`

**TODO**: `EmptyObject`

### `EmptyString`

**TODO**: `EmptyString`

### `FileSystem`

**TODO**: `FileSystem`

### `GetSourceContext`

**TODO**: `GetSourceContext`

### `GetSourceHandler`

**TODO**: `GetSourceHandler`

### `GetSourceHandlers`

**TODO**: `GetSourceHandlers`

### `GetSourceOptions`

**TODO**: `GetSourceOptions`

### `List<[T]>`

**TODO**: `List<[T]>`

### `MainFieldMap`

**TODO**: `MainFieldMap`

### `MainField`

**TODO**: `MainField`

### `ModuleFormatMap`

**TODO**: `ModuleFormatMap`

### `ModuleFormat`

**TODO**: `ModuleFormat`

### `ModuleId`

**TODO**: `ModuleId`

### `Numeric`

**TODO**: `Numeric`

### `PatternKeyComparsionMap`

**TODO**: `PatternKeyComparsionMap`

### `PatternKeyComparsion`

**TODO**: `PatternKeyComparsion`

### `PatternMatch`

**TODO**: `PatternMatch`

### `ProtocolMap`

**TODO**: `ProtocolMap`

### `Protocol`

**TODO**: `Protocol`

### `ResolveAliasOptions`

**TODO**: `ResolveAliasOptions`

### `ResolveModuleOptions`

**TODO**: `ResolveModuleOptions`

### `Stats`

**TODO**: `Stats`

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

This project has a [code of conduct](./CODE_OF_CONDUCT.md). By interacting with this repository, organization, or
community you agree to abide by its terms.

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[node-esm]: https://nodejs.org/api/esm.html

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
