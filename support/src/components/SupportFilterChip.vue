<script setup lang="ts">
const props = defineProps<{
  label: string
  active: boolean
}>()

const emit = defineEmits<{
  'update:active': [value: boolean]
}>()

const toggle = (): void => {
  emit('update:active', !props.active)
}
</script>

<template>
  <v-chip
    size="small"
    :variant="active ? 'flat' : 'outlined'"
    :color="active ? 'warning' : undefined"
    :closable="active"
    @click="toggle"
    @click:close.stop="emit('update:active', false)"
  >
    {{ label }}
  </v-chip>
</template>
