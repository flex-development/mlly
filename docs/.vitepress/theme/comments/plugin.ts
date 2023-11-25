/**
 * @file VitePress Theme - Comments Processor
 * @module docs/vitepress/theme/comments/attacher
 */

import type { Root } from '@flex-development/docast'
import { define, type EmptyArray } from '@flex-development/tutils'
import type { Plugin, Processor } from 'unified'
import type { VFile } from 'vfile'
import Compiler from './compiler'

/**
 * Configures the [docblock ast][1] compiler.
 *
 * [1]: https://github.com/flex-development/docast
 *
 * @see https://github.com/unifiedjs/unified#function-attacheroptions
 *
 * @type {Plugin<EmptyArray, Root, string[]>}
 * @this {Processor}
 *
 * @return {void} Nothing when complete
 */
function attacher(this: Processor): void {
  return void define(this, 'compiler', {
    value: (tree: Root, file: VFile): string[] => {
      return new Compiler(tree, file).compile()
    }
  })
}

export default <Plugin<EmptyArray, Root, string[]>>attacher
