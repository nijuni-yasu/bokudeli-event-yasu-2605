<script setup lang="ts">
import { computed } from 'vue'
import type { MenuPriceLine } from '@shokujii/common/utils/menuOption.js'
import { priceString } from '@shokujii/base/schemes/converter'

const props = defineProps<{
  lines: MenuPriceLine[]
  perMeal?: boolean
}>()

const formatYen = (amount: number): string => {
  if (amount < 0) {
    return `-¥${priceString(Math.abs(amount))}`
  }
  return `¥${priceString(amount)}`
}

const formattedLines = computed(() =>
  props.lines.map((line) => ({
    name: line.name,
    amountLabel: formatYen(line.amount),
  })),
)
</script>

<template>
  <div class="menu-price-breakdown">
    <div v-if="perMeal" class="menu-price-breakdown__note">{{ $t('menu_price_breakdown.per_meal') }}</div>
    <template v-for="(line, index) in formattedLines" :key="index">
      <span class="menu-price-breakdown__name">{{ line.name }}</span>
      <span class="menu-price-breakdown__amount">{{ line.amountLabel }}</span>
    </template>
  </div>
</template>

<style scoped>
.menu-price-breakdown {
  display: grid;
  grid-template-columns: minmax(0, max-content) max-content;
  column-gap: 1.75rem;
  width: max-content;
  max-width: 100%;
  line-height: 1.5;
  text-align: start;
  align-items: baseline;
}

.menu-price-breakdown__note {
  grid-column: 1 / -1;
}

.menu-price-breakdown__name {
  min-width: 0;
  overflow-wrap: anywhere;
}

.menu-price-breakdown__amount {
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}
</style>
