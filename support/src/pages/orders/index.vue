<script setup lang="ts">
import { orderBy, where } from 'firebase/firestore'
import { useOrderListStore } from '@shokujii/base/stores/orderList.js'
import { useEventStore } from '@shokujii/base/stores/event.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getEventUrl } from '@/utils/urls'
import { mdiOpenInNew } from '@mdi/js'

const PAGE_SIZE = 50

/** in_cart（カート投入のみ）は運営が確認したい「注文」ではないので除外する */
const orderListStore = useOrderListStore(
  'support/orders',
  [where('status', '!=', 'in_cart'), orderBy('status'), orderBy('updated_at', 'desc')],
  PAGE_SIZE,
)

type EventSummary = { eventName: string; communityName: string; communityAccount: string; shopName: string }

/** 表示行の event_id だけを解決する。旧 manager のような全コミュニティ走査はしない。 */
const eventSummaries = ref<Map<string, EventSummary>>(new Map())

watch(
  () => orderListStore.orders,
  async (orders) => {
    if (orders == null) {
      return
    }
    const unresolved = [...new Set(orders.map(({ eventId }) => eventId))].filter(
      (eventId) => !eventSummaries.value.has(eventId),
    )
    if (unresolved.length === 0) {
      return
    }
    const results = await Promise.all(
      unresolved.map(async (eventId) => {
        try {
          const event = await useEventStore(eventId).getLoadedEvent()
          if (event == null) {
            return null
          }
          return [
            eventId,
            {
              eventName: event.event_name,
              communityName: event.community_name,
              communityAccount: event.community_account,
              shopName: event.shop_name ?? '',
            },
          ] as const
        } catch (error) {
          console.warn(error)
          return null
        }
      }),
    )
    const next = new Map(eventSummaries.value)
    for (const result of results) {
      if (result != null) {
        next.set(result[0], result[1])
      }
    }
    eventSummaries.value = next
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <v-card>
      <v-card-title>{{ $t('orders.title') }}</v-card-title>

      <v-table density="compact" class="text-no-wrap">
        <thead>
          <tr>
            <th>{{ $t('orders.status') }}</th>
            <th>{{ $t('orders.ordered_at') }}</th>
            <th>{{ $t('orders.event_name') }}</th>
            <th>{{ $t('orders.community_name') }}</th>
            <th>{{ $t('orders.shop_name') }}</th>
            <th>{{ $t('orders.menu') }}</th>
            <th class="text-end">{{ $t('orders.price') }}</th>
            <th>{{ $t('orders.user') }}</th>
            <th>{{ $t('orders.carted_at') }}</th>
            <th>{{ $t('orders.canceled_at') }}</th>
            <th>{{ $t('orders.cancel_source') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ order, eventId } in orderListStore.orders ?? []" :key="order.order_id">
            <td>
              <v-chip size="small" label>{{ $t(`order_status.${order.status}`) }}</v-chip>
            </td>
            <td>{{ order.ordered_at == null ? '' : convertToDatetime(order.ordered_at) }}</td>
            <td>
              <a
                v-if="eventSummaries.get(eventId) != null"
                :href="getEventUrl(eventSummaries.get(eventId)!.communityAccount, eventId)"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ eventSummaries.get(eventId)!.eventName }}
                <v-icon :icon="mdiOpenInNew" size="14" />
              </a>
              <v-progress-circular v-else indeterminate size="16" width="2" />
            </td>
            <td>{{ eventSummaries.get(eventId)?.communityName }}</td>
            <td>{{ eventSummaries.get(eventId)?.shopName }}</td>
            <td>{{ order.menu_name }}</td>
            <td class="text-end">{{ $n(order.menu_price, 'currency') }}</td>
            <td>{{ order.user_id }}</td>
            <td>{{ convertToDatetime(order.carted_at) }}</td>
            <td>{{ order.canceled_at == null ? '' : convertToDatetime(order.canceled_at) }}</td>
            <td>{{ order.cancel_source == null ? '' : $t(`cancel_source.${order.cancel_source}`) }}</td>
          </tr>
          <tr v-if="orderListStore.orders != null && orderListStore.orders.length === 0">
            <td colspan="11" class="text-center py-6">{{ $t('common.no_data') }}</td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="orderListStore.orders == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>

      <v-card-actions v-if="orderListStore.hasMore" class="justify-center">
        <v-btn variant="tonal" @click="orderListStore.next()">{{ $t('common.load_more') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
