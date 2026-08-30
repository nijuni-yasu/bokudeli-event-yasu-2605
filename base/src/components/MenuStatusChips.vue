<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    isSoldOut?: boolean
    /** 限定食数の残数。nullish のとき残数 chip は非表示 */
    remaining?: number | null
    /** true のとき remaining を残数/完売 chip として表示 */
    showRemainingStatus?: boolean
    /** partner 向け: 1 イベントあたりの上限設定値 */
    limitPerEvent?: number | null
    placement?: 'inline' | 'overlay'
    align?: 'start' | 'center'
  }>(),
  {
    isSoldOut: false,
    placement: 'inline',
    align: 'start',
  },
)

const showSoldOut = computed(() => props.isSoldOut)
const showLimitSoldOut = computed(() => !props.isSoldOut && props.showRemainingStatus && props.remaining === 0)
const showRemainingCount = computed(
  () => !props.isSoldOut && props.showRemainingStatus && props.remaining != null && props.remaining > 0,
)
const showLimitSetting = computed(
  () => !props.isSoldOut && !props.showRemainingStatus && props.limitPerEvent != null && props.limitPerEvent > 0,
)

const hasVisibleChip = computed(
  () => showSoldOut.value || showLimitSoldOut.value || showRemainingCount.value || showLimitSetting.value,
)

const rootClass = computed(() => ({
  'menu-status-chips--overlay': props.placement === 'overlay',
  'menu-status-chips--inline': props.placement === 'inline',
  'menu-status-chips--align-center': props.align === 'center',
  'menu-status-chips--align-start': props.align === 'start',
}))
</script>

<template>
  <div v-if="hasVisibleChip" class="menu-status-chips" :class="rootClass">
    <v-chip v-if="showSoldOut" color="error" variant="tonal" size="small" label>
      {{ $t('event_menu.sold_out') }}
    </v-chip>
    <v-chip v-else-if="showLimitSoldOut" color="error" variant="tonal" size="small" label>
      {{ $t('event_menu.limit_sold_out') }}
    </v-chip>
    <v-chip v-else-if="showRemainingCount" color="primary" variant="tonal" size="small" label>
      {{ $t('event_menu.remaining_count', [remaining]) }}
    </v-chip>
    <v-chip v-else-if="showLimitSetting" color="info" variant="tonal" size="small" label>
      {{ $t('menu_status.limit_per_event', [limitPerEvent]) }}
    </v-chip>
  </div>
</template>

<style scoped lang="scss">
.menu-status-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.menu-status-chips--inline {
  &.menu-status-chips--align-center {
    justify-content: center;
  }

  &.menu-status-chips--align-start {
    justify-content: flex-start;
  }
}

.menu-status-chips--overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}
</style>
