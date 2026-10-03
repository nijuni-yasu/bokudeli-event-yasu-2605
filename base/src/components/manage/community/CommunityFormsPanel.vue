<script setup lang="ts">
import { useCreateAppCommunityStore } from '@shokujii/base/composable/useAppCommunityStore.js'
import { useNotification } from '@shokujii/base/composable/notification.js'
import { archiveCommunityForm, duplicateCommunityForm } from '@shokujii/base/apis/form.js'
import { omitHiddenFormFields } from '@shokujii/common/schemas/formFields.js'
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
const formsPending = computed(
  () => communityStore.value.community != null && communityStore.value.communityForms == null,
)
const loadFailed = computed(() => communityStore.value.communityFormsLoadFailed)
const forms = computed(() => {
  const list = communityStore.value.communityForms
  if (list == null) {
    return []
  }
  return list.map((form) => ({
    form_id: form.id,
    name: form.name,
    description: form.description,
    archived: form.archived,
    field_count: omitHiddenFormFields(form.fields).length,
    updated_at: form.updated_at,
  }))
})
const pendingFormId = ref('')

const retry = () => {
  communityStore.value.retryCommunityForms()
}

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

const toggleArchive = async (form: { form_id: string; archived: boolean }) => {
  if (pendingFormId.value !== '') return
  pendingFormId.value = form.form_id
  try {
    await archiveCommunityForm({
      community_id: communityId.value,
      form_id: form.form_id,
      archived: !form.archived,
    })
  } catch {
    notification.show($t('manage.forms.save_failed'), 'error')
  } finally {
    pendingFormId.value = ''
  }
}
</script>

<template>
  <v-container class="manage-container">
    <v-card class="pa-10 mb-10">
      <v-row>
        <v-card-text class="pa-3 title">
          <div>{{ $t('manage.forms.title') }}</div>
        </v-card-text>
      </v-row>
      <v-row>
        <v-card-text class="pa-3 description">
          <div class="form-help mb-4">
            <div class="form-help__section">
              <div class="form-help__heading">{{ $t('manage.forms.list_heading_what') }}</div>
              <p class="form-help__p" v-html="$t('manage.forms.list_what')"></p>
            </div>
            <div class="form-help__section form-help__section--after-what">
              <div class="form-help__heading">{{ $t('manage.forms.list_heading_how') }}</div>
              <p class="form-help__p mb-0" v-html="$t('manage.forms.list_how')"></p>
            </div>
          </div>
          <v-btn
            color="primary"
            size="large"
            :prepend-icon="mdiPlus"
            :disabled="communityId === '' || pendingFormId !== ''"
            @click="goNew"
          >
            {{ $t('manage.forms.create') }}
          </v-btn>
        </v-card-text>
      </v-row>
    </v-card>
    <v-progress-linear v-if="formsPending" indeterminate color="primary" />
    <v-alert v-else-if="loadFailed" type="error" variant="tonal">
      {{ $t('manage.forms.load_failed') }}
      <template #append
        ><v-btn variant="text" @click="retry">{{ $t('manage.forms.retry') }}</v-btn></template
      >
    </v-alert>
    <v-card v-else-if="forms.length > 0" class="pa-4">
      <div class="d-flex flex-column ga-3">
        <v-card
          v-for="form in forms"
          :key="form.form_id"
          variant="flat"
          border
          :loading="pendingFormId === form.form_id"
        >
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
    </v-card>
  </v-container>
</template>

<style scoped>
.title {
  font-size: 22px;
  font-weight: 700;
  text-align: left;
}

.description {
  font-size: 14px;
  font-weight: 400;
  line-height: 30px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}

.form-help {
  line-height: 1.65;
}

.form-help__section--after-what {
  margin-top: 1rem;
}

.form-help__heading {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.form-help__p {
  margin: 0 0 0.5rem;
}

.form-list-copy {
  min-width: 0;
  flex-basis: 220px;
}
.form-list-name {
  overflow-wrap: anywhere;
}
</style>
