import type { FormFieldInput } from '@shokujii/common/apis/form.js'
import { isChoiceFieldType } from '@shokujii/common/schemas/formFields.js'

export function formatDefaultFormName(
  communityName: string,
  format: (communityName: string) => string,
  maxLength: number,
): string {
  const trimmed = communityName.trim()
  if (trimmed === '') {
    return ''
  }
  const name = format(trimmed)
  if (name.length <= maxLength) {
    return name
  }
  return name.slice(0, maxLength)
}

export function createChoiceOptions(labels: readonly string[]): { label: string; hidden_for_new: false }[] {
  return labels.map((label) => ({ label, hidden_for_new: false }))
}

export function changeFormFieldType(
  field: FormFieldInput,
  type: FormFieldInput['type'],
  choiceOptionLabels: readonly string[] = [],
): FormFieldInput {
  if (field.type === type) {
    return field
  }

  // Callable は undefined を null に変換するため、旧ID・不要な選択肢はキーごと除く。
  return {
    type,
    label: field.label,
    description: field.description ?? '',
    required: field.required,
    hidden_for_new: false,
    ...(isChoiceFieldType(type) ? { options: createChoiceOptions(choiceOptionLabels) } : {}),
  }
}
