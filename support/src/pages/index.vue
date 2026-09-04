<script setup lang="ts">
import {
  countAcceptingOrderEvents,
  countOrdersOrderedSince,
  countPendingCommunities,
  countPendingShops,
} from '@shokujii/base/stores/supportCounts.js'
import { mdiAccountGroup, mdiStorefrontOutline, mdiCalendar, mdiCart } from '@mdi/js'

const RECENT_ORDER_DAYS = 7

type SummaryKey = 'pending_communities' | 'pending_shops' | 'accepting_events' | 'recent_orders'

const { t: $t } = useI18n()

/** null = 取得中 / undefined = 取得失敗（一覧側で確認してもらう） */
const counts = reactive<Record<SummaryKey, number | null | undefined>>({
  pending_communities: null,
  pending_shops: null,
  accepting_events: null,
  recent_orders: null,
})

const cards: { key: SummaryKey; title: string; icon: string; to: string }[] = [
  {
    key: 'pending_communities',
    title: $t('dashboard.pending_communities'),
    icon: mdiAccountGroup,
    to: '/communities?is_approved=false',
  },
  {
    key: 'pending_shops',
    title: $t('dashboard.pending_shops'),
    icon: mdiStorefrontOutline,
    to: '/shops?is_approved=false',
  },
  {
    key: 'accepting_events',
    title: $t('dashboard.accepting_events'),
    icon: mdiCalendar,
    to: '/events?status=accepting_order',
  },
  { key: 'recent_orders', title: $t('dashboard.recent_orders'), icon: mdiCart, to: '/orders?recent=7' },
]

const retryLoad = (key: SummaryKey): void => {
  counts[key] = null
  const fetchers: Record<SummaryKey, () => Promise<number>> = {
    pending_communities: countPendingCommunities,
    pending_shops: countPendingShops,
    accepting_events: countAcceptingOrderEvents,
    recent_orders: () => countOrdersOrderedSince(since),
  }
  load(key, fetchers[key])
}

const load = async (key: SummaryKey, fetch: () => Promise<number>): Promise<void> => {
  try {
    counts[key] = await fetch()
  } catch (error) {
    console.warn(error)
    counts[key] = undefined
  }
}

const since = new Date(Date.now() - RECENT_ORDER_DAYS * 24 * 60 * 60 * 1000)

load('pending_communities', countPendingCommunities)
load('pending_shops', countPendingShops)
load('accepting_events', countAcceptingOrderEvents)
load('recent_orders', () => countOrdersOrderedSince(since))
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">{{ $t('dashboard.title') }}</h1>
    <v-row>
      <v-col v-for="card in cards" :key="card.key" cols="12" sm="6" md="3">
        <v-card :to="card.to">
          <v-card-text class="d-flex align-center gap-4">
            <v-avatar size="44" rounded color="primary" variant="tonal">
              <v-icon :icon="card.icon" size="24" />
            </v-avatar>
            <div>
              <div class="text-body-2 text-medium-emphasis">{{ card.title }}</div>
              <div class="text-h5">
                <template v-if="counts[card.key] != null">{{ counts[card.key] }}</template>
                <v-progress-circular v-else-if="counts[card.key] === null" indeterminate size="20" width="2" />
                <span v-else class="text-body-2 text-error d-flex align-center gap-2">
                  {{ $t('common.load_failed') }}
                  <v-btn size="x-small" variant="text" @click.stop="retryLoad(card.key)">{{
                    $t('common.retry')
                  }}</v-btn>
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
