<script setup lang="ts">
import CommunityFormEditor from '@shokujii/base/components/manage/community/CommunityFormEditor.vue'
import { getManageCommunityFormsPath } from '@/router/utils'
</script>

<template>
  <CommunityFormEditor :resolve-forms-path="getManageCommunityFormsPath" />
</template>

<route lang="yaml">
meta:
  layout: manage
</route>
