<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { MenuAllergenType, MenuBadgeType } from '@shokujii/common/schemas/menuOption.js'

defineProps<{
  allergens?: MenuAllergenType[]
  badges?: MenuBadgeType[]
  isVegan?: boolean
  isHalal?: boolean
}>()

const { t: $t } = useI18n()
</script>

<template>
  <div
    v-if="(allergens?.length ?? 0) > 0 || (badges?.length ?? 0) > 0 || isVegan || isHalal"
    class="d-flex flex-wrap ga-1"
  >
    <v-chip v-for="badge in badges ?? []" :key="badge" size="x-small" color="primary" variant="tonal">
      {{ $t(`menu_badge.${badge}`) }}
    </v-chip>
    <v-chip v-if="isVegan" size="x-small" color="success" variant="tonal">
      {{ $t('menu_attribute.vegan') }}
    </v-chip>
    <v-chip v-if="isHalal" size="x-small" color="success" variant="tonal">
      {{ $t('menu_attribute.halal') }}
    </v-chip>
    <v-chip v-for="allergen in allergens ?? []" :key="allergen" size="x-small" variant="outlined">
      {{ $t(`menu_allergen.${allergen}`) }}
    </v-chip>
  </div>
</template>
