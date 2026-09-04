<script setup lang="ts">
/**
 * 運営向けステータス切替。確認ダイアログを挟んでから親へ反映する。
 */
const props = defineProps<{
  modelValue: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t: $t } = useI18n()

const dialogOpen = ref(false)
const pendingValue = ref<boolean | null>(null)

const onToggle = (value: boolean | null): void => {
  if (value == null || value === props.modelValue || props.disabled === true) {
    return
  }
  pendingValue.value = value
  dialogOpen.value = true
}

const confirm = (): void => {
  if (pendingValue.value != null) {
    emit('update:modelValue', pendingValue.value)
  }
  dialogOpen.value = false
  pendingValue.value = null
}

const cancel = (): void => {
  dialogOpen.value = false
  pendingValue.value = null
}
</script>

<template>
  <v-switch
    :model-value="modelValue"
    :disabled="disabled"
    density="compact"
    hide-details
    @update:model-value="onToggle"
  />
  <v-dialog v-model="dialogOpen" max-width="480" persistent>
    <v-card class="pa-4">
      <v-card-title class="text-h6">{{ $t('confirm.status_change_title') }}</v-card-title>
      <v-card-text>{{ $t('confirm.status_change_body') }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">{{ $t('confirm.cancel') }}</v-btn>
        <v-btn color="primary" variant="flat" @click="confirm">{{ $t('confirm.ok') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
