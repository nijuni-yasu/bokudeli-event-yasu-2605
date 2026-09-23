<script setup lang="ts">
import { orderBy, where } from 'firebase/firestore'
import {
  countAcceptingOrderEvents,
  countApplyingReservationEvents,
  countOrdersOrderedSince,
  countPendingCommunities,
  countPendingShops,
} from '@shokujii/base/stores/supportCounts.js'
import { useCommunityListStore } from '@shokujii/base/stores/communityList.js'
import { useShopListStore } from '@shokujii/base/stores/shopList.js'
import { useEventListStore } from '@shokujii/base/stores/eventList.js'
import { updateCommunityStatus, type BokudeliCommunity } from '@shokujii/base/stores/community.js'
import { updateShopStatus, type BokudeliPartnerShop } from '@shokujii/base/stores/partner.js'
import { convertToDateWeekdayShort } from '@shokujii/common/utils/datetime.js'
import type { RouteLocationRaw } from 'vue-router'
import { getCommunityUrl, getEventUrl } from '@/utils/urls'
import { getCommunitiesLocation, getEventsLocation, getOrdersLocation, getShopsLocation } from '@/router/utils'
import { formatRelativeJa } from '@/utils/format'
import type { Notification } from '@shokujii/base/types/index.js'
import { mdiAccountGroup, mdiStorefrontOutline, mdiCalendar, mdiCalendarClock, mdiCart } from '@mdi/js'
import ConfirmSwitch from '@/components/ConfirmSwitch.vue'
import SupportStatCard from '@/components/SupportStatCard.vue'
import SupportExternalLink from '@/components/SupportExternalLink.vue'

const RECENT_ORDER_DAYS = 7
const QUEUE_SIZE = 8

type SummaryKey =
  | 'pending_communities'
  | 'pending_shops'
  | 'applying_reservation_events'
  | 'accepting_events'
  | 'recent_orders'
type QueueTab = 'communities' | 'shops'

const { t: $t } = useI18n()
const notification = inject<Notification>('notification')

/** null = 取得中 / undefined = 取得失敗（一覧側で確認してもらう） */
const counts = reactive<Record<SummaryKey, number | null | undefined>>({
  pending_communities: null,
  pending_shops: null,
  applying_reservation_events: null,
  accepting_events: null,
  recent_orders: null,
})

const cards: { key: SummaryKey; title: string; icon: string; to: RouteLocationRaw; tone: 'action' | 'watch' }[] = [
  {
    key: 'pending_communities',
    title: $t('dashboard.pending_communities'),
    icon: mdiAccountGroup,
    to: getCommunitiesLocation({ pendingApproval: true }),
    tone: 'action',
  },
  {
    key: 'pending_shops',
    title: $t('dashboard.pending_shops'),
    icon: mdiStorefrontOutline,
    to: getShopsLocation({ pendingApproval: true }),
    tone: 'action',
  },
  {
    key: 'applying_reservation_events',
    title: $t('dashboard.applying_reservation_events'),
    icon: mdiCalendarClock,
    to: getEventsLocation({ applyingReservation: true }),
    tone: 'action',
  },
  {
    key: 'accepting_events',
    title: $t('dashboard.accepting_events'),
    icon: mdiCalendar,
    to: getEventsLocation({ acceptingOrder: true }),
    tone: 'watch',
  },
  {
    key: 'recent_orders',
    title: $t('dashboard.recent_orders'),
    icon: mdiCart,
    to: getOrdersLocation({ recentDays: 7 }),
    tone: 'watch',
  },
]

const todayLabel = convertToDateWeekdayShort(Date.now())

const queueTab = ref<QueueTab>('communities')

const pendingCommunityStore = useCommunityListStore(
  [where('is_approved', '==', false), orderBy('created_at', 'desc')],
  QUEUE_SIZE,
  { lightweight: true },
)

const pendingShopStore = useShopListStore([where('is_approved', '==', false), orderBy('createdAt', 'desc')], QUEUE_SIZE)

const applyingEventStore = useEventListStore(
  [where('event_status.value', '==', 'applying_reservation'), orderBy('event_start_datetime', 'desc')],
  QUEUE_SIZE,
  { autoContinue: false, storeKey: 'support/dashboard/applying' },
)

const acceptingEventStore = useEventListStore(
  [where('event_status.value', '==', 'accepting_order'), orderBy('event_start_datetime', 'desc')],
  QUEUE_SIZE,
  { autoContinue: false, storeKey: 'support/dashboard/accepting' },
)

