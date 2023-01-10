/**
 * @file VitePress Theme - Comments Processor
 * @module docs/vitepress/theme/comments/attacher
 */

import type { Root } from '@flex-development/docast'
import type { Plugin, Processor } from 'unified'
import Compiler from './compiler'

/**
 * Configures the [docblock ast][1] compiler.
 *
 * [1]: https://github.com/flex-development/docast
 *
 * @see https://github.com/unifiedjs/unified#function-attacheroptions
 *
 * @type {Plugin<[], Root, string[]>}
 * @this {Processor<void, Root, Root, string[]>}
 *
 * @return {void} Nothing when complete
 */
function attacher(this: Processor<void, void, Root, string[]>): void {
  this.Compiler = Compiler
  return void 0
}

export default attacher
