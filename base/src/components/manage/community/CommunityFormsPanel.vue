<script setup lang="ts">
import { useCreateAppCommunityStore } from '@shokujii/base/composable/useAppCommunityStore.js'
import { useNotification } from '@shokujii/base/composable/notification.js'
import { archiveCommunityForm, duplicateCommunityForm, listCommunityForms } from '@shokujii/base/apis/form.js'
import type { CommunityFormSummary } from '@shokujii/common/apis/form.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import type {
  ResolveManageCommunityFormEditPathFn,
  ResolveManageCommunityFormNewPathFn,
} from '@shokujii/base/types/profilePathResolvers.js'
import {
  mdiPlus,
  mdiTextBoxOutline,
  mdiDotsVertical,
  mdiContentCopy,
  mdiArchiveOutline,
  mdiArchiveArrowUpOutline,
  mdiPencilOutline,
} from '@mdi/js'

const props = defineProps<{
  resolveFormNewPath: ResolveManageCommunityFormNewPathFn
  resolveFormEditPath: ResolveManageCommunityFormEditPathFn
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

const forms = ref<CommunityFormSummary[]>([])
const loading = ref(false)
const loadFailed = ref(false)
const pendingFormId = ref('')

const load = async (isStale: () => boolean = () => false) => {
  const requestedCommunityId = communityId.value
  if (requestedCommunityId === '') {
    return
  }
  loading.value = true
  loadFailed.value = false
  try {
    const response = await listCommunityForms({ community_id: requestedCommunityId })
    if (isStale()) {
      return
    }
    forms.value = response.data.forms
  } catch {
    if (isStale()) {
      return
    }
    loadFailed.value = true
  } finally {
    if (!isStale()) {
      loading.value = false
    }
  }
}

watch(
  communityId,
  (_current, _previous, onCleanup) => {
    let cancelled = false
    onCleanup(() => {
      cancelled = true
    })
    void load(() => cancelled)
  },
  { immediate: true },
)

const goNew = () => {
  void router.push(props.resolveFormNewPath(communityAccount.value))
}

const goEdit = (formId: string) => {
  void router.push(props.resolveFormEditPath(communityAccount.value, formId))
}

const duplicate = async (formId: string) => {
  if (pendingFormId.value !== '') return
  pendingFormId.value = formId
  try {
    const response = await duplicateCommunityForm({ community_id: communityId.value, form_id: formId })
    notification.show($t('manage.forms.saved'), 'success')
    void router.push(props.resolveFormEditPath(communityAccount.value, response.data.form.form_id))
  } catch {
    notification.show($t('manage.forms.save_failed'), 'error')
  } finally {
    pendingFormId.value = ''
  }
}

const toggleArchive = async (form: CommunityFormSummary) => {
  if (pendingFormId.value !== '') return
  pendingFormId.value = form.form_id
  try {
    await archiveCommunityForm({
      community_id: communityId.value,
      form_id: form.form_id,
      archived: !form.archived,
    })
    await load()
  } catch {
    notification.show($t('manage.forms.save_failed'), 'error')
  } finally {
    pendingFormId.value = ''
  }
}
</script>

<template>
  <v-container class="manage-container">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h2 class="text-h6 mb-1">{{ $t('manage.forms.title') }}</h2>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('manage.forms.list_hint') }}</p>
      </div>
      <v-btn
        color="primary"
        :prepend-icon="mdiPlus"
        :disabled="communityId === '' || pendingFormId !== ''"
        @click="goNew"
        >{{ $t('manage.forms.create') }}</v-btn
      >
    </div>
    <v-progress-linear v-if="loading || communityId === ''" indeterminate color="primary" />
    <v-alert v-else-if="loadFailed" type="error" variant="tonal">
      {{ $t('manage.forms.load_failed') }}
      <template #append
        ><v-btn variant="text" @click="load">{{ $t('manage.forms.retry') }}</v-btn></template
      >
    </v-alert>
    <v-card v-else-if="forms.length === 0" variant="flat" border class="text-center pa-8">
      <v-avatar color="primary" variant="tonal" size="64" class="mb-4"
        ><v-icon :icon="mdiTextBoxOutline" size="32"
      /></v-avatar>
      <h3 class="text-subtitle-1 mb-2">{{ $t('manage.forms.empty_title') }}</h3>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('manage.forms.empty') }}</p>
    </v-card>
    <div v-else class="d-flex flex-column ga-3">
      <v-card v-for="form in forms" :key="form.form_id" variant="flat" border :loading="pendingFormId === form.form_id">
        <v-card-text class="d-flex flex-wrap align-center ga-4 pa-4">
          <v-avatar color="primary" variant="tonal" rounded="lg" class="d-none d-sm-flex"
            ><v-icon :icon="mdiTextBoxOutline"
          /></v-avatar>
          <div class="form-list-copy flex-grow-1">
            <div class="d-flex flex-wrap align-center ga-2 mb-1">
              <h3 class="text-subtitle-1 font-weight-medium form-list-name">{{ form.name }}</h3>
              <v-chip :color="form.archived ? 'secondary' : 'primary'" size="x-small" variant="tonal">{{
                form.archived ? $t('manage.forms.archived') : $t('manage.forms.active')
              }}</v-chip>
            </div>
            <p v-if="form.description !== ''" class="text-body-2 text-medium-emphasis text-truncate mb-2">
              {{ form.description }}
            </p>
            <div class="d-flex flex-wrap ga-3 text-caption text-medium-emphasis">
              <span>{{ $t('manage.forms.field_total', { count: form.field_count }) }}</span>
              <span>{{ $t('manage.forms.updated_at') }} {{ convertToDatetime(form.updated_at) }}</span>
            </div>
          </div>
          <div class="d-flex align-center ga-1 ml-auto">
            <v-btn
              :prepend-icon="mdiPencilOutline"
              variant="tonal"
              size="small"
              :disabled="pendingFormId !== ''"
              @click="goEdit(form.form_id)"
              >{{ $t('manage.forms.edit') }}</v-btn
            >
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  :icon="mdiDotsVertical"
                  :aria-label="$t('manage.forms.more_actions', { name: form.name })"
                  :disabled="pendingFormId !== ''"
                  variant="text"
                  size="small"
                  color="secondary"
                />
              </template>
              <v-list density="compact">
                <v-list-item
                  :prepend-icon="mdiContentCopy"
                  :title="$t('manage.forms.duplicate')"
                  @click="duplicate(form.form_id)"
                />
                <v-list-item
                  :prepend-icon="form.archived ? mdiArchiveArrowUpOutline : mdiArchiveOutline"
                  :title="form.archived ? $t('manage.forms.unarchive') : $t('manage.forms.archive')"
                  @click="toggleArchive(form)"
                />
              </v-list>
            </v-menu>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.form-list-copy {
  min-width: 0;
  flex-basis: 220px;
}
.form-list-name {
  overflow-wrap: anywhere;
}
</style>
