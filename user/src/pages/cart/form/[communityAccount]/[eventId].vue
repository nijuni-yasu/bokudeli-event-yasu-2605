<script setup lang="ts">
import CartFormAnswer from '@shokujii/base/components/forms/CartFormAnswer.vue'
import { getCartPath, getOrdersPathAfterOrder } from '@/router/utils'

const route = useRoute()
const eventId = route.params.eventId as string
const communityAccount = route.params.communityAccount as string
</script>

<template>
  <CartFormAnswer
    :event-id="eventId"
    :community-account="communityAccount"
    :resolve-orders-path="getOrdersPathAfterOrder"
    :resolve-cart-path="getCartPath"
  />
</template>
