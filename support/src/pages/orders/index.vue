<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useOrderListStore, type OrderListStore } from '@shokujii/base/stores/orderList.js'
import { useEventStore } from '@shokujii/base/stores/event.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import type { EventMemberOrder } from '@shokujii/common/schemas/EventMemberOrder.js'
import { getEventUrl } from '@/utils/urls'
import { orderStatusTicketTone } from '@/utils/statusColors'
import { matchesSearch } from '@/utils/search'
import { formatRelativeJa } from '@/utils/format'
import { isQueryFlagActive, withQueryFlag } from '@/utils/queryFlag'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import SupportPageHeader from '@/components/SupportPageHeader.vue'
import SupportStatusTicket from '@/components/SupportStatusTicket.vue'
import SupportDetailDrawer from '@/components/SupportDetailDrawer.vue'
import SupportDetailField from '@/components/SupportDetailField.vue'
import SupportExternalLink from '@/components/SupportExternalLink.vue'

const PAGE_SIZE = 50
const RECENT_ORDER_DAYS = 7

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')

type OrderRow = { order: EventMemberOrder; eventId: string }
const selected = shallowRef<OrderRow | null>(null)

const drawerOpen = computed({
  get: () => selected.value != null,
  set: (open: boolean) => {
    if (!open) {
      selected.value = null
    }
  },
})

const buildFilters = (): QueryConstraint[] => {
  if (isQueryFlagActive(route.query.recent, '7')) {
    const since = new Date(Date.now() - RECENT_ORDER_DAYS * 24 * 60 * 60 * 1000)
    return [where('status', '==', 'ordered'), where('ordered_at', '>=', since), orderBy('ordered_at', 'desc')]
  }
  return [orderBy('updated_at', 'desc')]
}

const storeId = computed(() =>
  isQueryFlagActive(route.query.recent, '7') ? 'support/orders/recent7' : 'support/orders',
)

const orderListStore = shallowRef<OrderListStore>(useOrderListStore(storeId.value, buildFilters(), PAGE_SIZE))

watch(
  () => route.query.recent,
  () => {
    eventSummaries.value = new Map()
    failedEventIds.value = new Set()
    orderListStore.value = useOrderListStore(storeId.value, buildFilters(), PAGE_SIZE)
  },
)

const showRecentFilter = computed(() => isQueryFlagActive(route.query.recent, '7'))

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
            return { eventId, summary: undefined }
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
          return { eventId, summary: undefined }
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

const filteredOrders = computed(() => {
  const orders = orderListStore.value.orders
  if (orders == null) {
    return null
  }
  return orders.filter(({ order, eventId }) => {
    const summary = eventSummaries.value.get(eventId)
    return matchesSearch(
      [order.menu_name, order.user_id, summary?.eventName, summary?.communityName, summary?.shopName],
      searchQuery.value,
    )
  })
})

const showingCount = computed(() => {
  if (searchQuery.value.trim() === '' || filteredOrders.value == null) {
    return null
  }
  return filteredOrders.value.length
})

const setRecentFilter = (active: boolean): void => {
  void router.replace({ query: withQueryFlag(route.query, 'recent', '7', active) })
}

const selectedSummary = computed(() => {
  const row = selected.value
  if (row == null) {
    return undefined
  }
  return eventSummaries.value.get(row.eventId)
})
</script>

