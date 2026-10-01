<script setup lang="ts">
import { FORM_FIELD_LIMITS, FORM_FIELD_TYPE_VALUES, isChoiceFieldType } from '@shokujii/common/schemas/formFields.js'
import type { FormFieldInput } from '@shokujii/common/apis/form.js'
import { changeFormFieldType } from '@shokujii/base/utils/formFieldEditor.js'
import { mdiDeleteOutline, mdiPlus, mdiTextBoxPlusOutline } from '@mdi/js'

const props = withDefaults(
  defineProps<{
    modelValue: FormFieldInput[]
    disabled?: boolean
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: FormFieldInput[]]
}>()

const { t: $t } = useI18n()
const typeItems = FORM_FIELD_TYPE_VALUES.map((value) => ({ value, title: $t(`manage.forms.types.${value}`) }))
const requiredRule = (value: string): boolean | string => value.trim() !== '' || $t('manage.forms.validation.required')
const visibleOptionRule = (field: FormFieldInput): boolean | string =>
  !field.required ||
  (field.options ?? []).some((option) => !option.hidden_for_new) ||
  $t('manage.forms.validation.visible_option')

const updateField = (index: number, patch: Partial<FormFieldInput>): void => {
  emit(
    'update:modelValue',
    props.modelValue.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...patch } : field)),
  )
}

const addField = (): void => {
  if (props.disabled || props.modelValue.length >= FORM_FIELD_LIMITS.maxFields) return
  emit('update:modelValue', [
    ...props.modelValue,
    {
      type: 'text',
      label: '',
      description: '',
      required: false,
      hidden_for_new: false,
    },
  ])
}

const removeField = (index: number): void => {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, fieldIndex) => fieldIndex !== index),
  )
}

const addOption = (index: number): void => {
  const options = [...(props.modelValue[index].options ?? [])]
  if (options.length >= FORM_FIELD_LIMITS.maxOptions) return
  options.push({ label: '', hidden_for_new: false })
  updateField(index, { options })
}

const updateOption = (
  fieldIndex: number,
  optionIndex: number,
  patch: { label?: string; hidden_for_new?: boolean },
): void => {
  const field = props.modelValue[fieldIndex]
  updateField(fieldIndex, {
    options: (field.options ?? []).map((option, index) => (index === optionIndex ? { ...option, ...patch } : option)),
  })
}

const removeOption = (fieldIndex: number, optionIndex: number): void => {
  updateField(fieldIndex, {
    options: (props.modelValue[fieldIndex].options ?? []).filter((_, index) => index !== optionIndex),
  })
}

const onTypeChange = (index: number, type: FormFieldInput['type']): void => {
  emit(
    'update:modelValue',
    props.modelValue.map((field, fieldIndex) => (fieldIndex === index ? changeFormFieldType(field, type) : field)),
  )
}
</script>

