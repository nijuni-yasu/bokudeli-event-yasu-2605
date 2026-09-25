<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useEventListStore, type EventListStore } from '@shokujii/base/stores/eventList.js'
import type { BokudeliEvent } from '@shokujii/base/stores/event.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getEventUrl, getCommunityUrl } from '@/utils/urls'
import { getEventInvoicePayment } from '@shokujii/base/stores/eventInvoicePayment.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import {
  INVOICE_PAYMENT_DOC_ID,
  type CommunityBillPaymentStatusType,
  type EventInvoicePayment,
} from '@shokujii/common/schemas/EventInvoicePayment.js'
import { eventStatusTicketTone, invoicePaymentTicketTone } from '@/utils/statusColors'
import { matchesSearch } from '@/utils/search'
import { formatRelativeJa, formatScheduleRange } from '@/utils/format'
import { isQueryFlagActive, withQueryFlag } from '@/utils/queryFlag'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import SupportPageHeader from '@/components/SupportPageHeader.vue'
import SupportStatusTicket from '@/components/SupportStatusTicket.vue'
import SupportDetailDrawer from '@/components/SupportDetailDrawer.vue'
import SupportDetailField from '@/components/SupportDetailField.vue'
import SupportExternalLink from '@/components/SupportExternalLink.vue'
import SupportInvoicePaymentPanel from '@/components/SupportInvoicePaymentPanel.vue'

const PAGE_SIZE = 30
const PAYMENT_STATUS_FILTERS: CommunityBillPaymentStatusType[] = ['unconfirmed', 'unpaid', 'paid']
const invoicePaymentKey = (event: Pick<BokudeliEvent, 'community_id' | 'event_id'>): string =>
  `${event.community_id}/${event.event_id}`
const COMMUNITY_BILL_FILTERS: QueryConstraint[] = [
  where('event_payment', '==', 'community_bill'),
  orderBy('event_start_datetime', 'desc'),
]

const route = useRoute()
const router = useRouter()

const { t: $t } = useI18n()

const searchQuery = ref('')
const selected = shallowRef<BokudeliEvent | null>(null)

const drawerOpen = computed({
  get: () => selected.value != null,
  set: (open: boolean) => {
    if (!open) {
      selected.value = null
    }
  },
})

const isPaymentStatusFilter = (value: unknown): value is CommunityBillPaymentStatusType =>
  value === 'unconfirmed' || value === 'unpaid' || value === 'paid'

const eventListStore = shallowRef<EventListStore>(
  useEventListStore(COMMUNITY_BILL_FILTERS, PAGE_SIZE, { autoContinue: false, storeKey: 'support/invoices' }),
)

/** 請求書払いイベントの入金ドキュメント。未作成は null。取得失敗は loadErrors。 */
const invoicePayments = ref<Map<string, EventInvoicePayment | null>>(new Map())
const invoicePaymentLoadErrors = ref(new Set<string>())

const events = computed(() => eventListStore.value.eventStores?.flatMap((store) => store.event ?? []) ?? null)

const paymentStatusFilter = computed(() => {
  const value = route.query.status
  return isPaymentStatusFilter(value) ? value : undefined
})

const invoicePaymentStatus = (
  event: Pick<BokudeliEvent, 'community_id' | 'event_id'>,
): CommunityBillPaymentStatusType => invoicePayments.value.get(invoicePaymentKey(event))?.status ?? 'unconfirmed'

const filteredEvents = computed(() => {
  if (events.value == null) {
    return null
  }
  return events.value.filter((event) => {
    const matched = matchesSearch(
      [
        event.event_name,
        event.community_name,
        event.community_account,
        event.shop_name,
        event.organizer_email,
        event.organizer_fullname,
        event.organizer_company,
        event.bill_email,
      ],
      searchQuery.value,
    )
    if (!matched) {
      return false
    }
    const filter = paymentStatusFilter.value
    if (filter == null) {
      return true
    }
    if (invoicePaymentLoadErrors.value.has(invoicePaymentKey(event))) {
      return false
    }
    if (!invoicePayments.value.has(invoicePaymentKey(event))) {
      return false
    }
    return invoicePaymentStatus(event) === filter
  })
})

const showingCount = computed(() => {
  const filtering = searchQuery.value.trim() !== '' || paymentStatusFilter.value != null
  if (!filtering || filteredEvents.value == null) {
    return null
  }
  return filteredEvents.value.length
})

