import type { FormFieldInput } from '@shokujii/common/apis/form.js'
import { isChoiceFieldType } from '@shokujii/common/schemas/formFields.js'

export function changeFormFieldType(field: FormFieldInput, type: FormFieldInput['type']): FormFieldInput {
  if (field.type === type) {
    return field
  }

  // Callable は undefined を null に変換するため、旧ID・不要な選択肢はキーごと除く。
  return {
    type,
    label: field.label,
    description: field.description ?? '',
    required: field.required,
    hidden_for_new: field.hidden_for_new ?? false,
    ...(isChoiceFieldType(type) ? { options: [{ label: '', hidden_for_new: false }] } : {}),
  }
}
