<script setup lang="ts">
import type { SupportTicketTone } from '@/utils/statusColors'

withDefaults(
  defineProps<{
    label: string
    tone?: SupportTicketTone
  }>(),
  { tone: 'ink' },
)
</script>

<template>
  <span class="support-ticket" :class="`support-ticket--${tone}`">{{ label }}</span>
</template>
