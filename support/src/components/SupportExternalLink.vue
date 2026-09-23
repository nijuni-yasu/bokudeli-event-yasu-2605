<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js'

defineProps<{
  href: string
  label: string
}>()
</script>

<template>
  <a class="support-link" :href="href" target="_blank" rel="noopener noreferrer" @click.stop>
    <span class="support-cell-primary">{{ label }}</span>
    <v-icon :icon="mdiOpenInNew" size="14" />
  </a>
</template>
