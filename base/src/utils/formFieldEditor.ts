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
  if (!name.startsWith(trimmed)) {
    return name.slice(0, maxLength)
  }
  const suffix = name.slice(trimmed.length)
  if (suffix.length >= maxLength) {
    return suffix.slice(0, maxLength)
  }
  return `${trimmed.slice(0, maxLength - suffix.length)}${suffix}`
}

export function nextDefaultOptionNumber(existingLabels: readonly string[], format: (number: number) => string): number {
  const used = new Set(existingLabels)
  let number = 1
  while (used.has(format(number))) {
    number += 1
  }
  return number
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
