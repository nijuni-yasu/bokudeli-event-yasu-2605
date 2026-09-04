<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useEventListStore, type EventListStore } from '@shokujii/base/stores/eventList.js'
import { countOrderedByEventId } from '@shokujii/base/stores/supportCounts.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getEventUrl, getCommunityUrl } from '@/utils/urls'
import { eventStatusChipColor } from '@/utils/statusColors'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import { mdiOpenInNew, mdiAlertCircleOutline } from '@mdi/js'

const PAGE_SIZE = 30
const route = useRoute()

const { t: $t } = useI18n()

const buildFilters = (): QueryConstraint[] => {
  const filters: QueryConstraint[] = [orderBy('event_start_datetime', 'desc')]
  if (route.query.status === 'accepting_order') {
    filters.unshift(where('event_status.value', '==', 'accepting_order'))
  }
  return filters
}

const eventListStore = shallowRef<EventListStore>(useEventListStore(buildFilters(), PAGE_SIZE, { autoContinue: false }))

watch(
  () => route.query.status,
  () => {
    orderedCounts.value = new Map()
    eventListStore.value = useEventListStore(buildFilters(), PAGE_SIZE, { autoContinue: false })
  },
)

const showAcceptingFilter = computed(() => route.query.status === 'accepting_order')

const events = computed(() => eventListStore.value.eventStores?.flatMap((store) => store.event ?? []) ?? null)

/** イベントごとの注文済み件数。表示中の行だけ遅延ロードする。 */
const orderedCounts = ref<Map<string, number>>(new Map())

watch(
  events,
  async (list) => {
    if (list == null) {
      return
    }
    const unresolved = list.filter((event) => !orderedCounts.value.has(event.event_id))
    if (unresolved.length === 0) {
      return
    }
    const results = await Promise.all(
      unresolved.map(async (event) => {
        try {
          return [event.event_id, await countOrderedByEventId(event.event_id)] as const
        } catch (error) {
          console.warn(error)
          return null
        }
      }),
    )
    const next = new Map(orderedCounts.value)
    for (const result of results) {
      if (result != null) {
        next.set(result[0], result[1])
      }
    }
    orderedCounts.value = next
  },
  { immediate: true },
)

const hasMore = computed(
  () => eventListStore.value.totalCount != null && (events.value?.length ?? 0) < eventListStore.value.totalCount,
)

const isOrderOverCapacity = (eventId: string, maxPeople: number): boolean => {
  const count = orderedCounts.value.get(eventId)
  return count != null && count > maxPeople
}
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center flex-wrap gap-2">
        {{ $t('events.title') }}
        <v-chip v-if="eventListStore.totalCount != null" size="small">
          {{ $t('common.total_count', { count: eventListStore.totalCount }) }}
        </v-chip>
        <SupportFilterChip v-if="showAcceptingFilter" :label="$t('filter.accepting_events')" />
      </v-card-title>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table text-no-wrap">
          <thead>
            <tr>
              <th>{{ $t('events.status') }}</th>
              <th>{{ $t('events.order_status') }}</th>
              <th>{{ $t('events.community_name') }}</th>
              <th>{{ $t('events.event_name') }}</th>
              <th>{{ $t('events.shop_name') }}</th>
              <th>{{ $t('events.schedule') }}</th>
              <th>{{ $t('events.deadline') }}</th>
              <th>{{ $t('events.payment') }}</th>
              <th>{{ $t('events.visibility') }}</th>
              <th>{{ $t('events.organizer') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events ?? []" :key="event.event_id">
              <td>
                <v-chip size="small" label :color="eventStatusChipColor(event.calculatedEventStatus)">
                  {{ $t(`event_status.${event.calculatedEventStatus}`) }}
                </v-chip>
              </td>
              <td>
                <template v-if="orderedCounts.get(event.event_id) != null">
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
              <td>
                <a
                  class="support-link"
                  :href="getCommunityUrl(event.community_account)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ event.community_name }}
                  <v-icon :icon="mdiOpenInNew" size="14" />
                </a>
              </td>
              <td>
                <a
                  class="support-link"
                  :href="getEventUrl(event.community_account, event.event_id)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="line-clamp-2 d-inline-block">{{ event.event_name }}</span>
                  <v-icon :icon="mdiOpenInNew" size="14" />
                </a>
              </td>
              <td>{{ event.shop_name }}</td>
              <td>
                {{ convertToDatetime(event.event_start_datetime) }}<br />
                〜{{ convertToDatetime(event.event_end_datetime) }}
              </td>
              <td>{{ convertToDatetime(event.event_deadline_datetime) }}</td>
              <td>{{ $t(`payment.${event.event_payment}`) }}</td>
              <td>{{ event.is_public ? $t('communities.is_public_on') : $t('communities.is_public_off') }}</td>
              <td>
                <div>{{ event.organizer_company }}</div>
                <div>{{ event.organizer_fullname }}</div>
                <div class="support-mono-id">{{ event.organizer_email }}</div>
              </td>
            </tr>
            <tr v-if="events != null && events.length === 0">
              <td colspan="10" class="text-center py-6">{{ $t('common.no_data') }}</td>
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
  </div>
</template>
