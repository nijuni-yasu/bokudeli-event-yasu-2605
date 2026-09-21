<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useI18n } from 'vue-i18n'
import { useShopListStore } from '@shokujii/base/stores/shopList.js'
import { updateShopStatus } from '@shokujii/base/stores/partner.js'
import type { BokudeliPartnerShop } from '@shokujii/base/stores/partner.js'
import { convertToDatetime, convertToTimeString } from '@shokujii/common/utils/datetime.js'
import ConfirmSwitch from '@/components/ConfirmSwitch.vue'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import SupportPageHeader from '@/components/SupportPageHeader.vue'
import SupportDetailDrawer from '@/components/SupportDetailDrawer.vue'
import SupportDetailField from '@/components/SupportDetailField.vue'
import type { Notification } from '@shokujii/base/types/index.js'
import { matchesSearch } from '@/utils/search'
import { summarizeRangeMinOrders } from '@/utils/format'
import { isQueryFlagActive, withQueryFlag } from '@/utils/queryFlag'

const PAGE_SIZE = 30
const route = useRoute()
const router = useRouter()

const { t: $t, tm: $tm } = useI18n()
const notification = inject<Notification>('notification')

const searchQuery = ref('')
const selected = shallowRef<BokudeliPartnerShop | null>(null)

const drawerOpen = computed({
  get: () => selected.value != null,
  set: (open: boolean) => {
    if (!open) {
      selected.value = null
    }
  },
})

const weekdayLabels = computed((): string[] => {
  const raw = $tm('day_of_week')
  if (!Array.isArray(raw)) {
    return []
  }
  return raw.map((item) => String(item))
})

const buildFilters = (): QueryConstraint[] => {
  const filters: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  if (isQueryFlagActive(route.query.is_approved, 'false')) {
    filters.unshift(where('is_approved', '==', false))
  }
  return filters
}

const shopListStore = shallowRef<ReturnType<typeof useShopListStore>>(useShopListStore(buildFilters(), PAGE_SIZE))

watch(
  () => route.query.is_approved,
  () => {
    shopListStore.value = useShopListStore(buildFilters(), PAGE_SIZE)
  },
)

const showPendingFilter = computed(() => isQueryFlagActive(route.query.is_approved, 'false'))

const shops = computed(() => shopListStore.value.shops)

const filteredShops = computed(() => {
  if (shops.value == null) {
    return null
  }
  return shops.value.filter((shop) =>
    matchesSearch(
      [shop.shop_name, shop.fullAddress, shop.shop_phone, shop.shop_email, shop.shop_postcode],
      searchQuery.value,
    ),
  )
})

const showingCount = computed(() => {
  if (searchQuery.value.trim() === '' || filteredShops.value == null) {
    return null
  }
  return filteredShops.value.length
})

/** shop_time / shop_deadline_datetime の時刻はタイムゾーンを持たない「その日の経過ミリ秒」なので UTC で整形する */
const formatTimeOfDay = (millis: number | null): string => (millis == null ? '' : convertToTimeString(millis, 'UTC'))

const formatBusinessHoursLine = (time: BokudeliPartnerShop['shop_time'][number], index: number): string => {
  if (!time.is_open) {
    return `${weekdayLabels.value[index] ?? ''}: ${$t('shops.is_open_off')}`
  }
  let line = `${weekdayLabels.value[index] ?? ''}: ${formatTimeOfDay(time.time_start)}-${formatTimeOfDay(time.time_end)}`
  if (time.time_start2 != null && time.time_end2 != null) {
    line += ` / ${formatTimeOfDay(time.time_start2)}-${formatTimeOfDay(time.time_end2)}`
  }
  return line
}

const countOpenDays = (shop: BokudeliPartnerShop): number => shop.shop_time.filter((time) => time.is_open).length

const rangeSummaryLabel = (shop: BokudeliPartnerShop): string => {
  const summary = summarizeRangeMinOrders(shop.shop_range_min_orders)
  if (summary == null) {
    return '—'
  }
  return $t('shops.range_min_orders_summary', { range: summary.shortestKm, count: summary.smallestCount })
}

const updating = ref<Set<string>>(new Set())

const changeStatus = async (
  shop: BokudeliPartnerShop,
  status: { is_open?: boolean; is_approved?: boolean },
): Promise<void> => {
  updating.value = new Set(updating.value).add(shop.shop_id)
  try {
    await updateShopStatus(shop.partner_id, shop.shop_id, status)
    if (notification != null) {
      notification.message = $t('common.updated')
      notification.color = 'success'
    }
  } catch (error) {
    console.error(error)
    if (notification != null) {
      notification.message = $t('common.update_failed')
      notification.color = 'error'
    }
    shopListStore.value.reload()
  } finally {
    const next = new Set(updating.value)
    next.delete(shop.shop_id)
    updating.value = next
  }
}

const setPendingFilter = (active: boolean): void => {
  void router.replace({ query: withQueryFlag(route.query, 'is_approved', 'false', active) })
}
</script>

