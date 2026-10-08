<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'
import { mdiTextBoxOutline } from '@mdi/js'
import type { CommunityFormSummary } from '@shokujii/common/apis/form.js'

const props = withDefaults(
  defineProps<{
    items: CommunityFormSummary[]
    loading?: boolean
    loadFailed?: boolean
    disabled?: boolean
    isEnterprise?: boolean
    canceled?: boolean
    notEditable?: boolean
    formsPath?: RouteLocationRaw
  }>(),
  {
    loading: false,
    loadFailed: false,
    disabled: false,
    isEnterprise: false,
    canceled: false,
    notEditable: false,
  },
)

const emit = defineEmits<{
  retry: []
}>()

const selectedFormId = defineModel<string>({ required: true })

const { t: $t } = useI18n()

const attachForm = ref(selectedFormId.value !== '')

watch(selectedFormId, (formId, previousFormId) => {
  if (formId !== '') {
    attachForm.value = true
    return
  }
  if (previousFormId != null && previousFormId !== '') {
    attachForm.value = false
  }
})

const controlsDisabled = computed(() => props.disabled || props.canceled || props.notEditable)

const selectableForms = computed(() => props.items.filter((form) => form.field_count > 0))

const selectItems = computed(() => {
  const selected = props.items.find((form) => form.form_id === selectedFormId.value)
  const forms =
    selected != null && selected.field_count <= 0 ? [...selectableForms.value, selected] : selectableForms.value
  return forms.map((form) => ({
    ...form,
    props: { disabled: form.field_count <= 0 },
  }))
})

const formSelectionRule = (value: unknown): true | string => {
  if (typeof value === 'string' && value !== '') {
    return true
  }
  if (selectableForms.value.length === 0) {
    return $t('event_edit.community_form_empty')
  }
  return $t('event_edit.community_form_select_required')
}

const onAttachFormChange = (value: unknown) => {
  if (typeof value !== 'boolean') {
    return
  }
  attachForm.value = value
  if (!value) {
    selectedFormId.value = ''
  }
}
</script>

<template>
  <v-card flat class="mt-2">
    <v-card-title class="pt-6 pt-md-10 px-2 px-md-5">
      <v-icon size="50" class="text--primary me-3" :icon="mdiTextBoxOutline" />
      {{ $t('event_edit.community_form') }}
    </v-card-title>
    <v-card-text class="pt-2 pt-md-5">
      <v-alert v-if="isEnterprise" type="info" variant="tonal">{{ $t('manage.forms.enterprise_unsupported') }}</v-alert>
      <template v-else>
        <i18n-t keypath="event_edit.community_form_hint" tag="p" class="text-body-2 text-medium-emphasis mb-4">
          <template #forms>
            <router-link v-if="formsPath != null" :to="formsPath" class="text-primary">{{
              $t('event_edit.community_forms_link')
            }}</router-link>
            <template v-else>{{ $t('event_edit.community_forms_link') }}</template>
          </template>
        </i18n-t>
        <v-alert v-if="canceled" type="info" variant="tonal" class="mb-4">{{
          $t('event_edit.community_form_canceled')
        }}</v-alert>
        <v-alert v-else-if="notEditable" type="info" variant="tonal" class="mb-4">{{
          $t('event_edit.community_form_not_editable')
        }}</v-alert>
        <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
        <v-alert v-else-if="loadFailed" type="error" variant="tonal" class="mb-4">
          {{ $t('manage.forms.load_failed') }}
          <template #append>
            <v-btn variant="text" @click="emit('retry')">{{ $t('manage.forms.retry') }}</v-btn>
          </template>
        </v-alert>
        <div v-else>
          <v-radio-group
            :model-value="attachForm"
            hide-details
            class="ma-1 ma-md-3"
            :disabled="controlsDisabled"
            @update:model-value="onAttachFormChange"
          >
            <v-radio :label="$t('event_edit.community_form_set')" :value="true" />
            <v-radio :label="$t('event_edit.community_form_none')" :value="false" />
          </v-radio-group>
          <v-select
            v-if="attachForm && selectItems.length > 0"
            v-model="selectedFormId"
            :items="selectItems"
            item-title="name"
            item-value="form_id"
            :label="$t('event_edit.community_form_select_label')"
            :disabled="controlsDisabled"
            :rules="[formSelectionRule]"
            hide-details="auto"
            class="mt-2"
          />
          <template v-else-if="attachForm">
            <v-alert type="info" variant="tonal" class="mt-2">{{ $t('event_edit.community_form_empty') }}</v-alert>
            <v-input :model-value="selectedFormId" :rules="[formSelectionRule]" class="d-none" />
          </template>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>
