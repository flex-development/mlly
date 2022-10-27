---
head:
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

const { site } = useData<ThemeConfig>()
const { apidocs } = site.value.themeConfig
</script>

<ApiDoc v-for="[identifier, doc] in apidocs" :doc="doc" :key="identifier" />