const pendingCommunities = computed(() => pendingCommunityStore.communities)
const pendingShops = computed(() => pendingShopStore.shops)
const applyingEvents = computed(() => applyingEventStore.eventStores?.flatMap((store) => store.event ?? []) ?? null)
const acceptingEvents = computed(() => acceptingEventStore.eventStores?.flatMap((store) => store.event ?? []) ?? null)

const retryLoad = (key: SummaryKey): void => {
  counts[key] = null
  const fetchers: Record<SummaryKey, () => Promise<number>> = {
    pending_communities: countPendingCommunities,
    pending_shops: countPendingShops,
    applying_reservation_events: countApplyingReservationEvents,
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
load('applying_reservation_events', countApplyingReservationEvents)
load('accepting_events', countAcceptingOrderEvents)
load('recent_orders', () => countOrdersOrderedSince(since))

const updatingCommunities = ref<Set<string>>(new Set())
const updatingShops = ref<Set<string>>(new Set())

const changeCommunityApproval = async (community: BokudeliCommunity, isApproved: boolean): Promise<void> => {
  updatingCommunities.value = new Set(updatingCommunities.value).add(community.community_id)
  try {
    await updateCommunityStatus(community.community_id, { is_approved: isApproved })
    if (notification != null) {
      notification.message = $t('common.updated')
      notification.color = 'success'
    }
    pendingCommunityStore.reload()
    retryLoad('pending_communities')
  } catch (error) {
    console.error(error)
    if (notification != null) {
      notification.message = $t('common.update_failed')
      notification.color = 'error'
    }
    pendingCommunityStore.reload()
  } finally {
    const next = new Set(updatingCommunities.value)
    next.delete(community.community_id)
    updatingCommunities.value = next
  }
}

const changeShopApproval = async (shop: BokudeliPartnerShop, isApproved: boolean): Promise<void> => {
  updatingShops.value = new Set(updatingShops.value).add(shop.shop_id)
  try {
    await updateShopStatus(shop.partner_id, shop.shop_id, { is_approved: isApproved })
    if (notification != null) {
      notification.message = $t('common.updated')
      notification.color = 'success'
    }
    pendingShopStore.reload()
    retryLoad('pending_shops')
  } catch (error) {
    console.error(error)
    if (notification != null) {
      notification.message = $t('common.update_failed')
      notification.color = 'error'
    }
    pendingShopStore.reload()
  } finally {
    const next = new Set(updatingShops.value)
    next.delete(shop.shop_id)
    updatingShops.value = next
  }
}
</script>

<template>
  <div class="support-page">
    <header>
      <p class="support-kicker">{{ $t('dashboard.kicker') }}</p>
      <h1 class="support-page-title">{{ $t('dashboard.title') }}</h1>
      <p class="support-date-line">{{ todayLabel }}</p>
    </header>

    <div class="support-stat-grid">
      <SupportStatCard
        v-for="card in cards"
        :key="card.key"
        :title="card.title"
        :icon="card.icon"
        :to="card.to"
        :tone="card.tone"
        :count="counts[card.key]"
        @retry="retryLoad(card.key)"
      />
    </div>

    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card class="support-sheet support-queue-card" elevation="0" rounded="0">
          <v-card-title class="support-queue-card__head">
            <span class="support-page-title">{{ $t('dashboard.queue_title') }}</span>
            <div class="support-queue-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                class="support-queue-tab"
                :class="{ 'support-queue-tab--active': queueTab === 'communities' }"
                :aria-selected="queueTab === 'communities'"
                @click="queueTab = 'communities'"
              >
                {{ $t('dashboard.queue_communities') }}
              </button>
              <button
                type="button"
                role="tab"
                class="support-queue-tab"
                :class="{ 'support-queue-tab--active': queueTab === 'shops' }"
                :aria-selected="queueTab === 'shops'"
                @click="queueTab = 'shops'"
              >
                {{ $t('dashboard.queue_shops') }}
              </button>
            </div>
          </v-card-title>
          <v-card-text>
            <template v-if="queueTab === 'communities'">
              <div v-if="pendingCommunities == null" class="d-flex justify-center py-6">
                <v-progress-circular indeterminate size="24" width="2" />
              </div>
              <div v-else-if="pendingCommunities.length === 0" class="text-medium-emphasis">
                {{ $t('dashboard.queue_empty') }}
              </div>
              <div v-else>
                <div v-for="community in pendingCommunities" :key="community.community_id" class="support-queue-row">
                  <div>
                    <SupportExternalLink
                      :href="getCommunityUrl(community.community_account)"
                      :label="community.community_name"
                    />
                    <div class="support-cell-sub">{{ community.community_account }}</div>
                  </div>
                  <ConfirmSwitch
                    :model-value="community.is_approved"
                    :on-label="$t('communities.is_approved_on')"
                    :off-label="$t('communities.is_approved_off')"
                    tone="pending"
                    :disabled="updatingCommunities.has(community.community_id)"
                    @update:model-value="(value) => changeCommunityApproval(community, value)"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="pendingShops == null" class="d-flex justify-center py-6">
                <v-progress-circular indeterminate size="24" width="2" />
              </div>
              <div v-else-if="pendingShops.length === 0" class="text-medium-emphasis">
                {{ $t('dashboard.queue_empty') }}
              </div>
              <div v-else>
                <div v-for="shop in pendingShops" :key="`${shop.partner_id}/${shop.shop_id}`" class="support-queue-row">
                  <div>
                    <div class="support-cell-primary">{{ shop.shop_name }}</div>
                    <div class="support-cell-sub">{{ shop.fullAddress }}</div>
                  </div>
                  <ConfirmSwitch
                    :model-value="shop.is_approved"
                    :on-label="$t('shops.is_approved_on')"
                    :off-label="$t('shops.is_approved_off')"
                    tone="pending"
                    :disabled="updatingShops.has(shop.shop_id)"
                    @update:model-value="(value) => changeShopApproval(shop, value)"
                  />
                </div>
              </div>
            </template>
            <div class="mt-4">
              <v-btn
                variant="text"
                size="small"
                :to="
                  queueTab === 'communities'
                    ? getCommunitiesLocation({ pendingApproval: true })
                    : getShopsLocation({ pendingApproval: true })
                "
              >
                {{ $t('dashboard.go_list') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card class="support-sheet support-queue-card" elevation="0" rounded="0">
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="support-page-title">{{ $t('dashboard.applying_title') }}</span>
            <v-btn variant="text" size="small" :to="getEventsLocation({ applyingReservation: true })">
              {{ $t('dashboard.go_list') }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="applyingEvents == null" class="d-flex justify-center py-6">
              <v-progress-circular indeterminate size="24" width="2" />
            </div>
            <div v-else-if="applyingEvents.length === 0" class="text-medium-emphasis">
              {{ $t('dashboard.applying_empty') }}
            </div>
            <div v-else>
              <div v-for="event in applyingEvents" :key="event.event_id" class="support-queue-row">
                <div>
                  <SupportExternalLink
                    :href="getEventUrl(event.community_account, event.event_id)"
                    :label="event.event_name"
                  />
                  <div class="support-cell-sub">{{ event.community_name }} · {{ event.shop_name }}</div>
                </div>
                <div class="text-end">
                  <div class="support-table-col-nowrap">
                    {{ $t('dashboard.capacity', { current: event.members.length, max: event.event_max_people }) }}
                  </div>
                  <div class="support-cell-sub">{{ formatRelativeJa(event.event_deadline_datetime) }}</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card class="support-sheet support-queue-card" elevation="0" rounded="0">
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="support-page-title">{{ $t('dashboard.accepting_title') }}</span>
            <v-btn variant="text" size="small" :to="getEventsLocation({ acceptingOrder: true })">
              {{ $t('dashboard.go_list') }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="acceptingEvents == null" class="d-flex justify-center py-6">
              <v-progress-circular indeterminate size="24" width="2" />
            </div>
            <div v-else-if="acceptingEvents.length === 0" class="text-medium-emphasis">
              {{ $t('dashboard.accepting_empty') }}
            </div>
            <div v-else>
              <div v-for="event in acceptingEvents" :key="event.event_id" class="support-queue-row">
                <div>
                  <SupportExternalLink
                    :href="getEventUrl(event.community_account, event.event_id)"
                    :label="event.event_name"
                  />
                  <div class="support-cell-sub">{{ event.community_name }} · {{ event.shop_name }}</div>
                </div>
                <div class="text-end">
                  <div class="support-table-col-nowrap">
                    {{ $t('dashboard.capacity', { current: event.members.length, max: event.event_max_people }) }}
                  </div>
                  <div class="support-cell-sub">{{ formatRelativeJa(event.event_deadline_datetime) }}</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
