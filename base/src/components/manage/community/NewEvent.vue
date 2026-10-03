<script setup lang="ts">
import EventEdit from '@shokujii/base/components/EventEdit.vue'
import type { ResolveManageCommunityFormsPathFn } from '@shokujii/base/types/profilePathResolvers.js'
import { getEventPath } from '@/router/utils'

const props = defineProps<{
  resolveFormsPath: ResolveManageCommunityFormsPathFn
}>()

const route = useRoute()
const router = useRouter()

const communityAccount = route.params.communityAccount as string

const updated = (eventId: string) => {
  router.push(getEventPath(communityAccount, eventId))
}
</script>

<template>
  <v-container class="manage-container">
    <v-row class="justify-center">
      <v-col md="12" sm="12" cols="12">
        <EventEdit
          :community-account="communityAccount"
          :resolve-forms-path="props.resolveFormsPath"
          @updated="updated"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
