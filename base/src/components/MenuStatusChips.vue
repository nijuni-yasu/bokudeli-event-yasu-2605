<script setup lang="ts">
import { computed } from 'vue'
import { formatLimitedPeriodRange } from '@shokujii/common/utils/datetime.js'

const props = withDefaults(
  defineProps<{
    /** 売り切れ（店舗・イベント編集画面向け） */
    isSoldOut?: boolean
    /** 限定食数の残数（イベントページ向け。1 以上のときのみ chip 表示） */
    remaining?: number | null
    /** 店舗・イベント編集画面向け: 1 イベントあたりの限定食数設定値 */
    limitPerEvent?: number | null
    /** 店舗メニューカード向け: 販売期間（開始・終了の epoch millis） */
    limitedPeriodStart?: number | null
    limitedPeriodEnd?: number | null
    align?: 'start' | 'center'
    /** 表示する chip の種別（all: すべて、limited-period: 期間限定のみ、status: 期間限定以外） */
    mode?: 'all' | 'limited-period' | 'status'
  }>(),
  {
    isSoldOut: false,
    align: 'start',
    mode: 'all',
  },
)

const showLimitedPeriod = computed(() => props.limitedPeriodStart != null && props.limitedPeriodEnd != null)
const limitedPeriodLabel = computed(() => {
  if (!showLimitedPeriod.value) {
    return ''
  }
  return formatLimitedPeriodRange(props.limitedPeriodStart!, props.limitedPeriodEnd!)
})
const showSoldOut = computed(() => props.isSoldOut)
const showRemainingCount = computed(() => !props.isSoldOut && props.remaining != null && props.remaining > 0)
const showLimitSetting = computed(() => !props.isSoldOut && props.limitPerEvent != null && props.limitPerEvent > 0)

const showLimitedPeriodChip = computed(
  () => (props.mode === 'all' || props.mode === 'limited-period') && showLimitedPeriod.value,
)
const showSoldOutChip = computed(() => (props.mode === 'all' || props.mode === 'status') && showSoldOut.value)
const showRemainingCountChip = computed(
  () => (props.mode === 'all' || props.mode === 'status') && showRemainingCount.value,
)
const showLimitSettingChip = computed(() => (props.mode === 'all' || props.mode === 'status') && showLimitSetting.value)

const hasVisibleChip = computed(
  () =>
    showLimitedPeriodChip.value || showSoldOutChip.value || showRemainingCountChip.value || showLimitSettingChip.value,
)

const rootClass = computed(() => ({
  'menu-status-chips--align-center': props.align === 'center',
  'menu-status-chips--align-start': props.align === 'start',
}))
</script>

<template>
  <div v-if="hasVisibleChip" class="menu-status-chips" :class="rootClass">
    <v-chip v-if="showLimitedPeriodChip" color="warning" variant="tonal" size="small" label>
      {{ $t('menu_status.limited_period', [limitedPeriodLabel]) }}
    </v-chip>
    <v-chip v-if="showSoldOutChip" color="error" variant="tonal" size="small" label>
      {{ $t('event_menu.sold_out') }}
    </v-chip>
    <v-chip v-if="showRemainingCountChip" color="primary" variant="tonal" size="small" label>
      {{ $t('event_menu.remaining_count', [remaining]) }}
    </v-chip>
    <v-chip v-if="showLimitSettingChip" color="success" variant="tonal" size="small" label>
      {{ $t('menu_status.limit_per_event', [limitPerEvent]) }}
    </v-chip>
  </div>
</template>

<style scoped lang="scss">
.menu-status-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  &.menu-status-chips--align-center {
    justify-content: center;
  }

  &.menu-status-chips--align-start {
    justify-content: flex-start;
  }
}
</style>
