<script setup lang="ts">
import CommunityFormEditor from '@shokujii/base/components/manage/community/CommunityFormEditor.vue'
import { getManageCommunityFormsPath } from '@/router/utils'

const formId = useRoute().params.formId as string
</script>

<template>
  <CommunityFormEditor :form-id="formId" :resolve-forms-path="getManageCommunityFormsPath" />
</template>

<route lang="yaml">
meta:
  layout: manage
</route>
