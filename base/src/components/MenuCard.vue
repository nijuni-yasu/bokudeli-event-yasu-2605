<script setup lang="ts">
import { type BokudeliPartnerMenu } from '@shokujii/base/stores/partner.js'
import { convertToDate } from '@shokujii/base/utils/datetime'
import MenuStatusChips from '@shokujii/base/components/MenuStatusChips.vue'

defineProps<{
  menu: BokudeliPartnerMenu
  imageUrl: string
}>()
</script>

<template>
  <v-card class="card">
    <div class="image-wrapper">
      <v-img :src="imageUrl" cover aspect-ratio="1" />
      <MenuStatusChips v-if="menu.is_sold_out" :is-sold-out="true" placement="overlay" />
    </div>

    <v-card-title class="text-h5 py-3 text-wrap">
      {{ menu.menu_name }}
    </v-card-title>
    <v-card-text class="py-2">
      {{ menu.menu_description }}
    </v-card-text>
    <v-card-text v-if="menu.menu_date_start != null && menu.menu_date_end != null" class="py-2">
      <span class="limited">{{
        $t('menu_card.limited_edition', [convertToDate(menu.menu_date_start), convertToDate(menu.menu_date_end)])
      }}</span>
    </v-card-text>
    <v-card-text v-if="!menu.is_sold_out && menu.limit_per_event != null" class="py-1">
      <MenuStatusChips :limit-per-event="menu.limit_per_event" align="start" />
    </v-card-text>
    <div class="spacer" />
    <v-card-text class="d-flex">
      <v-spacer />
      <span class="text-h4">{{ $n(menu.menu_price, 'currency') }}</span>
    </v-card-text>
    <slot></slot>
  </v-card>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  position: relative;
  > * {
    flex-grow: 0;
  }
  .spacer {
    flex-grow: 1;
  }
}
.image-wrapper {
  position: relative;
}
.limited {
  color: red;
}
</style>
