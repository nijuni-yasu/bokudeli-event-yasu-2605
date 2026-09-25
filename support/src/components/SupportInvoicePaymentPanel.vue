<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import type { BokudeliEvent } from '@shokujii/base/stores/event.js'
import { getEventInvoicePayment, updateEventInvoicePaymentStatus } from '@shokujii/base/stores/eventInvoicePayment.js'
import {
  type CommunityBillPaymentStatusType,
  type EventInvoicePayment,
} from '@shokujii/common/schemas/EventInvoicePayment.js'
import { convertToDate, convertToDatetime, getLastDayOfNextMonth } from '@shokujii/common/utils/datetime.js'
import { getInvoiceReminderBlockReason, isInvoiceReminderOnCooldown } from '@shokujii/common/utils/invoicePayment.js'
import { resendCommunityBillInvoiceMail } from '@shokujii/base/apis/communityBillInvoice.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'
import SupportStatusTicket from '@/components/SupportStatusTicket.vue'
import SupportDetailField from '@/components/SupportDetailField.vue'
import { invoicePaymentTicketTone } from '@/utils/statusColors'
import type { Notification } from '@shokujii/base/types/index.js'

const props = defineProps<{
  event: BokudeliEvent
}>()

const emit = defineEmits<{
  updated: [payment: EventInvoicePayment, communityId: string, eventId: string]
}>()

const { t: $t } = useI18n()
const notification = inject<Notification>('notification')

const STATUSES: CommunityBillPaymentStatusType[] = ['unconfirmed', 'unpaid', 'paid']

const payment = shallowRef<EventInvoicePayment | undefined>(undefined)
const loaded = ref(false)
const loadError = ref(false)
const memoDraft = ref('')
const saving = ref(false)
const sending = ref(false)
const reminderOpen = ref(false)
const reminderChecked = ref(false)
const pendingStatus = ref<CommunityBillPaymentStatusType | null>(null)
const statusDialogOpen = ref(false)
const nowTick = ref(Date.now())
const REMINDER_NOW_TICK_MS = 30_000
let nowTickTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  nowTickTimer = setInterval(() => {
    nowTick.value = Date.now()
  }, REMINDER_NOW_TICK_MS)
})

onUnmounted(() => {
  if (nowTickTimer != null) {
    clearInterval(nowTickTimer)
  }
})

const displayStatus = computed<CommunityBillPaymentStatusType>(() => payment.value?.status ?? 'unconfirmed')

const paymentDeadline = computed(() => convertToDate(getLastDayOfNextMonth(props.event.event_end_datetime)))

const reminderBlock = computed(() =>
  getInvoiceReminderBlockReason({
    eventPayment: props.event.event_payment,
    status: displayStatus.value,
    billEmail: props.event.bill_email,
    eventStartDatetime: props.event.event_start_datetime,
    lastMailSentAt: payment.value?.last_mail_sent_at,
    now: nowTick.value,
  }),
)

const reminderOnCooldown = computed(() => isInvoiceReminderOnCooldown(payment.value?.last_mail_sent_at, nowTick.value))

const isCurrentEvent = (communityId: string, eventId: string): boolean =>
  props.event.community_id === communityId && props.event.event_id === eventId

const loadPayment = async (): Promise<void> => {
  const communityId = props.event.community_id
  const eventId = props.event.event_id
  loaded.value = false
  loadError.value = false
  try {
    const next = await getEventInvoicePayment(communityId, eventId)
    if (!isCurrentEvent(communityId, eventId)) {
      return
    }
    payment.value = next
    memoDraft.value = next?.memo ?? ''
  } catch (error) {
    if (!isCurrentEvent(communityId, eventId)) {
      return
    }
    console.warn(error)
    reportClientError(error, { componentInfo: 'SupportInvoicePaymentPanel.loadPayment', severity: 'warn' })
    payment.value = undefined
    memoDraft.value = ''
    loadError.value = true
  } finally {
    if (isCurrentEvent(communityId, eventId)) {
      loaded.value = true
    }
  }
}

watch(
  () => [props.event.community_id, props.event.event_id],
  () => {
    reminderOpen.value = false
    statusDialogOpen.value = false
    reminderChecked.value = false
    pendingStatus.value = null
    saving.value = false
    sending.value = false
    void loadPayment()
  },
  { immediate: true },
)

