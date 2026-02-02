# Resolution Algorithm

The algorithm to load an ES module specifier is given through the [`ESM_RESOLVE`][esm-resolve] method below.
It returns the resolved `URL` for a module specifier relative to a `parent` URL.

The resolution algorithm determines the full resolved URL for a module load, along with its suggested module format.
It does not determine whether the resolved URL protocol can be loaded, or whether file extensions are permitted, instead
these validations are applied during a load phase (for example, if it was asked to load a URL that has a protocol that
is not `file:`, `data:` or `node:`).

The algorithm also tries to determine the format of the file based on extension ([`ESM_FILE_FORMAT`][esm-file-format]).
If it does not recognize the file extension, then a format of `undefined` is returned, which will result in an error
during the load phase.

The algorithm to determine the module format of a resolved URL is provided by [`ESM_FILE_FORMAT`][esm-file-format],
which returns the unique module format for any file. The `module` format is returned for an ECMAScript Module, while the
`commonjs` format is used to indicate loading through a legacy CommonJS loader.

In the algorithms below, all subroutine errors are propagated as errors of top-level routines unless stated otherwise.

The resolver can throw the following errors:

- [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
  — module specifier is an invalid URL, package name or package subpath specifier
- [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
  — a `package.json` configuration is invalid or contains an invalid configuration
- [`ERR_INVALID_PACKAGE_TARGET`][err-invalid-package-target]
  — package exports or imports define a target module for the package that is an invalid type or string target
- [`ERR_MODULE_NOT_FOUND`][err-module-not-found]
  — the package or module requested does not exist
- [`ERR_PACKAGE_IMPORT_NOT_DEFINED`][err-package-import-not-defined]
  — package imports do not define the specifier
- [`ERR_PACKAGE_PATH_NOT_EXPORTED`][err-package-path-not-exported]
  — package exports do not define or permit a target subpath in the package for the given module
- [`ERR_UNSUPPORTED_DIR_IMPORT`][err-unsupported-dir-import]
  — the resolved specifier corresponds to a directory, which is not a supported target for module imports

## Contents

- [`DETECT_MODULE_SYNTAX`][detect-module-syntax]
- [`ESM_FILE_FORMAT`][esm-file-format]
- [`ESM_RESOLVE`][esm-resolve]
- [`LOOKUP_PACKAGE_SCOPE`][lookup-package-scope]
- [`PACKAGE_EXPORTS_RESOLVE`][package-exports-resolve]
- [`PACKAGE_IMPORTS_EXPORTS_RESOLVE`][package-imports-exports-resolve]
- [`PACKAGE_IMPORTS_RESOLVE`][package-imports-resolve]
- [`PACKAGE_RESOLVE`][package-resolve]
- [`PACKAGE_SELF_RESOLVE`][package-self-resolve]
- [`PACKAGE_TARGET_RESOLVE`][package-target-resolve]
- [`PATTERN_KEY_COMPARE`][pattern-key-compare]
- [`READ_PACKAGE_JSON`][read-package-json]

## `DETECT_MODULE_SYNTAX(source)`

1. Parse `source` as an ECMAScript module
2. If the parse is successful, then
   1. If `source` contains top-level `await`, static `import` or `export` statements, or `import.meta`, return `true`
   2. If `source` contains a top-level lexical declaration (`class`, `const`, or `let`) of any CommonJS wrapper
      variables (`__dirname`, `__filename`, `exports`, `module`, or `require`) then return `true`
3. Else return `false`

## `ESM_FILE_FORMAT(url, extensionFormatMap)`

1. ☝️ **Assert**: `url` corresponds to an existing file
2. Let *ext* be the result the file extension of `url`
3. If `extensionFormatMap` has the key *ext*,
   1. Let *format* be the result of `extensionFormatMap.get(ext)`
   2. If `--experimental-wasm-modules` is enabled and *ext* is `'.wasm'`,
      1. Return *format*
   3. Return *format*
4. Let *packageUrl* be the result of [`LOOKUP_PACKAGE_SCOPE(url)`][lookup-package-scope]
5. Let *pjson* be the result of [`READ_PACKAGE_JSON(packageUrl)`][read-package-json]
6. Let *packageType* be `null`
7. If *pjson?.type* is `'module'` or `'commonjs'`, then
   1. Set *packageType* to *pjson.type*
8. If `url` ends in `'.js'`, then
   1. If *packageType* is not `null`, then
      1. Return *packageType*.
   2. If the result of [`DETECT_MODULE_SYNTAX(source)`](#detect_module_syntaxsource) is `true`, then
      1. Return `'module'`
   3. Return `'commonjs'`
9. If `url` does not have any extension, then
   1. If *packageType* is `'module'` and `--experimental-wasm-modules` is enabled and the file at `url` contains the
      header for a WebAssembly module, then
      1. Return `'wasm'`
   2. If *packageType* is not `null`, then
      1. Return *packageType*
   3. If the result of [`DETECT_MODULE_SYNTAX(source)`](#detect_module_syntaxsource) is `true`, then
      1. Return `'module'`
   4. Return `'commonjs'`
10. Return `undefined` (will throw during load phase)

<!--lint disable-->

## `ESM_RESOLVE(specifier, parent, conditions, mainFields, preserveSymlinks, extensionFormatMap)`

<!--lint enable-->

1. Let *resolved* be `undefined`
2. If `specifier` is a valid URL, then
   1. Set *resolved* to the result of parsing and re-serializing `specifier` as a URL
3. Otherwise, if `specifier` starts with `'/'`, `'./'`, or `'../'`, then
   1. Set *resolved* to the URL resolution of `specifier` relative to `parent`
4. Otherwise, if `specifier` starts with `'#'`, then
   1. Set *resolved* to the result of
      [`PACKAGE_IMPORTS_RESOLVE(specifier, parent, conditions, mainFields`][package-imports-resolve]
5. Otherwise,
   1. 👉 **Note**: `specifier` is now a bare specifier
   2. Set *resolved* the result of [`PACKAGE_RESOLVE(specifier, parent, conditions, mainFields)`][package-resolve]
6. Let *format* be `undefined`
7. If *resolved* is a `file:` URL, then
   1. If *resolved* contains any percent encodings of `'/'` or `'\\'` (`'%2F'` and `'%5C'` respectively), then
      1. Throw [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
   2. If the file at *resolved* is a directory, then
      1. Throw [`ERR_UNSUPPORTED_DIR_IMPORT`][err-unsupported-dir-import]
   3. If the file at *resolved* does not exist, then
      1. Throw [`ERR_MODULE_NOT_FOUND`][err-module-not-found]
   4. Set *resolved* to the real path of *resolved*, maintaining the same URL querystring and fragment components
   5. Set *format* to the result of [`ESM_FILE_FORMAT(resolved, extensionFormatMap)`][esm-file-format]
8. Otherwise,
   1. Set *format* the module format of the content type associated with the URL *resolved*
9. Return *format* and *resolved* to the loading phase

## `LOOKUP_PACKAGE_SCOPE(url, end)`

1. Let *scopeUrl* be `url`
2. While *scopeUrl* is not `end`,
   1. Set *scopeUrl* to the parent URL of *scopeUrl*
   2. If *scopeUrl* ends in a `'node_modules'` path segment, return `null`
   3. Let *pjsonUrl* be the resolution of `'package.json'` within *scopeUrl*
   4. if the file at *pjsonUrl* exists, then
      1. Return *scopeUrl*
3. Return `null`

<!--lint disable-->

## `PACKAGE_EXPORTS_RESOLVE(packageUrl, subpath, exports, conditions, parent)`

<!--lint enable-->

**TODO**: `PACKAGE_EXPORTS_RESOLVE`

<!--lint disable-->

## `PACKAGE_IMPORTS_EXPORTS_RESOLVE(matchKey, matchObject, packageUrl, isImports, conditions, mainFields, parent)`

<!--lint enable-->

**TODO**: `PACKAGE_IMPORTS_EXPORTS_RESOLVE`

<!--lint disable-->

## `PACKAGE_IMPORTS_RESOLVE(specifier, parent, conditions, mainFields)`

<!--lint enable-->

**TODO**: `PACKAGE_IMPORTS_RESOLVE`

## `PACKAGE_RESOLVE(specifier, parent, conditions, mainFields)`

**TODO**: `PACKAGE_RESOLVE`

## `PACKAGE_SELF_RESOLVE(name, subpath, parent, conditions)`

1. Let *packageUrl* be the result of [`LOOKUP_PACKAGE_SCOPE(packageUrl)`][lookup-package-scope]
2. If *packageUrl* is `null`, then
   1. Return `undefined`
3. Let *pjson* be the result of [`READ_PACKAGE_JSON(packageUrl)`][read-package-json]
4. If *pjson* is `null` or if *pjson*.*exports* is `null` or `undefined`, then
   1. Return `undefined`
5. If *pjson*.*name* is equal to `name`, then
   1. Return the result of
      [`PACKAGE_EXPORTS_RESOLVE(packageUrl, subpath, pjson.exports, conditions)`][package-exports-resolve]
6. Otherwise, return `undefined`

<!--lint disable-->

## `PACKAGE_TARGET_RESOLVE(packageUrl, target, subpath, patternMatch, isImports, conditions, mainFields, parent)`

<!--lint enable-->

**TODO**: `PACKAGE_TARGET_RESOLVE`

## `PATTERN_KEY_COMPARE(a, b)`

1. ☝️ **Assert**: `a` contains only a single `'*'`
2. ☝️ **Assert**: `b` contains only a single `'*'`
3. Let *baseLengthA* be the index of `'*'` in `a`
4. Let *baseLengthB* be the index of `'*'` in `b`
5. If *baseLengthA* is greater than *baseLengthB*
   1. Return `-1`
6. If *baseLengthB* is greater than *baseLengthA*
   1. Return `1`
7. If the length of `a` is greater than the length of `b`
   1. Return `-1`
8. If the length of `b` is greater than the length of `a`
   1. Return `1`
9. Return `0`

## `READ_PACKAGE_JSON(id)`

1. Let *pjsonUrl* be the resolution of `'package.json'` within `id`
2. If the file at *pjsonUrl* does not exist, then
   1. Return `null`
3. If the file at *pjsonUrl* does not parse as valid JSON, then
   1. Throw [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
4. If the file at *pjsonUrl* does not parse to a JSON object, then
   1. Throw [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
5. Return the parsed JSON source of the file at *pjsonUrl*

[detect-module-syntax]: #detect_module_syntaxsource

[err-invalid-module-specifier]: https://nodejs.org/api/errors.html#err_invalid_module_specifier

[err-invalid-package-config]: https://nodejs.org/api/errors.html#err_invalid_package_config

[err-invalid-package-target]: https://nodejs.org/api/errors.html#err_invalid_package_target

[err-module-not-found]: https://nodejs.org/api/errors.html#err_module_not_found

[err-package-import-not-defined]: https://nodejs.org/api/errors.html#err_package_import_not_defined

[err-package-path-not-exported]: https://nodejs.org/api/errors.html#err_package_path_not_exported

[err-unsupported-dir-import]: https://nodejs.org/api/errors.html#err_unsupported_dir_import

[esm-file-format]: #esm_file_formaturl-extensionformatmap

[esm-resolve]: #esm_resolvespecifier-parent-conditions-mainfields-preservesymlinks-extensionformatmap

[lookup-package-scope]: #lookup_package_scopeurl-end

[package-exports-resolve]: #package_exports_resolvepackageurl-subpath-exports-conditions-parent

[package-imports-exports-resolve]: #package_imports_exports_resolvematchkey-matchobject-packageurl-isimports-conditions-mainfields-parent

[package-imports-resolve]: #package_imports_resolvespecifier-parent-conditions-mainfields

[package-resolve]: #package_resolvespecifier-parent-conditions-mainfields

[package-self-resolve]: #package_self_resolvename-subpath-parent-conditions

[package-target-resolve]: #package_target_resolvepackageurl-target-subpath-patternmatch-isimports-conditions-mainfields-parent

[pattern-key-compare]: #pattern_key_comparea-b

[read-package-json]: #read_package_jsonid
