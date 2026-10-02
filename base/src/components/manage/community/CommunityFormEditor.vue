<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import { mdiArrowLeft, mdiContentSaveOutline, mdiEyeOutline, mdiTextBoxOutline } from '@mdi/js'
import FormFieldsEditor from '@shokujii/base/components/forms/FormFieldsEditor.vue'
import FormAnswerFields from '@shokujii/base/components/forms/FormAnswerFields.vue'
import { useAppCommunityStore } from '@shokujii/base/composable/useAppCommunityStore.js'
import { useNotification } from '@shokujii/base/composable/notification.js'
import { createCommunityForm, getCommunityForm, updateCommunityForm } from '@shokujii/base/apis/form.js'
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

const props = defineProps<{
  formId?: string
  resolveFormsPath: ResolveManageCommunityFormsPathFn
}>()

const { t: $t } = useI18n()
const router = useRouter()
const notification = useNotification()
const communityAccount = useRoute().params.communityAccount as string
const communityStore = useAppCommunityStore(communityAccount)
const communityId = computed(() => communityStore.community?.community_id ?? '')

const name = ref('')
const description = ref('')
const purpose = ref('')
const fields = ref<FormFieldInput[]>([])
const loading = ref(false)
const saving = ref(false)
const previewOpen = ref(false)
const previewAnswers = ref<FormAnswerInput[]>([])
const formRef = ref<InstanceType<typeof VForm> | null>(null)
const loadFailed = ref(false)
const validationFailed = ref(false)
const ready = computed(() => communityId.value !== '' && !loading.value && !loadFailed.value)
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

const load = async () => {
  if (props.formId == null || communityId.value === '') {
    return
  }
  loading.value = true
  loadFailed.value = false
  try {
    const response = await getCommunityForm({ community_id: communityId.value, form_id: props.formId })
    name.value = response.data.form.name
    description.value = response.data.form.description
    purpose.value = response.data.form.purpose
    fields.value = omitHiddenFormFields(response.data.form.fields)
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => [communityId.value, props.formId],
  () => {
    void load()
  },
  { immediate: true },
)

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
        purpose: purpose.value,
        fields: fields.value,
      })
      notification.show($t('manage.forms.saved'), 'success')
      void router.replace(props.resolveFormsPath(communityAccount))
    } else {
      await updateCommunityForm({
        community_id: communityId.value,
        form_id: props.formId,
        name: name.value.trim(),
        description: description.value,
        purpose: purpose.value,
        fields: fields.value,
      })
      notification.show($t('manage.forms.saved'), 'success')
      void router.push(props.resolveFormsPath(communityAccount))
    }
  } catch {
    notification.show($t('manage.forms.save_failed'), 'error')
  } finally {
    saving.value = false
  }
}

const back = () => {
  void router.push(props.resolveFormsPath(communityAccount))
}

const openPreview = (): void => {
  previewAnswers.value = []
  previewOpen.value = true
}
</script>

<template>
  <v-container class="manage-container form-editor">
    <v-btn :prepend-icon="mdiArrowLeft" variant="text" class="mb-4" :disabled="saving" @click="back">{{
      $t('manage.forms.back_to_list')
    }}</v-btn>
    <div class="d-flex align-center ga-3 mb-6">
      <v-avatar color="primary" variant="tonal" rounded="lg" size="48"><v-icon :icon="mdiTextBoxOutline" /></v-avatar>
      <div>
        <h1 class="text-h5 mb-1">{{ formId == null ? $t('manage.forms.create') : $t('manage.forms.edit') }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('manage.forms.editor_hint') }}</p>
      </div>
    </div>
    <v-progress-linear v-if="loading || communityId === ''" indeterminate color="primary" />
    <v-alert v-else-if="loadFailed" type="error" variant="tonal">
      {{ $t('manage.forms.load_failed') }}
      <template #append
        ><v-btn variant="text" @click="load">{{ $t('manage.forms.retry') }}</v-btn></template
      >
    </v-alert>
    <v-form v-else ref="formRef" :disabled="saving" @submit.prevent="save">
      <v-card variant="flat" border class="mb-6">
        <v-card-title class="pt-5 px-5">{{ $t('manage.forms.basic_info') }}</v-card-title>
        <v-card-text class="pa-5 pt-3">
          <v-text-field
            v-model="name"
            :label="$t('manage.forms.name_required')"
            :placeholder="$t('manage.forms.name_placeholder')"
            :maxlength="FORM_FIELD_LIMITS.maxName"
            :rules="[requiredRule]"
            hide-details="auto"
            class="mb-5"
          />
          <v-textarea
            v-model="description"
            :label="$t('manage.forms.description')"
            :maxlength="FORM_FIELD_LIMITS.maxDescription"
            rows="2"
            auto-grow
            hide-details="auto"
            class="mb-5"
          />
          <v-textarea
            v-model="purpose"
            :label="$t('manage.forms.purpose')"
            :hint="$t('manage.forms.purpose_hint')"
            persistent-hint
            :maxlength="FORM_FIELD_LIMITS.maxPurpose"
            rows="2"
            auto-grow
          />
        </v-card-text>
      </v-card>
      <FormFieldsEditor v-model="fields" :disabled="saving" />
      <v-alert v-if="validationFailed" type="error" variant="tonal" class="mt-4">{{
        $t('manage.forms.validation.summary')
      }}</v-alert>
      <v-sheet
        border
        rounded="lg"
        class="form-editor-actions d-flex flex-wrap align-center ga-3 pa-4 mt-6"
        elevation="2"
      >
        <v-btn :prepend-icon="mdiEyeOutline" variant="outlined" :disabled="saving" @click="openPreview">{{
          $t('manage.forms.preview')
        }}</v-btn>
        <v-spacer />
        <v-btn
          :prepend-icon="mdiContentSaveOutline"
          type="submit"
          color="primary"
          :loading="saving"
          :disabled="!ready"
          >{{ $t('manage.forms.save') }}</v-btn
        >
      </v-sheet>
    </v-form>
    <v-dialog v-model="previewOpen" max-width="720" scrollable>
      <v-card>
        <v-card-title>{{ $t('manage.forms.preview') }}</v-card-title>
        <v-card-text>
          <v-alert type="info" variant="tonal" class="mb-6">{{ $t('manage.forms.preview_notice') }}</v-alert>
          <h2 class="text-h6 mb-2 form-editor-copy">{{ name }}</h2>
          <p v-if="description !== ''" class="text-body-2 text-medium-emphasis mb-4 form-editor-copy">
            {{ description }}
          </p>
          <p v-if="purpose !== ''" class="mb-6 form-editor-copy">{{ purpose }}</p>
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
.form-editor {
  max-width: 960px;
}
.form-editor-actions {
  position: sticky;
  bottom: 16px;
  z-index: 2;
}
.form-editor-copy {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