const requireUid = (): string => {
  const uid = getAuth().currentUser?.uid
  if (uid == null) {
    throw new Error('unauthenticated')
  }
  return uid
}

const persist = async (
  communityId: string,
  eventId: string,
  status: CommunityBillPaymentStatusType,
  memo: string,
): Promise<void> => {
  if (isCurrentEvent(communityId, eventId) && loadError.value) {
    return
  }
  saving.value = true
  try {
    const next = await updateEventInvoicePaymentStatus(communityId, eventId, requireUid(), {
      status,
      memo,
    })
    emit('updated', next, communityId, eventId)
    if (!isCurrentEvent(communityId, eventId)) {
      return
    }
    payment.value = next
    memoDraft.value = next.memo ?? ''
    if (notification != null) {
      notification.message = $t('common.updated')
      notification.color = 'success'
    }
  } catch (error) {
    console.error(error)
    reportClientError(error, { componentInfo: 'SupportInvoicePaymentPanel.persist' })
    if (isCurrentEvent(communityId, eventId) && notification != null) {
      notification.message = $t('common.update_failed')
      notification.color = 'error'
    }
  } finally {
    if (isCurrentEvent(communityId, eventId)) {
      saving.value = false
    }
  }
}

const requestStatusChange = (status: CommunityBillPaymentStatusType): void => {
  if (loadError.value || status === displayStatus.value || saving.value) {
    return
  }
  pendingStatus.value = status
  statusDialogOpen.value = true
}

const confirmStatusChange = async (): Promise<void> => {
  const status = pendingStatus.value
  const communityId = props.event.community_id
  const eventId = props.event.event_id
  const memo = memoDraft.value
  statusDialogOpen.value = false
  pendingStatus.value = null
  if (status == null) {
    return
  }
  await persist(communityId, eventId, status, memo)
}

const saveMemo = async (): Promise<void> => {
  await persist(props.event.community_id, props.event.event_id, displayStatus.value, memoDraft.value)
}

const openReminder = (): void => {
  nowTick.value = Date.now()
  if (reminderBlock.value != null) {
    return
  }
  reminderChecked.value = false
  reminderOpen.value = true
}

const sendReminder = async (): Promise<void> => {
  nowTick.value = Date.now()
  if (!reminderChecked.value || reminderOnCooldown.value || sending.value) {
    return
  }
  const communityId = props.event.community_id
  const eventId = props.event.event_id
  sending.value = true
  try {
    const result = await resendCommunityBillInvoiceMail({
      communityId,
      eventId,
    })
    if (isCurrentEvent(communityId, eventId)) {
      reminderOpen.value = false
      nowTick.value = Date.now()
      if (notification != null) {
        notification.message = $t('invoices.reminder_sent', { email: result.data.to })
        notification.color = 'success'
      }
    }
    try {
      const recorded = await getEventInvoicePayment(communityId, eventId)
      if (recorded != null) {
        emit('updated', recorded, communityId, eventId)
        if (isCurrentEvent(communityId, eventId)) {
          payment.value = recorded
          memoDraft.value = recorded.memo ?? ''
        }
      }
    } catch (refreshError) {
      console.warn(refreshError)
      reportClientError(refreshError, {
        componentInfo: 'SupportInvoicePaymentPanel.sendReminder.refresh',
        severity: 'warn',
      })
      if (isCurrentEvent(communityId, eventId) && notification != null) {
        notification.message = $t('common.update_failed')
        notification.color = 'error'
      }
    }
  } catch (error) {
    console.error(error)
    reportClientError(error, { componentInfo: 'SupportInvoicePaymentPanel.sendReminder' })
    if (isCurrentEvent(communityId, eventId) && notification != null) {
      notification.message = $t('invoices.reminder_failed')
      notification.color = 'error'
    }
  } finally {
    if (isCurrentEvent(communityId, eventId)) {
      sending.value = false
    }
  }
}
</script>

