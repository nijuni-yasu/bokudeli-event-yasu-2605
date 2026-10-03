<script setup lang="ts">
import { listEventFormResponses } from '@shokujii/base/apis/form.js'
import { buildEventFormResponseCsv, downloadMemberCsv } from '@shokujii/base/composable/memberCsvExport.js'
import type { EventFormResponseFilter, EventFormResponseListItem } from '@shokujii/common/apis/form.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import type { BokudeliEvent } from '@shokujii/base/stores/event.js'
import { mdiDownload, mdiTextBoxCheckOutline } from '@mdi/js'

const props = defineProps<{
  event: BokudeliEvent
}>()

const { t: $t } = useI18n()

const isEnterprise = computed(() => props.event.enterprise_id != null && props.event.enterprise_id !== '')
const responses = ref<EventFormResponseListItem[]>([])
const loading = ref(false)
const loadFailed = ref(false)
const retryKey = ref(0)
const selected = ref<EventFormResponseListItem | null>(null)

watch(
  () => [props.event.community_id, props.event.event_id, props.event.enterprise_id, retryKey.value],
  async (_key, _previousKey, onCleanup) => {
    let cancelled = false
    onCleanup(() => {
      cancelled = true
    })
    responses.value = []
    selected.value = null
    loadFailed.value = false
    loading.value = false
    if (props.event.enterprise_id != null && props.event.enterprise_id !== '') return
    loading.value = true
    try {
      const [ordered, canceled] = await Promise.all([
        listEventFormResponses({
          community_id: props.event.community_id,
          event_id: props.event.event_id,
          filter: 'confirmed',
        }),
        listEventFormResponses({
          community_id: props.event.community_id,
          event_id: props.event.event_id,
          filter: 'canceled',
        }),
      ])
      if (!cancelled) responses.value = [...ordered.data.responses, ...canceled.data.responses]
    } catch {
      if (!cancelled) loadFailed.value = true
    } finally {
      if (!cancelled) loading.value = false
    }
  },
  { immediate: true },
)

const statusLabel = (value: EventFormResponseFilter) =>
  value === 'confirmed' ? $t('manage.forms.status_ordered') : $t('manage.forms.status_canceled')

const download = () => {
  if (loading.value || loadFailed.value || responses.value.length === 0) return
  const csv = buildEventFormResponseCsv(
    responses.value.map((item) => ({
      display_name: item.display_name,
      participation_label: statusLabel(item.participation),
      answered_at: convertToDatetime(item.answered_at),
      updated_at: convertToDatetime(item.updated_at),
      answers: item.answers.map((answer) => ({
        field_id: answer.field_id,
        field_label: answer.field_label,
        display_value: answer.display_value,
      })),
    })),
  )
  downloadMemberCsv($t('manage.forms.csv_filename'), csv)
}
</script>

