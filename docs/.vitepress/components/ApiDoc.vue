<script setup lang="ts">
/**
 * @file VitePress Components - ApiDoc
 * @module docs/vitepress/components/ApiDoc
 */

defineProps<{ doc: string }>()
</script>

<template>
  <div class="ApiDoc" v-html="doc" />
</template>

<style>
.ApiDoc table {
  margin-top: 10px;
}

.ApiDoc thead {
  display: none;
}

.ApiDoc tbody {
  display: inline-table;
  width: 100%;
}

.ApiDoc tr,
.ApiDoc tr > td {
  border-top: 0;
}

.ApiDoc tr > td:not(:last-of-type),
.ApiDoc h3[id$='-throws'] {
  white-space: nowrap;
}

.ApiDoc tr > td {
  border-bottom: 0;
  border-left: 0;
}

.ApiDoc tr > td:last-of-type {
  border-right: 0;
  min-width: 100%;
}

.ApiDoc h3[id$='-returns'] + table + .danger {
  margin: 32px 0 -12px;
  padding: 8px 16px;
}

.ApiDoc h3[id$='-returns'] + table > tbody > tr > td {
  padding-block: 0;
}

.ApiDoc h3[id$='-returns'] + table > tbody > tr > td:first-of-type {
  padding-left: 0;
}

.ApiDoc h3[id*='-throws-'],
.ApiDoc h3[id*='-throws-'] > code {
  font-size: 14px;
}

.ApiDoc h3[id*='-throws-'] {
  line-height: 24px;
  margin: 8px 0;
  text-transform: uppercase;
}
</style>
