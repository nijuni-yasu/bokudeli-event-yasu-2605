<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { buildFacebookUrl, buildInstagramUrl, buildTwitterUrl } from '@shokujii/base/utils/buildSnsLinks'
import { type BokudeliEventMember } from '@shokujii/base/stores/event.js'
import UserAvatar from '@shokujii/base/components/UserAvatar.vue'
import TagBadge from '@shokujii/base/components/TagBadge.vue'
import TagAddChip from '@shokujii/base/components/TagAddChip.vue'
import { getUserPath } from '@/router/utils'
import { useCurrentUserStore } from '@shokujii/base/stores/currentUser.js'
import { useProfileTagToggle } from '@shokujii/base/composable/useTagImportHint.js'
import { resolveMemberDisplayName } from '@shokujii/base/utils/displayMemberName.js'
import { orderTagsWithHighlightFirst } from '@shokujii/base/utils/tagDisplayOrder.js'
import { mdiAlphaXCircle, mdiFacebook, mdiInstagram, mdiWeb } from '@mdi/js'

const props = withDefaults(
  defineProps<{
    member: BokudeliEventMember
    organizer?: boolean
    index?: number
  }>(),
  {
    organizer: false,
    index: 0,
  },
)

const { t } = useI18n()
const { xs } = useDisplay()
const currentUserStore = useCurrentUserStore()
const { toggleTag: onMemberTagClick } = useProfileTagToggle()

const compact = computed(() => xs.value)
const myTags = computed(() => new Set(currentUserStore.user?.user_tags ?? []))
const isTagHighlighted = (tag: string) => myTags.value.has(tag)
const orderedUserTags = computed(() => orderTagsWithHighlightFirst(props.member.user_tags ?? [], isTagHighlighted))
const isCurrentUser = computed(() => props.member.user_id === currentUserStore.firebaseUser?.uid)
const showMemberTags = computed(() => orderedUserTags.value.length > 0 || isCurrentUser.value)
const userName = computed(() => resolveMemberDisplayName(props.member.user_name, t('event_members.guest')))
const userDescription = computed(() => props.member.user_description?.trim() ?? '')

const twitterUrl = computed(() => {
  const account = props.member.user_sns_twitter
  if (account == null || account === '') return null
  return buildTwitterUrl(account)
})
const facebookUrl = computed(() => {
  const account = props.member.user_sns_facebook
  if (account == null || account === '') return null
  return buildFacebookUrl(account)
})
const instagramUrl = computed(() => {
  const account = props.member.user_sns_instagram
  if (account == null || account === '') return null
  return buildInstagramUrl(account)
})
const websiteUrl = computed(() => {
  const url = props.member.user_sns_website
  if (url == null || url === '') return null
  return url
})
const hasSnsLinks = computed(
  () => twitterUrl.value != null || facebookUrl.value != null || instagramUrl.value != null || websiteUrl.value != null,
)

const cardStyle = computed(() => ({
  animationDelay: `${Math.min(props.index, 11) * 45}ms`,
}))
</script>

