<script setup lang="ts">
import Orders from '@shokujii/base/components/pages/orders.vue'
import { useRouter } from 'vue-router'
import { getChatPath, getEventPath, getReceiptPath } from '@/router/utils'
import { waitForEventChatMembership } from '@shokujii/base/stores/chat.js'
import type { NavigateToEventChatFn } from '@shokujii/base/types/profilePathResolvers.js'
import { withChatGreetingPrompt } from '@shokujii/base/utils/chatGreetingPrompt.js'
import { useNotification } from '@shokujii/base/composable/notification.js'
import { storeToRefs } from 'pinia'
import { useCurrentUserStore } from '@shokujii/base/stores/currentUser.js'

const profileFilter = { kind: 'pf-null' as const }

const router = useRouter()
const notification = useNotification()
const { t: $t } = useI18n()
const { user: loginUser, firebaseUser } = storeToRefs(useCurrentUserStore())

const navigateToEventChat: NavigateToEventChatFn = async (params) => {
  const userId = loginUser.value?.user_id ?? firebaseUser.value?.uid ?? ''
  if (userId === '') {
    return false
  }
  try {
    const roomId = await waitForEventChatMembership(userId, params.communityId, params.eventId)
    if (roomId == null) {
      notification.show($t('chat.error.preparing'), 'warning')
      return false
    }
    const location = getChatPath(roomId)
    const destination = params.promptGreeting === true ? withChatGreetingPrompt(location, roomId) : location
    await router.push(destination)
    return true
  } catch {
    notification.show($t('chat.error.open_failed'), 'error')
    return false
  }
}
</script>

<template>
  <Orders
    :profile-filter="profileFilter"
    :resolve-event-path="getEventPath"
    :resolve-receipt-path="getReceiptPath"
    :navigate-to-event-chat="navigateToEventChat"
  />
</template>
