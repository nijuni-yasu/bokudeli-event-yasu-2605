import type { FormField } from '../schemas/formFields.js'

export function nextCommunityFormDefinitionVersion(params: {
  currentVersion: number
  existingFields: FormField[]
  existingPurpose: string
  nextFields: FormField[]
  nextPurpose: string
}): number {
  const purposeChanged = params.existingPurpose !== params.nextPurpose
  const fieldsChanged = JSON.stringify(params.existingFields) !== JSON.stringify(params.nextFields)
  if (purposeChanged || fieldsChanged) {
    return params.currentVersion + 1
  }
  return params.currentVersion
}
