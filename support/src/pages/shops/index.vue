<script setup lang="ts">
import { orderBy } from 'firebase/firestore'
import { useShopListStore } from '@shokujii/base/stores/shopList.js'
import { updateShopStatus } from '@shokujii/base/stores/partner.js'
import type { BokudeliPartnerShop } from '@shokujii/base/stores/partner.js'
import { convertToDatetime, convertToTimeString } from '@shokujii/common/utils/datetime.js'
import type { Notification } from '@shokujii/base/types/index.js'

const { t: $t } = useI18n()
const notification = inject<Notification>('notification')

const shopListStore = useShopListStore([orderBy('createdAt', 'desc')])

const shops = computed(() => shopListStore.shops)

/** shop_time / shop_deadline_datetime の時刻はタイムゾーンを持たない「その日の経過ミリ秒」なので UTC で整形する */
const formatTimeOfDay = (millis: number | null): string => (millis == null ? '' : convertToTimeString(millis, 'UTC'))

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
    shopListStore.reload()
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
      <v-card-title class="d-flex align-center">
        {{ $t('shops.title') }}
        <v-chip v-if="shops != null" class="ms-3" size="small">
          {{ $t('common.total_count', { count: shops.length }) }}
        </v-chip>
      </v-card-title>

      <v-table density="compact" class="text-no-wrap">
        <thead>
          <tr>
            <th>{{ $t('shops.name') }}</th>
            <th>{{ $t('shops.address') }}</th>
            <th>{{ $t('shops.contact') }}</th>
            <th>{{ $t('shops.deadline') }}</th>
            <th>{{ $t('shops.range_min_orders') }}</th>
            <th>{{ $t('shops.business_hours') }}</th>
            <th>{{ $t('shops.created_at') }}</th>
            <th>{{ $t('shops.is_open') }}</th>
            <th>{{ $t('shops.is_approved') }}</th>
            <th>{{ $t('shops.partner_id') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="shop in shops ?? []" :key="`${shop.partner_id}/${shop.shop_id}`">
            <td>{{ shop.shop_name }}</td>
            <td class="text-wrap">{{ shop.shop_postcode }} {{ shop.fullAddress }}</td>
            <td>
              <div>{{ shop.shop_phone }}</div>
              <div>{{ shop.shop_email }}</div>
            </td>
            <td>
              {{ $t('shops.deadline_days_before', { days: shop.shop_deadline_datetime.days_before }) }}
              {{ formatTimeOfDay(shop.shop_deadline_datetime.time) }}
            </td>
            <td>
              <div v-for="(item, index) in shop.shop_range_min_orders" :key="index">
                {{ $t('shops.range_min_orders_item', { range: item.range, count: item.min_orders }) }}
              </div>
            </td>
            <td>
              <div v-for="(time, index) in shop.shop_time" :key="index">
                {{ $t('day_of_week')[index] }}:
                <template v-if="time.is_open">
                  {{ formatTimeOfDay(time.time_start) }}-{{ formatTimeOfDay(time.time_end) }}
                  <template v-if="time.time_start2 != null && time.time_end2 != null">
                    / {{ formatTimeOfDay(time.time_start2) }}-{{ formatTimeOfDay(time.time_end2) }}
                  </template>
                </template>
                <template v-else>{{ $t('shops.is_open_off') }}</template>
              </div>
            </td>
            <td>{{ convertToDatetime(shop.createdAt) }}</td>
            <td>
              <v-switch
                :model-value="shop.is_open"
                :label="shop.is_open ? $t('shops.is_open_on') : $t('shops.is_open_off')"
                :disabled="updating.has(shop.shop_id)"
                density="compact"
                hide-details
                @update:model-value="(value) => changeStatus(shop, { is_open: value === true })"
              />
            </td>
            <td>
              <v-switch
                :model-value="shop.is_approved"
                :label="shop.is_approved ? $t('shops.is_approved_on') : $t('shops.is_approved_off')"
                :disabled="updating.has(shop.shop_id)"
                density="compact"
                hide-details
                @update:model-value="(value) => changeStatus(shop, { is_approved: value === true })"
              />
            </td>
            <td>{{ shop.partner_id }}</td>
          </tr>
          <tr v-if="shops != null && shops.length === 0">
            <td colspan="10" class="text-center py-6">{{ $t('common.no_data') }}</td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="shops == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>
    </v-card>
  </div>
</template>
