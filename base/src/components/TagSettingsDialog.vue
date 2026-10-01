<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { mdiClose } from '@mdi/js'
import TagInput from '@shokujii/base/components/TagInput.vue'
import { useCurrentUserStore } from '@shokujii/base/stores/currentUser.js'
import { updateUserTags } from '@shokujii/base/apis/userTags.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import { normalizeTagList } from '@shokujii/common/utils/normalizeTag.js'

const model = defineModel<boolean>({ required: true })
const { t: $t } = useI18n()
const { smAndDown } = useDisplay()
const currentUserStore = useCurrentUserStore()

const errorMessage = ref('')
const isUpdating = ref(false)
const tagsReady = ref(false)
const tags = ref<string[]>([])
const baselineTags = ref<string[]>([])
/** 保存成功後、購読が保存配列に追いつくまでの次回オープン初期値 */
const savedTagsAwaitingSnapshot = ref<string[] | null>(null)
/** 保存開始時の購読値。これと違うスナップショットが来たら待機を捨てる */
const tagsObservedBeforeSave = ref<string[] | null>(null)

const sameTagList = (left: readonly string[] | undefined, right: readonly string[]): boolean => {
  const current = left ?? []
  return current.length === right.length && current.every((tag, index) => tag === right[index])
}

const hasTagChanges = computed(() => tagsReady.value && !sameTagList(baselineTags.value, tags.value))

watch(
  [model, () => currentUserStore.user, () => currentUserStore.firebaseUser?.uid ?? null],
  ([isOpen, , uid], previous) => {
    const openedNow = isOpen && previous?.[0] !== true
    const uidChanged = previous != null && previous[2] !== uid
    const user = currentUserStore.user
    if (user == null || uidChanged) {
      savedTagsAwaitingSnapshot.value = null
      tagsObservedBeforeSave.value = null
    } else if (savedTagsAwaitingSnapshot.value != null) {
      const snapshot = user.user_tags ?? []
      const matchedSave = sameTagList(snapshot, savedTagsAwaitingSnapshot.value)
      const movedPastStart =
        tagsObservedBeforeSave.value != null && !sameTagList(snapshot, tagsObservedBeforeSave.value)
      if (matchedSave || movedPastStart) {
        savedTagsAwaitingSnapshot.value = null
        tagsObservedBeforeSave.value = null
      }
    }
    if (isOpen && (openedNow || user == null || uidChanged)) {
      tagsReady.value = false
      tags.value = []
      baselineTags.value = []
      if (openedNow || uidChanged) {
        errorMessage.value = ''
      }
    }
    if (isOpen && !tagsReady.value && user != null) {
      const source = [...(savedTagsAwaitingSnapshot.value ?? user.user_tags ?? [])]
      tags.value = [...source]
      baselineTags.value = source
      tagsReady.value = true
    }
  },
  { immediate: true },
)

const saveTags = async (): Promise<void> => {
  if (isUpdating.value || !tagsReady.value || !hasTagChanges.value) return
  isUpdating.value = true
  errorMessage.value = ''
  try {
    const savedTags = normalizeTagList([...tags.value])
    const tagsBeforeSave = [...(currentUserStore.user?.user_tags ?? [])]
    const response = await updateUserTags(savedTags)
    if (!response.data.success) throw new Error(response.data.message)
    const snapshotTags = currentUserStore.user?.user_tags ?? []
    const snapshotMatchesSaved = sameTagList(snapshotTags, savedTags)
    const snapshotMoved = !sameTagList(snapshotTags, tagsBeforeSave)
    if (snapshotMatchesSaved || snapshotMoved) {
      savedTagsAwaitingSnapshot.value = null
      tagsObservedBeforeSave.value = null
    } else {
      savedTagsAwaitingSnapshot.value = savedTags
      tagsObservedBeforeSave.value = tagsBeforeSave
    }
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
          <h2 class="tag-settings-dialog__title">{{ $t('user_tags.section_title') }}</h2>
          <p class="tag-settings-dialog__hint text-body-2 text-medium-emphasis mt-2">
            {{ $t('user_tags.dialog_hint') }}
          </p>
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
          <span v-if="isUpdating" class="text-medium-emphasis" role="status">
            {{ $t('user_tags.save_status_saving') }}
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
          :disabled="isUpdating || !tagsReady || !hasTagChanges"
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
  padding: 28px 28px 12px;
}

.tag-settings-dialog__title {
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
}

.tag-settings-dialog__hint {
  white-space: pre-line;
}

// Materio はダイアログ本文の上パディングを 0 にしており、コンポーネント側の指定より詳細度が高い。
// outlined のラベルは枠の上にはみ出すので、同じかそれ以上の詳細度で上余白を取る。
.v-dialog > .v-overlay__content > .v-card > .tag-settings-dialog__body.v-card-text {
  // ラベルのはみ出し分だけ確保し、検索欄上の余白を抑える
  padding-top: 8px;
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
    padding: 20px 20px 10px;
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
