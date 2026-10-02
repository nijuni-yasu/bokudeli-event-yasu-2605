<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { mdiClipboardTextOutline } from '@mdi/js'
import { FirebaseError } from 'firebase/app'
import FormAnswerFields from '@shokujii/base/components/forms/FormAnswerFields.vue'
import ConfirmDialog from '@shokujii/base/components/ConfirmDialog.vue'
import { getOrderFormForCart, saveOrderFormAttempt } from '@shokujii/base/apis/form.js'
import { createStripeCheckoutSession } from '@shokujii/base/apis/stripe'
import { useCurrentUserStore } from '@shokujii/base/stores/currentUser'
import { useCreateAppEventStore } from '@shokujii/base/composable/useAppEventStore.js'
import { computeTotalPayment } from '@shokujii/common/utils/paymentCommunityBillOffAmount.js'
import { isWithinOrderDeadline } from '@shokujii/common/utils/orderDeadline.js'
import { sortOrderIdsForEnterpriseSubsidyReplay } from '@shokujii/common/utils/eventMemberOrderSort.js'
import { getUserFacingFailedPreconditionMessage } from '@shokujii/common/utils/failedPreconditionMessage.js'
import type { ResolveEventHrefFn, ResolveOrdersPathFn } from '@shokujii/base/types/profilePathResolvers.js'
import type { FormAnswerInput, FormValidationIssue } from '@shokujii/common/utils/validateFormAnswers.js'
import type { FormField } from '@shokujii/common/schemas/formFields.js'
import type { GetOrderFormForCartResponse } from '@shokujii/common/apis/form.js'

const props = defineProps<{
  eventId: string
  communityAccount: string
  resolveOrdersPath: ResolveOrdersPathFn
  resolveCartPath: () => string
  resolveEventPath: ResolveEventHrefFn
}>()

const { t: $t } = useI18n()
const router = useRouter()
const { cart } = storeToRefs(useCurrentUserStore())
const createAppEventStore = useCreateAppEventStore()

const loading = ref(true)
const saving = ref(false)
const form = ref<GetOrderFormForCartResponse | null>(null)
const answers = ref<FormAnswerInput[]>([])
const issues = ref<FormValidationIssue[]>([])
const alertMessage = ref('')
const isOpenAlert = ref(false)
const openConfirmOrder = ref(false)
const confirmDialogMessage = ref('')
const pendingAttemptId = ref('')

const showAlert = (message: string) => {
  alertMessage.value = message
  isOpenAlert.value = true
}

const cartItem = computed(() =>
  cart.value?.find(
    (item) => item.event.event_id === props.eventId && item.event.community_account === props.communityAccount,
  ),
)
const fields = computed<FormField[]>(() => form.value?.fields ?? [])
const cartItemKey = computed(() =>
  cartItem.value == null ? '' : `${cartItem.value.event.community_id}\0${cartItem.value.event.event_id}`,
)

const needsStripe = computed(() => {
  const item = cartItem.value
  if (item == null) {
    return false
  }
  if (item.event.event_payment === 'user_advance') {
    return computeTotalPayment(item.orders) > 0
  }
  if (item.event.event_payment === 'community_bill' && item.event.community_bill_settings?.type === 'discount') {
    return computeTotalPayment(item.orders) > 0
  }
  return false
})

watch(
  cartItemKey,
  async (_key, _previousKey, onCleanup) => {
    let cancelled = false
    onCleanup(() => {
      cancelled = true
    })
    form.value = null
    answers.value = []
    issues.value = []
    openConfirmOrder.value = false
    pendingAttemptId.value = ''
    isOpenAlert.value = false
    const item = cartItem.value
    if (item == null) {
      loading.value = false
      showAlert($t('cart.form_load_failed'))
      return
    }
    loading.value = true
    try {
      const response = await getOrderFormForCart({
        community_id: item.event.community_id,
        event_id: item.event.event_id,
      })
      if (cancelled) return
      form.value = response.data
      answers.value = response.data.initial_answers ?? []
      if (!response.data.has_form) {
        void router.replace(props.resolveCartPath())
      }
    } catch {
      if (!cancelled) showAlert($t('cart.form_load_failed'))
    } finally {
      if (!cancelled) loading.value = false
    }
  },
  { immediate: true },
)

const getOrderErrorMessage = (error: unknown): string | null => {
  if (error instanceof FirebaseError && error.code === 'functions/failed-precondition') {
    return getUserFacingFailedPreconditionMessage(error.message)
  }
  if (error instanceof Error) {
    return getUserFacingFailedPreconditionMessage(error.message)
  }
  return null
}

const persistAttempt = async (): Promise<string | null> => {
  const key = cartItemKey.value
  const item = cartItem.value
  const current = form.value
  if (item == null || current?.definition_version == null) {
    return null
  }
  const response = await saveOrderFormAttempt({
    community_id: item.event.community_id,
    event_id: item.event.event_id,
    definition_version: current.definition_version,
    answers: answers.value,
  })
  if (cartItemKey.value !== key) return null
  if (response.data.issues != null && response.data.issues.length > 0) {
    issues.value = response.data.issues
    return null
  }
  issues.value = []
  return response.data.attempt_id
}

