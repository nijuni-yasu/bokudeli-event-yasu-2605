<script setup lang="ts">
import { type BokudeliPartnerOption } from '@shokujii/base/stores/partner.js'
import { useValidators } from '@shokujii/base/composable/validators.js'
import { useI18n } from 'vue-i18n'
import { PRICE_DELTA_MAX, PRICE_DELTA_MIN } from '@shokujii/common/schemas/menuOption.js'
import { hasDuplicateOptionItemNames } from '@shokujii/common/utils/menuOption.js'

const { requiredValidator, maxLengthValidator } = useValidators()
const { t: $t } = useI18n()

const option = defineModel<BokudeliPartnerOption>({ required: true })

const emit = defineEmits<{
  save: [option: BokudeliPartnerOption]
  cancel: []
}>()

const isValid = ref(false)

const uniqueItemNameRule = (): true | string => {
  if (hasDuplicateOptionItemNames(option.value.option_items)) {
    return $t('option_edit_card.error_duplicate_item_name')
  }
  return true
}

const itemCountRule = (): true | string => {
  if (option.value.option_items.length < 1 || option.value.option_items.length > 20) {
    return $t('option_edit_card.error_item_count')
  }
  return true
}

const priceDeltaRule = (value: unknown): true | string => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < PRICE_DELTA_MIN || value > PRICE_DELTA_MAX) {
    return $t('option_edit_card.error_price_delta')
  }
  return true
}

const addItem = () => {
  if (option.value.option_items.length >= 20) {
    return
  }
  option.value.option_items = [...option.value.option_items, { item_id: crypto.randomUUID(), name: '', price_delta: 0 }]
}

const removeItem = (itemId: string) => {
  option.value.option_items = option.value.option_items.filter((item) => item.item_id !== itemId)
}

const handleSubmit = () => {
  if (!isValid.value || !option.value.isValidForDatabase()) {
    return
  }
  emit('save', option.value)
}
</script>

<template>
  <v-form v-model="isValid" @submit.prevent="handleSubmit">
    <v-card class="pa-4">
      <template #title>
        <div class="text-h4">
          <slot name="title" />
        </div>
      </template>
      <v-card-text class="d-flex flex-column ga-4">
        <v-text-field
          v-model="option.option_name"
          :label="$t('option_edit_card.name')"
          :rules="[requiredValidator, (v: string) => maxLengthValidator(v, 40)]"
        />
        <v-textarea
          v-model="option.option_description"
          :label="$t('option_edit_card.description')"
          :rules="[(v: string) => maxLengthValidator(v ?? '', 200)]"
          rows="2"
        />
        <v-radio-group v-model="option.selection" :label="$t('option_edit_card.selection')" inline hide-details>
          <v-radio :label="$t('option_edit_card.selection_single')" value="single" />
          <v-radio :label="$t('option_edit_card.selection_multiple')" value="multiple" />
        </v-radio-group>
        <v-switch v-model="option.required" :label="$t('option_edit_card.required')" color="primary" hide-details />
        <div>
          <div class="text-subtitle-2 mb-2">{{ $t('option_edit_card.items') }}</div>
          <div
            v-for="item in option.option_items"
            :key="item.item_id"
            class="option-edit-card__item d-flex align-start ga-2 mb-2"
          >
            <v-text-field
              v-model="item.name"
              class="option-edit-card__item-name"
              :label="$t('option_edit_card.item_name')"
              :rules="[requiredValidator, (v: string) => maxLengthValidator(v, 40), uniqueItemNameRule]"
              density="compact"
            />
            <v-text-field
              v-model.number="item.price_delta"
              class="option-edit-card__price-delta"
              type="number"
              :label="$t('option_edit_card.price_delta')"
              :min="PRICE_DELTA_MIN"
              :max="PRICE_DELTA_MAX"
              :rules="[priceDeltaRule]"
              density="compact"
            />
            <v-btn class="flex-shrink-0" variant="text" @click="removeItem(item.item_id)">
              {{ $t('option_edit_card.remove_item') }}
            </v-btn>
          </div>
          <v-btn variant="tonal" :disabled="option.option_items.length >= 20" @click="addItem">
            {{ $t('option_edit_card.add_item') }}
          </v-btn>
          <p class="text-caption text-medium-emphasis mt-2">{{ itemCountRule() === true ? '' : itemCountRule() }}</p>
        </div>
      </v-card-text>
      <template #actions>
        <v-spacer />
        <v-btn variant="plain" @click="$emit('cancel')">{{ $t('option_edit_card.close') }}</v-btn>
        <v-btn type="submit" :disabled="!isValid || !option.isValidForDatabase()" variant="tonal">
          {{ $t('option_edit_card.submit') }}
        </v-btn>
      </template>
    </v-card>
  </v-form>
</template>

<style scoped lang="scss">
.option-edit-card__item-name {
  flex: 1 1 auto;
  min-width: 0;
}

.option-edit-card__price-delta {
  flex: 0 0 10rem;
  width: 10rem;
  max-width: 10rem;
}

.option-edit-card__price-delta :deep(input) {
  min-width: 0;
}
</style>
