<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { VField, VInput } from 'vuetify/components'
import TagSettingsDialog from '@shokujii/base/components/TagSettingsDialog.vue'
import { useCurrentUserStore } from '@shokujii/base/stores/currentUser.js'

const { t: $t } = useI18n()
const currentUserStore = useCurrentUserStore()
const tagDialog = ref(false)
const focused = ref(false)

const tags = computed(() => currentUserStore.user?.user_tags ?? [])
const isLoggedIn = computed(() => currentUserStore.firebaseUser != null)
const fieldValue = computed(() => (tags.value.length > 0 ? tags.value.join('\n') : null))

const openDialog = (): void => {
  if (!isLoggedIn.value) return
  tagDialog.value = true
}
</script>

<template>
  <div
    class="user-profile-tags-edit-section v-text-field"
    role="button"
    tabindex="0"
    aria-haspopup="dialog"
    :aria-expanded="tagDialog"
    @click="openDialog"
    @keydown.enter.prevent="openDialog"
    @keydown.space.prevent="openDialog"
    @focus="focused = true"
    @blur="focused = false"
  >
    <VInput :model-value="fieldValue" readonly hide-details>
      <template #default="{ id, isDirty }">
        <VField
          :id="id.value"
          :label="$t('user_tags.section_title')"
          variant="outlined"
          :active="focused || isDirty.value"
          :focused="focused"
          :dirty="isDirty.value"
          append-inner-icon="$expand"
        >
          <template #default="{ props: fieldProps }">
            <div v-bind="fieldProps" class="user-profile-tags-edit-section__value">
              <v-chip
                v-for="tag in tags"
                :key="tag"
                class="user-profile-tags-edit-section__chip"
                color="primary"
                variant="tonal"
                size="small"
              >
                {{ tag }}
              </v-chip>
            </div>
          </template>
        </VField>
      </template>
    </VInput>
    <TagSettingsDialog v-if="isLoggedIn" v-model="tagDialog" />
  </div>
</template>

<style lang="scss" scoped>
.user-profile-tags-edit-section {
  cursor: pointer;

  :deep(.v-field),
  :deep(.v-field__input),
  :deep(.v-field__append-inner) {
    cursor: pointer;
  }

  :deep(.v-field__input) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    gap: 6px;
    height: auto;
    min-height: 56px;
    padding-block: 8px;
  }
}

.user-profile-tags-edit-section__chip {
  max-width: 100%;
  height: auto;
  min-height: 28px;
  pointer-events: none;

  :deep(.v-chip__content) {
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
</style>
