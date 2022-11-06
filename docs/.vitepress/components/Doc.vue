<script setup lang="ts">
/**
 * @file VitePress Components - Doc
 * @module docs/vitepress/components/Doc
 */

import type Documentation from '../theme/documentation'

defineProps<{ doc: Documentation['doc'] }>()
</script>

<template>
  <div class="Doc" v-html="doc" />
</template>

<style>
.Doc table {
  margin-top: 10px;
}

.Doc thead {
  display: none;
}

.Doc tr,
.Doc tr > td {
  border-top: 0;
}

.Doc tr > td:not(:last-of-type),
.Doc h3[id$='-throws'] {
  white-space: nowrap;
}

.Doc tr > td {
  border-bottom: 0;
  border-left: 0;
}

.Doc tr > td:last-of-type {
  border-right: 0;
  min-width: 100%;
}

.Doc h3[id$='-returns'] + p + .danger {
  margin: 32px 0 -12px;
  padding: 8px 16px;
}

.Doc h3[id$='-see-also'] {
  font-size: 16px;
  margin-top: 16px;
}

.Doc h3[id*='-throws'],
.Doc h3[id*='-throws'] > code {
  font-size: 14px;
}

.Doc h3[id*='-throws'] {
  line-height: 24px;
  margin: 8px 0;
  text-transform: uppercase;
}
</style>
