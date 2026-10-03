<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FirebaseError } from 'firebase/app'
import { useI18n } from 'vue-i18n'
import { type BokudeliEventMenu } from '@shokujii/base/stores/event.js'
import { useAppEventStore } from '@shokujii/base/composable/useAppEventStore.js'
import { useMenuLimitRemaining } from '@shokujii/base/composable/useMenuLimitRemaining.js'
import { getUserFacingFailedPreconditionMessage } from '@shokujii/common/utils/failedPreconditionMessage.js'
import { priceString } from '@shokujii/base/schemes/converter'
import { mdiCart, mdiFoodOffOutline } from '@mdi/js'
import EventMenuImage from '@shokujii/base/components/EventMenuImage.vue'
import MenuStatusChips from '@shokujii/base/components/MenuStatusChips.vue'
import { NO_ORDER_PARTICIPATION_MENU_ID } from '@shokujii/common/schemas/EventItemType.js'
import type { CartSelectedItemType } from '@shokujii/common/schemas/menuOption.js'
import { resolveEventMenuCartOrder } from '@shokujii/common/utils/menuOption.js'

const props = defineProps<{
  menu: BokudeliEventMenu
  eventId: string
}>()

const { t: $t } = useI18n()
const eventStore = useAppEventStore(props.eventId)
const { getRemainingForMenu, isMenuLimitSoldOut } = useMenuLimitRemaining(props.eventId)

const isOpen = defineModel<boolean>()

const emit = defineEmits<{
  added: []
}>()

const selectedCount = ref(1)
const addErrorMessage = ref('')
const selectedByOption = ref<Record<string, string[]>>({})

const currentMenu = computed(() => {
  const menus = eventStore.menus
  if (menus == null) {
    return props.menu
  }
  return menus.find((m) => m.menu_id === props.menu.menu_id) ?? props.menu
})

const remainingInfo = computed(() => getRemainingForMenu(currentMenu.value))

const showRemainingChip = computed(
  () =>
    !currentMenu.value.is_sold_out &&
    !isMenuLimitSoldOut(currentMenu.value) &&
    remainingInfo.value != null &&
    remainingInfo.value.remaining > 0,
)

const showSoldOutStatusChip = computed(() => currentMenu.value.is_sold_out || isMenuLimitSoldOut(currentMenu.value))

const maxSelectableCount = computed(() => {
  const remaining = remainingInfo.value?.remaining
  if (remaining == null) {
    return 5
  }
  return Math.min(remaining, 5)
})

const countOptions = computed(() => {
  const max = maxSelectableCount.value
  if (max <= 0) {
    return []
  }
  return Array.from({ length: max }, (_, i) => i + 1)
})

const menuOptions = computed(() => currentMenu.value.options ?? [])

const resetOptionSelection = () => {
  const initial: Record<string, string[]> = {}
  for (const option of menuOptions.value) {
    initial[option.option_id] =
      option.required && option.selection === 'single' && option.option_items[0] != null
        ? [option.option_items[0].item_id]
        : []
  }
  selectedByOption.value = initial
}

const selectedItems = computed((): CartSelectedItemType[] =>
  Object.entries(selectedByOption.value).flatMap(([option_id, itemIds]) =>
    itemIds.map((item_id) => ({ option_id, item_id })),
  ),
)

const resolvedSelection = computed(() =>
  resolveEventMenuCartOrder({
    eventMenu: currentMenu.value,
    selectedItems: selectedItems.value,
  }),
)

const displayedPrice = computed(() =>
  resolvedSelection.value.ok ? resolvedSelection.value.menu_price : currentMenu.value.menu_price,
)

const displayedSubtotal = computed(() =>
  resolvedSelection.value.ok ? resolvedSelection.value.menu_price * selectedCount.value : null,
)

const isAddDisabled = computed(
  () =>
    currentMenu.value.is_sold_out ||
    isMenuLimitSoldOut(currentMenu.value) ||
    countOptions.value.length === 0 ||
    !resolvedSelection.value.ok,
)

const getSingleValue = (optionId: string): string | null => selectedByOption.value[optionId]?.[0] ?? null

const setSingleValue = (optionId: string, itemId: string | null) => {
  selectedByOption.value = { ...selectedByOption.value, [optionId]: itemId == null || itemId === '' ? [] : [itemId] }
}

const isMultipleChecked = (optionId: string, itemId: string): boolean =>
  selectedByOption.value[optionId]?.includes(itemId) === true

const toggleMultiple = (optionId: string, itemId: string, checked: boolean) => {
  const current = new Set(selectedByOption.value[optionId] ?? [])
  if (checked) {
    current.add(itemId)
  } else {
    current.delete(itemId)
  }
  selectedByOption.value = { ...selectedByOption.value, [optionId]: [...current] }
}

