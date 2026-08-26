<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FirebaseError } from 'firebase/app'
import { useI18n } from 'vue-i18n'
import { type BokudeliEventMenu } from '@shokujii/base/stores/event.js'
import { useAppEventStore } from '@shokujii/base/composable/useAppEventStore.js'
import { useMenuLimitRemaining } from '@shokujii/base/composable/useMenuLimitRemaining.js'
import { getUserFacingFailedPreconditionMessage } from '@shokujii/common/utils/failedPreconditionMessage.js'
import { priceString } from '@shokujii/base/schemes/converter'
import { mdiCart, mdiAccountCheck } from '@mdi/js'
import EventMenuImage from '@shokujii/base/components/EventMenuImage.vue'
import MenuStatusChips from '@shokujii/base/components/MenuStatusChips.vue'
import { NO_ORDER_PARTICIPATION_MENU_ID } from '@shokujii/common/schemas/EventItemType.js'

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

const isAddDisabled = computed(
  () => currentMenu.value.is_sold_out || isMenuLimitSoldOut(currentMenu.value) || countOptions.value.length === 0,
)

watch(isOpen, (open) => {
  if (open) {
    addErrorMessage.value = ''
    selectedCount.value = countOptions.value[0] ?? 1
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

const isNoOrderParticipation = computed(() => props.menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)

const closeDialog = () => {
  isAddingOrder.value = false
  selectedCount.value = 1
  addErrorMessage.value = ''
  isOpen.value = false
}

const getAddToCartErrorMessage = (error: unknown): string | null => {
  if (error instanceof FirebaseError && error.code === 'functions/failed-precondition') {
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
          count: isNoOrderParticipation.value ? 1 : selectedCount.value,
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
      <div
        v-if="isNoOrderParticipation && eventStore.event != null"
        class="d-flex align-center justify-center no-order-icon-area ma-3"
      >
        <v-icon :icon="mdiAccountCheck" size="80" color="primary" />
      </div>
      <EventMenuImage v-else-if="eventStore.event != null" :event="eventStore.event" :menu="currentMenu" class="ma-3" />
      <v-card-title class="text-left text-h4 py-1 text-wrap">
        {{ currentMenu.menu_name }}
      </v-card-title>
      <v-card-text class="text-left py-2">
        {{ currentMenu.menu_description }}
      </v-card-text>
      <v-card-text class="d-flex align-center pb-8">
        <MenuStatusChips v-if="showRemainingChip" :remaining="remainingInfo!.remaining" align="start" />
        <MenuStatusChips
          v-else-if="showSoldOutStatusChip"
          :is-sold-out="currentMenu.is_sold_out"
          :is-limit-sold-out="!currentMenu.is_sold_out && isMenuLimitSoldOut(currentMenu)"
          align="start"
        />
        <v-spacer />
        <span v-if="isNoOrderParticipation" class="text-h4">{{
          $t('cart_dialog.no_order_participation_price_label')
        }}</span>
        <template v-else>
          <span class="text-h5">¥ </span>
          <span class="text-h4">{{ priceString(currentMenu.menu_price) }}</span>
        </template>
      </v-card-text>
      <v-row v-if="!isNoOrderParticipation && countOptions.length > 0" class="mx-3 mb-2">
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
          {{ isNoOrderParticipation ? $t('cart_dialog.add_no_order_participation') : $t('cart_dialog.add') }}
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

<style lang="scss" scoped>
.no-order-icon-area {
  aspect-ratio: 1;
  max-height: 200px;
  background-color: rgb(var(--v-theme-grey-100));
  border-radius: 4px;
}
</style>
