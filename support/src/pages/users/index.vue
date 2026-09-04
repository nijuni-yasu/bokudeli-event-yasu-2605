<script setup lang="ts">
import { orderBy } from 'firebase/firestore'
import { useUserListStore } from '@shokujii/base/stores/userList.js'
import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
import { getUserUrl } from '@/utils/urls'
import { mdiOpenInNew } from '@mdi/js'

const PAGE_SIZE = 50

const userListStore = useUserListStore([orderBy('created_at', 'desc')], PAGE_SIZE)
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        {{ $t('users.title') }}
        <v-chip v-if="userListStore.totalCount != null" class="ms-3" size="small">
          {{ $t('common.total_count', { count: userListStore.totalCount }) }}
        </v-chip>
      </v-card-title>

      <div class="support-table-wrap">
        <v-table density="compact" class="support-table text-no-wrap">
          <thead>
            <tr>
              <th>{{ $t('users.name') }}</th>
              <th>{{ $t('users.mypage') }}</th>
              <th>{{ $t('users.description') }}</th>
              <th class="text-end">{{ $t('users.participated_event_count') }}</th>
              <th>{{ $t('users.sns_twitter') }}</th>
              <th>{{ $t('users.sns_facebook') }}</th>
              <th>{{ $t('users.sns_instagram') }}</th>
              <th>{{ $t('users.created_at') }}</th>
              <th>{{ $t('users.updated_at') }}</th>
              <th>{{ $t('users.is_deleted') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userListStore.users ?? []" :key="user.id">
              <td>{{ user.user_name || '—' }}</td>
              <td>
                <a class="support-link" :href="getUserUrl(user.id)" target="_blank" rel="noopener noreferrer">
                  <span class="support-mono-id" :title="user.id">{{ user.id }}</span>
                  <v-icon :icon="mdiOpenInNew" size="14" />
                </a>
              </td>
              <td class="line-clamp-2 text-wrap">{{ user.user_description || '—' }}</td>
              <td class="text-end">{{ user.participated_event_count }}</td>
              <td>{{ user.user_sns_twitter || '—' }}</td>
              <td>{{ user.user_sns_facebook || '—' }}</td>
              <td>{{ user.user_sns_instagram || '—' }}</td>
              <td>{{ convertToDatetime(user.created_at) }}</td>
              <td>{{ convertToDatetime(user.updated_at) }}</td>
              <td>{{ user.is_deleted ? $t('common.yes') : $t('common.no') }}</td>
            </tr>
            <tr v-if="userListStore.users != null && userListStore.users.length === 0">
              <td colspan="10" class="text-center py-6">{{ $t('common.no_data') }}</td>
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
  </div>
</template>
