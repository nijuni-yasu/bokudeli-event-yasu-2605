<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth'
import UserAvatar from '@shokujii/base/components/UserAvatar.vue'
import { mdiLogout } from '@mdi/js'

const auth = getAuth()
const email = ref<string | null>(auth.currentUser?.email ?? null)

auth.onAuthStateChanged((user) => {
  email.value = user?.email ?? null
})

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <span class="me-4">{{ email }}</span>
    <UserAvatar :user="email" class="cursor-pointer">
      <v-menu activator="parent" width="230" location="bottom end" offset="14px">
        <v-list>
          <v-list-item @click="logout()">
            <template #prepend>
              <v-icon class="me-2" :icon="mdiLogout" size="22" />
            </template>
            <v-list-item-title>{{ $t('logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </UserAvatar>
  </div>
</template>
