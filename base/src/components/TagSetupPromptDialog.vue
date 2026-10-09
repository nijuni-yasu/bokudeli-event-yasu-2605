<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { mdiTagOutline } from '@mdi/js'

const model = defineModel<boolean>({ required: true })

defineEmits<{
  confirm: []
}>()

const { t: $t } = useI18n()
const { smAndDown } = useDisplay()
</script>

<template>
  <v-dialog v-model="model" max-width="480" :fullscreen="smAndDown" transition="dialog-bottom-transition">
    <v-card class="tag-setup-prompt-dialog pa-sm-9 pa-5">
      <v-card-item class="text-center pb-2 px-0">
        <v-icon :icon="mdiTagOutline" color="primary" size="32" class="mb-2" />
        <v-card-title class="text-h5">{{ $t('user_tags.setup_prompt_title') }}</v-card-title>
      </v-card-item>

      <v-card-text class="px-0 pt-2 text-body-1">
        <p class="mb-0">{{ $t('user_tags.setup_prompt_body') }}</p>
      </v-card-text>

      <v-card-actions class="px-0 pt-2">
        <v-btn block color="primary" @click="$emit('confirm')">{{ $t('user_tags.setup_prompt_action') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
