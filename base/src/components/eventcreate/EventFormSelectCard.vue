<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const selectItems = computed(() => [{ form_id: '', name: $t('event_edit.community_form_none') }, ...props.items])
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
        <p class="text-body-2 text-medium-emphasis mb-4">{{ $t('event_edit.community_form_hint') }}</p>
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
        <v-select
          v-else
          v-model="selectedFormId"
          :items="selectItems"
          item-title="name"
          item-value="form_id"
          :label="$t('event_edit.community_form')"
          :disabled="disabled || canceled || notEditable"
          hide-details="auto"
        />
      </template>
    </v-card-text>
  </v-card>
</template>
