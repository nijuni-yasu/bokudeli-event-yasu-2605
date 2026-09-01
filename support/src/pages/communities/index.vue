<script setup lang="ts">
import { orderBy } from 'firebase/firestore'
import { useCommunityListStore } from '@shokujii/base/stores/communityList.js'
import { updateCommunityStatus, type BokudeliCommunity } from '@shokujii/base/stores/community.js'
import { countCommunityMembers, countEventsByCommunityId } from '@shokujii/base/stores/supportCounts.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getCommunityUrl } from '@/utils/urls'
import type { Notification } from '@shokujii/base/types/index.js'
import { mdiOpenInNew } from '@mdi/js'

const PAGE_SIZE = 30

const { t: $t } = useI18n()
const notification = inject<Notification>('notification')

// 運営はテナント横断で全コミュニティを見るため、enterprise_id を絞らずに呼ぶ（Rules の isSupport() で許可）
const communityListStore = useCommunityListStore([orderBy('created_at', 'desc')], PAGE_SIZE, { lightweight: true })

const communities = computed(() => communityListStore.communities)

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
    communityListStore.reload()
  } finally {
    const next = new Set(updating.value)
    next.delete(community.community_id)
    updating.value = next
  }
}

const hasMore = computed(
  () => communityListStore.totalCount != null && (communities.value?.length ?? 0) < communityListStore.totalCount,
)
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        {{ $t('communities.title') }}
        <v-chip v-if="communityListStore.totalCount != null" class="ms-3" size="small">
          {{ $t('common.total_count', { count: communityListStore.totalCount }) }}
        </v-chip>
      </v-card-title>

      <v-table density="compact" class="text-no-wrap">
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
              <a :href="getCommunityUrl(community.community_account)" target="_blank" rel="noopener noreferrer">
                {{ community.community_name }}
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
              <div>{{ community.community_email }}</div>
            </td>
            <td class="text-wrap">{{ community.community_use_purpose }}</td>
            <td>
              <div>{{ convertToDatetime(community.created_at) }}</div>
              <div>{{ convertToDatetime(community.updated_at) }}</div>
            </td>
            <td>
              <v-switch
                :model-value="community.is_public"
                :label="community.is_public ? $t('communities.is_public_on') : $t('communities.is_public_off')"
                :disabled="updating.has(community.community_id)"
                density="compact"
                hide-details
                @update:model-value="(value) => changeStatus(community, { is_public: value === true })"
              />
            </td>
            <td>
              <v-switch
                :model-value="community.is_approved"
                :label="community.is_approved ? $t('communities.is_approved_on') : $t('communities.is_approved_off')"
                :disabled="updating.has(community.community_id)"
                density="compact"
                hide-details
                @update:model-value="(value) => changeStatus(community, { is_approved: value === true })"
              />
            </td>
          </tr>
          <tr v-if="communities != null && communities.length === 0">
            <td colspan="10" class="text-center py-6">{{ $t('common.no_data') }}</td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="communities == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>

      <v-card-actions v-if="hasMore" class="justify-center">
        <v-btn variant="tonal" @click="communityListStore.next()">{{ $t('common.load_more') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
