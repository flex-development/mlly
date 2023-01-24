---
head:
  - - meta
    - name: description
      content: Enums exported from @flex-development/mlly
  - - meta
    - name: keywords
      content:
        - ecmascript
        - es modules
        - esm
        - node
        - typescript
  - - meta
    - name: priority
      content: 0.7
outline: 2
---

# Enums

Enums exported from `mlly`.

<script setup lang='ts'>
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
  return /src\/enums\/[\w-]+\.ts$/.test(doc.file)
})
</script>

<Doc v-for='doc in docs' :doc='doc.doc' :key='doc.file' />
