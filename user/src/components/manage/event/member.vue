<script setup lang="ts">
import UserAvatar from '@shokujii/base/components/UserAvatar.vue'
import EmailDialog from '@shokujii/base/components/EmailDialog.vue'
import { useEventStore, type EventStore } from '@shokujii/base/stores/event.js'
import { useUserStore } from '@shokujii/base/stores/user.js'
import { useCommunityStore } from '@shokujii/base/stores/community.js'
import { useNotification } from '@shokujii/base/composable/notification.js'
import ConfirmDialog from '@shokujii/base/components/ConfirmDialog.vue'
import { useRouter } from 'vue-router'
import { mdiEmailOutline, mdiDownload } from '@mdi/js'
import { getUserPath, getManageCommunitySettingsPath } from '@/router/utils'
import type { EventMemberOrder } from '@shokujii/common/schemas/EventMemberOrder.js'
import {
  buildEventMemberCsv,
  downloadMemberCsv,
  type EventMemberCsvRowInput,
} from '@shokujii/base/composable/memberCsvExport.js'
import { priceString } from '@shokujii/base/schemes/converter'
import type { User } from '@shokujii/common/schemas/User'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { formatOrderMenuDisplayName } from '@shokujii/common/utils/menuOption.js'
import EventFormResponsesPanel from '@shokujii/base/components/manage/event/EventFormResponsesPanel.vue'

const { t: $t } = useI18n()
const route = useRoute()
const eventId = route.params.eventId as string

const notification = useNotification()
const router = useRouter()

const eventStore = useEventStore(eventId) as EventStore
const communityAccount = computed(() => eventStore.event?.community_account ?? '')
const communityStore = computed(() => {
  const account = communityAccount.value
  if (account) {
    return useCommunityStore(account)
  }
  return null
})
const canSendEmail = computed(() => !!communityStore.value?.community?.community_email)
const menus = computed<Array<[EventMemberOrder, User]>>(
  () =>
    eventStore.orders?.flatMap((order) => {
      const user = useUserStore(order.user_id).user
      return user == null ? [] : [[order, user] as [EventMemberOrder, User]]
    }) ?? [],
)
const orderedMenus = computed(() =>
  menus.value.filter(([order]) => order.status === 'ordered').sort(([a], [b]) => a.updated_at - b.updated_at),
)
const processingMenus = computed(() =>
  menus.value
    .filter(([order]) => order.status === 'processing')
    .sort(([a], [b]) => (a.processing_at ?? a.updated_at) - (b.processing_at ?? b.updated_at)),
)
const cartMenus = computed(() =>
  menus.value
    .filter(([order]) => order.status === 'in_cart')
    .sort(([a], [b]) => (a.carted_at ?? 0) - (b.carted_at ?? 0)),
)
const canceledMenus = computed(() =>
  menus.value
    .filter(([order]) => order.status === 'canceled')
    .sort(([a], [b]) => (a.canceled_at ?? 0) - (b.canceled_at ?? 0)),
)
const orderRows = computed(() => [
  ...orderedMenus.value,
  ...processingMenus.value,
  ...cartMenus.value,
  ...canceledMenus.value,
])
const orderStatusCounts = computed(() =>
  (
    [
      { status: 'ordered', count: orderedMenus.value.length },
      { status: 'processing', count: processingMenus.value.length },
      { status: 'in_cart', count: cartMenus.value.length },
      { status: 'canceled', count: canceledMenus.value.length },
    ] satisfies Array<{ status: EventMemberOrder['status']; count: number }>
  ).filter((item) => item.count > 0),
)

const isCommunityBill = computed(() => eventStore.event?.event_payment === 'community_bill')

const targetMember = ref<User | null>(null)
const isEmailDialogOpen = computed({
  get: () => targetMember.value != null,
  set: (val) => {
    if (!val) {
      targetMember.value = null
    }
  },
})
const isOpenEmailSetupDialog = ref(false)
const clickEmailButton = (member: User) => {
  if (!canSendEmail.value) {
    isOpenEmailSetupDialog.value = true
    return
  }
  targetMember.value = member
}
const goToCommunitySettings = () => {
  if (communityAccount.value) {
    router.push(getManageCommunitySettingsPath(communityAccount.value))
  }
}
const onEmailSent = () => {
  notification.show($t('email_dialog.sent'), 'success')
}
const onEmailFailed = () => {
  // エラー通知は EmailDialog 内で表示
}
const orderStatusColor = (status: EventMemberOrder['status']) => (status === 'ordered' ? 'primary' : 'secondary')
const allOrderRows = computed((): EventMemberCsvRowInput[] =>
  orderRows.value.map(([order, member]) => ({
    order,
    member,
    statusLabel: $t(`manage.member.${order.status}`),
  })),
)

