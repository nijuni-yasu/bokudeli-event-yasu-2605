<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="support-detail-field">
    <dt>{{ label }}</dt>
    <dd><slot /></dd>
  </div>
</template>
