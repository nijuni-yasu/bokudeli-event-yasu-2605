<script setup lang="ts">
import { orderBy } from 'firebase/firestore'
import { useUserListStore } from '@shokujii/base/stores/userList.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import type { User } from '@shokujii/common/schemas/User.js'
import { getUserUrl } from '@/utils/urls'
import { matchesSearch } from '@/utils/search'
import { userInitial } from '@/utils/format'
import SupportPageHeader from '@/components/SupportPageHeader.vue'
import SupportStatusTicket from '@/components/SupportStatusTicket.vue'
import SupportDetailDrawer from '@/components/SupportDetailDrawer.vue'
import SupportDetailField from '@/components/SupportDetailField.vue'

const PAGE_SIZE = 50

const searchQuery = ref('')
const selected = shallowRef<User | null>(null)

const drawerOpen = computed({
  get: () => selected.value != null,
  set: (open: boolean) => {
    if (!open) {
      selected.value = null
    }
  },
})

const userListStore = useUserListStore('support/users', [orderBy('created_at', 'desc')], PAGE_SIZE)

const filteredUsers = computed(() => {
  if (userListStore.users == null) {
    return null
  }
  return userListStore.users.filter((user) =>
    matchesSearch(
      [
        user.user_name,
        user.id,
        user.user_description,
        user.user_sns_twitter,
        user.user_sns_facebook,
        user.user_sns_instagram,
      ],
      searchQuery.value,
    ),
  )
})

const showingCount = computed(() => {
  if (searchQuery.value.trim() === '' || filteredUsers.value == null) {
    return null
  }
  return filteredUsers.value.length
})

const displayName = (user: User): string => (user.user_name.trim() === '' ? '—' : user.user_name)
</script>

<template>
  <div class="support-page">
    <v-card class="support-sheet" elevation="0" rounded="0">
      <SupportPageHeader
        v-model:search="searchQuery"
        :title="$t('users.title')"
        :total-count="userListStore.totalCount"
        :showing-count="showingCount"
      />

      <v-alert v-if="userListStore.loadError" type="error" variant="tonal" class="ma-4">
        {{ $t('common.load_failed') }}
        <v-btn variant="text" size="small" @click="userListStore.reload()">{{ $t('common.retry') }}</v-btn>
      </v-alert>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table">
          <thead>
            <tr>
              <th>{{ $t('users.name') }}</th>
              <th class="text-end">{{ $t('users.participated_event_count') }}</th>
              <th>{{ $t('users.created_at') }}</th>
              <th>{{ $t('users.is_deleted') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers ?? []"
              :key="user.id"
              class="support-row-clickable"
              :class="{ 'support-row--deleted': user.is_deleted }"
              @click="selected = user"
            >
              <td>
                <div class="support-identity">
                  <span class="support-identity__mark">{{ userInitial(user.user_name) }}</span>
                  <span>
                    <span class="support-cell-primary">{{ displayName(user) }}</span>
                    <span class="support-cell-sub support-mono-id" :title="user.id">{{ user.id }}</span>
                  </span>
                </div>
              </td>
              <td class="text-end">{{ user.participated_event_count }}</td>
              <td class="support-table-col-nowrap">{{ convertToDatetime(user.created_at) }}</td>
              <td>
                <SupportStatusTicket
                  v-if="user.is_deleted"
                  :label="$t('users.deleted')"
                  tone="muted"
                />
                <span v-else class="support-cell-sub">{{ $t('common.no') }}</span>
              </td>
            </tr>
            <tr v-if="filteredUsers != null && filteredUsers.length === 0">
              <td colspan="4" class="text-center py-6">
                {{
                  userListStore.users != null && userListStore.users.length > 0
                    ? $t('common.search_no_match')
                    : $t('common.no_data')
                }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div v-if="userListStore.users == null" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate />
      </div>

      <v-card-actions v-if="userListStore.hasMore" class="justify-center">
        <v-btn variant="tonal" @click="userListStore.next()">{{ $t('common.load_more') }}</v-btn>
      </v-card-actions>
    </v-card>

    <SupportDetailDrawer v-model="drawerOpen" :title="selected == null ? $t('users.title') : displayName(selected)">
      <dl v-if="selected != null" class="support-detail-list">
        <SupportDetailField :label="$t('users.mypage')">
          <span class="support-mono-id">{{ selected.id }}</span>
        </SupportDetailField>
        <SupportDetailField :label="$t('users.description')">
          {{ selected.user_description || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('users.sns_twitter')">
          {{ selected.user_sns_twitter || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('users.sns_facebook')">
          {{ selected.user_sns_facebook || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('users.sns_instagram')">
          {{ selected.user_sns_instagram || '—' }}
        </SupportDetailField>
        <SupportDetailField :label="$t('users.participated_event_count')">
          {{ selected.participated_event_count }}
        </SupportDetailField>
        <SupportDetailField :label="$t('users.created_at')">
          {{ convertToDatetime(selected.created_at) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('users.updated_at')">
          {{ convertToDatetime(selected.updated_at) }}
        </SupportDetailField>
        <SupportDetailField :label="$t('users.is_deleted')">
          {{ selected.is_deleted ? $t('common.yes') : $t('common.no') }}
        </SupportDetailField>
      </dl>
      <template #actions>
        <v-btn
          v-if="selected != null"
          variant="tonal"
          :href="getUserUrl(selected.id)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('common.open_external') }}
        </v-btn>
      </template>
    </SupportDetailDrawer>
  </div>
</template>
