<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type BokudeliEvent } from '@shokujii/base/stores/event.js'
import { useAppCommunityStore } from '@shokujii/base/composable/useAppCommunityStore.js'
import { useAppEventStore } from '@shokujii/base/composable/useAppEventStore.js'
import EventMemberCard from '@shokujii/base/components/EventMemberCard.vue'
import { getEventPath } from '@/router/utils'
import { useCurrentUserStore } from '@shokujii/base/stores/currentUser.js'
import { mdiArrowLeftBold } from '@mdi/js'
import { shouldShowEventParticipantsSection } from '@shokujii/common/utils/eventParticipantsVisibility.js'
import { useNotification } from '@shokujii/base/composable/notification.js'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  communityAccount: string
  eventId: string
}>()

const router = useRouter()
const notification = useNotification()
const { t: $t } = useI18n()
const communityStore = useAppCommunityStore(props.communityAccount)
const isShowMember: boolean = await new Promise((resolve) => {
  watch(
    () => communityStore.community?.is_show_member,
    (isShowMember) => {
      if (isShowMember === false) {
        router.push('/404')
      }
      if (isShowMember != null) {
        resolve(isShowMember)
      }
    },
    { immediate: true },
  )
})

const eventStore = useAppEventStore(props.eventId)
const currentUserStore = useCurrentUserStore()
const event = computed<BokudeliEvent | null>(() => eventStore.event)

const latestOrderAt = (member: { orders: { updated_at: number }[] }): number =>
  member.orders.reduce((max, order) => Math.max(max, order.updated_at), 0)

const members = computed(() => {
  const uid = currentUserStore.firebaseUser?.uid
  return [...(eventStore.members ?? [])].sort((a, b) => {
    const aIsSelf = uid != null && a.user_id === uid
    const bIsSelf = uid != null && b.user_id === uid
    if (aIsSelf !== bIsSelf) {
      return aIsSelf ? -1 : 1
    }
    return latestOrderAt(a) - latestOrderAt(b)
  })
})

const shouldShowParticipantsPage = computed(() => {
  const currentEvent = event.value
  if (currentEvent == null) {
    return null
  }
  return shouldShowEventParticipantsSection(currentEvent, currentEvent.members.length)
})

watch(
  shouldShowParticipantsPage,
  (visible) => {
    // is_show_member が false のときは既に /404 へ遷移済みなので、ここで上書きしない
    if (visible === false && isShowMember) {
      const currentEvent = event.value
      const message =
        currentEvent != null && currentEvent.members.length === 0
          ? $t('event_detail.members_page_hidden_no_participants')
          : $t('event_detail.members_page_hidden_until_threshold')
      notification.show(message, 'info')
      router.replace(getEventPath(props.communityAccount, props.eventId))
    }
  },
  { immediate: true },
)
</script>
<template>
  <section>
    <div v-if="event != null && isShowMember && shouldShowParticipantsPage" class="members-page">
      <header class="members-page__header">
        <v-btn
          class="members-page__back"
          color="primary"
          variant="text"
          :prepend-icon="mdiArrowLeftBold"
          @click="router.push(getEventPath(props.communityAccount, props.eventId))"
        >
          {{ event.event_name }}
        </v-btn>
        <div class="members-page__heading">
          <h1 class="members-page__title">
            {{ $t('event_members.title') }}
            <span class="members-page__count">{{ members.length }} / {{ event.event_max_people }}</span>
          </h1>
        </div>
      </header>
      <v-row class="ma-0 pa-0 align-stretch">
        <v-col
          v-for="(member, index) in members"
          :key="member.user_id"
          class="d-flex align-start ma-0 pa-2"
          lg="3"
          md="4"
          sm="6"
          cols="12"
        >
          <event-member-card
            :member="member"
            :organizer="event.created_by != null && event.created_by === member.user_id"
            :index="index"
            class="w-100"
          />
        </v-col>
      </v-row>
    </div>
    <div v-else class="justify-center">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </div>
  </section>
</template>
<style scoped lang="scss">
.members-page__header {
  padding: 4px 8px 8px;
}

.members-page__back {
  height: auto;
  margin-inline-start: -4px;
  padding-top: 8px;
  padding-bottom: 8px;

  :deep(.v-btn__content) {
    white-space: normal;
    text-align: start;
  }
}

.members-page__heading {
  padding: 0 16px 4px;
}

.members-page__title {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 900;
  line-height: 1.4;
}

.members-page__count {
  margin-inline-start: 8px;
  font-size: 1.125rem;
  font-weight: 900;
}

@media (min-width: 600px) {
  .members-page__title {
    font-size: 1.625rem;
  }

  .members-page__count {
    font-size: 1.25rem;
  }
}
</style>
