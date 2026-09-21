<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  icon: string
  to: RouteLocationRaw
  tone: 'action' | 'watch'
  count: number | null | undefined
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <router-link class="support-stat-card" :class="`support-stat-card--${tone}`" :to="to">
    <span class="support-stat-card__icon">
      <v-icon :icon="icon" size="22" />
    </span>
    <span>
      <span class="support-stat-card__label">{{ title }}</span>
      <span v-if="count != null" class="support-stat-card__value">{{ count }}</span>
      <v-progress-circular v-else-if="count === null" indeterminate size="20" width="2" class="mt-1" />
      <span v-else class="support-stat-card__error">
        {{ $t('common.load_failed') }}
        <v-btn size="x-small" variant="text" @click.prevent="emit('retry')">{{ $t('common.retry') }}</v-btn>
      </span>
    </span>
  </router-link>
</template>
