---
head:
  - - meta
    - name: description
      content: API reference for @flex-development/mlly
  - - meta
    - name: keywords
      content:
        - ecmascript
        - es modules
        - esm
        - node
  - - meta
    - name: priority
      content: 1
outline: 2
---

# API

::: warning
Documentation in progress.
:::

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
  return /src\/lib\/[\w-]+\.ts$/.test(doc.file)
})
</script>

<Doc v-for="doc in docs" :doc="doc.doc" :key="doc.file" />
