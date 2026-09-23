<script setup lang="ts">
/**
 * 運営向けステータス切替。確認ダイアログを挟んでから親へ反映する。
 */
const props = defineProps<{
  modelValue: boolean
  disabled?: boolean
  onLabel: string
  offLabel: string
  tone?: 'live' | 'pending'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t: $t } = useI18n()

const dialogOpen = ref(false)
const pendingValue = ref<boolean | null>(null)

const pillClass = computed(() => {
  if (!props.modelValue) {
    return props.tone === 'pending' ? 'support-status-pill--pending' : 'support-status-pill--off'
  }
  return 'support-status-pill--live'
})

const onToggle = (): void => {
  if (props.disabled === true) {
    return
  }
  pendingValue.value = !props.modelValue
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
  <button type="button" class="support-status-pill" :class="pillClass" :disabled="disabled" @click.stop="onToggle">
    {{ modelValue ? onLabel : offLabel }}
  </button>
  <v-dialog v-model="dialogOpen" max-width="480" persistent>
    <v-card class="pa-4 support-sheet" elevation="0">
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
