/**
 * @file VitePress Theme - UnifiedCompiler
 * @module docs/vitepress/theme/comments/UnifiedCompiler
 */

import type { Node } from 'unist'
import type { VFile } from 'vfile'

/**
 * Abstract syntax tree compiler.
 *
 * @see https://github.com/unifiedjs/unified#processorcompiler
 *
 * @abstract
 *
 * @template Tree - Node the compiler receives
 * @template Result - What the compiler yields
 */
abstract class UnifiedCompiler<Tree extends Node = Node, Result = unknown> {
  /**
   * @protected
   * @readonly
   * @member {VFile} file - File associated with {@link tree}
   */
  protected readonly file: VFile

  /**
   * @protected
   * @readonly
   * @member {Tree} tree - Syntax tree to compile
   */
  protected readonly tree: Tree

  /**
   * Instantiates a new syntax tree compiler.
   *
   * @param {Tree} tree - Syntax tree to compile
   * @param {VFile} file - File associated with `tree`
   */
  constructor(tree: Tree, file: VFile) {
    this.tree = tree
    this.file = file
  }

  /**
   * Compiles {@link tree}.
   *
   * @public
   * @abstract
   *
   * @return {Result} Compilation result
   */
  public abstract compile(): Result
}

export default UnifiedCompiler