const downloadCsvFile = () => {
  const csv = buildEventMemberCsv(allOrderRows.value, {
    includeCommunityBill: isCommunityBill.value,
    statusLabel: $t('manage.member.status'),
    nameLabel: $t('manage.member.name'),
    orderLabel: $t('manage.member.order'),
    optionLabel: $t('manage.member.option'),
    menuPriceLabel: $t('manage.member.menu_price'),
    communityBillOffLabel: $t('manage.member.community_bill_off_amount'),
    dateOrderedLabel: $t('manage.member.date.ordered'),
    emptyDateLabel: $t('manage.member.csv_empty_date'),
    profileLabel: $t('manage.member.csv_profile'),
    tagsLabel: $t('manage.member.csv_tags'),
  })
  downloadMemberCsv('event_member.csv', csv)
}
</script>

<template>
  <v-container class="manage-container">
    <v-row class="justify-center">
      <v-col md="12" sm="12" cols="12" class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div class="d-flex flex-wrap align-center ga-2">
          <h2 class="text-h5 font-weight-bold">{{ $t('manage.member.orders_title') }}</h2>
          <v-chip
            v-for="item in orderStatusCounts"
            :key="item.status"
            :color="orderStatusColor(item.status)"
            size="small"
            variant="tonal"
          >
            {{ $t(`manage.member.${item.status}`) }}
            {{ $t('manage.member.orders_count', { count: item.count }) }}
          </v-chip>
        </div>
        <v-btn variant="outlined" :prepend-icon="mdiDownload" @click="downloadCsvFile">{{
          $t('manage.member.csv_download')
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col md="12" sm="12" cols="12">
        <v-card v-if="orderRows.length === 0">
          <p class="text-body-1 ma-0 px-4 py-4">{{ $t('manage.member.no_member') }}</p>
        </v-card>
        <v-card v-else class="overflow-hidden">
          <v-table>
            <thead>
              <tr>
                <th>#</th>
                <th colspan="2">{{ $t('manage.member.name') }}</th>
                <th>{{ $t('manage.member.order') }}</th>
                <th class="text-right amount-cell">{{ $t('manage.member.menu_price') }}</th>
                <th v-if="isCommunityBill" class="text-right amount-cell">
                  {{ $t('manage.member.community_bill_off_amount') }}
                </th>
                <th>{{ $t('manage.member.status') }}</th>
                <th>{{ $t('manage.member.updated_at') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="([order, member], i) of orderRows" :key="order.order_id">
                <td class="number-cell text-body-2">{{ i + 1 }}</td>
                <td class="minimum-cell">
                  <router-link :to="getUserPath(member.user_id)">
                    <UserAvatar :user="member"></UserAvatar>
                  </router-link>
                </td>
                <td class="name-cell">
                  <router-link :to="getUserPath(member.user_id)" style="color: rgba(var(--v-theme-on-surface))">
                    {{ member.user_name }}
                  </router-link>
                </td>
                <td class="menu-cell text-body-2">
                  {{ formatOrderMenuDisplayName(order.menu_name, order.selected_options) }}
                </td>
                <td class="text-right text-body-2 amount-cell">¥{{ priceString(order.menu_price) }}</td>
                <td v-if="isCommunityBill" class="text-right text-body-2 amount-cell">
                  ¥{{ priceString(order.pay_community_bill_off_amount ?? 0) }}
                </td>
                <td>
                  <v-chip :color="orderStatusColor(order.status)" size="small" variant="tonal">{{
                    $t(`manage.member.${order.status}`)
                  }}</v-chip>
                </td>
                <td class="date-cell text-body-2">
                  {{ convertToDatetime(order.updated_at) }}
                </td>
                <td class="text-center number-cell">
                  <v-btn
                    :icon="mdiEmailOutline"
                    variant="text"
                    size="small"
                    :color="canSendEmail ? undefined : 'grey-400'"
                    @click="clickEmailButton(member)"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <EventFormResponsesPanel
          v-if="eventStore.event != null"
          class="mt-8"
          :event="eventStore.event"
          :resolve-user-path="getUserPath"
        />
      </v-col>
    </v-row>
  </v-container>
  <EmailDialog
    v-if="targetMember != null"
    v-model="isEmailDialogOpen"
    :toUser="targetMember"
    :communityAccount="communityAccount"
    :communityId="communityStore?.community?.community_id ?? ''"
    :eventId="eventId"
    :replyTo="communityStore?.community?.community_email ?? ''"
    @sent="onEmailSent"
    @failed="onEmailFailed"
  />
  <confirm-dialog v-model="isOpenEmailSetupDialog" :ok-text="'OK'" max-width="700px" :ok-click="goToCommunitySettings">
    <v-card-text class="text-center py-10 text-h4">
      {{ $t('manage.letter.email_not_set.title') }}
    </v-card-text>
    <v-card-text class="pb-0" style="line-height: 2.4rem">
      <div v-html="$t('manage.letter.email_not_set.description')" />
    </v-card-text>
  </confirm-dialog>
</template>

<style scoped>
.hidden {
  visibility: hidden; /* サイズは保持されるが内容は非表示 */
}
.number-cell {
  width: 60px;
}
.name-cell {
  width: 250px;
}
.menu-cell {
  width: 300px;
}
.amount-cell {
  width: 120px;
  white-space: nowrap;
}
.date-cell {
  width: 160px;
}
.minimum-cell {
  width: 1px;
  padding: 0 !important;
}
</style>
