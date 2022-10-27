/**
 * @file VitePress Theme - IndexObject
 * @module docs/vitepress/theme/IndexObject
 */

import type { StoredDocSearchHit } from '@docsearch/react/dist/esm/types'
import type { Nullable } from '@flex-development/tutils'

/**
 * Algolia search index object type.
 *
 * @extends {Omit<StoredDocSearchHit, '_distinctSeqID' | '_rankingInfo'>}
 */
interface IndexObject
  extends Omit<StoredDocSearchHit, '_distinctSeqID' | '_rankingInfo'> {
  lang: string
  weight: {
    level: Nullable<number>
    pageRank: string
    position: Nullable<number>
  }
}

export type { IndexObject as default }
