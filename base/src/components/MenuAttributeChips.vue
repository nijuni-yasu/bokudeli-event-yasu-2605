<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { MenuAllergenType, MenuBadgeType } from '@shokujii/common/schemas/menuOption.js'

withDefaults(
  defineProps<{
    allergens?: MenuAllergenType[]
    badges?: MenuBadgeType[]
    isVegan?: boolean
    isHalal?: boolean
    size?: 'x-small' | 'small'
    label?: boolean
    /** 親の flex 折り返しにチップを参加させる */
    inline?: boolean
  }>(),
  {
    size: 'x-small',
    label: false,
    inline: false,
  },
)

const { t: $t } = useI18n()
</script>

<template>
  <div
    v-if="(allergens?.length ?? 0) > 0 || (badges?.length ?? 0) > 0 || isVegan || isHalal"
    :class="inline ? 'd-contents' : 'd-flex flex-wrap ga-1'"
  >
    <v-chip v-for="badge in badges ?? []" :key="badge" :size="size" :label="label" color="info" variant="tonal">
      {{ $t(`menu_badge.${badge}`) }}
    </v-chip>
    <v-chip v-if="isVegan" :size="size" :label="label" color="secondary" variant="tonal">
      {{ $t('menu_attribute.vegan') }}
    </v-chip>
    <v-chip v-if="isHalal" :size="size" :label="label" color="secondary" variant="tonal">
      {{ $t('menu_attribute.halal') }}
    </v-chip>
    <v-chip
      v-for="allergen in allergens ?? []"
      :key="allergen"
      :size="size"
      :label="label"
      color="error"
      variant="outlined"
    >
      {{ $t(`menu_allergen.${allergen}`) }}
    </v-chip>
  </div>
</template>
