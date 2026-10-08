<script setup lang="ts">
import { onUnmounted } from 'vue'
import type { VForm } from 'vuetify/components'
import { mdiArrowLeft, mdiContentSaveOutline, mdiEyeOutline } from '@mdi/js'
import FormFieldsEditor from '@shokujii/base/components/forms/FormFieldsEditor.vue'
import FormAnswerFields from '@shokujii/base/components/forms/FormAnswerFields.vue'
import FormLinkedText from '@shokujii/base/components/forms/FormLinkedText.vue'
import { useCreateAppCommunityStore } from '@shokujii/base/composable/useAppCommunityStore.js'
import { useNotification } from '@shokujii/base/composable/notification.js'
import { createCommunityForm, updateCommunityForm } from '@shokujii/base/apis/form.js'
import type { FormFieldInput } from '@shokujii/common/apis/form.js'
import type { FormAnswerInput } from '@shokujii/common/utils/validateFormAnswers.js'
import {
  FORM_FIELD_LIMITS,
  FormFieldSchema,
  isChoiceFieldType,
  omitHiddenFormFields,
  type FormField,
} from '@shokujii/common/schemas/formFields.js'
import type { ResolveManageCommunityFormsPathFn } from '@shokujii/base/types/profilePathResolvers.js'
import { formatDefaultFormName } from '@shokujii/base/utils/formFieldEditor.js'

const props = defineProps<{
  formId?: string
  resolveFormsPath: ResolveManageCommunityFormsPathFn
}>()

const { t: $t } = useI18n()
const router = useRouter()
const route = useRoute()
const notification = useNotification()
const communityAccount = computed(() => {
  const value = route.params.communityAccount
  if (typeof value === 'string') {
    return value
  }
  return Array.isArray(value) ? (value[0] ?? '') : ''
})
const createCommunityStore = useCreateAppCommunityStore()
const communityStore = computed(() => createCommunityStore(communityAccount.value))
const communityId = computed(() => communityStore.value.community?.community_id ?? '')

const name = ref('')

watch(
  () => communityStore.value.community?.community_name ?? '',
  (communityName) => {
    if (props.formId != null || name.value !== '') {
      return
    }
    const next = formatDefaultFormName(
      communityName,
      (value) => $t('manage.forms.default_name', { communityName: value }),
      FORM_FIELD_LIMITS.maxName,
    )
    if (next === '') {
      return
    }
    name.value = next
  },
  { immediate: true },
)
const description = ref('')
const fields = ref<FormFieldInput[]>([])
const saving = ref(false)
const previewOpen = ref(false)
const previewAnswers = ref<FormAnswerInput[]>([])
const formRef = ref<InstanceType<typeof VForm> | null>(null)
const loadFailed = ref(false)
const hydratedFormId = ref('')
const validationFailed = ref(false)
const awaitingSnapshot = computed(
  () => props.formId != null && hydratedFormId.value !== props.formId && !loadFailed.value,
)
const ready = computed(
  () =>
    communityId.value !== '' && (props.formId == null || hydratedFormId.value === props.formId) && !loadFailed.value,
)
const requiredRule = (value: string): boolean | string => value.trim() !== '' || $t('manage.forms.validation.required')

const previewFields = computed<FormField[]>(() => {
  const parsed: FormField[] = []
  fields.value.forEach((field, index) => {
    if (field.hidden_for_new || field.label.trim() === '') {
      return
    }
    if (isChoiceFieldType(field.type)) {
      const options = (field.options ?? [])
        .filter((option) => option.label.trim() !== '')
        .map((option, optionIndex) => ({
          option_id: option.option_id ?? `preview_opt_${index}_${optionIndex}`,
          label: option.label,
          hidden_for_new: option.hidden_for_new ?? false,
        }))
      const result = FormFieldSchema.safeParse({
        field_id: field.field_id ?? `preview_${index}`,
        type: field.type,
        label: field.label,
        description: field.description ?? '',
        required: field.required,
        hidden_for_new: field.hidden_for_new ?? false,
        options,
      })
      if (result.success) {
        parsed.push(result.data)
      }
      return
    }
    const result = FormFieldSchema.safeParse({
      field_id: field.field_id ?? `preview_${index}`,
      type: field.type,
      label: field.label,
      description: field.description ?? '',
      required: field.required,
      hidden_for_new: field.hidden_for_new ?? false,
    })
    if (result.success) {
      parsed.push(result.data)
    }
  })
  return parsed
})

const applyForm = (formId: string) => {
  const list = communityStore.value.communityForms
  const form = list?.find((item) => item.id === formId)
  if (form == null) {
    return false
  }
  name.value = form.name
  description.value = form.description
  fields.value = omitHiddenFormFields(form.fields).map((field) =>
    field.type === 'checkbox' || field.type === 'radio' || field.type === 'select'
      ? {
          field_id: field.field_id,
          type: field.type,
          label: field.label,
          description: field.description,
          required: field.required,
          hidden_for_new: field.hidden_for_new,
          options: field.options.map((option) => ({
            option_id: option.option_id,
            label: option.label,
            hidden_for_new: option.hidden_for_new,
          })),
        }
      : {
          field_id: field.field_id,
          type: field.type,
          label: field.label,
          description: field.description,
          required: field.required,
          hidden_for_new: field.hidden_for_new,
        },
  )
  hydratedFormId.value = formId
  loadFailed.value = false
  return true
}

let missingTimer: number | undefined

const clearMissingTimer = () => {
  if (missingTimer != null) {
    window.clearTimeout(missingTimer)
    missingTimer = undefined
  }
}

