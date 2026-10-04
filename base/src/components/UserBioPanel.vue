<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCurrentUserStore } from '@shokujii/base/stores/currentUser.js'
import { User } from '@shokujii/common/schemas/User.js'
import { buildFacebookUrl, buildInstagramUrl, buildTwitterUrl } from '@shokujii/base/utils/buildSnsLinks'
import UserAvatar from '@shokujii/base/components/UserAvatar.vue'
import TagBadge from '@shokujii/base/components/TagBadge.vue'
import TagAddChip from '@shokujii/base/components/TagAddChip.vue'
import { mdiAlphaXCircle, mdiCogOutline, mdiFacebook, mdiInstagram, mdiWeb } from '@mdi/js'
import { getProfile } from '@/router/utils'
import { useProfileTagToggle } from '@shokujii/base/composable/useTagImportHint.js'

const { t: $t } = useI18n()

const props = withDefaults(
  defineProps<{
    userData: User
    isEditable: boolean | undefined
    hideSns?: boolean
  }>(),
  {
    hideSns: false,
  },
)

const currentUserStore = useCurrentUserStore()

const isEditable = computed(() => props.isEditable ?? false)
const { toggleTag } = useProfileTagToggle()

const onTagClick = (tag: string) => {
  if (isEditable.value) return
  toggleTag(tag)
}

const userName = computed(() => props.userData.user_name ?? 'ゲスト')

const isDescriptionPlaceholder = computed(
  () => props.userData.user_description === '' && currentUserStore.firebaseUser?.uid === props.userData.user_id,
)

const userDescription = computed(() => {
  if (props.userData.user_description !== '') return props.userData.user_description
  return isDescriptionPlaceholder.value ? $t('user_profile.user_description_placeholder') : ''
})
const twitterUrl = computed(() =>
  props.userData.user_sns_twitter === '' ? undefined : buildTwitterUrl(props.userData.user_sns_twitter),
)

const facebookUrl = computed(() =>
  props.userData.user_sns_facebook === '' ? undefined : buildFacebookUrl(props.userData.user_sns_facebook),
)

const instagramUrl = computed(() =>
  props.userData.user_sns_instagram === '' ? undefined : buildInstagramUrl(props.userData.user_sns_instagram),
)

const websiteUrl = computed(() =>
  props.userData.user_sns_website === '' ? undefined : props.userData.user_sns_website,
)
const hasSnsLinks = computed(
  () => twitterUrl.value != null || facebookUrl.value != null || instagramUrl.value != null || websiteUrl.value != null,
)

const displayTags = computed(() => props.userData.user_tags ?? [])

const myTags = computed(() => new Set(currentUserStore.user?.user_tags ?? []))
const isHighlighted = (tag: string) => myTags.value.has(tag)
</script>

<template>
  <v-row class="user-bio-panel">
    <!-- user profile -->
    <v-col cols="12">
      <v-card class="pt-8 mx-4 mx-sm-0">
        <v-card-title class="d-flex align-center flex-column mb-4">
          <UserAvatar :user="userData" :size="180" />
        </v-card-title>
        <v-card-text class="user-bio-panel__name-wrap">
          <div class="user-bio-panel__name">{{ userName }}</div>
        </v-card-text>
        <v-card-text
          v-linkify
          class="text-subtitle-1"
          :class="{ 'text-medium-emphasis': isDescriptionPlaceholder }"
          style="line-height: 30px; white-space: pre-line"
        >
          {{ userDescription }}
        </v-card-text>
        <v-card-text v-if="displayTags.length > 0 || isEditable" class="px-6 pt-0">
          <div class="d-flex flex-wrap">
            <TagBadge
              v-for="t in displayTags"
              :key="t"
              :tag="t"
              :highlighted="isHighlighted(t)"
              :clickable="!isEditable"
              @click="onTagClick(t)"
            />
            <TagAddChip v-if="isEditable" />
          </div>
        </v-card-text>
        <v-card-actions v-if="isEditable" class="justify-center">
          <v-btn color="primary" class="mb-3" :prepend-icon="mdiCogOutline" :to="getProfile()">
            {{ $t('user_profile.profile_settings') }}
          </v-btn>
        </v-card-actions>
        <div v-if="!hideSns && hasSnsLinks" class="user-bio-panel__sns">
          <v-btn
            v-if="twitterUrl"
            :href="twitterUrl"
            target="_blank"
            rel="noopener noreferrer"
            :icon="mdiAlphaXCircle"
            size="small"
            variant="outlined"
            class="user-bio-panel__sns-btn"
            :aria-label="$t('event_members.sns_x')"
          />
          <v-btn
            v-if="facebookUrl"
            :href="facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
            :icon="mdiFacebook"
            size="small"
            variant="outlined"
            class="user-bio-panel__sns-btn"
            :aria-label="$t('event_members.sns_facebook')"
          />
          <v-btn
            v-if="instagramUrl"
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            :icon="mdiInstagram"
            size="small"
            variant="outlined"
            class="user-bio-panel__sns-btn"
            :aria-label="$t('event_members.sns_instagram')"
          />
          <v-btn
            v-if="websiteUrl"
            :href="websiteUrl"
            target="_blank"
            rel="noopener noreferrer"
            :icon="mdiWeb"
            size="small"
            variant="outlined"
            class="user-bio-panel__sns-btn"
            :aria-label="$t('event_members.sns_website')"
          />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.user-bio-panel__name-wrap {
  padding-top: 0;
}

.user-bio-panel__name {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0.01em;
  text-align: center;
  word-break: break-word;
}

.user-bio-panel__sns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: auto;
  padding: 8px 16px 20px;
}

.user-bio-panel__sns-btn {
  color: rgba(var(--v-theme-on-surface), 0.72) !important;
  border-color: rgba(var(--v-theme-on-surface), 0.18) !important;
}
</style>
