<script setup lang="ts">
import CartFormAnswer from '@shokujii/base/components/forms/CartFormAnswer.vue'
import { getCartPath, getEventPath, getOrdersPathAfterOrder } from '@/router/utils'

const route = useRoute()
const eventId = computed(() => {
  const value = route.params.eventId
  if (typeof value === 'string') {
    return value
  }
  return Array.isArray(value) ? (value[0] ?? '') : ''
})
const communityAccount = computed(() => {
  const value = route.params.communityAccount
  if (typeof value === 'string') {
    return value
  }
  return Array.isArray(value) ? (value[0] ?? '') : ''
})
</script>

<template>
  <CartFormAnswer
    :event-id="eventId"
    :community-account="communityAccount"
    :resolve-orders-path="getOrdersPathAfterOrder"
    :resolve-cart-path="getCartPath"
    :resolve-event-path="getEventPath"
  />
</template>
