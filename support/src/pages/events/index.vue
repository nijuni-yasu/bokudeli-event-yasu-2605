<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useEventListStore, type EventListStore } from '@shokujii/base/stores/eventList.js'
import type { BokudeliEvent } from '@shokujii/base/stores/event.js'
import { countOrderedByEventId } from '@shokujii/base/stores/supportCounts.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getEventUrl, getCommunityUrl } from '@/utils/urls'
import { eventStatusTicketTone } from '@/utils/statusColors'
import { matchesSearch } from '@/utils/search'
import { formatRelativeJa, formatScheduleRange } from '@/utils/format'
import { isQueryFlagActive, withQueryFlag } from '@/utils/queryFlag'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import SupportPageHeader from '@/components/SupportPageHeader.vue'
import SupportStatusTicket from '@/components/SupportStatusTicket.vue'
import SupportDetailDrawer from '@/components/SupportDetailDrawer.vue'
import SupportDetailField from '@/components/SupportDetailField.vue'
import SupportExternalLink from '@/components/SupportExternalLink.vue'
import { mdiAlertCircleOutline } from '@mdi/js'

const PAGE_SIZE = 30
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

type EventStatusFilter = 'accepting_order' | 'applying_reservation'

const isEventStatusFilter = (value: unknown): value is EventStatusFilter =>
  value === 'accepting_order' || value === 'applying_reservation'

const buildFilters = (): QueryConstraint[] => {
  const filters: QueryConstraint[] = [orderBy('event_start_datetime', 'desc')]
  if (isEventStatusFilter(route.query.status)) {
    filters.unshift(where('event_status.value', '==', route.query.status))
  }
  return filters
}

const eventListStoreKey = (): string =>
  isEventStatusFilter(route.query.status) ? `support/events/${route.query.status}` : 'support/events'

const eventListStore = shallowRef<EventListStore>(
  useEventListStore(buildFilters(), PAGE_SIZE, { autoContinue: false, storeKey: eventListStoreKey() }),
)

/** イベントごとの注文済み件数。表示中の行だけ遅延ロードする。 */
const orderedCounts = ref<Map<string, number>>(new Map())
const orderedCountLoadErrors = ref(new Set<string>())

watch(
  () => route.query.status,
  () => {
    orderedCounts.value = new Map()
    orderedCountLoadErrors.value = new Set()
    eventListStore.value = useEventListStore(buildFilters(), PAGE_SIZE, {
      autoContinue: false,
      storeKey: eventListStoreKey(),
    })
  },
)

const showAcceptingFilter = computed(() => isQueryFlagActive(route.query.status, 'accepting_order'))
const showApplyingFilter = computed(() => isQueryFlagActive(route.query.status, 'applying_reservation'))

const events = computed(() => eventListStore.value.eventStores?.flatMap((store) => store.event ?? []) ?? null)

const filteredEvents = computed(() => {
  if (events.value == null) {
    return null
  }
  return events.value.filter((event) =>
    matchesSearch(
      [
        event.event_name,
        event.community_name,
        event.community_account,
        event.shop_name,
        event.organizer_email,
        event.organizer_fullname,
        event.organizer_company,
      ],
      searchQuery.value,
    ),
  )
})

const showingCount = computed(() => {
  if (searchQuery.value.trim() === '' || filteredEvents.value == null) {
    return null
  }
  return filteredEvents.value.length
})

const loadOrderedCounts = async (targets: BokudeliEvent[]): Promise<void> => {
  if (targets.length === 0) {
    return
  }
  const results = await Promise.all(
    targets.map(async (event) => {
      try {
        return { eventId: event.event_id, count: await countOrderedByEventId(event.event_id), error: false }
      } catch (error) {
        console.warn(error)
        reportClientError(error, {
          componentInfo: 'events.index.loadOrderedCount',
          documentPath: `communities/${event.community_id}/events/${event.event_id}`,
          severity: 'warn',
        })
        return { eventId: event.event_id, count: null, error: true }
      }
    }),
  )
  const next = new Map(orderedCounts.value)
  const nextErrors = new Set(orderedCountLoadErrors.value)
  for (const result of results) {
    if (result.error) {
      nextErrors.add(result.eventId)
      next.delete(result.eventId)
      continue
    }
    nextErrors.delete(result.eventId)
    next.set(result.eventId, result.count ?? 0)
  }
  orderedCountLoadErrors.value = nextErrors
  orderedCounts.value = next
}

