<script setup lang="ts">
import { shallowRef } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { FORM_FIELD_LIMITS, FORM_FIELD_TYPE_VALUES, isChoiceFieldType } from '@shokujii/common/schemas/formFields.js'
import type { FormFieldInput } from '@shokujii/common/apis/form.js'
import type { FormFieldType } from '@shokujii/common/schemas/formFields.js'
import { changeFormFieldType } from '@shokujii/base/utils/formFieldEditor.js'
import {
  mdiArrowDown,
  mdiArrowUp,
  mdiCalendarOutline,
  mdiCheckboxMarkedOutline,
  mdiDeleteOutline,
  mdiDragVertical,
  mdiEmailOutline,
  mdiFormDropdown,
  mdiPhoneOutline,
  mdiPlus,
  mdiRadioboxMarked,
  mdiTextBoxPlusOutline,
  mdiTextLong,
  mdiTextShort,
} from '@mdi/js'

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

const TYPE_ICONS: Record<FormFieldType, string> = {
  text: mdiTextShort,
  textarea: mdiTextLong,
  email: mdiEmailOutline,
  phone: mdiPhoneOutline,
  date: mdiCalendarOutline,
  checkbox: mdiCheckboxMarkedOutline,
  radio: mdiRadioboxMarked,
  select: mdiFormDropdown,
}

const { t: $t } = useI18n()
// 旧画面で無効化した設問も、削除済みと同じく編集対象から外す。
const editableFields = computed(() => props.modelValue.filter((field) => !field.hidden_for_new))
const deleteDialogOpen = ref(false)
const pendingDeleteField = shallowRef<FormFieldInput | null>(null)
const typeItems = computed(() =>
  FORM_FIELD_TYPE_VALUES.map((value) => ({
    value,
    title: $t(`manage.forms.types.${value}`),
    icon: TYPE_ICONS[value],
  })),
)
const isFormFieldType = (value: unknown): value is FormFieldType =>
  typeof value === 'string' && (FORM_FIELD_TYPE_VALUES as readonly string[]).includes(value)
const iconFor = (value: unknown): string => (isFormFieldType(value) ? TYPE_ICONS[value] : mdiTextShort)
const requiredRule = (value: string): boolean | string => value.trim() !== '' || $t('manage.forms.validation.required')
const updateField = (index: number, patch: Partial<FormFieldInput>): void => {
  emit(
    'update:modelValue',
    editableFields.value.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...patch } : field)),
  )
}

const addField = (): void => {
  if (props.disabled || editableFields.value.length >= FORM_FIELD_LIMITS.maxFields) return
  emit('update:modelValue', [
    ...editableFields.value,
    {
      type: 'text',
      label: '',
      description: '',
      required: false,
      hidden_for_new: false,
    },
  ])
}

const requestRemoveField = (field: FormFieldInput): void => {
  if (props.disabled) return
  pendingDeleteField.value = field
  deleteDialogOpen.value = true
}

const removeField = (): void => {
  if (props.disabled || pendingDeleteField.value == null) return
  emit(
    'update:modelValue',
    editableFields.value.filter((field) => field !== pendingDeleteField.value),
  )
  deleteDialogOpen.value = false
  pendingDeleteField.value = null
}

const addOption = (index: number): void => {
  const options = [...(editableFields.value[index].options ?? [])]
  if (options.length >= FORM_FIELD_LIMITS.maxOptions) return
  options.push({ label: '', hidden_for_new: false })
  updateField(index, { options })
}

const updateOption = (fieldIndex: number, optionIndex: number, patch: { label?: string }): void => {
  const field = editableFields.value[fieldIndex]
  updateField(fieldIndex, {
    options: (field.options ?? []).map((option, index) => (index === optionIndex ? { ...option, ...patch } : option)),
  })
}

const removeOption = (fieldIndex: number, optionIndex: number): void => {
  updateField(fieldIndex, {
    options: (editableFields.value[fieldIndex].options ?? []).filter((_, index) => index !== optionIndex),
  })
}

const reorderFields = (oldIndex: number, newIndex: number): void => {
  if (props.disabled || oldIndex === newIndex || oldIndex < 0 || newIndex < 0) return
  if (oldIndex >= editableFields.value.length || newIndex >= editableFields.value.length) return
  const next = [...editableFields.value]
  const moved = next[oldIndex]
  if (moved == null) return
  next.splice(oldIndex, 1)
  next.splice(newIndex, 0, moved)
  emit('update:modelValue', next)
}

const onDragEnd = (event: { oldIndex?: number; newIndex?: number }): void => {
  if (event.oldIndex == null || event.newIndex == null) return
  reorderFields(event.oldIndex, event.newIndex)
}

const moveField = (index: number, direction: -1 | 1): void => {
  reorderFields(index, index + direction)
}

