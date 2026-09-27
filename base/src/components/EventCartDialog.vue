<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FirebaseError } from 'firebase/app'
import { useI18n } from 'vue-i18n'
import { type BokudeliEventMenu } from '@shokujii/base/stores/event.js'
import { useAppEventStore } from '@shokujii/base/composable/useAppEventStore.js'
import { useMenuLimitRemaining } from '@shokujii/base/composable/useMenuLimitRemaining.js'
import { getUserFacingFailedPreconditionMessage } from '@shokujii/common/utils/failedPreconditionMessage.js'
import { priceString } from '@shokujii/base/schemes/converter'
import { mdiCart } from '@mdi/js'
import EventMenuImage from '@shokujii/base/components/EventMenuImage.vue'
import MenuStatusChips from '@shokujii/base/components/MenuStatusChips.vue'
import { buildMenuPriceLines, resolveEventMenuCartOrder } from '@shokujii/common/utils/menuOption.js'
import type { CartSelectedItemType } from '@shokujii/common/schemas/menuOption.js'
import MenuPriceBreakdown from '@shokujii/base/components/MenuPriceBreakdown.vue'

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

const priceBreakdownLines = computed(() => {
  const resolved = resolvedSelection.value
  if (!resolved.ok) {
    return []
  }
  return buildMenuPriceLines(currentMenu.value.menu_name, resolved.menu_price, resolved.selected_options)
})

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

const formatDelta = (delta: number): string => {
  if (delta === 0) {
    return $t('cart_dialog.price_delta_zero')
  }
  const sign = delta > 0 ? '+' : ''
  return `${sign}${priceString(delta)}`
}

watch(isOpen, (open) => {
  if (open) {
    addErrorMessage.value = ''
    selectedCount.value = countOptions.value[0] ?? 1
    resetOptionSelection()
  }
})

watch(countOptions, (options) => {
  if (options.length === 0) {
    return
  }
  if (!options.includes(selectedCount.value)) {
    selectedCount.value = options[options.length - 1] ?? 1
  }
})

const isAddingOrder = ref(false)

const closeDialog = () => {
  isAddingOrder.value = false
  selectedCount.value = 1
  addErrorMessage.value = ''
  isOpen.value = false
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
          count: selectedCount.value,
          selected_items: selectedItems.value,
          presented_menu_price: displayedPrice.value,
        },
      ],
    })
    emit('added')
    closeDialog()
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
  <v-dialog v-model="isOpen" max-width="500px" @click:outside="closeDialog()">
    <v-card class="pa-sm-10 pa-5">
      <EventMenuImage v-if="eventStore.event != null" :event="eventStore.event" :menu="currentMenu" class="ma-3" />
      <v-card-title class="text-left text-h4 py-1 text-wrap">
        {{ currentMenu.menu_name }}
      </v-card-title>
      <v-card-text class="text-left py-2">
        {{ currentMenu.menu_description }}
      </v-card-text>
      <v-card-text v-if="menuOptions.length > 0" class="text-left py-2">
        <div v-for="option in menuOptions" :key="option.option_id" class="mb-4">
          <div class="text-subtitle-2 mb-1">
            {{ option.option_name }}
            <span v-if="option.required" class="text-error">{{ $t('cart_dialog.required') }}</span>
          </div>
          <p
            v-if="option.option_description != null && option.option_description !== ''"
            class="text-caption text-medium-emphasis mb-2"
          >
            {{ option.option_description }}
          </p>
          <v-radio-group
            v-if="option.selection === 'single'"
            :model-value="getSingleValue(option.option_id)"
            :mandatory="option.required"
            hide-details
            @update:model-value="(value) => setSingleValue(option.option_id, typeof value === 'string' ? value : null)"
          >
            <v-radio v-if="!option.required" :label="$t('cart_dialog.no_selection')" :value="''" />
            <v-radio
              v-for="item in option.option_items"
              :key="item.item_id"
              :value="item.item_id"
              :label="`${item.name}（${formatDelta(item.price_delta)}）`"
            />
          </v-radio-group>
          <div v-else>
            <v-checkbox
              v-for="item in option.option_items"
              :key="item.item_id"
              :model-value="isMultipleChecked(option.option_id, item.item_id)"
              :label="`${item.name}（${formatDelta(item.price_delta)}）`"
              hide-details
              density="compact"
              @update:model-value="(value) => toggleMultiple(option.option_id, item.item_id, value === true)"
            />
          </div>
        </div>
      </v-card-text>
      <v-card-text class="pb-8">
        <div class="d-flex align-center ga-3">
          <MenuStatusChips v-if="showRemainingChip" :remaining="remainingInfo!.remaining" align="start" />
          <MenuStatusChips
            v-else-if="showSoldOutStatusChip"
            :is-sold-out="currentMenu.is_sold_out"
            :is-limit-sold-out="!currentMenu.is_sold_out && isMenuLimitSoldOut(currentMenu)"
            align="start"
          />
          <v-spacer />
          <div v-if="priceBreakdownLines.length === 0" class="text-no-wrap">
            <span class="text-h5">¥ </span>
            <span class="text-h4">{{ priceString(displayedPrice) }}</span>
          </div>
        </div>
        <div v-if="priceBreakdownLines.length > 0" class="cart-dialog-price mt-4">
          <MenuPriceBreakdown class="text-body-1" :lines="priceBreakdownLines" />
          <div class="cart-dialog-price__total text-no-wrap">
            <span class="text-h5">¥ </span>
            <span class="text-h4">{{ priceString(displayedPrice) }}</span>
          </div>
        </div>
      </v-card-text>
      <v-row v-if="countOptions.length > 0" class="mx-3 mb-2">
        <v-select v-model="selectedCount" :items="countOptions" dense outlined filled label="個数"></v-select>
      </v-row>
      <v-alert v-if="addErrorMessage !== ''" type="error" variant="tonal" class="mx-3 mb-2">
        {{ addErrorMessage }}
      </v-alert>
      <v-row class="justify-center mx-1 my-2">
        <v-btn
          class="justify-center mx-1 align-self-center"
          rounded="pill"
          color="primary"
          :prepend-icon="mdiCart"
          :loading="isAddingOrder"
          :disabled="isAddDisabled"
          @click="addCart()"
        >
          {{ $t('cart_dialog.add') }}
        </v-btn>
        <v-btn
          class="justify-center mx-1 my-2 align-self-center"
          rounded="pill"
          size="small"
          variant="outlined"
          color="secondary"
          @click="closeDialog()"
        >
          {{ $t('cart_dialog.close') }}
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.cart-dialog-price {
  width: max-content;
  max-width: 100%;
}

.cart-dialog-price :deep(.menu-price-breakdown) {
  width: 100%;
  grid-template-columns: minmax(0, 1fr) max-content;
}

.cart-dialog-price__total {
  margin-top: 0.75rem;
  text-align: right;
}
</style>