const optionAmountColumnCh = computed(() => {
  const maxLength = menuOptions.value.reduce((max, option) => {
    const optionMax = option.option_items.reduce(
      (innerMax, item) => Math.max(innerMax, priceString(Math.abs(item.price_delta)).length),
      0,
    )
    return Math.max(max, optionMax)
  }, 1)
  return maxLength
})

const optionPriceColumnStyle = computed(() => ({
  '--cart-option-amount-ch': String(optionAmountColumnCh.value),
}))

const optionPriceSign = (delta: number): '+' | '-' | '' => {
  if (delta > 0) {
    return '+'
  }
  if (delta < 0) {
    return '-'
  }
  return ''
}

watch(
  isOpen,
  (open) => {
    if (open) {
      addErrorMessage.value = ''
      selectedCount.value = countOptions.value[0] ?? 1
      resetOptionSelection()
    }
  },
  { immediate: true },
)

watch(countOptions, (options) => {
  if (options.length === 0) {
    return
  }
  if (!options.includes(selectedCount.value)) {
    selectedCount.value = options[options.length - 1] ?? 1
  }
})

const isAddingOrder = ref(false)

const isNoOrderParticipation = computed(() => props.menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)

const resetAndClose = () => {
  selectedCount.value = 1
  addErrorMessage.value = ''
  isOpen.value = false
}

const closeDialog = () => {
  if (isAddingOrder.value) {
    return
  }
  resetAndClose()
}

const getAddToCartErrorMessage = (error: unknown): string | null => {
  if (
    error instanceof FirebaseError &&
    (error.code === 'functions/failed-precondition' || error.code === 'functions/invalid-argument')
  ) {
    return getUserFacingFailedPreconditionMessage(error.message)
  }
  if (error instanceof Error) {
    return getUserFacingFailedPreconditionMessage(error.message)
  }
  return null
}