<template>
  <section>
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <div>
        <div class="d-flex align-center ga-2">
          <h2 class="text-h6">{{ $t('manage.forms.fields') }}</h2>
          <v-chip size="small" variant="tonal">{{
            $t('manage.forms.field_count', { count: modelValue.length, max: FORM_FIELD_LIMITS.maxFields })
          }}</v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mt-1 mb-0">{{ $t('manage.forms.fields_hint') }}</p>
      </div>
      <v-btn
        :prepend-icon="mdiPlus"
        :disabled="disabled || modelValue.length >= FORM_FIELD_LIMITS.maxFields"
        variant="tonal"
        @click="addField"
      >
        {{ $t('manage.forms.add_field') }}
      </v-btn>
    </div>
    <v-card v-if="modelValue.length === 0" variant="outlined" class="text-center pa-8">
      <v-icon :icon="mdiTextBoxPlusOutline" size="36" color="primary" class="mb-3" />
      <h3 class="text-subtitle-1 mb-1">{{ $t('manage.forms.fields_empty') }}</h3>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('manage.forms.fields_empty_hint') }}</p>
    </v-card>
    <v-card
      v-for="(field, index) in modelValue"
      :key="field.field_id ?? `new-${index}`"
      class="mb-4"
      variant="flat"
      border
    >
      <div class="d-flex align-center ga-3 px-4 py-3">
        <v-avatar color="primary" variant="tonal" size="32" class="text-body-2 font-weight-medium">{{
          index + 1
        }}</v-avatar>
        <h3 class="text-subtitle-1">{{ $t('manage.forms.question_number', { number: index + 1 }) }}</h3>
        <v-chip v-if="field.hidden_for_new" size="small" variant="tonal">{{ $t('manage.forms.hidden') }}</v-chip>
        <v-spacer />
        <v-btn
          :icon="mdiDeleteOutline"
          :aria-label="$t('manage.forms.remove_field', { number: index + 1 })"
          :disabled="disabled"
          size="small"
          variant="text"
          color="secondary"
          @click="removeField(index)"
        />
      </div>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              :model-value="field.label"
              :label="$t('manage.forms.field_label')"
              :placeholder="$t('manage.forms.field_placeholder')"
              :maxlength="FORM_FIELD_LIMITS.maxLabel"
              :rules="[requiredRule]"
              :disabled="disabled"
              hide-details="auto"
              @update:model-value="updateField(index, { label: String($event ?? '') })"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :model-value="field.type"
              :items="typeItems"
              :label="$t('manage.forms.field_type')"
              :disabled="disabled"
              hide-details="auto"
              @update:model-value="onTypeChange(index, $event)"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              :model-value="field.description ?? ''"
              :label="$t('manage.forms.field_description')"
              :maxlength="FORM_FIELD_LIMITS.maxDescription"
              :disabled="disabled"
              hide-details="auto"
              @update:model-value="updateField(index, { description: String($event ?? '') })"
            />
          </v-col>
          <v-col v-if="isChoiceFieldType(field.type)" cols="12">
            <div class="text-subtitle-2 mb-3">{{ $t('manage.forms.options') }}</div>
            <v-input
              :model-value="field.options"
              :rules="[
                () => (field.options?.length ?? 0) > 0 || $t('manage.forms.validation.options_required'),
                () => visibleOptionRule(field),
              ]"
              :disabled="disabled"
              hide-details="auto"
            >
              <div class="w-100">
                <div
                  v-for="(option, optionIndex) in field.options ?? []"
                  :key="option.option_id ?? `opt-${optionIndex}`"
                  class="form-option-row mb-3"
                >
                  <v-text-field
                    :model-value="option.label"
                    :label="$t('manage.forms.option_number', { number: optionIndex + 1 })"
                    :maxlength="FORM_FIELD_LIMITS.maxLabel"
                    :rules="[requiredRule]"
                    :disabled="disabled"
                    density="comfortable"
                    hide-details="auto"
                    @update:model-value="updateOption(index, optionIndex, { label: String($event ?? '') })"
                  />
                  <v-checkbox
                    :model-value="option.hidden_for_new === true"
                    :label="$t('manage.forms.option_hidden')"
                    :disabled="disabled"
                    density="compact"
                    hide-details
                    @update:model-value="updateOption(index, optionIndex, { hidden_for_new: $event === true })"
                  />
                  <v-btn
                    :icon="mdiDeleteOutline"
                    :aria-label="$t('manage.forms.remove_option', { number: optionIndex + 1 })"
                    :disabled="disabled"
                    size="small"
                    variant="text"
                    color="secondary"
                    @click="removeOption(index, optionIndex)"
                  />
                </div>
                <v-btn
                  :prepend-icon="mdiPlus"
                  :disabled="disabled || (field.options?.length ?? 0) >= FORM_FIELD_LIMITS.maxOptions"
                  size="small"
                  variant="text"
                  @click="addOption(index)"
                  >{{ $t('manage.forms.add_option') }}</v-btn
                >
              </div>
            </v-input>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <div class="d-flex flex-wrap align-center ga-4 px-4 py-2">
        <v-switch
          :model-value="field.required"
          :label="$t('manage.forms.field_required')"
          :disabled="disabled"
          color="primary"
          density="compact"
          hide-details
          @update:model-value="updateField(index, { required: $event === true })"
        />
        <v-checkbox
          :model-value="field.hidden_for_new === true"
          :label="$t('manage.forms.field_hidden')"
          :disabled="disabled"
          density="compact"
          hide-details
          @update:model-value="updateField(index, { hidden_for_new: $event === true })"
        />
      </div>
    </v-card>
  </section>
</template>

<style scoped>
.form-option-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: start;
  gap: 8px;
}
@media (max-width: 599px) {
  .form-option-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .form-option-row > :first-child {
    grid-column: 1 / -1;
  }
}
</style>