<template>
  <div>
    <SupportDetailField :label="$t('invoices.payment')">
      <div v-if="!loaded" class="d-flex py-1">
        <v-progress-circular indeterminate size="16" width="2" />
      </div>
      <div v-else-if="loadError" class="d-flex flex-column align-start ga-2">
        <span class="text-medium-emphasis">{{ $t('common.load_failed') }}</span>
        <v-btn size="small" variant="tonal" @click.stop="loadPayment">{{ $t('common.retry') }}</v-btn>
      </div>
      <div v-else class="d-flex flex-wrap ga-2">
        <v-btn
          v-for="status in STATUSES"
          :key="status"
          size="small"
          variant="text"
          class="pa-0"
          :disabled="saving"
          @click.stop="requestStatusChange(status)"
        >
          <SupportStatusTicket
            :label="$t(`invoice_payment_status.${status}`)"
            :tone="displayStatus === status ? invoicePaymentTicketTone(status) : 'muted'"
          />
        </v-btn>
      </div>
    </SupportDetailField>

    <SupportDetailField :label="$t('invoices.memo')">
      <v-textarea
        v-model="memoDraft"
        :placeholder="$t('invoices.memo_placeholder')"
        density="compact"
        variant="outlined"
        rows="3"
        hide-details
        :disabled="saving || !loaded || loadError"
        @click.stop
      />
      <v-btn
        class="mt-2"
        size="small"
        variant="tonal"
        :disabled="saving || !loaded || loadError"
        @click.stop="saveMemo"
      >
        {{ $t('invoices.save_memo') }}
      </v-btn>
    </SupportDetailField>

    <SupportDetailField v-if="displayStatus === 'unpaid'" :label="$t('invoices.reminder')">
      <div v-if="!props.event.bill_email?.trim()" class="text-medium-emphasis">
        {{ $t('invoices.bill_email_missing') }}
      </div>
      <template v-else>
        <div v-if="payment?.last_mail_sent_at != null" class="support-cell-sub mb-2">
          {{ $t('invoices.reminder_last_sent') }}: {{ convertToDatetime(payment.last_mail_sent_at) }}
        </div>
        <v-btn color="warning" variant="tonal" :disabled="reminderBlock != null || sending" @click.stop="openReminder">
          {{ $t('invoices.reminder') }}
        </v-btn>
        <div v-if="reminderOnCooldown" class="support-cell-sub mt-2">
          {{ $t('invoices.reminder_cooldown') }}
        </div>
      </template>
    </SupportDetailField>

    <v-dialog v-model="statusDialogOpen" max-width="480" persistent>
      <v-card class="pa-4 support-sheet" elevation="0">
        <v-card-title class="text-h6">{{ $t('confirm.invoice_status_title') }}</v-card-title>
        <v-card-text>
          {{ $t('confirm.invoice_status_body') }}
          <div v-if="pendingStatus != null" class="mt-3">
            <SupportStatusTicket
              :label="$t(`invoice_payment_status.${pendingStatus}`)"
              :tone="invoicePaymentTicketTone(pendingStatus)"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="statusDialogOpen = false">{{ $t('confirm.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="confirmStatusChange">
            {{ $t('confirm.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="reminderOpen" max-width="520" persistent>
      <v-card class="pa-4 support-sheet" elevation="0">
        <v-card-title class="text-h6">{{ $t('invoices.reminder_title') }}</v-card-title>
        <v-card-text>
          <dl class="support-detail-list">
            <SupportDetailField :label="$t('events.event_name')">{{ event.event_name }}</SupportDetailField>
            <SupportDetailField :label="$t('events.community_name')">{{ event.community_name }}</SupportDetailField>
            <SupportDetailField :label="$t('invoices.reminder_to')">
              {{ event.bill_email }}
            </SupportDetailField>
            <SupportDetailField v-if="event.organizer_email?.trim()" :label="$t('invoices.reminder_cc')">
              {{ event.organizer_email }}
            </SupportDetailField>
            <SupportDetailField :label="$t('invoices.reminder_deadline')">
              {{ paymentDeadline }}
            </SupportDetailField>
          </dl>
          <v-checkbox
            v-model="reminderChecked"
            :label="$t('invoices.reminder_confirm')"
            hide-details
            density="compact"
            class="mt-4"
            @click.stop
          />
          <div v-if="reminderOnCooldown" class="text-warning mt-2">
            {{ $t('invoices.reminder_cooldown') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="reminderOpen = false">{{ $t('confirm.cancel') }}</v-btn>
          <v-btn
            color="warning"
            variant="flat"
            :disabled="!reminderChecked || reminderOnCooldown"
            :loading="sending"
            @click="sendReminder"
          >
            {{ $t('invoices.reminder') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
