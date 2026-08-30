<script setup lang="ts">
import { computed } from 'vue'
import { type BokudeliPartnerMenu } from '@shokujii/base/stores/partner.js'
import MenuStatusChips from '@shokujii/base/components/MenuStatusChips.vue'

const props = defineProps<{
  menu: BokudeliPartnerMenu
  imageUrl: string
}>()

const hasStatusChips = computed(
  () =>
    props.menu.is_sold_out ||
    props.menu.limit_per_event != null ||
    (props.menu.menu_date_start != null && props.menu.menu_date_end != null),
)
</script>

<template>
  <v-card class="card">
    <div class="image-wrapper">
      <v-img :src="imageUrl" cover aspect-ratio="1" />
    </div>

    <v-card-title class="text-h5 py-3 text-wrap">
      {{ menu.menu_name }}
    </v-card-title>
    <v-card-text class="py-2">
      {{ menu.menu_description }}
    </v-card-text>
    <v-card-text v-if="hasStatusChips" class="py-1">
      <MenuStatusChips
        :limited-period-start="menu.menu_date_start"
        :limited-period-end="menu.menu_date_end"
        :is-sold-out="menu.is_sold_out"
        :limit-per-event="menu.limit_per_event"
        align="start"
      />
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
</style>
