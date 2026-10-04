<script setup lang="ts">
import { linkifyHttpUrls } from '@shokujii/base/utils/linkifyHttpUrls.js'

const props = defineProps<{
  text: string
}>()

const segments = computed(() => linkifyHttpUrls(props.text))
</script>

<template>
  <span class="form-linked-text">
    <template v-for="(segment, index) in segments" :key="index">
      <a v-if="segment.kind === 'url'" :href="segment.href" target="_blank" rel="noopener noreferrer">{{
        segment.label
      }}</a>
      <template v-else>{{ segment.value }}</template>
    </template>
  </span>
</template>

<style scoped>
.form-linked-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.form-linked-text a {
  text-decoration: underline;
  overflow-wrap: anywhere;
}
</style>
