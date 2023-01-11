/**
 * @file VitePress Composables - useComments
 * @module docs/vitepress/composables/useComments
 */

import type { Root } from '@flex-development/docast'
import docastParse, { type Options } from '@flex-development/docast-parse'
import { CompareResult } from '@flex-development/tutils'
import { globby } from 'globby'
import fs from 'node:fs/promises'
import path, { type ParsedPath } from 'node:path'
import { unified } from 'unified'
import { VFile } from 'vfile'
import attacher from '../theme/comments/plugin'
import type Documentation from '../theme/documentation'

/**
 * Generates API documentation from JSDoc comments.
 *
 * @async
 *
 * @return {Promise<Documentation[]>} Documentation objects
 */
async function useComments(): Promise<Documentation[]> {
  /**
   * Documentation objects.
   *
   * @const {Documentation[]} objects
   */
  const objects: Documentation[] = []

  /**
   * Regular expression matching documentation snippets that have titles in all
   * caps.
   *
   * @const {RegExp} capitalized
   */
  const capitalized: RegExp = /^<h2.*?><code>[A-Z_]+?<\/code>/

  /**
   * Glob patterns referencing files containing comments with API documentation.
   *
   * @const {string[]} patterns
   */
  const patterns: string[] = ['interfaces/*.ts', 'types/*.ts', 'utils/*.ts']

  // get comments
  for (let p of await globby(patterns, {
    cwd: path.resolve(process.cwd(), 'src'),
    ignore: ['**/index.ts']
  })) {
    /**
     * Source code associated with {@link p}.
     *
     * @const {Buffer} buffer
     */
    const buffer: Buffer = await fs.readFile((p = path.resolve('src', p)))

    /**
     * Virtual file representation of {@link buffer}.
     *
     * @const {VFile} file
     */
    const file: VFile = new VFile(buffer)

    // get virtual file properties
    const {
      base: basename,
      dir: dirname,
      ext: extname,
      name: stem
    }: ParsedPath = path.parse(p)

    // set virtual file properties
    file.path = p
    file.basename = basename
    file.dirname = dirname
    file.extname = extname
    file.stem = stem

    /**
     * Docblock abstract syntax tree for {@link file}.
     *
     * @see https://github.com/flex-development/docast
     *
     * @const {Root} tree
     */
    const tree: Root = unified()
      .use<[Options?], string, Root>(docastParse)
      .parse(file)

    /**
     * API documentation extracted from {@link file}.
     *
     * @const {string[]} compilation
     */
    const compilation: string[] = unified()
      .use<[], Root, string[]>(attacher)
      .stringify(tree, file)

    // add docs
    for (const doc of compilation) objects.push({ doc, file: p })
  }

  return objects.sort((obj1: Documentation, obj2: Documentation): number => {
    /**
     * Comparison result for {@linkcode obj1} and {@linkcode obj2}.
     *
     * @var {number} result
     */
    let result: number = Number.NaN

    switch (true) {
      case capitalized.test(obj1.doc) && !capitalized.test(obj2.doc):
        result = CompareResult.LESS_THAN
        break
      case !capitalized.test(obj1.doc) && capitalized.test(obj2.doc):
        result = CompareResult.GREATER_THAN
        break
      default:
        result = obj1.doc.localeCompare(obj2.doc, undefined, {
          caseFirst: 'upper',
          numeric: true
        })
        break
    }

    return result
  })
}

export default useComments
