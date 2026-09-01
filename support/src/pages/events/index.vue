<script setup lang="ts">
import { orderBy } from 'firebase/firestore'
import { useEventListStore } from '@shokujii/base/stores/eventList.js'
import { countOrderedByEventId } from '@shokujii/base/stores/supportCounts.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getEventUrl, getCommunityUrl } from '@/utils/urls'
import { mdiOpenInNew } from '@mdi/js'

const PAGE_SIZE = 30

// 運営はテナント横断で全イベントを見るため、enterprise_id を絞らずに呼ぶ（Rules の isSupport() で許可）
const eventListStore = useEventListStore([orderBy('event_start_datetime', 'desc')], PAGE_SIZE, {
  autoContinue: false,
})

const events = computed(() => eventListStore.eventStores?.flatMap((store) => store.event ?? []) ?? null)

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
  () => eventListStore.totalCount != null && (events.value?.length ?? 0) < eventListStore.totalCount,
)
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        {{ $t('events.title') }}
        <v-chip v-if="eventListStore.totalCount != null" class="ms-3" size="small">
          {{ $t('common.total_count', { count: eventListStore.totalCount }) }}
        </v-chip>
      </v-card-title>

      <v-table density="compact" class="text-no-wrap">
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
              <v-chip size="small" label>{{ $t(`event_status.${event.calculatedEventStatus}`) }}</v-chip>
            </td>
            <td>
              <template v-if="orderedCounts.get(event.event_id) != null">
                {{ orderedCounts.get(event.event_id) }} / {{ event.event_max_people }}
              </template>
              <v-progress-circular v-else indeterminate size="16" width="2" />
            </td>
            <td>
              <a :href="getCommunityUrl(event.community_account)" target="_blank" rel="noopener noreferrer">
                {{ event.community_name }}
                <v-icon :icon="mdiOpenInNew" size="14" />
              </a>
            </td>
            <td>
              <a :href="getEventUrl(event.community_account, event.event_id)" target="_blank" rel="noopener noreferrer">
                {{ event.event_name }}
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
              <div>{{ event.organizer_email }}</div>
            </td>
          </tr>
          <tr v-if="events != null && events.length === 0">
            <td colspan="10" class="text-center py-6">{{ $t('common.no_data') }}</td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="events == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>

      <v-card-actions v-if="hasMore" class="justify-center">
        <v-btn variant="tonal" @click="eventListStore.next()">{{ $t('common.load_more') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
