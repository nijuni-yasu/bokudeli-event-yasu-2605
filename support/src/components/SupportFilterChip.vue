<script setup lang="ts">
defineProps<{
  label: string
}>()

const router = useRouter()

const clearFilter = (): void => {
  router.replace({ query: {} })
}
</script>

<template>
  <v-chip class="ms-2" size="small" color="primary" variant="tonal" closable @click:close="clearFilter">
    {{ label }}
  </v-chip>
</template>
