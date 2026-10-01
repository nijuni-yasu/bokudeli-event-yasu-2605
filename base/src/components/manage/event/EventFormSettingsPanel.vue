<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import { mdiContentSaveOutline } from '@mdi/js'
import FormFieldsEditor from '@shokujii/base/components/forms/FormFieldsEditor.vue'
import ConfirmDialog from '@shokujii/base/components/ConfirmDialog.vue'
import { useNotification } from '@shokujii/base/composable/notification.js'
import {
  clearEventFormConfig,
  getEventFormConfig,
  listCommunityForms,
  setEventFormFromCommunity,
  updateEventFormConfig,
} from '@shokujii/base/apis/form.js'
import type { CommunityFormSummary, EventFormConfigDto, FormFieldInput } from '@shokujii/common/apis/form.js'
import { FORM_FIELD_LIMITS, isEventFormEditableStatus } from '@shokujii/common/schemas/formFields.js'
import type { BokudeliEvent } from '@shokujii/base/stores/event.js'

const props = defineProps<{
  event: BokudeliEvent
}>()

const { t: $t } = useI18n()
const notification = useNotification()

const config = ref<EventFormConfigDto | null>(null)
const forms = ref<CommunityFormSummary[]>([])
const selectedFormId = ref('')
const purpose = ref('')
const fields = ref<FormFieldInput[]>([])
const loading = ref(false)
const saving = ref(false)
const clearConfirmOpen = ref(false)
const formRef = ref<InstanceType<typeof VForm> | null>(null)
const validationFailed = ref(false)
const loadFailed = ref(false)

const isEnterprise = computed(() => props.event.enterprise_id != null && props.event.enterprise_id !== '')
const editable = computed(() => isEventFormEditableStatus(props.event.event_status.value))

const load = async () => {
  if (isEnterprise.value) {
    return
  }
  loading.value = true
  loadFailed.value = false
  try {
    const [configRes, formsRes] = await Promise.all([
      getEventFormConfig({ community_id: props.event.community_id, event_id: props.event.event_id }),
      listCommunityForms({ community_id: props.event.community_id }),
    ])
    config.value = configRes.data.config
    forms.value = formsRes.data.forms.filter((form) => !form.archived)
    purpose.value = configRes.data.config?.purpose ?? ''
    fields.value = configRes.data.config?.fields ?? []
    selectedFormId.value = configRes.data.config?.source_form_id ?? forms.value[0]?.form_id ?? ''
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => props.event.event_id,
  () => {
    void load()
  },
  { immediate: true },
)

const applyCommunityForm = async () => {
  if (selectedFormId.value === '' || saving.value || loading.value || loadFailed.value) {
    return
  }
  saving.value = true
  try {
    const response = await setEventFormFromCommunity({
      community_id: props.event.community_id,
      event_id: props.event.event_id,
      form_id: selectedFormId.value,
    })
    config.value = response.data.config
    purpose.value = response.data.config.purpose
    fields.value = response.data.config.fields
    validationFailed.value = false
    formRef.value?.resetValidation()
    notification.show($t('manage.forms.saved'), 'success')
  } catch {
    notification.show($t('manage.forms.save_failed'), 'error')
  } finally {
    saving.value = false
  }
}

const saveFields = async () => {
  if (saving.value || loading.value || loadFailed.value || !editable.value) return
  saving.value = true
  try {
    const validation = await formRef.value?.validate()
    validationFailed.value = validation?.valid !== true
    if (validationFailed.value) return
    const response = await updateEventFormConfig({
      community_id: props.event.community_id,
      event_id: props.event.event_id,
      purpose: purpose.value,
      fields: fields.value,
    })
    config.value = response.data.config
    purpose.value = response.data.config.purpose
    fields.value = response.data.config.fields
    notification.show($t('manage.forms.saved'), 'success')
  } catch {
    notification.show($t('manage.forms.save_failed'), 'error')
  } finally {
    saving.value = false
  }
}

const requestClear = () => {
  clearConfirmOpen.value = true
}

const clear = async () => {
  saving.value = true
  try {
    await clearEventFormConfig({
      community_id: props.event.community_id,
      event_id: props.event.event_id,
    })
    config.value = null
    purpose.value = ''
    fields.value = []
    notification.show($t('manage.forms.saved'), 'success')
  } catch {
    notification.show($t('manage.forms.save_failed'), 'error')
  } finally {
    saving.value = false
    clearConfirmOpen.value = false
  }
}
</script>

<template>
  <div>
    <v-alert v-if="isEnterprise" type="info" variant="tonal">{{ $t('manage.forms.enterprise_unsupported') }}</v-alert>
    <v-alert v-else-if="!editable" type="info" variant="tonal" class="mb-4">{{
      $t('manage.forms.event_not_editable')
    }}</v-alert>
    <v-progress-linear v-else-if="loading" indeterminate color="primary" class="mb-4" />
    <v-alert v-else-if="loadFailed" type="error" variant="tonal">
      {{ $t('manage.forms.load_failed') }}
      <template #append
        ><v-btn variant="text" @click="load">{{ $t('manage.forms.retry') }}</v-btn></template
      >
    </v-alert>
    <template v-else>
      <p class="text-body-2 text-medium-emphasis mb-4">{{ $t('manage.forms.event_form_hint') }}</p>
      <div class="d-flex flex-wrap ga-3 align-center mb-4">
        <v-select
          v-model="selectedFormId"
          :items="forms"
          item-title="name"
          item-value="form_id"
          :label="$t('manage.forms.select_form')"
          hide-details
          :disabled="saving"
          style="min-width: 0; flex-basis: 240px"
        />
        <v-btn
          color="primary"
          :loading="saving"
          :disabled="selectedFormId === '' || saving"
          @click="applyCommunityForm"
        >
          {{ config == null ? $t('manage.forms.set_to_event') : $t('manage.forms.replace_event') }}
        </v-btn>
        <v-btn v-if="config != null" variant="text" color="secondary" :disabled="saving" @click="requestClear">
          {{ $t('manage.forms.clear_event') }}
        </v-btn>
      </div>
      <v-alert v-if="config == null" type="info" variant="tonal">{{ $t('manage.forms.no_event_form') }}</v-alert>
      <v-form v-else ref="formRef" :disabled="saving" @submit.prevent="saveFields">
        <v-divider class="my-6" />
        <h2 class="text-h6 mb-1">{{ $t('manage.forms.event_fields') }}</h2>
        <p class="text-body-2 text-medium-emphasis mb-4">{{ $t('manage.forms.event_edit_hint') }}</p>
        <v-textarea
          v-model="purpose"
          :label="$t('manage.forms.purpose')"
          :maxlength="FORM_FIELD_LIMITS.maxPurpose"
          rows="2"
          auto-grow
          :hint="$t('manage.forms.purpose_hint')"
          persistent-hint
          class="mb-4"
        />
        <FormFieldsEditor v-model="fields" :disabled="saving" />
        <v-alert v-if="validationFailed" type="error" variant="tonal" class="mt-4">{{
          $t('manage.forms.validation.summary')
        }}</v-alert>
        <div class="d-flex justify-end mt-4">
          <v-btn type="submit" :prepend-icon="mdiContentSaveOutline" color="primary" :loading="saving">{{
            $t('manage.forms.save')
          }}</v-btn>
        </div>
      </v-form>
    </template>
    <ConfirmDialog v-model="clearConfirmOpen" :is-confirm="true" :ok-click="clear" :ok-loading-state="saving">
      {{ $t('manage.forms.clear_confirm') }}
    </ConfirmDialog>
  </div>
</template>
