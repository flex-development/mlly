---
head:
  - - meta
    - name: description
      content: Constant values exported from @flex-development/mlly
  - - meta
    - name: keywords
      content:
        - ecmascript
        - es modules
        - esm
        - node
  - - meta
    - name: priority
      content: 0.8
---

# Constants

Constant values exported from `mlly`.

These values are used as defaults for several [library functions](index.md).

<script setup lang="ts">
import { useData } from 'vitepress'
import type ThemeConfig from '../.vitepress/theme/config'
import type Documentation from '../.vitepress/theme/documentation'

const { site } = useData<ThemeConfig>()
const { documentation } = site.value.themeConfig

/**
 * Documentation objects.
 *
 * @const {Documentation[]} docs
 */
const docs: Documentation[] = documentation.filter(doc => {
  return /src\/constants\.ts$/.test(doc.file)
})
</script>

<Doc v-for="doc in docs" :doc="doc.doc" :key="doc.file" />