const onTypeChange = (index: number, type: unknown): void => {
  if (!isFormFieldType(type)) return
  emit(
    'update:modelValue',
    editableFields.value.map((field, fieldIndex) => (fieldIndex === index ? changeFormFieldType(field, type) : field)),
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
            $t('manage.forms.field_count', { count: editableFields.length, max: FORM_FIELD_LIMITS.maxFields })
          }}</v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mt-1 mb-0">{{ $t('manage.forms.fields_hint') }}</p>
        <p class="text-body-2 text-medium-emphasis mt-1 mb-0">{{ $t('manage.forms.deleted_field_answers_hint') }}</p>
      </div>
    </div>
    <button
      v-if="editableFields.length === 0"
      type="button"
      class="form-field-empty"
      :disabled="disabled"
      @click="addField"
    >
      <v-icon :icon="mdiTextBoxPlusOutline" size="36" color="primary" class="mb-3" />
      <span class="text-subtitle-1 d-block mb-1">{{ $t('manage.forms.fields_empty') }}</span>
      <span class="text-body-2 text-medium-emphasis d-block">{{ $t('manage.forms.fields_empty_hint') }}</span>
    </button>
    <draggable
      :model-value="editableFields"
      item-key="field_id"
      handle=".form-field-drag-handle"
      :disabled="disabled"
      ghost-class="form-field-ghost"
      @end="onDragEnd"
    >
      <v-card
        v-for="(field, index) in editableFields"
        :key="field.field_id ?? `new-${index}`"
        class="mb-4"
        variant="flat"
        border
      >
        <div class="d-flex align-center ga-2 px-4 py-3">
          <button
            type="button"
            class="form-field-drag-handle"
            :aria-label="$t('manage.forms.drag_field', { number: index + 1 })"
            :disabled="disabled"
          >
            <v-icon :icon="mdiDragVertical" size="22" />
          </button>
          <v-avatar color="primary" variant="tonal" size="32" class="text-body-2 font-weight-medium">{{
            index + 1
          }}</v-avatar>
          <h3 class="text-subtitle-1">{{ $t('manage.forms.question_number', { number: index + 1 }) }}</h3>
          <v-spacer />
          <v-btn
            :icon="mdiArrowUp"
            :aria-label="$t('manage.forms.move_up', { number: index + 1 })"
            :disabled="disabled || index === 0"
            size="small"
            variant="text"
            color="secondary"
            @click="moveField(index, -1)"
          />
          <v-btn
            :icon="mdiArrowDown"
            :aria-label="$t('manage.forms.move_down', { number: index + 1 })"
            :disabled="disabled || index === editableFields.length - 1"
            size="small"
            variant="text"
            color="secondary"
            @click="moveField(index, 1)"
          />
          <v-btn
            :icon="mdiDeleteOutline"
            :aria-label="$t('manage.forms.remove_field', { number: index + 1 })"
            :disabled="disabled"
            size="small"
            variant="text"
            color="secondary"
            @click="requestRemoveField(field)"
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
                item-title="title"
                item-value="value"
                :label="$t('manage.forms.field_type')"
                :disabled="disabled"
                hide-details="auto"
                @update:model-value="onTypeChange(index, $event)"
              >
                <template #selection>
                  <div class="d-flex align-center ga-2">
                    <v-icon :icon="TYPE_ICONS[field.type]" size="20" />
                    <span>{{ $t(`manage.forms.types.${field.type}`) }}</span>
                  </div>
                </template>
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps" :prepend-icon="iconFor(item.value)" />
                </template>
              </v-select>
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
                :rules="[() => (field.options?.length ?? 0) > 0 || $t('manage.forms.validation.options_required')]"
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
        </div>
      </v-card>
    </draggable>
    <div v-if="editableFields.length > 0" class="d-flex justify-center">
      <v-btn
        :prepend-icon="mdiPlus"
        :disabled="disabled || editableFields.length >= FORM_FIELD_LIMITS.maxFields"
        class="form-field-add"
        size="large"
        variant="outlined"
        @click="addField"
      >
        {{ $t('manage.forms.add_field') }}
      </v-btn>
    </div>
    <v-dialog v-model="deleteDialogOpen" max-width="480">
      <v-card>
        <v-card-title>{{ $t('manage.forms.delete_field_title') }}</v-card-title>
        <v-card-text>{{ $t('manage.forms.delete_field_confirm') }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="deleteDialogOpen = false">{{ $t('manage.forms.cancel') }}</v-btn>
          <v-btn color="error" :disabled="disabled" @click="removeField">{{ $t('manage.forms.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<style scoped>
.form-field-drag-handle {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  cursor: grab;
  color: inherit;
}

.form-field-drag-handle:disabled {
  cursor: default;
  opacity: 0.4;
}

.form-field-drag-handle:active:not(:disabled) {
  cursor: grabbing;
}

.form-field-ghost {
  opacity: 0.5;
}

.form-field-empty {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 2rem;
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  background: rgb(var(--v-theme-surface));
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
}

.form-field-empty:hover:not(:disabled),
.form-field-empty:focus-visible:not(:disabled) {
  border-color: rgb(var(--v-theme-primary));
}

.form-field-empty:disabled {
  cursor: default;
  opacity: 0.6;
}

.form-field-add {
  min-width: 16rem;
}

.form-option-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 8px;
}
@media (max-width: 599px) {
  .form-option-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }
}
</style>