<template>
  <section>
    <v-alert v-if="isEnterprise" type="info" variant="tonal">{{ $t('manage.forms.enterprise_unsupported') }}</v-alert>
    <div v-else class="d-flex flex-wrap align-center justify-space-between ga-4 mb-4">
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <h2 class="text-h6">{{ $t('manage.forms.responses_title') }}</h2>
          <v-chip v-if="!loading && !loadFailed" size="small" variant="tonal">{{
            $t('manage.forms.responses_count', { count: responses.length })
          }}</v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('manage.forms.responses_hint') }}</p>
      </div>
      <div class="d-flex flex-wrap align-center ga-3">
        <v-btn
          :prepend-icon="mdiDownload"
          variant="tonal"
          :disabled="loading || loadFailed || responses.length === 0"
          @click="download"
        >
          {{ $t('manage.forms.csv_download') }}
        </v-btn>
      </div>
    </div>
    <template v-if="!isEnterprise">
      <v-progress-linear v-if="loading" indeterminate color="primary" />
      <v-alert v-else-if="loadFailed" type="error" variant="tonal">
        {{ $t('manage.forms.load_failed') }}
        <template #append
          ><v-btn variant="text" @click="retryKey++">{{ $t('manage.forms.retry') }}</v-btn></template
        >
      </v-alert>
      <v-sheet v-else-if="responses.length === 0" border rounded="lg" class="text-center pa-8">
        <v-avatar color="primary" variant="tonal" size="56" class="mb-3"
          ><v-icon :icon="mdiTextBoxCheckOutline" size="28"
        /></v-avatar>
        <p class="text-body-1 mb-0">{{ $t('manage.forms.responses_empty') }}</p>
      </v-sheet>
      <v-table v-else class="border rounded-lg form-responses-table d-none d-sm-block">
        <thead>
          <tr>
            <th>{{ $t('manage.forms.display_name') }}</th>
            <th>{{ $t('manage.forms.status') }}</th>
            <th>{{ $t('manage.forms.answered_at') }}</th>
            <th>{{ $t('manage.forms.updated_at') }}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in responses" :key="item.user_id">
            <td class="form-response-name">{{ item.display_name }}</td>
            <td>
              <v-chip
                :color="item.participation === 'confirmed' ? 'primary' : 'secondary'"
                size="small"
                variant="tonal"
                >{{ statusLabel(item.participation) }}</v-chip
              >
            </td>
            <td class="text-no-wrap">{{ convertToDatetime(item.answered_at) }}</td>
            <td class="text-no-wrap">{{ convertToDatetime(item.updated_at) }}</td>
            <td class="text-right">
              <v-btn variant="text" size="small" @click="selected = item">{{ $t('manage.forms.detail') }}</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <div v-if="!loading && !loadFailed && responses.length > 0" class="d-flex d-sm-none flex-column ga-3">
        <v-sheet v-for="item in responses" :key="item.user_id" border rounded="lg" class="pa-4">
          <div class="d-flex align-start ga-3 mb-3">
            <div class="flex-grow-1 form-response-person">
              <h3 class="text-subtitle-1 mb-2 form-response-copy">{{ item.display_name }}</h3>
              <v-chip
                :color="item.participation === 'confirmed' ? 'primary' : 'secondary'"
                size="small"
                variant="tonal"
                >{{ statusLabel(item.participation) }}</v-chip
              >
            </div>
            <v-btn variant="tonal" size="small" @click="selected = item">{{ $t('manage.forms.detail') }}</v-btn>
          </div>
          <p class="text-caption text-medium-emphasis mb-0">
            {{ $t('manage.forms.updated_at') }} {{ convertToDatetime(item.updated_at) }}
          </p>
        </v-sheet>
      </div>
      <v-dialog
        :model-value="selected != null"
        max-width="720"
        scrollable
        @update:model-value="selected = $event ? selected : null"
      >
        <v-card v-if="selected != null">
          <v-card-title class="px-5 pt-5">{{ $t('manage.forms.response_detail') }}</v-card-title>
          <v-card-text class="pa-5">
            <div class="d-flex flex-wrap align-center ga-2 mb-2">
              <h3 class="text-h6 form-response-copy">{{ selected.display_name }}</h3>
              <v-chip
                :color="selected.participation === 'confirmed' ? 'primary' : 'secondary'"
                size="small"
                variant="tonal"
                >{{ statusLabel(selected.participation) }}</v-chip
              >
            </div>
            <dl class="d-flex flex-wrap ga-4 mb-6">
              <div>
                <dt class="text-caption text-medium-emphasis">{{ $t('manage.forms.answered_at') }}</dt>
                <dd class="text-body-2">{{ convertToDatetime(selected.answered_at) }}</dd>
              </div>
              <div>
                <dt class="text-caption text-medium-emphasis">{{ $t('manage.forms.updated_at') }}</dt>
                <dd class="text-body-2">{{ convertToDatetime(selected.updated_at) }}</dd>
              </div>
            </dl>
            <v-sheet v-for="answer in selected.answers" :key="answer.field_id" border rounded="lg" class="pa-4 mb-3">
              <div class="text-subtitle-2 mb-2 form-response-copy">{{ answer.field_label }}</div>
              <div class="text-body-1 form-response-copy">
                {{ answer.display_value !== '' ? answer.display_value : $t('manage.forms.no_answer') }}
              </div>
            </v-sheet>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="selected = null">{{ $t('manage.forms.close') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </section>
</template>

<style scoped>
.form-response-copy {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.form-responses-table :deep(th) {
  white-space: nowrap;
}
.form-response-name {
  min-width: 140px;
  max-width: 280px;
  overflow-wrap: anywhere;
}
.form-response-person {
  min-width: 0;
}
</style>
