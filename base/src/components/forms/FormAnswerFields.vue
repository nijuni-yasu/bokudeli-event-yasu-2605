<script setup lang="ts">
import type { FormField } from '@shokujii/common/schemas/formFields.js'
import type { FormAnswerInput, FormValidationIssue } from '@shokujii/common/utils/validateFormAnswers.js'

const props = withDefaults(
  defineProps<{
    fields: FormField[]
    modelValue: FormAnswerInput[]
    disabled?: boolean
    issues?: FormValidationIssue[]
  }>(),
  {
    disabled: false,
    issues: () => [],
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: FormAnswerInput[]]
}>()

const { t: $t } = useI18n()

const issueMessage = (fieldId: string): string => {
  const issue = props.issues.find((item) => item.field_id === fieldId)
  if (issue == null) {
    return ''
  }
  return $t(`manage.forms.issues.${issue.code}`)
}

const answerFor = (fieldId: string): FormAnswerInput => {
  return props.modelValue.find((answer) => answer.field_id === fieldId) ?? { field_id: fieldId }
}

const upsert = (next: FormAnswerInput) => {
  const rest = props.modelValue.filter((answer) => answer.field_id !== next.field_id)
  emit('update:modelValue', [...rest, next])
}

const setText = (fieldId: string, textValue: string) => {
  upsert({ field_id: fieldId, text_value: textValue })
}

const setOption = (fieldId: string, optionId: string) => {
  upsert({ field_id: fieldId, option_id: optionId })
}

const setOptions = (fieldId: string, optionIds: string[]) => {
  upsert({ field_id: fieldId, option_ids: optionIds })
}

const textInputType = (type: FormField['type']): string => (type === 'phone' ? 'tel' : type)

const visibleOptions = (field: FormField) => {
  if (field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'select') {
    return []
  }
  return field.options.filter((option) => !option.hidden_for_new)
}
</script>

<template>
  <div class="d-flex flex-column ga-4">
    <v-sheet
      v-for="(field, index) in fields"
      :key="field.field_id"
      border
      rounded="lg"
      class="pa-4 pa-sm-5 form-answer"
    >
      <div class="d-flex align-center ga-2 mb-3">
        <span class="text-caption text-medium-emphasis">{{
          $t('manage.forms.question_number', { number: index + 1 })
        }}</span>
        <v-chip v-if="field.required" color="error" size="x-small" variant="tonal">{{
          $t('manage.forms.field_required')
        }}</v-chip>
        <span v-else class="text-caption text-medium-emphasis">{{ $t('manage.forms.field_optional') }}</span>
      </div>
      <div class="text-subtitle-1 font-weight-medium mb-2 form-answer-copy">{{ field.label }}</div>
      <div v-if="field.description !== ''" class="text-body-2 text-medium-emphasis mb-4 form-answer-copy">
        {{ field.description }}
      </div>
      <p v-if="field.type === 'checkbox'" class="text-caption text-medium-emphasis mb-2">
        {{ $t('manage.forms.multiple_choice_hint') }}
      </p>
      <v-text-field
        v-if="field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'date'"
        :model-value="answerFor(field.field_id).text_value ?? ''"
        :type="textInputType(field.type)"
        :disabled="disabled"
        :error-messages="issueMessage(field.field_id)"
        hide-details="auto"
        variant="outlined"
        @update:model-value="setText(field.field_id, String($event ?? ''))"
      />
      <v-textarea
        v-else-if="field.type === 'textarea'"
        :model-value="answerFor(field.field_id).text_value ?? ''"
        :disabled="disabled"
        :error-messages="issueMessage(field.field_id)"
        hide-details="auto"
        variant="outlined"
        rows="4"
        auto-grow
        @update:model-value="setText(field.field_id, String($event ?? ''))"
      />
      <v-radio-group
        v-else-if="field.type === 'radio'"
        :model-value="answerFor(field.field_id).option_id ?? ''"
        :disabled="disabled"
        :error-messages="issueMessage(field.field_id)"
        hide-details="auto"
        @update:model-value="setOption(field.field_id, String($event ?? ''))"
      >
        <v-radio
          v-for="option in visibleOptions(field)"
          :key="option.option_id"
          :label="option.label"
          :value="option.option_id"
        />
      </v-radio-group>
      <v-select
        v-else-if="field.type === 'select'"
        :model-value="answerFor(field.field_id).option_id ?? ''"
        :items="visibleOptions(field)"
        item-title="label"
        item-value="option_id"
        :menu-props="{ contentClass: 'form-answer-options' }"
        :disabled="disabled"
        :error-messages="issueMessage(field.field_id)"
        hide-details="auto"
        variant="outlined"
        @update:model-value="setOption(field.field_id, String($event ?? ''))"
      />
      <v-select
        v-else-if="field.type === 'checkbox'"
        :model-value="answerFor(field.field_id).option_ids ?? []"
        :items="visibleOptions(field)"
        item-title="label"
        item-value="option_id"
        :menu-props="{ contentClass: 'form-answer-options' }"
        multiple
        chips
        closable-chips
        :disabled="disabled"
        :error-messages="issueMessage(field.field_id)"
        hide-details="auto"
        variant="outlined"
        @update:model-value="setOptions(field.field_id, Array.isArray($event) ? $event.map(String) : [])"
      />
    </v-sheet>
  </div>
</template>

<style scoped>
.form-answer {
  min-width: 0;
}
.form-answer-copy {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.form-answer :deep(.v-label) {
  white-space: normal;
  overflow-wrap: anywhere;
}
.form-answer :deep(.v-select__selection),
.form-answer :deep(.v-chip__content) {
  min-width: 0;
}
.form-answer :deep(.v-chip__content) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
:global(.form-answer-options .v-list-item-title) {
  white-space: normal;
  overflow-wrap: anywhere;
}
</style>
