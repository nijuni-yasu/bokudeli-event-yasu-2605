<script setup lang="ts">
import { parseISO, format } from 'date-fns'
import { watch } from 'vue'
import { type BokudeliPartnerMenu } from '@shokujii/base/stores/partner.js'
import { useValidators } from '@shokujii/base/composable/validators.js'
import { useI18n } from 'vue-i18n'
import ImageInput from '@shokujii/base/components/ImageInput.vue'
import DateInput from '@shokujii/base/components/DateInput.vue'
import { MENU_LIMIT_PER_EVENT_MAX } from '@shokujii/common/utils/menuLimit.js'
import type { BokudeliPartnerOption } from '@shokujii/base/stores/partner.js'
import {
  MENU_ALLERGEN_VALUES,
  MENU_BADGE_VALUES,
  type MenuAllergenType,
  type MenuBadgeType,
} from '@shokujii/common/schemas/menuOption.js'
import { isMenuMinTotalValid } from '@shokujii/common/utils/menuOption.js'

const { requiredValidator, maxLengthValidator, betweenValidator } = useValidators()
const { t: $t } = useI18n()

const menu = defineModel<BokudeliPartnerMenu>({ required: true })

const props = defineProps<{
  imageUrl: string
  options: BokudeliPartnerOption[]
}>()

const emit = defineEmits<{
  save: [menu: BokudeliPartnerMenu, file: File | null]
  cancel: []
}>()

const imageFile = ref<File | null>(null)

const isValid = ref(false)
const formRef = ref()

// v-mode.number が空文字列を受け入れてしまうため、computed を使って型を整える
// TODO: vuetify 3.5.10 以降にアップグレードして
// https://vuetifyjs.com/en/components/number-inputs/#installation
// を使用したほうがよい
const price = computed({
  get: () => menu.value.menu_price,
  set: (value) => {
    if (Number.isInteger(value)) {
      menu.value.menu_price = value
    }
  },
})

const dateStart = computed({
  get: () => (menu.value.menu_date_start == null ? null : format(menu.value.menu_date_start, 'yyyy-MM-dd')),
  set: (value) => {
    menu.value.menu_date_start = value == null ? null : parseISO(value).getTime()
  },
})
const dateEnd = computed({
  get: () => (menu.value.menu_date_end == null ? null : format(menu.value.menu_date_end, 'yyyy-MM-dd')),
  set: (value) => {
    menu.value.menu_date_end = value == null ? null : parseISO(value).getTime() + 24 * 60 * 60 * 1000 - 1
  },
})

const limitPerEvent = computed({
  get: () => menu.value.limit_per_event ?? '',
  set: (value) => {
    if (value === '' || value == null) {
      menu.value.limit_per_event = null
      return
    }
    const parsed = Number(value)
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= MENU_LIMIT_PER_EVENT_MAX) {
      menu.value.limit_per_event = parsed
    }
  },
})

const limitPerEventRule = (value: string | number): true | string => {
  if (value === '' || value == null) {
    return true
  }
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > MENU_LIMIT_PER_EVENT_MAX) {
    return $t('menu_edit_card.error_limit_per_event')
  }
  return true
}

// 販売期間のバリデーションを入力欄に紐付ける
const dateRangeRule = (): true | string => {
  const hasStart = menu.value.menu_date_start != null
  const hasEnd = menu.value.menu_date_end != null

  // 片方だけ設定されている場合はエラー
  if (hasStart !== hasEnd) {
    return $t('menu_edit_card.error_date_range_incomplete')
  }
  // 両方設定されている場合、開始日 <= 終了日であることを確認
  if (hasStart && hasEnd && menu.value.menu_date_start! > menu.value.menu_date_end!) {
    return $t('menu_edit_card.error_date_range_invalid')
  }

  return true
}
const dateRangeRules = [dateRangeRule]

const attachedOptions = computed(() =>
  (menu.value.option_ids ?? [])
    .map((optionId) => props.options.find((option) => option.option_id === optionId))
    .filter((option): option is BokudeliPartnerOption => option != null),
)

const minTotalValid = computed(() => isMenuMinTotalValid(menu.value.menu_price, attachedOptions.value))

const minTotalRule = (): true | string => {
  if (!minTotalValid.value) {
    return $t('menu_edit_card.error_min_total')
  }
  return true
}

