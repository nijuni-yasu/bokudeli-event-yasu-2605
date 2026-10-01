<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { VTextField } from 'vuetify/components'
import { mdiArrowLeft, mdiCheck, mdiClose, mdiMagnify, mdiPlus } from '@mdi/js'
import { TAG_GENRES, isMasterTagLabel } from '@shokujii/common/constants/tags.js'
import { USER_TAG_MAX_COUNT, USER_TAG_MAX_LENGTH } from '@shokujii/common/constants/userTags.js'
import { normalizeTag, tagCodePointLength } from '@shokujii/common/utils/normalizeTag.js'
import { getProfileTagCandidates, PROFILE_TAG_PAGE_SIZE } from '@shokujii/base/utils/profileTagOptions.js'

const props = withDefaults(defineProps<{ loading?: boolean }>(), { loading: false })
const tags = defineModel<string[]>({ required: true })

const { t: $t } = useI18n()
const { xs } = useDisplay()
const query = ref('')
const queryField = ref<InstanceType<typeof VTextField> | null>(null)
const candidateHeading = ref<HTMLElement | null>(null)
const showGenres = ref(false)
const expandedGenres = ref<string[]>([])
const page = ref(1)
const isComposing = ref(false)
const normalizedQuery = computed(() => normalizeTag(query.value))
const isSearching = computed(() => normalizedQuery.value !== '')
const isAtLimit = computed(() => tags.value.length >= USER_TAG_MAX_COUNT)
const isTooLong = computed(() => tagCodePointLength(normalizedQuery.value) > USER_TAG_MAX_LENGTH)
const selectedTags = computed(() => new Map(tags.value.map((tag) => [normalizeTag(tag), tag])))
const candidates = computed(() => getProfileTagCandidates(query.value))
const pageSize = computed(() => (xs.value ? PROFILE_TAG_PAGE_SIZE.mobile : PROFILE_TAG_PAGE_SIZE.desktop))
const visibleTags = computed(() => candidates.value.slice(0, page.value * pageSize.value))
const hasMore = computed(() => visibleTags.value.length < candidates.value.length)
const canCreate = computed(
  () => isSearching.value && !isMasterTagLabel(normalizedQuery.value) && !selectedTags.value.has(normalizedQuery.value),
)
const isBrowsingGenres = computed(() => showGenres.value)

watch([normalizedQuery, pageSize], () => {
  page.value = 1
})

const setGenreView = async (show: boolean): Promise<void> => {
  if (show) expandedGenres.value = []
  showGenres.value = show
  await nextTick()
  // 候補の件数が大きく変わっても、スクロール位置が一覧末尾に移らないようにする。
  candidateHeading.value?.focus({ preventScroll: true })
  candidateHeading.value?.scrollIntoView({ block: 'nearest' })
}

const isSelected = (tag: string): boolean => selectedTags.value.has(normalizeTag(tag))

const addTag = (raw: string, clearQuery: boolean): void => {
  const tag = normalizeTag(raw)
  if (
    props.loading ||
    isComposing.value ||
    tag === '' ||
    tagCodePointLength(tag) > USER_TAG_MAX_LENGTH ||
    isAtLimit.value ||
    isSelected(tag)
  ) {
    return
  }
  tags.value = [...tags.value, tag]
  if (clearQuery) {
    query.value = ''
    queryField.value?.focus()
  }
}

const removeTag = (tag: string, restoreFocus: boolean): void => {
  if (props.loading) return
  tags.value = tags.value.filter((item) => item !== tag)
  if (restoreFocus) queryField.value?.focus()
}

const toggleTag = (tag: string): void => {
  const storedTag = selectedTags.value.get(normalizeTag(tag))
  if (storedTag != null) {
    removeTag(storedTag, false)
  } else {
    addTag(tag, false)
  }
}

const onEnter = (event: KeyboardEvent): void => {
  // Safari では変換確定の Enter で isComposing が false になることがある。
  if (event.isComposing || isComposing.value || event.keyCode === 229) return
  event.preventDefault()
  addTag(query.value, true)
}
</script>