const addCart = async () => {
  if (isAddingOrder.value) {
    return
  }
  if (eventStore.event == null) {
    console.warn('eventStore.event is null')
    return
  }
  const menu_id = props.menu.id
  if (menu_id == null) {
    console.warn('menu_id is null')
    return
  }
  if (isAddDisabled.value) {
    return
  }

  isAddingOrder.value = true
  addErrorMessage.value = ''
  try {
    await eventStore.addToCart({
      community_id: eventStore.event.community_id,
      event_id: eventStore.event.event_id,
      menus: [
        {
          menu_id,
          count: isNoOrderParticipation.value ? 1 : selectedCount.value,
          selected_items: selectedItems.value,
          presented_menu_price: displayedPrice.value,
        },
      ],
    })
    emit('added')
    resetAndClose()
  } catch (e) {
    const message = getAddToCartErrorMessage(e)
    if (message != null) {
      addErrorMessage.value = message
    } else {
      console.error(e)
      addErrorMessage.value = $t('cart.update_failed')
    }
  } finally {
    isAddingOrder.value = false
  }
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="500px" scrollable :persistent="isAddingOrder" @click:outside="closeDialog()">
    <v-card>
      <v-card-text class="pa-5 pa-sm-10" :style="optionPriceColumnStyle">
        <div
          v-if="isNoOrderParticipation && eventStore.event != null"
          class="d-flex align-center justify-center no-order-icon-area my-3"
        >
          <v-icon :icon="mdiFoodOffOutline" size="80" color="grey-darken-1" />
        </div>
        <EventMenuImage
          v-else-if="eventStore.event != null"
          :event="eventStore.event"
          :menu="currentMenu"
          :alt="currentMenu.menu_name"
          class="my-3"
        />
        <v-card-title class="text-left text-h4 font-weight-bold px-0 py-1 text-wrap">
          {{ currentMenu.menu_name }}
        </v-card-title>
        <div class="text-h5 py-1">¥{{ priceString(currentMenu.menu_price) }}</div>
        <div v-if="showRemainingChip || showSoldOutStatusChip" class="mt-2">
          <MenuStatusChips v-if="showRemainingChip" :remaining="remainingInfo!.remaining" align="start" />
          <MenuStatusChips
            v-else-if="showSoldOutStatusChip"
            :is-sold-out="currentMenu.is_sold_out"
            :is-limit-sold-out="!currentMenu.is_sold_out && isMenuLimitSoldOut(currentMenu)"
            align="start"
          />
        </div>
        <p
          v-if="currentMenu.menu_description != null && currentMenu.menu_description !== ''"
          class="text-body-2 text-medium-emphasis mt-4 mb-0"
        >
          {{ currentMenu.menu_description }}
        </p>
        <template v-if="!isNoOrderParticipation">
          <div v-for="option in menuOptions" :key="option.option_id" class="mt-6">
            <v-divider class="mb-5" />
            <div class="d-flex align-center flex-wrap ga-2 mb-1">
              <h3 class="text-subtitle-1 font-weight-bold">{{ option.option_name }}</h3>
              <v-chip
                :color="option.required ? 'error' : 'secondary'"
                variant="outlined"
                size="small"
                class="flex-shrink-0"
              >
                {{ $t(option.required ? 'cart_dialog.required' : 'cart_dialog.optional') }}
              </v-chip>
              <v-btn
                v-if="option.selection === 'single' && !option.required && getSingleValue(option.option_id) != null"
                variant="text"
                size="small"
                class="ms-auto"
                @click="setSingleValue(option.option_id, null)"
              >
                {{ $t('cart_dialog.clear_selection') }}
              </v-btn>
            </div>
            <p
              v-if="option.option_description != null && option.option_description !== ''"
              class="text-body-2 text-medium-emphasis mb-2"
            >
              {{ option.option_description }}
            </p>
            <v-radio-group
              v-if="option.selection === 'single'"
              :model-value="getSingleValue(option.option_id)"
              :mandatory="option.required"
              class="cart-dialog-options"
              hide-details
              @update:model-value="
                (value) => setSingleValue(option.option_id, typeof value === 'string' ? value : null)
              "
            >
              <v-radio v-for="item in option.option_items" :key="item.item_id" :value="item.item_id">
                <template #label>
                  <span class="cart-dialog-option-label">
                    <span class="cart-dialog-option-name">{{ item.name }}</span>
                    <span class="cart-dialog-option-price text-no-wrap text-medium-emphasis">
                      <span class="cart-dialog-option-sign">{{ optionPriceSign(item.price_delta) }}</span>
                      <span>¥</span>
                      <span class="cart-dialog-option-amount">{{ priceString(Math.abs(item.price_delta)) }}</span>
                    </span>
                  </span>
                </template>
              </v-radio>
            </v-radio-group>
            <div v-else class="cart-dialog-options">
              <v-checkbox
                v-for="item in option.option_items"
                :key="item.item_id"
                :model-value="isMultipleChecked(option.option_id, item.item_id)"
                hide-details
                @update:model-value="(value) => toggleMultiple(option.option_id, item.item_id, value === true)"
              >
                <template #label>
                  <span class="cart-dialog-option-label">
                    <span class="cart-dialog-option-name">{{ item.name }}</span>
                    <span class="cart-dialog-option-price text-no-wrap text-medium-emphasis">
                      <span class="cart-dialog-option-sign">{{ optionPriceSign(item.price_delta) }}</span>
                      <span>¥</span>
                      <span class="cart-dialog-option-amount">{{ priceString(Math.abs(item.price_delta)) }}</span>
                    </span>
                  </span>
                </template>
              </v-checkbox>
            </div>
          </div>
        </template>
      </v-card-text>
      <v-divider />
      <div class="pa-5 px-sm-10 py-sm-6 flex-shrink-0">
        <div v-if="!isNoOrderParticipation" class="d-flex align-center justify-space-between ga-4 mb-4">
          <v-select
            v-if="countOptions.length > 0"
            v-model="selectedCount"
            :items="countOptions"
            :label="$t('cart_dialog.count')"
            class="cart-dialog-count"
            hide-details
          />
          <div class="text-h5 text-no-wrap text-right ms-auto">
            {{ displayedSubtotal == null ? $t('cart_dialog.price_pending') : `¥${priceString(displayedSubtotal)}` }}
          </div>
        </div>
        <v-alert v-if="addErrorMessage !== ''" type="error" variant="tonal" class="mb-4">
          {{ addErrorMessage }}
        </v-alert>
        <div class="d-flex justify-end align-center flex-wrap ga-3">
          <v-btn
            rounded="pill"
            size="small"
            variant="outlined"
            color="secondary"
            :disabled="isAddingOrder"
            @click="closeDialog()"
          >
            {{ $t('cart_dialog.close') }}
          </v-btn>
          <v-btn
            rounded="pill"
            color="primary"
            :prepend-icon="isNoOrderParticipation ? mdiFoodOffOutline : mdiCart"
            :loading="isAddingOrder"
            :disabled="isAddDisabled"
            @click="addCart()"
          >
            {{ $t('cart_dialog.add') }}
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.cart-dialog-options :deep(.v-selection-control) {
  width: 100%;
}

.cart-dialog-options :deep(.v-label) {
  flex: 1;
  width: 100%;
  min-width: 0;
  opacity: 1;
}

.cart-dialog-option-name {
  color: rgb(var(--v-theme-on-surface));
}

.cart-dialog-option-label {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
  white-space: normal;
  overflow-wrap: anywhere;
}

.cart-dialog-option-price {
  display: inline-grid;
  grid-template-columns: 1ch auto calc(var(--cart-option-amount-ch, 1) * 1ch);
  align-items: baseline;
  flex-shrink: 0;
  margin-inline-start: auto;
  font-variant-numeric: tabular-nums;
}

.cart-dialog-option-sign {
  text-align: center;
}

.cart-dialog-option-amount {
  text-align: right;
}

.cart-dialog-count {
  flex: 0 0 120px;
}

.no-order-icon-area {
  width: 100%;
  height: 200px;
  background-color: rgb(var(--v-theme-grey-100));
  border-radius: 4px;
}
</style>