const toggleOptionId = (optionId: string, attached: boolean) => {
  const current = menu.value.option_ids ?? []
  if (attached) {
    if (current.includes(optionId) || current.length >= 10) {
      return
    }
    menu.value.option_ids = [...current, optionId]
    return
  }
  menu.value.option_ids = current.filter((id) => id !== optionId)
}

const moveOption = (optionId: string, direction: -1 | 1) => {
  const current = [...(menu.value.option_ids ?? [])]
  const index = current.indexOf(optionId)
  const next = index + direction
  if (index < 0 || next < 0 || next >= current.length) {
    return
  }
  const [moved] = current.splice(index, 1)
  current.splice(next, 0, moved)
  menu.value.option_ids = current
}

const allergenItems = MENU_ALLERGEN_VALUES.map((value) => ({
  title: $t(`menu_allergen.${value}`),
  value,
}))

const badgeItems = MENU_BADGE_VALUES.map((value) => ({
  title: $t(`menu_badge.${value}`),
  value,
}))

const allergensModel = computed({
  get: () => menu.value.allergens ?? [],
  set: (value: MenuAllergenType[]) => {
    menu.value.allergens = value
  },
})

const badgesModel = computed({
  get: () => menu.value.badges ?? [],
  set: (value: MenuBadgeType[]) => {
    menu.value.badges = value
  },
})

// 販売期間のバリデーションを入力欄に紐付けて、変更を監視する
watch(
  () => [menu.value.menu_date_start, menu.value.menu_date_end],
  () => {
    if (!formRef.value) return
    formRef.value.validate()
  },
)

const handleSubmit = () => {
  if (!isValid.value || !minTotalValid.value) {
    return
  }
  emit('save', menu.value, imageFile.value)
}
</script>