<template>
  <div class="tag-input">
    <v-text-field
      ref="queryField"
      v-model="query"
      :label="$t('user_tags.search_label')"
      :placeholder="$t('user_tags.search_placeholder')"
      :prepend-inner-icon="mdiMagnify"
      :error-messages="isTooLong ? $t('user_tags.tag_max_length') : []"
      variant="outlined"
      rounded="lg"
      density="comfortable"
      hide-details="auto"
      autocomplete="off"
      :disabled="loading"
      @keydown.enter="onEnter"
      @compositionstart="isComposing = true"
      @compositionend="isComposing = false"
    />

    <p v-if="isAtLimit" class="text-caption text-medium-emphasis mt-3" role="status">
      {{ $t('user_tags.limit_help') }}
    </p>

    <div class="tag-input__heading">
      <h3 ref="candidateHeading" class="text-subtitle-2" tabindex="-1">
        {{
          $t(
            isSearching
              ? 'user_tags.search_results'
              : isBrowsingGenres
                ? 'user_tags.browse_genres'
                : 'user_tags.choose_tags',
          )
        }}
      </h3>
      <v-btn
        v-if="isBrowsingGenres"
        class="tag-input__nav-link"
        variant="text"
        size="small"
        color="primary"
        :prepend-icon="mdiArrowLeft"
        @click="setGenreView(false)"
      >
        {{ $t('user_tags.back_to_suggestions') }}
      </v-btn>
    </div>

    <v-expansion-panels
      v-if="isBrowsingGenres"
      v-model="expandedGenres"
      variant="accordion"
      multiple
      flat
      class="tag-input__genres"
    >
      <v-expansion-panel v-for="group in TAG_GENRES" :key="group.genre" :value="group.genre">
        <v-expansion-panel-title>{{ group.genre }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="tag-input__options">
            <v-btn
              v-for="tag in group.tags"
              :key="tag"
              class="tag-input__option"
              :color="isSelected(tag) ? 'primary' : ''"
              :variant="isSelected(tag) ? 'flat' : 'tonal'"
              rounded="pill"
              :prepend-icon="isSelected(tag) ? mdiCheck : mdiPlus"
              :aria-label="tag"
              :aria-pressed="isSelected(tag)"
              :aria-disabled="loading || (!isSelected(tag) && isAtLimit)"
              :disabled="loading || (!isSelected(tag) && isAtLimit)"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-else class="tag-input__options" :aria-label="$t('user_tags.choose_tags')">
      <v-btn
        v-for="tag in visibleTags"
        :key="tag"
        class="tag-input__option"
        :color="isSelected(tag) ? 'primary' : ''"
        :variant="isSelected(tag) ? 'flat' : 'tonal'"
        rounded="pill"
        :prepend-icon="isSelected(tag) ? mdiCheck : mdiPlus"
        :aria-label="tag"
        :aria-pressed="isSelected(tag)"
        :aria-disabled="loading || (!isSelected(tag) && isAtLimit)"
        :disabled="loading || (!isSelected(tag) && isAtLimit)"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </v-btn>
    </div>

    <p v-if="isSearching && visibleTags.length === 0" class="text-body-2 text-medium-emphasis my-3">
      {{ $t('user_tags.no_results') }}
    </p>
    <div v-if="isSearching && hasMore" class="text-center mt-3">
      <v-btn variant="text" size="small" color="secondary" @click="page += 1">
        {{ $t('user_tags.more_results') }}
      </v-btn>
    </div>
    <v-btn
      v-if="canCreate"
      class="tag-input__create mt-4"
      block
      variant="tonal"
      color="primary"
      :prepend-icon="mdiPlus"
      :disabled="loading || isAtLimit || isTooLong || isComposing"
      @click="addTag(query, true)"
    >
      {{ $t('user_tags.create_tag', { tag: normalizedQuery }) }}
    </v-btn>
    <v-btn
      v-if="!showGenres"
      class="tag-input__show-more mt-4"
      block
      variant="outlined"
      size="large"
      color="primary"
      @click="setGenreView(true)"
    >
      {{ $t('user_tags.show_more') }}
    </v-btn>

    <section v-if="tags.length > 0" class="tag-input__selected" :aria-label="$t('user_tags.current_tags_heading')">
      <p class="text-caption text-medium-emphasis mb-2">{{ $t('user_tags.current_tags_heading') }}</p>
      <div class="tag-input__options">
        <v-btn
          v-for="tag in tags"
          :key="tag"
          class="tag-input__remove"
          variant="flat"
          color="primary"
          rounded="pill"
          :append-icon="mdiClose"
          :aria-label="$t('user_tags.remove_tag', { tag })"
          :aria-disabled="loading"
          :disabled="loading"
          @click="removeTag(tag, true)"
        >
          {{ tag }}
        </v-btn>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.tag-input__nav-link {
  font-weight: 600;
  letter-spacing: normal;
  text-transform: none;
}

.tag-input__show-more {
  font-weight: 400;
  letter-spacing: normal;
  text-transform: none;
}

.tag-input__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-block: 20px 12px;
}

.tag-input__genres {
  :deep(.v-expansion-panel) {
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }

  :deep(.v-expansion-panel-title) {
    min-height: 52px;
    padding-inline: 0;
    font-size: 0.875rem;
    font-weight: 600;
  }

  :deep(.v-expansion-panel-text__wrapper) {
    padding: 4px 0 20px;
  }
}

.tag-input__options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-input__option,
.tag-input__remove,
.tag-input__create {
  height: auto;
  min-width: 0;
  max-width: 100%;
  min-height: 44px;
  padding-block: 10px;
  letter-spacing: normal;
  text-transform: none;

  :deep(.v-btn__content) {
    min-width: 0;
    white-space: normal;
    overflow-wrap: anywhere;
    text-align: start;
  }

  &[aria-disabled='true'] {
    cursor: default;
  }
}

.tag-input__selected {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
