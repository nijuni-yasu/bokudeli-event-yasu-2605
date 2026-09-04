<script setup lang="ts">
import { useRoute } from 'vue-router'
import Error from '@shokujii/base/components/Error.vue'
import { parseErrorCodeFromRoute } from '@/router/utils'

const route = useRoute()
const errorCode = computed(() => parseErrorCodeFromRoute(route.path, route.params.error) ?? '404')
</script>

<template>
  <Error :code="errorCode" />
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