watch(
  events,
  (list) => {
    if (list == null) {
      return
    }
    void loadOrderedCounts(
      list.filter(
        (event) => !orderedCounts.value.has(event.event_id) && !orderedCountLoadErrors.value.has(event.event_id),
      ),
    )
  },
  { immediate: true },
)

const retryOrderedCountLoad = (event: BokudeliEvent): void => {
  const next = new Map(orderedCounts.value)
  next.delete(event.event_id)
  orderedCounts.value = next
  const nextErrors = new Set(orderedCountLoadErrors.value)
  nextErrors.delete(event.event_id)
  orderedCountLoadErrors.value = nextErrors
  void loadOrderedCounts([event])
}

const hasMore = computed(
  () => eventListStore.value.totalCount != null && (events.value?.length ?? 0) < eventListStore.value.totalCount,
)

const isOrderOverCapacity = (eventId: string, maxPeople: number): boolean => {
  const count = orderedCounts.value.get(eventId)
  return count != null && count > maxPeople
}

const rowClass = (event: BokudeliEvent): string[] => {
  const classes = ['support-row-clickable']
  if (isOrderOverCapacity(event.event_id, event.event_max_people) || event.calculatedEventStatus === 'event_canceled') {
    classes.push('support-row--danger')
  }
  return classes
}

const setStatusFilter = (status: EventStatusFilter, active: boolean): void => {
  void router.replace({ query: withQueryFlag(route.query, 'status', status, active) })
}
</script>

<template>
  <div class="support-page">
    <v-card class="support-sheet" elevation="0" rounded="0">
      <SupportPageHeader
        v-model:search="searchQuery"
        :title="$t('events.title')"
        :total-count="eventListStore.totalCount"
        :showing-count="showingCount"
      >
        <template #filters>
          <SupportFilterChip
            :active="showAcceptingFilter"
            :label="$t('filter.accepting_events')"
            @update:active="(active) => setStatusFilter('accepting_order', active)"
          />
          <SupportFilterChip
            :active="showApplyingFilter"
            :label="$t('filter.applying_reservation')"
            @update:active="(active) => setStatusFilter('applying_reservation', active)"
          />
        </template>
      </SupportPageHeader>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table">
          <thead>
            <tr>
              <th>{{ $t('events.event_name') }}</th>
              <th>{{ $t('events.status') }}</th>
              <th>{{ $t('events.order_status') }}</th>
              <th>{{ $t('events.schedule') }}</th>
              <th>{{ $t('events.deadline') }}</th>
              <th>{{ $t('events.shop_name') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in filteredEvents ?? []"
              :key="event.event_id"
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
                  v-if="orderedCountLoadErrors.has(event.event_id)"
                  :label="$t('common.load_failed')"
                  tone="danger"
                  @click.stop="retryOrderedCountLoad(event)"
                />
                <template v-else-if="orderedCounts.get(event.event_id) != null">
                  <span
                    :class="{
                      'order-status-over': isOrderOverCapacity(event.event_id, event.event_max_people),
                    }"
                  >
                    {{ orderedCounts.get(event.event_id) }} / {{ event.event_max_people }}
                  </span>
                  <v-tooltip
                    v-if="isOrderOverCapacity(event.event_id, event.event_max_people)"
                    :text="$t('events.order_status_over')"
                  >
                    <template #activator="{ props: tooltipProps }">
                      <v-icon
                        v-bind="tooltipProps"
                        :icon="mdiAlertCircleOutline"
                        size="16"
                        color="error"
                        class="ms-1"
                      />
                    </template>
                  </v-tooltip>
                </template>
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

    <SupportDetailDrawer v-model="drawerOpen" :title="selected?.event_name ?? $t('events.title')">
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