const startOrder = async (attemptId: string) => {
  const item = cartItem.value
  if (item == null) {
    return
  }
  if (!isWithinOrderDeadline(item.event.event_deadline_datetime)) {
    showAlert($t('cart.cannot_order_deadline'))
    return
  }
  const orderIds = sortOrderIdsForEnterpriseSubsidyReplay(item.orders)
  if (needsStripe.value) {
    try {
      const response = await createStripeCheckoutSession({
        community_id: item.event.community_id,
        event_id: item.event.event_id,
        order_ids: orderIds,
        isPosted: false,
        origin: window.location.origin,
        form_attempt_id: attemptId,
      })
      window.location.href =
        response.data.url ?? props.resolveEventPath(item.event.community_account, item.event.event_id)
    } catch (error) {
      showAlert(getOrderErrorMessage(error) ?? $t('cart.payment_failed'))
    }
    return
  }
  try {
    const eventStore = createAppEventStore(item.event.event_id)
    await eventStore.confirmOrder({
      community_id: item.event.community_id,
      event_id: item.event.event_id,
      order_ids: orderIds,
      form_attempt_id: attemptId,
    })
  } catch (error) {
    showAlert(getOrderErrorMessage(error) ?? $t('cart.order_failed'))
    return
  }
  try {
    await router.push(
      props.resolveOrdersPath({ eventId: item.event.event_id, communityAccount: item.event.community_account }),
    )
  } catch {
    // 注文は確定済み。遷移失敗は注文失敗として扱わない
  }
}

const onPrimary = async () => {
  if (loading.value || saving.value || form.value?.has_form !== true) return
  const key = cartItemKey.value
  saving.value = true
  try {
    const attemptId = await persistAttempt()
    if (cartItemKey.value !== key) return
    if (attemptId == null) {
      if (issues.value.length === 0) {
        showAlert($t('cart.form_save_failed'))
      }
      return
    }
    if (needsStripe.value) {
      await startOrder(attemptId)
      return
    }
    confirmDialogMessage.value =
      cartItem.value?.event.event_payment === 'user_on_day'
        ? $t('cart.confirm_order_participant_on_day')
        : $t('cart.confirm_order_community_bill')
    pendingAttemptId.value = attemptId
    openConfirmOrder.value = true
  } catch (error) {
    if (cartItemKey.value === key) {
      showAlert(getOrderErrorMessage(error) ?? $t('cart.form_save_failed'))
    }
  } finally {
    saving.value = false
  }
}

const confirmOrderNow = async () => {
  if (loading.value || saving.value || pendingAttemptId.value === '') return
  saving.value = true
  try {
    await startOrder(pendingAttemptId.value)
  } finally {
    saving.value = false
    openConfirmOrder.value = false
  }
}
</script>

<template>
  <v-container class="manage-container py-8 cart-form">
    <div class="d-flex align-center ga-3 mb-6">
      <v-avatar color="primary" variant="tonal" rounded="lg" size="48"
        ><v-icon :icon="mdiClipboardTextOutline"
      /></v-avatar>
      <h1 class="text-h5">{{ $t('cart.form_page_title') }}</h1>
    </div>
    <v-progress-linear v-if="loading" indeterminate color="primary" />
    <template v-else-if="form?.has_form">
      <v-sheet v-if="form.purpose != null && form.purpose !== ''" color="surface" border rounded="lg" class="pa-4 mb-6">
        <h2 class="text-subtitle-2 mb-2">{{ $t('manage.forms.purpose') }}</h2>
        <p class="text-body-2 text-medium-emphasis mb-0 cart-form-copy">{{ form.purpose }}</p>
      </v-sheet>
      <FormAnswerFields v-model="answers" :fields="fields" :issues="issues" :disabled="saving || openConfirmOrder" />
      <v-alert v-if="issues.length > 0" type="error" variant="tonal" class="mt-4">{{
        $t('manage.forms.validation.summary')
      }}</v-alert>
      <v-btn
        class="mt-8"
        color="primary"
        size="large"
        block
        :loading="saving"
        :disabled="openConfirmOrder"
        @click="onPrimary"
      >
        {{ needsStripe ? $t('cart.proceed_to_payment') : $t('cart.order_and_attend_event') }}
      </v-btn>
      <v-btn
        class="mt-3"
        variant="text"
        block
        :disabled="saving || openConfirmOrder"
        @click="router.push(resolveCartPath())"
        >{{ $t('cart.back_to_cart') }}</v-btn
      >
    </template>
    <ConfirmDialog v-model="openConfirmOrder" :is-confirm="true" :ok-click="confirmOrderNow" :ok-loading-state="saving">
      {{ confirmDialogMessage }}
    </ConfirmDialog>
    <ConfirmDialog v-model="isOpenAlert" :is-confirm="false">{{ alertMessage }}</ConfirmDialog>
  </v-container>
</template>

<style scoped>
.cart-form {
  max-width: 720px;
}
.cart-form-copy {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