const loadInvoicePayments = async (targets: BokudeliEvent[]): Promise<void> => {
  if (targets.length === 0) {
    return
  }
  const results = await Promise.all(
    targets.map(async (event) => {
      try {
        const payment = await getEventInvoicePayment(event.community_id, event.event_id)
        return { key: invoicePaymentKey(event), payment: payment ?? null, error: false }
      } catch (error) {
        console.warn(error)
        reportClientError(error, {
          componentInfo: 'invoices.index.loadPayment',
          documentPath: `communities/${event.community_id}/events/${event.event_id}/invoice_payments/${INVOICE_PAYMENT_DOC_ID}`,
          severity: 'warn',
        })
        return { key: invoicePaymentKey(event), payment: null, error: true }
      }
    }),
  )
  const next = new Map(invoicePayments.value)
  const nextErrors = new Set(invoicePaymentLoadErrors.value)
  for (const result of results) {
    if (result.error) {
      nextErrors.add(result.key)
      next.set(result.key, null)
      continue
    }
    nextErrors.delete(result.key)
    next.set(result.key, result.payment)
  }
  invoicePaymentLoadErrors.value = nextErrors
  invoicePayments.value = next
}

watch(
  events,
  (list) => {
    if (list == null) {
      return
    }
    void loadInvoicePayments(list.filter((event) => !invoicePayments.value.has(invoicePaymentKey(event))))
  },
  { immediate: true },
)

const retryInvoicePaymentLoad = (event: BokudeliEvent): void => {
  const key = invoicePaymentKey(event)
  const next = new Map(invoicePayments.value)
  next.delete(key)
  invoicePayments.value = next
  const nextErrors = new Set(invoicePaymentLoadErrors.value)
  nextErrors.delete(key)
  invoicePaymentLoadErrors.value = nextErrors
  void loadInvoicePayments([event])
}

const onDrawerInvoicePaymentUpdated = (payment: EventInvoicePayment, eventId: string): void => {
  const selectedEvent = selected.value
  if (selectedEvent == null || selectedEvent.event_id !== eventId) {
    return
  }
  const key = invoicePaymentKey(selectedEvent)
  const next = new Map(invoicePayments.value)
  next.set(key, payment)
  invoicePayments.value = next
  const nextErrors = new Set(invoicePaymentLoadErrors.value)
  nextErrors.delete(key)
  invoicePaymentLoadErrors.value = nextErrors
}

const hasMore = computed(
  () => eventListStore.value.totalCount != null && (events.value?.length ?? 0) < eventListStore.value.totalCount,
)

const rowClass = (event: BokudeliEvent): string[] => {
  const classes = ['support-row-clickable']
  if (event.calculatedEventStatus === 'event_canceled') {
    classes.push('support-row--danger')
  }
  return classes
}

const setPaymentStatusFilter = (status: CommunityBillPaymentStatusType, active: boolean): void => {
  void router.replace({ query: withQueryFlag(route.query, 'status', status, active) })
}

const isPaymentStatusChipActive = (status: CommunityBillPaymentStatusType): boolean =>
  isQueryFlagActive(route.query.status, status)
</script>

