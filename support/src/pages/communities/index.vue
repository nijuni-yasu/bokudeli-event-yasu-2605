<script setup lang="ts">
import { orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { useCommunityListStore, type CommunityListStore } from '@shokujii/base/stores/communityList.js'
import { updateCommunityStatus, type BokudeliCommunity } from '@shokujii/base/stores/community.js'
import { countCommunityMembers, countEventsByCommunityId } from '@shokujii/base/stores/supportCounts.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getCommunityUrl } from '@/utils/urls'
import ConfirmSwitch from '@/components/ConfirmSwitch.vue'
import SupportFilterChip from '@/components/SupportFilterChip.vue'
import type { Notification } from '@shokujii/base/types/index.js'
import { mdiOpenInNew } from '@mdi/js'

const PAGE_SIZE = 30
const route = useRoute()

const { t: $t } = useI18n()
const notification = inject<Notification>('notification')

const buildFilters = (): QueryConstraint[] => {
  const filters: QueryConstraint[] = [orderBy('created_at', 'desc')]
  if (route.query.is_approved === 'false') {
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

const showPendingFilter = computed(() => route.query.is_approved === 'false')

const communities = computed(() => communityListStore.value.communities)

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
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center flex-wrap gap-2">
        {{ $t('communities.title') }}
        <v-chip v-if="communityListStore.totalCount != null" size="small">
          {{ $t('common.total_count', { count: communityListStore.totalCount }) }}
        </v-chip>
        <SupportFilterChip v-if="showPendingFilter" :label="$t('filter.pending_approval')" />
      </v-card-title>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table text-no-wrap">
          <thead>
            <tr>
              <th>{{ $t('communities.account') }}</th>
              <th>{{ $t('communities.name') }}</th>
              <th>{{ $t('communities.company') }}</th>
              <th class="text-end">{{ $t('communities.num_members') }}</th>
              <th class="text-end">{{ $t('communities.num_events') }}</th>
              <th>{{ $t('communities.contact') }}</th>
              <th>{{ $t('communities.use_purpose') }}</th>
              <th>{{ $t('communities.created_at') }}</th>
              <th>{{ $t('communities.is_public') }}</th>
              <th>{{ $t('communities.is_approved') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="community in communities ?? []" :key="community.community_id">
              <td>{{ community.community_account }}</td>
              <td>
                <a
                  class="support-link"
                  :href="getCommunityUrl(community.community_account)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="line-clamp-2 d-inline-block">{{ community.community_name }}</span>
                  <v-icon :icon="mdiOpenInNew" size="14" />
                </a>
              </td>
              <td>
                <div>{{ community.community_company }}</div>
                <div>{{ community.community_manager_fullname }}</div>
              </td>
              <td class="text-end">{{ counts.get(community.community_id)?.members ?? '-' }}</td>
              <td class="text-end">{{ counts.get(community.community_id)?.events ?? '-' }}</td>
              <td class="text-wrap">
                <div>{{ community.community_postalcode }} {{ community.fullAddress }}</div>
                <div>{{ community.community_phone }}</div>
                <div class="support-mono-id">{{ community.community_email }}</div>
              </td>
              <td class="text-wrap">
                <span class="line-clamp-3 d-block">{{ community.community_use_purpose || '—' }}</span>
              </td>
              <td>
                <div>{{ convertToDatetime(community.created_at) }}</div>
                <div>{{ convertToDatetime(community.updated_at) }}</div>
              </td>
              <td>
                <div class="text-caption text-medium-emphasis mb-1">
                  {{ community.is_public ? $t('communities.is_public_on') : $t('communities.is_public_off') }}
                </div>
                <ConfirmSwitch
                  :model-value="community.is_public"
                  :disabled="updating.has(community.community_id)"
                  @update:model-value="(value) => changeStatus(community, { is_public: value })"
                />
              </td>
              <td>
                <div class="text-caption text-medium-emphasis mb-1">
                  {{ community.is_approved ? $t('communities.is_approved_on') : $t('communities.is_approved_off') }}
                </div>
                <ConfirmSwitch
                  :model-value="community.is_approved"
                  :disabled="updating.has(community.community_id)"
                  @update:model-value="(value) => changeStatus(community, { is_approved: value })"
                />
              </td>
            </tr>
            <tr v-if="communities != null && communities.length === 0">
              <td colspan="10" class="text-center py-6">{{ $t('common.no_data') }}</td>
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
  </div>
</template>
