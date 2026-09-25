<script setup lang="ts">
import { ref } from 'vue'
import { mdiHelpCircleOutline } from '@mdi/js'

defineProps<{
  note: string
}>()

const isOpen = ref(false)
</script>

<template>
  <v-btn
    :icon="mdiHelpCircleOutline"
    class="pa-0 payment-fee-note-btn"
    color="primary"
    size="small"
    density="compact"
    variant="text"
    :aria-label="$t('payment_fee_note_aria')"
    @click.stop.prevent="isOpen = true"
  />
  <v-dialog v-model="isOpen" max-width="420">
    <v-card class="pa-2">
      <v-card-title class="text-h6 text-wrap">{{ $t('payment_fee_note_title') }}</v-card-title>
      <v-card-text class="text-body-2">{{ note }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="isOpen = false">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.payment-fee-note-btn {
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
