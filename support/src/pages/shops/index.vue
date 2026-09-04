<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useI18n } from 'vue-i18n'
import { useShopListStore } from '@shokujii/base/stores/shopList.js'
import { updateShopStatus } from '@shokujii/base/stores/partner.js'
import type { BokudeliPartnerShop } from '@shokujii/base/stores/partner.js'
import { convertToDatetime, convertToTimeString } from '@shokujii/common/utils/datetime.js'
import ConfirmSwitch from '@/components/ConfirmSwitch.vue'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import type { Notification } from '@shokujii/base/types/index.js'

const PAGE_SIZE = 30
const route = useRoute()

const { t: $t, tm: $tm } = useI18n()
const notification = inject<Notification>('notification')

const dayOfWeek = $tm('day_of_week') as Record<number, string>

const buildFilters = (): QueryConstraint[] => {
  const filters: QueryConstraint[] = [orderBy('createdAt', 'desc')]
  if (route.query.is_approved === 'false') {
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

const showPendingFilter = computed(() => route.query.is_approved === 'false')

const shops = computed(() => shopListStore.value.shops)

/** shop_time / shop_deadline_datetime の時刻はタイムゾーンを持たない「その日の経過ミリ秒」なので UTC で整形する */
const formatTimeOfDay = (millis: number | null): string => (millis == null ? '' : convertToTimeString(millis, 'UTC'))

const formatBusinessHoursLine = (time: BokudeliPartnerShop['shop_time'][number], index: number): string => {
  if (!time.is_open) {
    return `${dayOfWeek[index]}: ${$t('shops.is_open_off')}`
  }
  let line = `${dayOfWeek[index]}: ${formatTimeOfDay(time.time_start)}-${formatTimeOfDay(time.time_end)}`
  if (time.time_start2 != null && time.time_end2 != null) {
    line += ` / ${formatTimeOfDay(time.time_start2)}-${formatTimeOfDay(time.time_end2)}`
  }
  return line
}

const countOpenDays = (shop: BokudeliPartnerShop): number => shop.shop_time.filter((time) => time.is_open).length

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
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center flex-wrap gap-2">
        {{ $t('shops.title') }}
        <v-chip v-if="shopListStore.totalCount != null" size="small">
          {{ $t('common.total_count', { count: shopListStore.totalCount }) }}
        </v-chip>
        <SupportFilterChip v-if="showPendingFilter" :label="$t('filter.pending_approval')" />
      </v-card-title>

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
              <th>{{ $t('shops.contact') }}</th>
              <th class="support-table-col-nowrap">{{ $t('shops.deadline') }}</th>
              <th>{{ $t('shops.range_min_orders') }}</th>
              <th class="support-table-col-hours">{{ $t('shops.business_hours') }}</th>
              <th class="support-table-col-nowrap">{{ $t('shops.created_at') }}</th>
              <th>{{ $t('shops.is_open') }}</th>
              <th>{{ $t('shops.is_approved') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="shop in shops ?? []" :key="`${shop.partner_id}/${shop.shop_id}`">
              <td>{{ shop.shop_name }}</td>
              <td class="text-wrap">{{ shop.shop_postcode }} {{ shop.fullAddress }}</td>
              <td>
                <div>{{ shop.shop_phone }}</div>
                <div class="support-mono-id">{{ shop.shop_email }}</div>
              </td>
              <td class="support-table-col-nowrap">
                {{ $t('shops.deadline_days_before', { days: shop.shop_deadline_datetime.days_before }) }}
                {{ formatTimeOfDay(shop.shop_deadline_datetime.time) }}
              </td>
              <td class="text-wrap">
                <div v-for="(item, index) in shop.shop_range_min_orders" :key="index">
                  {{ $t('shops.range_min_orders_item', { range: item.range, count: item.min_orders }) }}
                </div>
              </td>
              <td class="support-table-col-hours">
                <v-menu open-on-hover location="start" :close-on-content-click="false">
                  <template #activator="{ props: menuProps }">
                    <button type="button" class="support-hours-trigger" v-bind="menuProps">
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
              <td class="support-table-col-nowrap">{{ convertToDatetime(shop.createdAt) }}</td>
              <td>
                <div class="text-caption text-medium-emphasis mb-1">
                  {{ shop.is_open ? $t('shops.is_open_on') : $t('shops.is_open_off') }}
                </div>
                <ConfirmSwitch
                  :model-value="shop.is_open"
                  :disabled="updating.has(shop.shop_id)"
                  @update:model-value="(value) => changeStatus(shop, { is_open: value })"
                />
              </td>
              <td>
                <div class="text-caption text-medium-emphasis mb-1">
                  {{ shop.is_approved ? $t('shops.is_approved_on') : $t('shops.is_approved_off') }}
                </div>
                <ConfirmSwitch
                  :model-value="shop.is_approved"
                  :disabled="updating.has(shop.shop_id)"
                  @update:model-value="(value) => changeStatus(shop, { is_approved: value })"
                />
              </td>
            </tr>
            <tr v-if="shops != null && shops.length === 0">
              <td colspan="9" class="text-center py-6">{{ $t('common.no_data') }}</td>
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
  </div>
</template>