<template>
  <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
    <v-card class="pa-4">
      <template #title>
        <div class="text-h4">
          <slot name="title" />
        </div>
      </template>
      <v-card-text class="menu-edit-card__image pb-2">
        <v-row justify="center">
          <v-col cols="7">
            <ImageInput
              :urls="[imageUrl]"
              @file-selected="(f) => (imageFile = f)"
              style="width: auto; max-width: min(600px, 100%); aspect-ratio: 1/1"
              :cover="true"
              :rules="[requiredValidator]"
            />
            <span class="text-caption text-medium-emphasis">{{ $t('menu_edit_card.image_hint') }}</span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="menu-edit-card__fields pt-2">
        <v-text-field
          v-model="menu.menu_name"
          outlined
          dense
          class="menu-edit-card__field"
          :label="$t('menu_edit_card.name')"
          :rules="[requiredValidator]"
        />
        <v-textarea
          v-model="menu.menu_description"
          outlined
          class="menu-edit-card__field"
          :label="$t('menu_edit_card.description')"
          :rules="[requiredValidator, (v: string) => maxLengthValidator(v, 140)]"
        />
        <v-text-field
          type="number"
          min="10"
          max="100000"
          class="menu-edit-card__field"
          :prefix="$n(0, 'currency').replace('0', '')"
          v-model.number="price"
          :label="$t('menu_edit_card.price')"
          :rules="[requiredValidator, (v: string) => betweenValidator(v, 10, 100000)]"
        />
        <div class="menu-edit-card__section">
          <div class="menu-edit-card__section-label">
            {{ $t('menu_edit_card.limited_edition') }}
          </div>
          <v-row dense>
            <v-col cols="6">
              <DateInput
                v-model="dateStart"
                :clearable="true"
                :label="$t('menu_edit_card.date_start')"
                :rules="dateRangeRules"
              />
            </v-col>
            <v-col cols="6">
              <DateInput
                v-model="dateEnd"
                :clearable="true"
                :label="$t('menu_edit_card.date_end')"
                :rules="dateRangeRules"
              />
            </v-col>
          </v-row>
          <p class="menu-edit-card__hint">
            {{ $t('menu_edit_card.limited_edition_hint') }}
          </p>
        </div>
        <div class="menu-edit-card__section menu-edit-card__section--limit">
          <div class="menu-edit-card__section-label">
            {{ $t('menu_edit_card.limit_per_event_section') }}
          </div>
          <v-text-field
            v-model="limitPerEvent"
            type="number"
            min="1"
            :max="MENU_LIMIT_PER_EVENT_MAX"
            clearable
            :label="$t('menu_edit_card.limit_per_event')"
            :placeholder="$t('menu_edit_card.limit_per_event_placeholder')"
            :rules="[limitPerEventRule]"
          />
          <p class="menu-edit-card__hint">
            {{ $t('menu_edit_card.limit_per_event_hint') }}
          </p>
        </div>
        <div class="menu-edit-card__section">
          <div class="menu-edit-card__section-label">{{ $t('menu_edit_card.options') }}</div>
          <div v-if="options.length === 0" class="menu-edit-card__hint">
            {{ $t('menu_edit_card.options_empty') }}
            <RouterLink class="ms-1" to="/options">{{ $t('navigation.option') }}</RouterLink>
          </div>
          <div v-for="optionId in menu.option_ids ?? []" :key="optionId" class="d-flex align-center ga-2 mb-1">
            <v-checkbox
              :model-value="true"
              :label="options.find((option) => option.option_id === optionId)?.option_name ?? optionId"
              hide-details
              density="compact"
              @update:model-value="toggleOptionId(optionId, false)"
            />
            <v-btn size="x-small" variant="text" @click="moveOption(optionId, -1)">↑</v-btn>
            <v-btn size="x-small" variant="text" @click="moveOption(optionId, 1)">↓</v-btn>
          </div>
          <v-checkbox
            v-for="option in options.filter((item) => !(menu.option_ids ?? []).includes(item.option_id))"
            :key="option.option_id"
            :model-value="false"
            :label="option.option_name"
            :disabled="(menu.option_ids ?? []).length >= 10"
            hide-details
            density="compact"
            @update:model-value="toggleOptionId(option.option_id, true)"
          />
          <p class="menu-edit-card__hint text-error">{{ minTotalRule() === true ? '' : minTotalRule() }}</p>
        </div>
        <div class="menu-edit-card__section">
          <div class="menu-edit-card__section-label">{{ $t('menu_edit_card.allergens') }}</div>
          <v-select
            v-model="allergensModel"
            :items="allergenItems"
            multiple
            chips
            closable-chips
            :label="$t('menu_edit_card.allergens')"
          />
          <v-switch v-model="menu.is_vegan" :label="$t('menu_attribute.vegan')" color="success" hide-details />
          <v-switch v-model="menu.is_halal" :label="$t('menu_attribute.halal')" color="success" hide-details />
        </div>
        <div class="menu-edit-card__section">
          <div class="menu-edit-card__section-label">{{ $t('menu_edit_card.badges') }}</div>
          <v-select
            v-model="badgesModel"
            :items="badgeItems"
            multiple
            chips
            closable-chips
            :label="$t('menu_edit_card.badges')"
          />
        </div>
        <div class="menu-edit-card__switch">
          <v-switch
            v-model="menu.is_sold_out"
            color="error"
            hide-details
            :label="`${menu.is_sold_out ? $t('menu_edit_card.sold_out') : $t('menu_edit_card.in_stock')}`"
          />
          <p class="menu-edit-card__hint">
            {{ $t('menu_edit_card.sold_out_sync_notice') }}
          </p>
        </div>
      </v-card-text>
      <template #actions>
        <v-spacer></v-spacer>
        <v-btn variant="plain" @click="$emit('cancel')">
          {{ $t('menu_edit_card.close') }}
        </v-btn>
        <v-btn type="submit" :disabled="!isValid || !minTotalValid" variant="tonal">
          {{ $t('menu_edit_card.submit') }}
        </v-btn>
      </template>
    </v-card>
  </v-form>
</template>

<style scoped lang="scss">
.menu-edit-card__fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-edit-card__field {
  flex-shrink: 0;
}

.menu-edit-card__section-label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  margin-bottom: 8px;
}

.menu-edit-card__section--limit {
  margin-top: 12px;

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.menu-edit-card__hint {
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  text-align: left;
  margin: 4px 0 0;
  padding: 0;
}

.menu-edit-card__switch {
  margin-top: 4px;

  :deep(.v-selection-control) {
    padding-inline-start: 0;
  }
}
</style>
