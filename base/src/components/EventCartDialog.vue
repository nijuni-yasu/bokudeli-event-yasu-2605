<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FirebaseError } from 'firebase/app'
import { useI18n } from 'vue-i18n'
import { type BokudeliEventMenu } from '@shokujii/base/stores/event.js'
import { useAppEventStore } from '@shokujii/base/composable/useAppEventStore.js'
import { useMenuLimitRemaining } from '@shokujii/base/composable/useMenuLimitRemaining.js'
import { MENU_LIMIT_EXCEEDED_MESSAGE } from '@shokujii/common/utils/menuLimit.js'
import { priceString } from '@shokujii/base/schemes/converter'
import { mdiCart } from '@mdi/js'
import EventMenuImage from '@shokujii/base/components/EventMenuImage.vue'
import MenuStatusChips from '@shokujii/base/components/MenuStatusChips.vue'

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

const remainingInfo = computed(() => getRemainingForMenu(props.menu))

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
  () => props.menu.is_sold_out || isMenuLimitSoldOut(props.menu) || countOptions.value.length === 0,
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

const closeDialog = () => {
  isAddingOrder.value = false
  selectedCount.value = 1
  addErrorMessage.value = ''
  isOpen.value = false
}

const getAddToCartErrorMessage = (error: unknown): string | null => {
  if (error instanceof FirebaseError && error.code === 'functions/failed-precondition') {
    return error.message
  }
  if (error instanceof Error && error.message.includes(MENU_LIMIT_EXCEEDED_MESSAGE)) {
    return error.message
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
      <EventMenuImage v-if="eventStore.event != null" :event="eventStore.event" :menu="menu" class="ma-3" />
      <v-card-title class="text-left text-h4 py-1 text-wrap">
        {{ menu.menu_name }}
      </v-card-title>
      <v-card-text class="text-left py-2">
        {{ menu.menu_description }}
      </v-card-text>
      <v-card-text
        v-if="!menu.is_sold_out && !isMenuLimitSoldOut(menu) && remainingInfo != null && remainingInfo.remaining > 0"
        class="text-left py-0"
      >
        <MenuStatusChips :remaining="remainingInfo.remaining" align="start" />
      </v-card-text>
      <v-card-text class="text-right pb-8">
        <span class="text-h5">¥ </span>
        <span class="text-h4">{{ priceString(menu.menu_price) }}</span>
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