<template>
  <article
    class="event-member-card"
    :class="{
      'event-member-card--compact': compact,
      'event-member-card--organizer': organizer,
    }"
    :style="cardStyle"
  >
    <router-link :to="getUserPath(member.user_id)" class="event-member-card__main">
      <div class="event-member-card__identity">
        <div class="event-member-card__avatar-wrap">
          <UserAvatar :user="member" :size="compact ? 56 : 96" />
        </div>
        <div class="event-member-card__name-block">
          <span class="event-member-card__name" :title="userName">{{ userName }}</span>
          <div v-if="organizer" class="event-member-card__roles">
            <span class="event-member-card__role">{{ t('event_members.organizer') }}</span>
          </div>
        </div>
      </div>

      <p v-if="userDescription !== ''" class="event-member-card__description">{{ userDescription }}</p>
    </router-link>

    <div v-if="showMemberTags" class="event-member-card__tags">
      <div class="event-member-card__tag-list">
        <span v-for="tag in orderedUserTags" :key="tag" class="event-member-card__tag">
          <TagBadge
            :tag="tag"
            compact
            :highlighted="isTagHighlighted(tag)"
            :clickable="!isCurrentUser"
            @click="onMemberTagClick(tag)"
          />
        </span>
      </div>
      <TagAddChip v-if="isCurrentUser" compact />
    </div>

    <div v-if="hasSnsLinks" class="event-member-card__sns">
      <v-btn
        v-if="twitterUrl"
        :href="twitterUrl"
        target="_blank"
        rel="noopener noreferrer"
        :icon="mdiAlphaXCircle"
        size="small"
        variant="outlined"
        class="event-member-card__sns-btn"
        :aria-label="t('event_members.sns_x')"
      />
      <v-btn
        v-if="facebookUrl"
        :href="facebookUrl"
        target="_blank"
        rel="noopener noreferrer"
        :icon="mdiFacebook"
        size="small"
        variant="outlined"
        class="event-member-card__sns-btn"
        :aria-label="t('event_members.sns_facebook')"
      />
      <v-btn
        v-if="instagramUrl"
        :href="instagramUrl"
        target="_blank"
        rel="noopener noreferrer"
        :icon="mdiInstagram"
        size="small"
        variant="outlined"
        class="event-member-card__sns-btn"
        :aria-label="t('event_members.sns_instagram')"
      />
      <v-btn
        v-if="websiteUrl"
        :href="websiteUrl"
        target="_blank"
        rel="noopener noreferrer"
        :icon="mdiWeb"
        size="small"
        variant="outlined"
        class="event-member-card__sns-btn"
        :aria-label="t('event_members.sns_website')"
      />
    </div>
  </article>
</template>

<style scoped lang="scss">
.event-member-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  padding: 22px 16px 16px;
  background: rgb(var(--v-theme-surface));
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(var(--v-theme-on-surface), 0.06),
    0 10px 28px rgba(var(--v-theme-on-surface), 0.1);
  transition: box-shadow 0.22s ease;
}

.event-member-card:hover {
  box-shadow:
    0 2px 4px rgba(var(--v-theme-on-surface), 0.06),
    0 16px 36px rgba(var(--v-theme-on-surface), 0.14);
}

.event-member-card__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  border-radius: 12px;

  &:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 4px;
  }
}

.event-member-card__identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 0;
  text-align: center;
}

.event-member-card__avatar-wrap {
  display: flex;
  flex-shrink: 0;
  border-radius: 50%;
}

.event-member-card__name-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 6px;
}

.event-member-card__name {
  max-width: 100%;
  overflow: hidden;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-member-card__roles {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.event-member-card__role {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  color: rgba(var(--v-theme-on-surface), 0.72);
  letter-spacing: 0.04em;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 999px;
}

.event-member-card__description {
  display: -webkit-box;
  margin: 14px 0 0;
  overflow: hidden;
  font-size: 0.875rem;
  line-height: 1.65;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  text-align: start;
  word-break: break-word;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  /* autoprefixer: ignore next - line-clamp に必須 */
  -webkit-box-orient: vertical;
}

.event-member-card__tags {
  width: 100%;
  margin-top: 12px;
}

.event-member-card__tag-list {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}

.event-member-card__tag {
  display: inline-flex;
  max-width: 100%;
}

.event-member-card__sns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: auto;
  padding-top: 14px;
}

.event-member-card__sns-btn {
  color: rgba(var(--v-theme-on-surface), 0.72) !important;
  border-color: rgba(var(--v-theme-on-surface), 0.18) !important;
}

.event-member-card--compact {
  padding: 16px;

  .event-member-card__identity {
    flex-direction: row;
    align-items: center;
    text-align: start;
  }

  .event-member-card__name-block,
  .event-member-card__roles,
  .event-member-card__sns {
    align-items: flex-start;
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .event-member-card {
    animation: member-card-in 0.45s ease both;
  }

  .event-member-card__avatar-wrap {
    transition: transform 0.22s ease;
  }

  .event-member-card__main:hover .event-member-card__avatar-wrap {
    transform: scale(1.04);
  }
}

@keyframes member-card-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>
