<script setup lang="ts">
import { mdiClose } from '@mdi/js'

const open = defineModel<boolean>({ default: false })

defineProps<{
  title: string
}>()
</script>

<template>
  <v-navigation-drawer v-model="open" location="right" temporary width="440" class="support-detail-drawer">
    <div class="support-detail-drawer__head">
      <h2 class="support-page-title">{{ title }}</h2>
      <v-btn icon variant="text" size="small" :aria-label="$t('common.close')" @click="open = false">
        <v-icon :icon="mdiClose" />
      </v-btn>
    </div>
    <div class="support-detail-drawer__body">
      <slot />
    </div>
    <div v-if="$slots.actions" class="support-detail-drawer__actions">
      <slot name="actions" />
    </div>
  </v-navigation-drawer>
</template>
