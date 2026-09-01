<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { themeConfig } from '@themeConfig'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { useValidators } from '@shokujii/base/composable/validators.js'
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import logo from '@/assets/images/shokujii/shokujii_logo_square.webp'

const { t: $t } = useI18n()
const route = useRoute()
const { requiredValidator, emailValidator } = useValidators()

const auth = getAuth()

const isLoading = ref(false)
const isPasswordVisible = ref(false)
const forgotPasswordDialog = ref(false)

const isValid = ref(false)
const email = ref('')
const password = ref('')
const snackbar = ref({ show: false, message: '', color: '' })

// 運営アカウント以外がログインした場合、ルーターガードが signOut して error=not_support で戻す
if (route.query.error === 'not_support') {
  snackbar.value = { show: true, message: $t('login.error_not_support'), color: 'error' }
}

const submit = async () => {
  isLoading.value = true
  try {
    // ログイン後の遷移先判定（運営権限チェックを含む）はルーターガードに任せる
    await signInWithEmailAndPassword(auth, email.value, password.value)
  } catch (error) {
    snackbar.value = {
      show: true,
      message: $t('login.error_could_not_login'),
      color: 'error',
    }
    console.warn(error)
  } finally {
    isLoading.value = false
  }
}

const sendMail = async () => {
  isLoading.value = true
  try {
    await sendPasswordResetEmail(auth, email.value)
    snackbar.value = {
      show: true,
      message: $t('login.message_email_sent'),
      color: 'success',
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      message: $t('login.error_could_not_send_email'),
      color: 'error',
    }
    console.warn(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
    </div>

    <v-row no-gutters class="auth-wrapper">
      <v-col md="8" class="d-none d-md-flex position-relative">
        <div class="d-flex align-center justify-center w-100 h-100 pa-10 pe-0">
          <img max-width="797" :src="logo" />
        </div>
      </v-col>

      <v-col
        cols="12"
        md="4"
        class="auth-card-v2 d-flex align-center justify-center"
        style="background-color: rgb(var(--v-theme-surface))"
      >
        <v-card flat :width="500" class="mt-12 mt-sm-0 pa-4">
          <v-card-text>
            <h4 class="text-h4 mb-1">{{ $t('login.title') }}</h4>
          </v-card-text>
          <v-card-text>
            <v-form v-model="isValid" @submit.prevent="submit">
              <v-row>
                <!-- email -->
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :label="$t('login.email_label')"
                    type="email"
                    autofocus
                    autocomplete="on"
                    :rules="[requiredValidator, emailValidator]"
                  />
                </v-col>

                <!-- password -->
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :label="$t('login.password_label')"
                    :rules="[requiredValidator]"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    autocomplete="on"
                    :append-inner-icon="isPasswordVisible ? mdiEyeOff : mdiEye"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <v-btn class="my-6" :disabled="!isValid" :loading="isLoading" block type="submit">
                    {{ $t('login.submit') }}
                  </v-btn>

                  <div class="text-center">
                    <a class="text-primary cursor-pointer" @click="forgotPasswordDialog = true">
                      {{ $t('login.forgot_password') }}
                    </a>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" location="top">
      {{ snackbar.message }}
    </v-snackbar>
    <v-dialog v-model="forgotPasswordDialog" max-width="800px">
      <v-card>
        <template #title> {{ $t('forgot_password_dialog.title') }} </template>
        <template #text>
          <div class="mb-4">{{ $t('forgot_password_dialog.message') }}</div>
          <v-text-field v-model="email" :label="$t('login.email_label')" type="email" :rules="[emailValidator]" />
        </template>
        <template #actions>
          <v-spacer></v-spacer>
          <v-btn @click="forgotPasswordDialog = false">{{ $t('cancel') }}</v-btn>
          <v-btn variant="tonal" @click="(sendMail(), (forgotPasswordDialog = false))">{{ $t('ok') }}</v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss">
@use '@core/scss/template/pages/page-auth.scss';
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
