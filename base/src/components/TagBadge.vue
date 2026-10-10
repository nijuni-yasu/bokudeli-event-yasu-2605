<script setup lang="ts">
import { computed } from 'vue'
import { mdiCheck } from '@mdi/js'

const props = withDefaults(
  defineProps<{
    tag: string
    highlighted?: boolean
    clickable?: boolean
    /** x-small より一段小さくする（イベントページの参加者ブロックなど狭いレイアウト向け） */
    compact?: boolean
    /** モーダル内「設定中のタグ」向け（small + primary tonal） */
    emphasized?: boolean
    /** × ボタンで削除可能（モーダル内設定中タグ向け） */
    removable?: boolean
    /** おすすめタグ一覧で未選択・選択可能な見た目 */
    pickable?: boolean
    /** おすすめタグ一覧で選択済み（✓ 表示） */
    selected?: boolean
    disabled?: boolean
    /** 取り込み通信中。同じタグのチップすべてに出す */
    loading?: boolean
  }>(),
  {
    highlighted: false,
    clickable: false,
    compact: false,
    emphasized: false,
    removable: false,
    pickable: false,
    selected: false,
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  click: [tag: string]
  close: [tag: string]
}>()

const isHighlighted = computed(() => props.highlighted || props.emphasized || props.selected)

const chipVariant = computed(() => (isHighlighted.value ? 'tonal' : 'outlined'))

const chipSize = computed(() => (props.emphasized ? 'small' : 'x-small'))

const chipColor = 'primary'

const onClick = () => {
  if (props.clickable && !props.disabled && !props.loading) {
    emit('click', props.tag)
  }
}

const onClose = () => {
  if (!props.disabled) {
    emit('close', props.tag)
  }
}
</script>

<template>
  <v-chip
    :variant="chipVariant"
    :color="chipColor"
    :size="chipSize"
    :closable="removable"
    :disabled="disabled"
    :prepend-icon="selected ? mdiCheck : undefined"
    :aria-busy="loading || undefined"
    :class="[
      'tag-badge',
      {
        'tag-badge--highlighted': isHighlighted,
        'cursor-pointer': clickable && !disabled && !loading,
        'tag-badge--compact': compact,
        'tag-badge--emphasized': emphasized,
        'tag-badge--pickable': pickable,
        'ma-1': !compact,
      },
    ]"
    @click="onClick"
    @click:close="onClose"
  >
    <v-progress-circular
      v-if="loading"
      class="tag-badge__spinner"
      color="primary"
      indeterminate
      :size="compact ? 10 : 12"
      width="2"
    />
    {{ tag }}
  </v-chip>
</template>

<style lang="scss" scoped>
.tag-badge--compact.v-chip {
  --v-chip-size: 0.6875rem;
  --v-chip-height: 20px;
  font-size: 0.6875rem;
  line-height: 1.2;
  padding: 0 5px;
  margin: 0 2px 4px 0;
}

.tag-badge--emphasized.v-chip {
  margin: 0 4px 8px 0;
  box-shadow: 0 1px 2px rgba(var(--v-theme-primary), 0.15);
}

.tag-badge__spinner {
  margin-inline-end: 4px;
  flex-shrink: 0;
}

.tag-badge--pickable.v-chip:not(.v-chip--disabled) {
  background-color: rgb(var(--v-theme-surface));
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    transform 0.1s ease;

  &:active {
    transform: scale(0.97);
  }

  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.08);
  }
}
</style>
