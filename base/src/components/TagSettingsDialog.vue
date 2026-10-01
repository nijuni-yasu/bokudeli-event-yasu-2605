<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { mdiClose } from '@mdi/js'
import TagInput from '@shokujii/base/components/TagInput.vue'
import { useCurrentUserStore } from '@shokujii/base/stores/currentUser.js'
import { updateUserTags } from '@shokujii/base/apis/userTags.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'

const model = defineModel<boolean>({ required: true })
const { t: $t } = useI18n()
const { smAndDown } = useDisplay()
const currentUserStore = useCurrentUserStore()

const errorMessage = ref('')
const isUpdating = ref(false)
const tagsReady = ref(false)
const tags = ref<string[]>([])

watch(
  [model, () => currentUserStore.user],
  ([isOpen], previous) => {
    const openedNow = isOpen && previous?.[0] !== true
    const user = currentUserStore.user
    if (isOpen && (openedNow || user == null)) {
      tagsReady.value = false
      tags.value = []
      if (openedNow) {
        errorMessage.value = ''
      }
    }
    if (isOpen && !tagsReady.value && user != null) {
      tags.value = [...(user.user_tags ?? [])]
      tagsReady.value = true
    }
  },
  { immediate: true },
)

const saveTags = async (): Promise<void> => {
  if (isUpdating.value || !tagsReady.value) return
  isUpdating.value = true
  errorMessage.value = ''
  try {
    const response = await updateUserTags([...tags.value])
    if (!response.data.success) throw new Error(response.data.message)
    model.value = false
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : $t('user_tags.save_failed')
    reportClientError(error, { componentInfo: 'TagSettingsDialog', severity: 'warn' })
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <v-dialog
    v-model="model"
    max-width="600"
    :aria-label="$t('user_tags.section_title')"
    :fullscreen="smAndDown"
    :persistent="isUpdating"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="tag-settings-dialog">
      <header class="tag-settings-dialog__header">
        <div>
          <p class="text-caption text-medium-emphasis mb-2">{{ $t('user_tags.section_title') }}</p>
          <h2 class="tag-settings-dialog__title">{{ $t('user_tags.dialog_title') }}</h2>
          <p class="text-body-2 text-medium-emphasis mt-2">{{ $t('user_tags.dialog_hint') }}</p>
        </div>
        <v-btn
          :icon="mdiClose"
          :aria-label="$t('user_tags.close')"
          :disabled="isUpdating"
          variant="text"
          color="secondary"
          size="small"
          @click="model = false"
        />
      </header>

      <v-card-text class="tag-settings-dialog__body">
        <v-progress-linear v-if="model && !tagsReady" indeterminate color="primary" />
        <TagInput v-if="model && tagsReady" v-model="tags" :loading="isUpdating" />
      </v-card-text>

      <v-card-actions class="tag-settings-dialog__footer">
        <div class="tag-settings-dialog__summary text-caption">
          <span v-if="tagsReady">{{ $t('user_tags.section_count', { count: tags.length }) }}</span>
          <span class="text-medium-emphasis" role="status">
            {{ $t(isUpdating ? 'user_tags.save_status_saving' : 'user_tags.save_hint') }}
          </span>
        </div>
        <div v-if="errorMessage !== ''" class="tag-settings-dialog__error">
          <p class="text-caption text-error" role="alert">{{ errorMessage }}</p>
        </div>
        <v-btn
          block
          variant="flat"
          color="primary"
          size="large"
          rounded="lg"
          :disabled="isUpdating || !tagsReady"
          :loading="isUpdating"
          @click="saveTags"
        >
          {{ $t('user_tags.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.tag-settings-dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 28px 28px 20px;
}

.tag-settings-dialog__title {
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
}

.tag-settings-dialog__body.v-card-text {
  padding: 4px 28px 24px;
}

.tag-settings-dialog__footer.v-card-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 16px 28px max(24px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

  > .v-btn {
    margin-inline: 0;
  }
}

.tag-settings-dialog__summary,
.tag-settings-dialog__error {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 12px;
}

.tag-settings-dialog__error p {
  flex: 1 1 180px;
  overflow-wrap: anywhere;
}

@media (min-width: 960px) {
  .tag-settings-dialog {
    border-radius: 24px;
  }
}

@media (max-width: 599px) {
  .tag-settings-dialog__header {
    padding: 20px 20px 16px;
  }

  .tag-settings-dialog__title {
    font-size: 1.25rem;
  }

  .tag-settings-dialog__body.v-card-text {
    padding-inline: 20px;
  }

  .tag-settings-dialog__footer.v-card-actions {
    padding-inline: 20px;
  }
}
</style>
