<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useCommunityListStore, type CommunityListStore } from '@shokujii/base/stores/communityList.js'
import { updateCommunityStatus, type BokudeliCommunity } from '@shokujii/base/stores/community.js'
import { countCommunityMembers, countEventsByCommunityId } from '@shokujii/base/stores/supportCounts.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getCommunityUrl } from '@/utils/urls'
import ConfirmSwitch from '@/components/ConfirmSwitch.vue'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import SupportPageHeader from '@/components/SupportPageHeader.vue'
import SupportDetailDrawer from '@/components/SupportDetailDrawer.vue'
import SupportDetailField from '@/components/SupportDetailField.vue'
import SupportExternalLink from '@/components/SupportExternalLink.vue'
import type { Notification } from '@shokujii/base/types/index.js'
import { matchesSearch } from '@/utils/search'
import { isQueryFlagActive, withQueryFlag } from '@/utils/queryFlag'

const PAGE_SIZE = 30
const route = useRoute()
const router = useRouter()

const { t: $t } = useI18n()
const notification = inject<Notification>('notification')

const searchQuery = ref('')
const selected = shallowRef<BokudeliCommunity | null>(null)

const drawerOpen = computed({
  get: () => selected.value != null,
  set: (open: boolean) => {
    if (!open) {
      selected.value = null
    }
  },
})

const buildFilters = (): QueryConstraint[] => {
  const filters: QueryConstraint[] = [orderBy('created_at', 'desc')]
  if (isQueryFlagActive(route.query.is_approved, 'false')) {
    filters.unshift(where('is_approved', '==', false))
  }
  return filters
}

const communityListStore = shallowRef<CommunityListStore>(
  useCommunityListStore(buildFilters(), PAGE_SIZE, { lightweight: true }),
)

watch(
  () => route.query.is_approved,
  () => {
    counts.value = new Map()
    communityListStore.value = useCommunityListStore(buildFilters(), PAGE_SIZE, { lightweight: true })
  },
)

const showPendingFilter = computed(() => isQueryFlagActive(route.query.is_approved, 'false'))

const communities = computed(() => communityListStore.value.communities)

const filteredCommunities = computed(() => {
  if (communities.value == null) {
    return null
  }
  return communities.value.filter((community) =>
    matchesSearch(
      [
        community.community_name,
        community.community_account,
        community.community_company,
        community.community_manager_fullname,
        community.community_email,
        community.community_phone,
      ],
      searchQuery.value,
    ),
  )
})

const showingCount = computed(() => {
  if (searchQuery.value.trim() === '' || filteredCommunities.value == null) {
    return null
  }
  return filteredCommunities.value.length
})

type CommunityCounts = { members: number; events: number }
const counts = ref<Map<string, CommunityCounts>>(new Map())

watch(
  communities,
  async (list) => {
    if (list == null) {
      return
    }
    const unresolved = list.filter((community) => !counts.value.has(community.community_id))
    if (unresolved.length === 0) {
      return
    }
    const results = await Promise.all(
      unresolved.map(async (community) => {
        try {
          const [members, events] = await Promise.all([
            countCommunityMembers(community.community_id),
            countEventsByCommunityId(community.community_id),
          ])
          return [community.community_id, { members, events }] as const
        } catch (error) {
          console.warn(error)
          return null
        }
      }),
    )
    const next = new Map(counts.value)
    for (const result of results) {
      if (result != null) {
        next.set(result[0], result[1])
      }
    }
    counts.value = next
  },
  { immediate: true },
)

const updating = ref<Set<string>>(new Set())

const changeStatus = async (
  community: BokudeliCommunity,
  status: { is_public?: boolean; is_approved?: boolean },
): Promise<void> => {
  updating.value = new Set(updating.value).add(community.community_id)
  try {
    await updateCommunityStatus(community.community_id, status)
    if (notification != null) {
      notification.message = $t('common.updated')
      notification.color = 'success'
    }
  } catch (error) {
    console.error(error)
    if (notification != null) {
      notification.message = $t('common.update_failed')
      notification.color = 'error'
    }
    communityListStore.value.reload()
  } finally {
    const next = new Set(updating.value)
    next.delete(community.community_id)
    updating.value = next
  }
}

const hasMore = computed(
  () =>
    communityListStore.value.totalCount != null &&
    (communities.value?.length ?? 0) < communityListStore.value.totalCount,
)

const setPendingFilter = (active: boolean): void => {
  void router.replace({ query: withQueryFlag(route.query, 'is_approved', 'false', active) })
}
</script>