<template>
  <div class="support-page">
    <v-card class="support-sheet" elevation="0" rounded="0">
      <SupportPageHeader
        v-model:search="searchQuery"
        :title="$t('shops.title')"
        :total-count="shopListStore.totalCount"
        :showing-count="showingCount"
      >
        <template #filters>
          <SupportFilterChip
            :active="showPendingFilter"
            :label="$t('filter.pending_approval')"
            @update:active="setPendingFilter"
          />
        </template>
      </SupportPageHeader>

      <v-alert v-if="shopListStore.loadError" type="error" variant="tonal" class="ma-4">
        {{ $t('common.load_failed') }}
        <v-btn variant="text" size="small" @click="shopListStore.reload()">{{ $t('common.retry') }}</v-btn>
      </v-alert>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table">
          <thead>
            <tr>
              <th>{{ $t('shops.name') }}</th>
              <th>{{ $t('shops.address') }}</th>
              <th>{{ $t('shops.business_hours') }}</th>
              <th>{{ $t('shops.range_min_orders') }}</th>
              <th>{{ $t('shops.created_at') }}</th>
              <th>{{ $t('shops.is_open') }}</th>
              <th>{{ $t('shops.is_approved') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="shop in filteredShops ?? []"
              :key="`${shop.partner_id}/${shop.shop_id}`"
              class="support-row-clickable"
              :class="{ 'support-row--pending': !shop.is_approved }"
              @click="selected = shop"
            >
              <td>
                <div class="support-cell-primary">{{ shop.shop_name }}</div>
                <div class="support-cell-sub support-mono-id">{{ shop.shop_email }}</div>
              </td>
              <td>
                <span class="line-clamp-2">{{ shop.shop_postcode }} {{ shop.fullAddress }}</span>
              </td>
              <td class="support-table-col-nowrap">
                <v-menu open-on-hover location="start" :close-on-content-click="false">
                  <template #activator="{ props: menuProps }">
                    <button type="button" class="support-hours-trigger" v-bind="menuProps" @click.stop>
                      {{ $t('shops.business_hours_summary', { count: countOpenDays(shop) }) }}
                    </button>
                  </template>
                  <v-card>
                    <v-card-text class="support-hours-menu text-caption py-2">
                      <div v-for="(time, index) in shop.shop_time" :key="index">
                        {{ formatBusinessHoursLine(time, index) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </td>
              <td class="support-table-col-nowrap">{{ rangeSummaryLabel(shop) }}</td>
              <td class="support-table-col-nowrap">{{ convertToDatetime(shop.createdAt) }}</td>
              <td>
                <ConfirmSwitch
                  :model-value="shop.is_open"
                  :on-label="$t('shops.is_open_on')"
                  :off-label="$t('shops.is_open_off')"
                  :disabled="updating.has(shop.shop_id)"
                  @update:model-value="(value) => changeStatus(shop, { is_open: value })"
                />
              </td>
              <td>
                <ConfirmSwitch
                  :model-value="shop.is_approved"
                  :on-label="$t('shops.is_approved_on')"
                  :off-label="$t('shops.is_approved_off')"
                  tone="pending"
                  :disabled="updating.has(shop.shop_id)"
                  @update:model-value="(value) => changeStatus(shop, { is_approved: value })"
                />
              </td>
            </tr>
            <tr v-if="filteredShops != null && filteredShops.length === 0">
              <td colspan="7" class="text-center py-6">
                {{ shops != null && shops.length > 0 ? $t('common.search_no_match') : $t('common.no_data') }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div v-if="shops == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>

      <v-card-actions v-if="shopListStore.hasMore" class="justify-center">
        <v-btn variant="tonal" @click="shopListStore.next()">{{ $t('common.load_more') }}</v-btn>
      </v-card-actions>
    </v-card>

    <SupportDetailDrawer v-model="drawerOpen" :title="selected?.shop_name ?? $t('shops.title')">
      <dl v-if="selected != null" class="support-detail-list">
        <SupportDetailField :label="$t('shops.address')">
          {{ selected.shop_postcode }} {{ selected.fullAddress }}
        </SupportDetailField>
        <SupportDetailField :label="$t('shops.contact')">
          <div>{{ selected.shop_phone }}</div>
          <div>{{ selected.shop_email }}</div>
        </SupportDetailField>
        <SupportDetailField :label="$t('shops.deadline')">
          {{ $t('shops.deadline_days_before', { days: selected.shop_deadline_datetime.days_before }) }}
          {{ formatTimeOfDay(selected.shop_deadline_datetime.time) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('shops.range_min_orders')">
          <div v-for="(item, index) in selected.shop_range_min_orders" :key="index">
            {{ $t('shops.range_min_orders_item', { range: item.range, count: item.min_orders }) }}
          </div>
        </SupportDetailField>
        <SupportDetailField :label="$t('shops.business_hours')">
          <div v-for="(time, index) in selected.shop_time" :key="index">
            {{ formatBusinessHoursLine(time, index) }}
          </div>
        </SupportDetailField>
        <SupportDetailField :label="$t('shops.created_at')">
          {{ convertToDatetime(selected.createdAt) }}
        </SupportDetailField>
      </dl>
    </SupportDetailDrawer>
  </div>
</template>