<template>
  <div class="support-page">
    <v-card class="support-sheet" elevation="0" rounded="0">
      <SupportPageHeader
        v-model:search="searchQuery"
        :title="$t('invoices.title')"
        :total-count="eventListStore.totalCount"
        :showing-count="showingCount"
      >
        <template #filters>
          <SupportFilterChip
            v-for="status in PAYMENT_STATUS_FILTERS"
            :key="status"
            :active="isPaymentStatusChipActive(status)"
            :label="$t(`filter.invoice_${status}`)"
            @update:active="(active) => setPaymentStatusFilter(status, active)"
          />
        </template>
      </SupportPageHeader>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table">
          <thead>
            <tr>
              <th>{{ $t('events.event_name') }}</th>
              <th>{{ $t('events.status') }}</th>
              <th>{{ $t('invoices.payment') }}</th>
              <th>{{ $t('events.schedule') }}</th>
              <th>{{ $t('events.deadline') }}</th>
              <th>{{ $t('events.shop_name') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in filteredEvents ?? []"
              :key="invoicePaymentKey(event)"
              :class="rowClass(event)"
              @click="selected = event"
            >
              <td>
                <SupportExternalLink
                  :href="getEventUrl(event.community_account, event.event_id)"
                  :label="event.event_name"
                />
                <div class="support-cell-sub">{{ event.community_name }}</div>
              </td>
              <td>
                <SupportStatusTicket
                  :label="$t(`event_status.${event.calculatedEventStatus}`)"
                  :tone="eventStatusTicketTone(event.calculatedEventStatus)"
                />
              </td>
              <td>
                <SupportStatusTicket
                  v-if="invoicePaymentLoadErrors.has(invoicePaymentKey(event))"
                  :label="$t('common.load_failed')"
                  tone="danger"
                  @click.stop="retryInvoicePaymentLoad(event)"
                />
                <SupportStatusTicket
                  v-else-if="invoicePayments.has(invoicePaymentKey(event))"
                  :label="$t(`invoice_payment_status.${invoicePaymentStatus(event)}`)"
                  :tone="invoicePaymentTicketTone(invoicePaymentStatus(event))"
                />
                <v-progress-circular v-else indeterminate size="16" width="2" />
              </td>
              <td class="support-table-col-nowrap">
                {{ formatScheduleRange(event.event_start_datetime, event.event_end_datetime) }}
              </td>
              <td>
                <div>{{ formatRelativeJa(event.event_deadline_datetime) }}</div>
                <div class="support-cell-sub">{{ convertToDatetime(event.event_deadline_datetime) }}</div>
              </td>
              <td>
                <span class="line-clamp-2">{{ event.shop_name }}</span>
              </td>
            </tr>
            <tr v-if="filteredEvents != null && filteredEvents.length === 0">
              <td colspan="6" class="text-center py-6">
                {{ events != null && events.length > 0 ? $t('common.search_no_match') : $t('common.no_data') }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div v-if="events == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>

      <v-card-actions v-if="hasMore" class="justify-center">
        <v-btn variant="tonal" @click="eventListStore.next()">{{ $t('common.load_more') }}</v-btn>
      </v-card-actions>
    </v-card>

    <SupportDetailDrawer v-model="drawerOpen" :title="selected?.event_name ?? $t('invoices.title')">
      <dl v-if="selected != null" class="support-detail-list">
        <SupportDetailField :label="$t('events.status')">
          <SupportStatusTicket
            :label="$t(`event_status.${selected.calculatedEventStatus}`)"
            :tone="eventStatusTicketTone(selected.calculatedEventStatus)"
          />
        </SupportDetailField>
        <SupportDetailField :label="$t('events.community_name')">
          {{ selected.community_name }}
        </SupportDetailField>
        <SupportDetailField :label="$t('events.shop_name')">{{ selected.shop_name }}</SupportDetailField>
        <SupportDetailField :label="$t('events.schedule')">
          {{ formatScheduleRange(selected.event_start_datetime, selected.event_end_datetime) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('events.deadline')">
          {{ convertToDatetime(selected.event_deadline_datetime) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('events.payment')">
          {{ $t(`payment.${selected.event_payment}`) }}
        </SupportDetailField>
        <SupportInvoicePaymentPanel :event="selected" @updated="onDrawerInvoicePaymentUpdated" />
        <SupportDetailField :label="$t('events.visibility')">
          {{ selected.is_public ? $t('communities.is_public_on') : $t('communities.is_public_off') }}
        </SupportDetailField>
        <SupportDetailField :label="$t('events.place')">
          {{ selected.event_place || selected.fullAddress || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('events.organizer')">
          <div>{{ selected.organizer_company }}</div>
          <div>{{ selected.organizer_fullname }}</div>
          <div class="support-mono-id">{{ selected.organizer_email }}</div>
        </SupportDetailField>
        <SupportDetailField :label="$t('events.organizer_phone_company')">
          {{ selected.organizer_phone_company || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('events.organizer_phone_personal')">
          {{ selected.organizer_phone_personal || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('events.organizer_memo')">
          {{ selected.organizer_memo || '—' }}
        </SupportDetailField>
      </dl>
      <template #actions>
        <v-btn
          v-if="selected != null"
          variant="tonal"
          :href="getEventUrl(selected.community_account, selected.event_id)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('common.open_external') }}
        </v-btn>
        <v-btn
          v-if="selected != null"
          variant="text"
          :href="getCommunityUrl(selected.community_account)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('events.community_name') }}
        </v-btn>
      </template>
    </SupportDetailDrawer>
  </div>
</template>