<template>
  <div class="support-page">
    <v-card class="support-sheet" elevation="0" rounded="0">
      <SupportPageHeader v-model:search="searchQuery" :title="$t('orders.title')" :showing-count="showingCount">
        <template #filters>
          <SupportFilterChip
            :active="showRecentFilter"
            :label="$t('filter.recent_orders')"
            @update:active="setRecentFilter"
          />
        </template>
      </SupportPageHeader>

      <v-alert v-if="orderListStore.loadError" type="error" variant="tonal" class="ma-4">
        {{ $t('common.load_failed') }}
        <v-btn variant="text" size="small" @click="orderListStore.reload()">{{ $t('common.retry') }}</v-btn>
      </v-alert>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table">
          <thead>
            <tr>
              <th>{{ $t('orders.event_name') }}</th>
              <th>{{ $t('orders.status') }}</th>
              <th>{{ $t('orders.menu') }}</th>
              <th class="text-end">{{ $t('orders.price') }}</th>
              <th>{{ $t('orders.updated_at') }}</th>
              <th>{{ $t('orders.user') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in filteredOrders ?? []"
              :key="row.order.order_id"
              class="support-row-clickable"
              :class="{ 'support-row--danger': row.order.status === 'canceled' }"
              @click="selected = row"
            >
              <td>
                <SupportExternalLink
                  v-if="eventSummaries.get(row.eventId) != null"
                  :href="getEventUrl(eventSummaries.get(row.eventId)?.communityAccount ?? '', row.eventId)"
                  :label="eventSummaries.get(row.eventId)?.eventName ?? ''"
                />
                <span v-else-if="failedEventIds.has(row.eventId)" class="text-medium-emphasis">—</span>
                <v-progress-circular v-else indeterminate size="16" width="2" />
                <div class="support-cell-sub">{{ eventSummaries.get(row.eventId)?.communityName }}</div>
              </td>
              <td>
                <SupportStatusTicket
                  :label="$t(`order_status.${row.order.status}`)"
                  :tone="orderStatusTicketTone(row.order.status)"
                />
              </td>
              <td>
                <span class="line-clamp-2">{{ row.order.menu_name }}</span>
              </td>
              <td class="text-end support-table-col-nowrap">{{ $n(row.order.menu_price, 'currency') }}</td>
              <td>
                <div>{{ formatRelativeJa(row.order.updated_at) }}</div>
                <div class="support-cell-sub">{{ convertToDatetime(row.order.updated_at) }}</div>
              </td>
              <td>
                <span class="support-mono-id" :title="row.order.user_id">{{ row.order.user_id }}</span>
              </td>
            </tr>
            <tr v-if="filteredOrders != null && filteredOrders.length === 0">
              <td colspan="6" class="text-center py-6">
                {{
                  orderListStore.orders != null && orderListStore.orders.length > 0
                    ? $t('common.search_no_match')
                    : $t('common.no_data')
                }}
              </td>
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

    <SupportDetailDrawer v-model="drawerOpen" :title="selected?.order.menu_name ?? $t('orders.title')">
      <dl v-if="selected != null" class="support-detail-list">
        <SupportDetailField :label="$t('orders.status')">
          <SupportStatusTicket
            :label="$t(`order_status.${selected.order.status}`)"
            :tone="orderStatusTicketTone(selected.order.status)"
          />
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.event_name')">
          {{ selectedSummary?.eventName ?? '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.community_name')">
          {{ selectedSummary?.communityName ?? '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.shop_name')">
          {{ selectedSummary?.shopName || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.price')">
          {{ $n(selected.order.menu_price, 'currency') }}
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.user')">
          <span class="support-mono-id" :title="selected.order.user_id">{{ selected.order.user_id }}</span>
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.updated_at')">
          {{ convertToDatetime(selected.order.updated_at) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.ordered_at')">
          {{ selected.order.ordered_at == null ? '—' : convertToDatetime(selected.order.ordered_at) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.carted_at')">
          {{ convertToDatetime(selected.order.carted_at) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.canceled_at')">
          {{ selected.order.canceled_at == null ? '' : convertToDatetime(selected.order.canceled_at) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('orders.cancel_source')">
          {{ selected.order.cancel_source == null ? '' : $t(`cancel_source.${selected.order.cancel_source}`) }}
        </SupportDetailField>
      </dl>
      <template #actions>
        <v-btn
          v-if="selected != null && selectedSummary != null"
          variant="tonal"
          :href="getEventUrl(selectedSummary.communityAccount, selected.eventId)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('common.open_external') }}
        </v-btn>
      </template>
    </SupportDetailDrawer>
  </div>
</template>
