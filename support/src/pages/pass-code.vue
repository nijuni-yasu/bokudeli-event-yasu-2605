<script setup lang="ts">
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import logo from '@/assets/images/shokujii/shokujii_logo_wide.png'
import ConfirmDialog from '@shokujii/base/components/ConfirmDialog.vue'
import { useNotification } from '@shokujii/base/composable/notification'
import { confirmEmailLogin, requestEmailLogin } from '@shokujii/base/apis/user'
import { setLastLoginProvider } from '@shokujii/base/utils/lastLoginProvider.js'
import { getRedirectPath } from '@shokujii/base/utils/redirect'
import { getLogin } from '@/router/utils'

const router = useRouter()
const { t: $t } = useI18n()
const notification = useNotification()

const isLoading = ref(false)
const isValid = ref(false)

const rawEmail = history.state?.email as string | undefined
const hasEmail = typeof rawEmail === 'string' && rawEmail.length > 0

if (!hasEmail) {
  await router.replace(getLogin())
}

const email = hasEmail ? rawEmail : ''

const passCode = ref('')
const isOpenUnMatchPassCodeDialog = ref(false)

if (hasEmail) {
  watch(passCode, async (newValue) => {
    if (newValue.length === 6) {
      await submit(newValue)
    }
  })
}

const reSendPassCode = async () => {
  isLoading.value = true
  try {
    await requestEmailLogin({ email })
  } catch (error) {
    console.warn('Error resending pass code:', error)
    notification.show($t('passcode.send_code_failed'), 'error')
  } finally {
    isLoading.value = false
  }
}

const submit = async (passCodeInput: string) => {
  isValid.value = true
  try {
    const result = await confirmEmailLogin({ email, passCode: passCodeInput })
    const { token } = result.data
    await signInWithCustomToken(getAuth(), token)
    setLastLoginProvider('custom')
    const redirectPath = getRedirectPath() ?? '/'
    await router.push(redirectPath)
  } catch (error: unknown) {
    console.warn('Error confirming pass code:', error)
    isOpenUnMatchPassCodeDialog.value = true
  } finally {
    isValid.value = false
  }
}

const goBack = () => {
  router.push(getLogin())
}
</script>

<template>
  <v-container v-if="hasEmail">
    <v-row justify="center" class="mt-16">
      <v-col lg="5" md="6" sm="10" cols="12" class="pa-0">
        <v-sheet class="rounded-lg py-14 px-md-10 px-5">
          <v-container>
            <v-row justify="center">
              <v-img max-width="160" :src="logo" />
            </v-row>
            <v-row justify="center">
              <h1 class="my-3 text-h3 font-weight-bold">{{ $t('passcode.enter_passcode') }}</h1>
            </v-row>
            <v-row justify="center">
              <p>{{ $t('passcode.enter_passcode_description', { email: email }) }}</p>
            </v-row>
          </v-container>

          <v-otp-input autofocus :disabled="isLoading" :loading="isValid" v-model="passCode" />

          <v-btn
            size="large"
            color="grey-900"
            variant="text"
            block
            :disabled="isValid"
            :loading="isLoading"
            @click="reSendPassCode"
          >
            {{ $t('passcode.resend') }}
          </v-btn>
          <v-btn
            size="large"
            color="grey-900"
            variant="text"
            block
            :disabled="isValid"
            :loading="isLoading"
            @click="goBack"
          >
            {{ $t('passcode.back') }}
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>

    <confirm-dialog v-model="isOpenUnMatchPassCodeDialog" :is-confirm="false">
      <v-card-text class="text-center py-10 text-h4">
        {{ $t('passcode.un_match_passcode') }}
      </v-card-text>
    </confirm-dialog>
  </v-container>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
