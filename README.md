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
  - [`ConditionMap`](#conditionmap)
  - [`Condition`](#condition)
  - [`EmptyArray`](#emptyarray)
  - [`EmptyObject`](#emptyobject)
  - [`EmptyString`](#emptystring)
  - [`FileSystem`](#filesystem)
  - [`GetSourceContext`](#getsourcecontext)
  - [`GetSourceHandler`](#getsourcehandler)
  - [`GetSourceHandlers`](#getsourcehandlers)
  - [`GetSourceOptions`](#getsourceoptions)
  - [`IsDirectory`](#isdirectory)
  - [`IsFile`](#isfile)
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
  - [`ReadFile`](#readfile)
  - [`Realpath`](#realpath)
  - [`ResolveAliasOptions`](#resolvealiasoptions)
  - [`ResolveModuleOptions`](#resolvemoduleoptions)
  - [`Stat`](#stat)
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

Record, where each key is a path alias or pattern and each value is a path mapping configuration (interface).

```ts
interface Aliases {
  [alias: string]: (string | null | undefined)[] | string | null | undefined
}
```

When developing extensions that use additional aliases, augment `Aliases` to register custom aliases:

```ts
declare module '@flex-development/mlly' {
  interface Aliases {
    custom?: string[] | string | null
  }
}
```

### `Awaitable<T>`

Create a union of `T` and `T` as a promise-like object (type).

```ts
type Awaitable<T> = PromiseLike<T> | T
```

#### Type Parameters

- `T` (`any`)
  - the value

### `ChangeExtFn<[Ext]>`

Get a new file extension for `url` (type).

Returning an empty string (`''`), `null`, or `undefined` will remove the current file extension.

```ts
type ChangeExtFn<
  Ext extends string | null | undefined = string | null | undefined
> = (this: void, url: URL, specifier: string) => Ext
```

#### Type Parameters

- `Ext` (`string` | `null` | `undefined`, optional)
  — the new file extension

#### Parameters

- `url` (`URL`)
  — the resolved module URL
- `specifier` (`string`)
  — the module specifier being resolved

#### Returns

(`Ext`) The new file extension

### `ConditionMap`

Registry of export/import conditions (interface).

When developing extensions that use additional conditions, augment `ConditionMap` to register custom conditions:

```ts
declare module '@flex-development/mlly' {
  interface ConditionMap {
    custom: 'custom'
  }
}
```

### `Condition`

Union of values that can occur where a export/import condition is expected (type).

To register new conditions, augment [`ConditionMap`](#conditionmap).
They will be added to this union automatically.

```ts
type Condition = ConditionMap[keyof ConditionMap]
```

### `EmptyArray`

An empty array (type).

```ts
type EmptyArray = []
```

### `EmptyObject`

An empty object (type).

```ts
type EmptyObject = { [tag]?: never }
```

### `EmptyString`

An empty string (type).

```ts
type EmptyString = ''
```

### `FileSystem`

The file system API (interface).

#### Properties

- `readFile` ([`ReadFile`](#readfile))
  — read the entire contents of a file
- `realpath` ([`Realpath`](#realpath))
  — compute a canonical pathname by resolving `.`, `..`, and symbolic links
- `stat` ([`Stat`](#stat))
  — get information about a directory or file

### `GetSourceContext`

Source code retrieval context (interface).

#### Extends

- [`GetSourceOptions`](#getsourceoptions)

#### Properties

- `fs` ([`FileSystem`](#filesystem))
  — the file system api
- `handlers` ([`GetSourceHandlers`](#getsourcehandlers))
  — record, where each key is a url protocol and each value is a source code handler
- `req` (`RequestInit`)
  — request options for network based modules
- `schemes` (`Set<string>`)
  — the list of supported url schemes

### `GetSourceHandler`

Get the source code for a module (type).

```ts
type GetSourceHandler = (
  this: GetSourceContext,
  url: URL
) => Awaitable<Uint8Array | string | null | undefined>
```

#### Parameters

- **`this`** ([`GetSourceContext`](#getsourcecontext))
  — the retrieval context
- `url` (`URL`)
  — the module URL

#### Returns

([`Awaitable<Uint8Array | string | null | undefined>`](#awaitablet)) The source code

### `GetSourceHandlers`

Record, where key is a URL protocol and each value is a source code handler (type).

```ts
type GetSourceHandlers = {
  [H in Protocol]?: GetSourceHandler | null | undefined
}
```

### `GetSourceOptions`

Options for retrieving source code (interface).

#### Properties

- `format?` ([`ModuleFormat`](#moduleformat) | `null` | `undefined`)
  — the module format hint
- `fs?` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api
- `handlers?` ([`GetSourceHandlers`](#getsourcehandlers) | `null` | `undefined`)
  — record, where each key is a url protocol and each value is a source code handler
- `ignoreErrors?` (`boolean` | `null` | `undefined`)
  — whether to ignore [`ERR_UNSUPPORTED_ESM_URL_SCHEME`][err-unsupported-esm-url-scheme] if thrown
- `req?` (`RequestInit` | `null` | `undefined`)
  — request options for network based modules
- `schemes?` ([`List<string>`](#listt) | `null` | `undefined`)
  — the list of supported url schemes
  - **default**: `['data', 'file', 'http', 'https', 'node']`

### `IsDirectory`

Check if a stats object describes a directory (interface).

#### Returns

(`boolean`) `true` if stats describes directory, `false` otherwise

### `IsFile`

Check if a stats object describes a file (interface).

#### Returns

(`boolean`) `true` if stats describes regular file, `false` otherwise

### `List<[T]>`

A list (type).

```ts
type List<T = unknown> = ReadonlySet<T> | readonly T[]
```

#### Type Parameters

- `T` (`any`, optional)
  — list item type

### `MainFieldMap`

Registry of main fields (interface).

When developing extensions that use additional fields, augment `MainFieldMap` to register custom fields:

```ts
declare module '@flex-development/mlly' {
  interface MainFieldMap {
    unpkg: 'unpkg'
  }
}
```

### `MainField`

Union of values that can occur where a main field is expected (type).

To register new main fields, augment [`MainFieldMap`](#mainfieldmap).
They will be added to this union automatically.

```ts
type MainField = MainFieldMap[keyof MainFieldMap]
```

### `ModuleFormatMap`

Registry of module formats (interface).

When developing extensions that use additional formats, augment `ModuleFormatMap` to register custom formats:

```ts
declare module '@flex-development/mlly' {
  interface ModuleFormatMap {
    custom: 'custom'
  }
}
```

### `ModuleFormat`

Union of values that can occur where a module format is expected (type).

To register new main formats, augment [`ModuleFormatMap`](#moduleformatmap).
They will be added to this union automatically.

```ts
type ModuleFormat = ModuleFormatMap[keyof ModuleFormatMap]
```

### `ModuleId`

Union of values that can occur where a ECMAScript (ES) module identifier is expected (type).

```ts
type ModuleId = URL | string
```

### `Numeric`

A string that can be parsed to a valid number (type).

```ts
type Numeric = `${number}`
```

### `PatternKeyComparsionMap`

Registry of `PATTERN_KEY_COMPARE` algorithm results (interface).

When developing extensions that use additional results, augment `PatternKeyComparsionMap` to register custom results:

```ts
declare module '@flex-development/mlly' {
  interface PatternKeyComparsionMap {
    afterThree: 3
  }
}
```

### `PatternKeyComparsion`

Union of values that can occur where a `PATTERN_KEY_COMPARE` algorithm result is expected (type).

To register new results, augment [`PatternKeyComparisonMap`](#patternkeycomparsionmap).
They will be added to this union automatically.

```ts
type PatternKeyComparison =
  PatternKeyComparisonMap[keyof PatternKeyComparisonMap]
```

### `PatternMatch`

List, where the first item is the key of a package `exports` or `imports` target object,
and the last is a subpath pattern match (type).

```ts
type PatternMatch = [expansionKey: string, patternMatch: string | null]
```

### `ProtocolMap`

Registry of URL protocols (interface).

When developing extensions that use additional protocols, augment `ProtocolMap` to register custom protocols:

```ts
declare module '@flex-development/mlly' {
  interface ProtocolMap {
    custom: 'custom:'
  }
}
```

### `Protocol`

Union of values that can occur where a URL protocol is expected (type).

To register new results, augment [`ProtocolMap`](#protocolmap).
They will be added to this union automatically.

```ts
type Protocol = ProtocolMap[keyof ProtocolMap]
```

### `ReadFile`

Read the entire contents of a file (interface).

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id

#### Returns

([`Awaitable<Buffer | string>`](#awaitablet)) The file contents

### `Realpath`

Compute a canonical pathname by resolving `.`, `..`, and symbolic links (interface).

> 👉 **Note**: A canonical pathname is not necessarily unique.
> Hard links and bind mounts can expose an entity through many pathnames.

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id

#### Returns

([`Awaitable<string>`](#awaitablet)) The canonical pathname

### `ResolveAliasOptions`

Options for path alias resolution (interface).

#### Properties

- `absolute?` (`boolean` | `null` | `undefined`)
  — whether the resolved specifier should be absolute.\
  if `true`, the resolved specifier will be a [`file:` URL][file-url]
- `aliases?` ([`Aliases`](#aliases) | `null` | `undefined`)
  — the path mappings dictionary
  > 👉 **note**: paths should be relative to `cwd`
- `cwd?` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the directory to resolve non-absolute modules from
  - **default**: [`cwd()`](#cwd)
- `parent?` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the parent module

### `ResolveModuleOptions`

Options for path alias resolution (interface).

#### Properties

- `aliases?` ([`Aliases`](#aliases) | `null` | `undefined`)
  — the path mappings dictionary
  > 👉 **note**: paths should be relative to `cwd`
- `conditions?` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export/import conditions
  - **default**: [`defaultConditions`](#defaultconditions)
  > 👉 **note**: should be sorted by priority
- `cwd?` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the directory to resolve path `aliases` from
  - **default**: [`cwd()`](#cwd)
- `ext?` ([`ChangeExtFn`](#changeextfnext) | `string` | `null` | `undefined`)
  — a replacement file extension or a function that returns a file extension.
  > 👉 **note**: an empty string (`''`) or `null` will remove a file extension
- `extensions?` ([`List<string>`](#listt) | `null` | `undefined`)
  — the module extensions to probe for
  - **default**: [`defaultExtensions`](#defaultextensions)
  > 👉 **note**: should be sorted by priority
- `fs?` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api
- `mainFields?` ([`List<MainField>`](#mainfield) | `null` | `undefined`)
  — the list of legacy `main` fields
  - **default**: [`defaultMainFields`](#defaultmainfields)
  > 👉 **note**: should be sorted by priority
- `preserveSymlinks?` (`boolean` | `null` | `undefined`)
  — whether to keep symlinks instead of resolving them

### `Stat`

Get information about a directory or file (interface).

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id

#### Returns

([`Awaitable<Stats>`](#stats)) The info

### `Stats`

An object describing a directory or file (interface).

#### Properties

- `isDirectory` ([`IsDirectory`](#isdirectory))
  — check if the stats object describes a directory
- `isFile` ([`IsFile`](#isfile))
  — check if the stats object describes a file

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

This project has a [code of conduct](./CODE_OF_CONDUCT.md). By interacting with this repository, organization, or
community you agree to abide by its terms.

[err-unsupported-esm-url-scheme]: https://nodejs.org/api/errors.html#err_unsupported_esm_url_scheme

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[file-url]: https://nodejs.org/api/esm.html#file-urls

[node-esm]: https://nodejs.org/api/esm.html

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