watch(
  () => ({
    formId: props.formId ?? '',
    forms: communityStore.value.communityForms,
    failed: communityStore.value.communityFormsLoadFailed,
  }),
  ({ formId, forms, failed }) => {
    if (formId === '') {
      clearMissingTimer()
      loadFailed.value = false
      return
    }
    if (hydratedFormId.value === formId) {
      clearMissingTimer()
      return
    }
    if (failed) {
      clearMissingTimer()
      loadFailed.value = true
      return
    }
    if (forms == null) {
      clearMissingTimer()
      return
    }
    if (applyForm(formId)) {
      clearMissingTimer()
      return
    }
    if (missingTimer != null) {
      return
    }
    missingTimer = window.setTimeout(() => {
      missingTimer = undefined
      if (props.formId === formId && hydratedFormId.value !== formId) {
        loadFailed.value = true
      }
    }, 1000)
  },
  { immediate: true },
)

onUnmounted(clearMissingTimer)

const retry = () => {
  loadFailed.value = false
  hydratedFormId.value = ''
  clearMissingTimer()
  communityStore.value.retryCommunityForms()
}

const save = async () => {
  if (!ready.value || saving.value) {
    return
  }
  saving.value = true
  try {
    const validation = await formRef.value?.validate()
    validationFailed.value = validation?.valid !== true
    if (validationFailed.value) return
    if (props.formId == null) {
      await createCommunityForm({
        community_id: communityId.value,
        name: name.value.trim(),
        description: description.value,
        fields: fields.value,
      })
      notification.show($t('manage.forms.saved'), 'success')
      void router.replace(props.resolveFormsPath(communityAccount.value))
    } else {
      await updateCommunityForm({
        community_id: communityId.value,
        form_id: props.formId,
        name: name.value.trim(),
        description: description.value,
        fields: fields.value,
      })
      notification.show($t('manage.forms.saved'), 'success')
      void router.push(props.resolveFormsPath(communityAccount.value))
    }
  } catch {
    notification.show($t('manage.forms.save_failed'), 'error')
  } finally {
    saving.value = false
  }
}

const back = () => {
  void router.push(props.resolveFormsPath(communityAccount.value))
}

const openPreview = (): void => {
  previewAnswers.value = []
  previewOpen.value = true
}
</script>

<template>
  <v-container class="manage-container">
    <v-row class="justify-center">
      <v-col md="10" sm="10" cols="12">
        <v-btn :prepend-icon="mdiArrowLeft" variant="text" class="mb-4" :disabled="saving" @click="back">{{
          $t('manage.forms.back_to_list')
        }}</v-btn>
        <v-progress-linear v-if="awaitingSnapshot" indeterminate color="primary" />
        <v-alert v-else-if="loadFailed" type="error" variant="tonal">
          {{ $t('manage.forms.load_failed') }}
          <template #append
            ><v-btn variant="text" @click="retry">{{ $t('manage.forms.retry') }}</v-btn></template
          >
        </v-alert>
        <v-form v-else ref="formRef" :disabled="saving" @submit.prevent="save">
          <v-card class="pa-6 pa-md-16">
            <v-row>
              <v-col cols="12">
                <span class="text-h4 font-weight-bold">{{
                  formId == null ? $t('manage.forms.create') : $t('manage.forms.edit')
                }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <span class="text-h6 font-weight-bold">{{ $t('manage.forms.basic_info') }}</span>
                <v-text-field
                  v-model="name"
                  :label="$t('manage.forms.name_required')"
                  :placeholder="$t('manage.forms.name_placeholder')"
                  :maxlength="FORM_FIELD_LIMITS.maxName"
                  :rules="[requiredRule]"
                  hide-details="auto"
                  class="mt-4"
                />
                <v-textarea
                  v-model="description"
                  :label="$t('manage.forms.description')"
                  :hint="$t('manage.forms.description_privacy_hint')"
                  persistent-hint
                  :maxlength="FORM_FIELD_LIMITS.maxDescription"
                  rows="2"
                  auto-grow
                  class="mt-4"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <FormFieldsEditor v-model="fields" :disabled="saving" />
              </v-col>
            </v-row>
            <v-alert v-if="validationFailed" type="error" variant="tonal" class="my-6">{{
              $t('manage.forms.validation.summary')
            }}</v-alert>
            <v-row>
              <v-col cols="12" class="d-flex flex-wrap justify-end ga-3">
                <v-btn :prepend-icon="mdiEyeOutline" variant="outlined" :disabled="saving" @click="openPreview">{{
                  $t('manage.forms.preview')
                }}</v-btn>
                <v-btn :prepend-icon="mdiContentSaveOutline" type="submit" :loading="saving" :disabled="!ready">{{
                  $t('manage.forms.save')
                }}</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
    <v-dialog v-model="previewOpen" max-width="720" scrollable>
      <v-card>
        <v-card-title>{{ $t('manage.forms.preview') }}</v-card-title>
        <v-card-text>
          <v-alert type="info" variant="tonal" class="mb-6">{{ $t('manage.forms.preview_notice') }}</v-alert>
          <h2 class="text-h6 mb-2 form-editor-copy">{{ name }}</h2>
          <p v-if="description !== ''" class="text-body-2 text-medium-emphasis mb-6 form-editor-copy">
            <FormLinkedText :text="description" />
          </p>
          <FormAnswerFields v-if="previewFields.length > 0" v-model="previewAnswers" :fields="previewFields" />
          <v-alert v-else type="info" variant="tonal">{{ $t('manage.forms.preview_empty') }}</v-alert>
        </v-card-text>
        <v-card-actions
          ><v-spacer /><v-btn @click="previewOpen = false">{{ $t('manage.forms.close') }}</v-btn></v-card-actions
        >
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.form-editor-copy {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
