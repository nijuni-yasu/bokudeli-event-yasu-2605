<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'

const search = defineModel<string>('search', { default: '' })

defineProps<{
  title: string
  totalCount?: number | null
  showingCount?: number | null
  searchPlaceholder?: string
}>()
</script>

<template>
  <header class="support-page-header">
    <div class="support-page-header__title-row">
      <h1 class="support-page-title">{{ title }}</h1>
      <span v-if="totalCount != null" class="support-count-badge">
        {{ $t('common.total_count', { count: totalCount }) }}
      </span>
      <span v-if="showingCount != null" class="support-count-badge">
        {{ $t('common.showing_count', { count: showingCount }) }}
      </span>
      <slot name="filters" />
    </div>
    <div class="support-page-header__tools">
      <v-text-field
        v-model="search"
        class="support-search-field"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        type="search"
        :placeholder="searchPlaceholder ?? $t('common.search_placeholder')"
        :prepend-inner-icon="mdiMagnify"
      />
      <slot name="actions" />
    </div>
  </header>
</template>
