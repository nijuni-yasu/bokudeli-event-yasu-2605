<script setup lang="ts">
import CommunityFormEditor from '@shokujii/base/components/manage/community/CommunityFormEditor.vue'
import { getManageCommunityFormsPath } from '@/router/utils'

const route = useRoute()
const formId = computed(() => {
  const value = route.params.formId
  if (typeof value === 'string') {
    return value
  }
  return Array.isArray(value) ? (value[0] ?? '') : ''
})
</script>

<template>
  <CommunityFormEditor :form-id="formId" :resolve-forms-path="getManageCommunityFormsPath" />
</template>

<route lang="yaml">
meta:
  layout: manage
</route>
