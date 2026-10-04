<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiHelpCircleOutline } from '@mdi/js'
import type { CommunityBillSettingsType } from '@shokujii/common/schemas/Event.js'

const props = defineProps<{
  settings: CommunityBillSettingsType
}>()

const { t: $t } = useI18n()
const isOpen = ref(false)

const note = computed((): string => {
  if (props.settings.type === 'discount') {
    return $t('discount_settings.banner_discount', [props.settings.off_amount])
  }
  return $t('discount_settings.banner_free')
})
</script>

<template>
  <v-btn
    :icon="mdiHelpCircleOutline"
    class="pa-0 community-bill-help-btn"
    color="primary"
    size="small"
    density="compact"
    variant="text"
    :aria-label="$t('discount_settings.help_aria')"
    @click.stop.prevent="isOpen = true"
  />
  <v-dialog v-model="isOpen" max-width="420">
    <v-card class="pa-2">
      <v-card-title class="text-h6 text-wrap">{{ $t('discount_settings.help_title') }}</v-card-title>
      <v-card-text class="text-body-2 text-wrap">{{ note }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="isOpen = false">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.community-bill-help-btn {
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
