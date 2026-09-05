<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useOrderListStore, type OrderListStore } from '@shokujii/base/stores/orderList.js'
import { useEventStore } from '@shokujii/base/stores/event.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getEventUrl } from '@/utils/urls'
import { orderStatusChipColor } from '@/utils/statusColors'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import { mdiOpenInNew } from '@mdi/js'

const PAGE_SIZE = 50
const RECENT_ORDER_DAYS = 7

const route = useRoute()

const buildFilters = (): QueryConstraint[] => {
  if (route.query.recent === '7') {
    const since = new Date(Date.now() - RECENT_ORDER_DAYS * 24 * 60 * 60 * 1000)
    return [where('status', '==', 'ordered'), where('ordered_at', '>=', since), orderBy('ordered_at', 'desc')]
  }
  return [orderBy('updated_at', 'desc')]
}

const storeId = computed(() => (route.query.recent === '7' ? 'support/orders/recent7' : 'support/orders'))

const orderListStore = shallowRef<OrderListStore>(useOrderListStore(storeId.value, buildFilters(), PAGE_SIZE))

watch(
  () => route.query.recent,
  () => {
    eventSummaries.value = new Map()
    failedEventIds.value = new Set()
    orderListStore.value = useOrderListStore(storeId.value, buildFilters(), PAGE_SIZE)
  },
)

const showRecentFilter = computed(() => route.query.recent === '7')

type EventSummary = { eventName: string; communityName: string; communityAccount: string; shopName: string }

/** 表示行の event_id だけを解決する。旧 manager のような全コミュニティ走査はしない。 */
const eventSummaries = ref<Map<string, EventSummary>>(new Map())
const failedEventIds = ref<Set<string>>(new Set())

watch(
  () => orderListStore.value.orders,
  async (orders) => {
    if (orders == null) {
      return
    }
    const unresolved = [...new Set(orders.map(({ eventId }) => eventId))].filter(
      (eventId) => !eventSummaries.value.has(eventId) && !failedEventIds.value.has(eventId),
    )
    if (unresolved.length === 0) {
      return
    }
    const results = await Promise.all(
      unresolved.map(async (eventId) => {
        try {
          const event = await useEventStore(eventId).getLoadedEvent()
          if (event == null) {
            return { eventId, summary: null as EventSummary | null }
          }
          return {
            eventId,
            summary: {
              eventName: event.event_name,
              communityName: event.community_name,
              communityAccount: event.community_account,
              shopName: event.shop_name ?? '',
            },
          }
        } catch (error) {
          console.warn(error)
          return { eventId, summary: null as EventSummary | null }
        }
      }),
    )
    const nextSummaries = new Map(eventSummaries.value)
    const nextFailed = new Set(failedEventIds.value)
    for (const { eventId, summary } of results) {
      if (summary == null) {
        nextFailed.add(eventId)
      } else {
        nextSummaries.set(eventId, summary)
      }
    }
    eventSummaries.value = nextSummaries
    failedEventIds.value = nextFailed
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center flex-wrap gap-2">
        {{ $t('orders.title') }}
        <SupportFilterChip v-if="showRecentFilter" :label="$t('filter.recent_orders')" />
      </v-card-title>

      <v-alert v-if="orderListStore.loadError" type="error" variant="tonal" class="ma-4">
        {{ $t('common.load_failed') }}
        <v-btn variant="text" size="small" @click="orderListStore.reload()">{{ $t('common.retry') }}</v-btn>
      </v-alert>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table text-no-wrap">
          <thead>
            <tr>
              <th>{{ $t('orders.status') }}</th>
              <th>{{ $t('orders.updated_at') }}</th>
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
                <v-chip size="small" label :color="orderStatusChipColor(order.status)">
                  {{ $t(`order_status.${order.status}`) }}
                </v-chip>
              </td>
              <td>{{ convertToDatetime(order.updated_at) }}</td>
              <td>
                <a
                  v-if="eventSummaries.get(eventId) != null"
                  class="support-link"
                  :href="getEventUrl(eventSummaries.get(eventId)!.communityAccount, eventId)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="line-clamp-2 d-inline-block">{{ eventSummaries.get(eventId)!.eventName }}</span>
                  <v-icon :icon="mdiOpenInNew" size="14" />
                </a>
                <span v-else-if="failedEventIds.has(eventId)" class="text-medium-emphasis">—</span>
                <v-progress-circular v-else indeterminate size="16" width="2" />
              </td>
              <td>{{ eventSummaries.get(eventId)?.communityName }}</td>
              <td>{{ eventSummaries.get(eventId)?.shopName }}</td>
              <td>{{ order.menu_name }}</td>
              <td class="text-end">{{ $n(order.menu_price, 'currency') }}</td>
              <td>
                <span class="support-mono-id" :title="order.user_id">{{ order.user_id }}</span>
              </td>
              <td>{{ convertToDatetime(order.carted_at) }}</td>
              <td>{{ order.canceled_at == null ? '' : convertToDatetime(order.canceled_at) }}</td>
              <td>{{ order.cancel_source == null ? '' : $t(`cancel_source.${order.cancel_source}`) }}</td>
            </tr>
            <tr v-if="orderListStore.orders != null && orderListStore.orders.length === 0">
              <td colspan="11" class="text-center py-6">{{ $t('common.no_data') }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div v-if="orderListStore.orders == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>

      <v-card-actions v-if="orderListStore.hasMore" class="justify-center">
        <v-btn variant="tonal" @click="orderListStore.next()">{{ $t('common.load_more') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