<template>
  <div class="support-page">
    <v-card class="support-sheet" elevation="0" rounded="0">
      <SupportPageHeader
        v-model:search="searchQuery"
        :title="$t('communities.title')"
        :total-count="communityListStore.totalCount"
        :showing-count="showingCount"
      >
        <template #filters>
          <SupportFilterChip
            :active="showPendingFilter"
            :label="$t('filter.pending_approval')"
            @update:active="setPendingFilter"
          />
        </template>
      </SupportPageHeader>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table">
          <thead>
            <tr>
              <th>{{ $t('communities.name') }}</th>
              <th>{{ $t('communities.company') }}</th>
              <th class="text-end">{{ $t('communities.num_members') }}</th>
              <th class="text-end">{{ $t('communities.num_events') }}</th>
              <th>{{ $t('communities.created_at') }}</th>
              <th>{{ $t('communities.is_public') }}</th>
              <th>{{ $t('communities.is_approved') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="community in filteredCommunities ?? []"
              :key="community.community_id"
              class="support-row-clickable"
              :class="{ 'support-row--pending': !community.is_approved }"
              @click="selected = community"
            >
              <td>
                <SupportExternalLink
                  :href="getCommunityUrl(community.community_account)"
                  :label="community.community_name"
                />
                <div class="support-cell-sub">{{ community.community_account }}</div>
              </td>
              <td>
                <div class="support-cell-primary">{{ community.community_company }}</div>
                <div class="support-cell-sub">{{ community.community_manager_fullname }}</div>
              </td>
              <td class="text-end">{{ counts.get(community.community_id)?.members ?? '-' }}</td>
              <td class="text-end">{{ counts.get(community.community_id)?.events ?? '-' }}</td>
              <td class="support-table-col-nowrap">{{ convertToDatetime(community.created_at) }}</td>
              <td>
                <ConfirmSwitch
                  :model-value="community.is_public"
                  :on-label="$t('communities.is_public_on')"
                  :off-label="$t('communities.is_public_off')"
                  :disabled="updating.has(community.community_id)"
                  @update:model-value="(value) => changeStatus(community, { is_public: value })"
                />
              </td>
              <td>
                <ConfirmSwitch
                  :model-value="community.is_approved"
                  :on-label="$t('communities.is_approved_on')"
                  :off-label="$t('communities.is_approved_off')"
                  tone="pending"
                  :disabled="updating.has(community.community_id)"
                  @update:model-value="(value) => changeStatus(community, { is_approved: value })"
                />
              </td>
            </tr>
            <tr v-if="filteredCommunities != null && filteredCommunities.length === 0">
              <td colspan="7" class="text-center py-6">
                {{
                  communities != null && communities.length > 0 ? $t('common.search_no_match') : $t('common.no_data')
                }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div v-if="communities == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>

      <v-card-actions v-if="hasMore" class="justify-center">
        <v-btn variant="tonal" @click="communityListStore.next()">{{ $t('common.load_more') }}</v-btn>
      </v-card-actions>
    </v-card>

    <SupportDetailDrawer v-model="drawerOpen" :title="selected?.community_name ?? $t('communities.title')">
      <dl v-if="selected != null" class="support-detail-list">
        <SupportDetailField :label="$t('communities.account')">
          {{ selected.community_account }}
        </SupportDetailField>
        <SupportDetailField :label="$t('communities.company')">
          {{ selected.community_company }} / {{ selected.community_manager_fullname }}
        </SupportDetailField>
        <SupportDetailField :label="$t('communities.contact')">
          <div>{{ selected.community_postalcode }} {{ selected.fullAddress }}</div>
          <div>{{ selected.community_phone }}</div>
          <div>{{ selected.community_email }}</div>
        </SupportDetailField>
        <SupportDetailField :label="$t('communities.officialsite')">
          {{ selected.community_sns_officialsite || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('communities.use_purpose')">
          {{ selected.community_use_purpose || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('communities.created_at')">
          {{ convertToDatetime(selected.created_at) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('communities.updated_at')">
          {{ convertToDatetime(selected.updated_at) }}
        </SupportDetailField>
      </dl>
      <template #actions>
        <v-btn
          v-if="selected != null"
          variant="tonal"
          :href="getCommunityUrl(selected.community_account)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('common.open_external') }}
        </v-btn>
      </template>
    </SupportDetailDrawer>
  </div>
</template>
