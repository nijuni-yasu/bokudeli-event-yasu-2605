<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { mdiClose } from '@mdi/js'
import { User } from '@shokujii/common/schemas/User.js'
import UserAvatar from '@shokujii/base/components/UserAvatar.vue'
import {
  subscribeChatEventParticipantRoster,
  type ChatEventParticipantRoster,
} from '@shokujii/base/stores/chatEventParticipants.js'
import type { ResolveUserPathFn } from '@shokujii/base/types/profilePathResolvers.js'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
  eventId: string
  memberIds: string[]
  eventMaxPeople: number
  communityAccount: string
  resolveProfilePath?: ResolveUserPathFn
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  openMembers: [payload: { communityAccount: string; eventId: string }]
}>()

const { t } = useI18n()
const display = useDisplay()

const open = computed({
  get: (): boolean => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  },
})

const drawerWidth = computed((): number => {
  if (display.smAndDown.value !== true) {
    return 360
  }
  const viewportWidth = display.width.value
  return viewportWidth > 0 ? viewportWidth : 360
})

const emptyRoster = (): ChatEventParticipantRoster => {
  return {
    usersById: new Map(),
  }
}

const roster = ref<ChatEventParticipantRoster>(emptyRoster())
const memberIdsKey = computed((): string => props.memberIds.join('\0'))

let unsubscribeRoster: (() => void) | null = null

const stopRoster = (): void => {
  unsubscribeRoster?.()
  unsubscribeRoster = null
}

watch(
  () => [open.value, memberIdsKey.value] as const,
  () => {
    stopRoster()
    roster.value = emptyRoster()
    if (open.value !== true) {
      return
    }
    unsubscribeRoster = subscribeChatEventParticipantRoster(props.memberIds, (next) => {
      roster.value = next
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  stopRoster()
})

const rosterLoading = computed((): boolean => {
  if (open.value !== true) {
    return false
  }
  return props.memberIds.some((memberId) => memberId !== '' && !roster.value.usersById.has(memberId))
})

type ParticipantRow = {
  userId: string
  user: User | null
  name: string
  profileTo: RouteLocationRaw | null
}

const rows = computed((): ParticipantRow[] => {
  return props.memberIds
    .filter((memberId) => memberId !== '')
    .map((memberId) => {
      const user = roster.value.usersById.get(memberId) ?? null
      const loaded = roster.value.usersById.has(memberId)
      let name = ''
      if (loaded) {
        name = user != null && user.user_name !== '' ? user.user_name : t('chat.default_user_name')
      }
      const profileTo = props.resolveProfilePath == null || memberId === '' ? null : props.resolveProfilePath(memberId)
      return {
        userId: memberId,
        user,
        name,
        profileTo,
      }
    })
})

const canOpenMembersPage = computed((): boolean => props.communityAccount !== '' && props.eventId !== '')

const close = (): void => {
  open.value = false
}

const openMembersPage = (): void => {
  if (!canOpenMembersPage.value) {
    return
  }
  emit('openMembers', { communityAccount: props.communityAccount, eventId: props.eventId })
  close()
}
</script>

<template>
  <VNavigationDrawer
    v-model="open"
    class="chat-participants-drawer"
    location="end"
    absolute
    temporary
    touchless
    disable-resize-watcher
    :width="drawerWidth"
    :aria-label="t('chat.participants.open')"
  >
    <div class="chat-participants-drawer__header d-flex align-center px-4 py-3">
      <div class="flex-grow-1 min-width-0">
        <div class="text-subtitle-1">{{ t('chat.participants.open') }}</div>
        <div v-if="eventMaxPeople > 0" class="text-body-2 text-medium-emphasis">
          {{ t('chat.participants.count', { count: memberIds.length, max: eventMaxPeople }) }}
        </div>
      </div>
      <VBtn icon variant="text" color="default" :aria-label="t('chat.participants.close')" @click="close">
        <VIcon :icon="mdiClose" />
      </VBtn>
    </div>
    <VDivider />
    <VProgressLinear v-if="rosterLoading" indeterminate color="primary" />
    <div class="chat-participants-drawer__list flex-grow-1 overflow-y-auto">
      <div v-for="row in rows" :key="row.userId" class="chat-participants-drawer__row px-4 py-3">
        <component
          :is="row.profileTo != null ? 'router-link' : 'div'"
          class="d-flex align-center text-decoration-none chat-participants-drawer__profile"
          :to="row.profileTo ?? undefined"
          :aria-label="row.profileTo != null ? t('chat.open_user_profile', { name: row.name }) : undefined"
        >
          <UserAvatar :user="row.user" :size="40" class="flex-shrink-0" />
          <div class="ps-3 min-width-0 text-body-2 font-weight-bold text-truncate">
            {{ row.name }}
          </div>
        </component>
      </div>
    </div>
    <VDivider />
    <div v-if="canOpenMembersPage" class="pa-4">
      <VBtn class="w-100" size="small" variant="outlined" color="primary" @click="openMembersPage">
        {{ t('chat.participants.open_profiles') }}
      </VBtn>
    </div>
  </VNavigationDrawer>
</template>

<style scoped lang="scss">
.chat-participants-drawer :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-participants-drawer__list {
  min-block-size: 0;
}

.chat-participants-drawer__profile {
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));

  &:hover {
    opacity: 0.75;
  }
}
</style>
