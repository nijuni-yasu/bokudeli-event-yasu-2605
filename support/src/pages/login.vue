<script setup lang="ts">
import { FirebaseError } from 'firebase/app'
import { requestEmailLogin } from '@shokujii/base/apis/user'
import { useNotification } from '@shokujii/base/composable/notification'
import { useValidators } from '@shokujii/base/composable/validators.js'
import { getLastLoginProvider } from '@shokujii/base/utils/lastLoginProvider.js'
import { setRedirectPath } from '@shokujii/base/utils/redirect'
import AuthEntryLayout from '@/components/auth/AuthEntryLayout.vue'
import { getPassCode } from '@/router/utils'

const route = useRoute()
const router = useRouter()
const notification = useNotification()
const { t: $t } = useI18n()
const { requiredValidator, emailValidator } = useValidators()

const isLoading = ref(false)
const isValid = ref(false)
const email = ref('')
const lastLoginProvider = getLastLoginProvider()

onMounted(() => {
  if (route.query.error === 'not_support') {
    notification.show($t('login.error_not_support'), 'error')
  }
})

const persistLoginRedirect = (): void => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string' || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return
  }
  if (redirect === '/login' || redirect === '/pass-code' || redirect === '/maintenance') {
    return
  }
  setRedirectPath(redirect)
}

const handleLogin = async () => {
  isLoading.value = true
  try {
    persistLoginRedirect()
    await requestEmailLogin({ email: email.value })
    await router.push(getPassCode(email.value))
  } catch (error) {
    console.error(error)
    if (error instanceof FirebaseError && error.code === 'functions/not-found') {
      notification.show($t('login.not_registered'), 'warning')
    } else {
      notification.show($t('login.login_fail'), 'error')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <auth-entry-layout>
    <v-form v-model="isValid" @submit.prevent="handleLogin">
      <v-container class="mb-4 pa-0">
        <label class="field-label" style="font-size: 12px; font-weight: bold">{{ $t('login.email') }}</label>
        <v-text-field placeholder="example@example.com" v-model="email" :rules="[requiredValidator, emailValidator]" />
      </v-container>

      <v-btn
        class="mb-4"
        size="large"
        color="grey-900"
        block
        :loading="isLoading"
        :disabled="!isValid || isLoading"
        type="submit"
      >
        <span class="login-btn-label">
          <span>{{ $t('login.continue_email_login') }}</span>
          <v-chip
            v-if="lastLoginProvider === 'custom'"
            size="x-small"
            color="primary"
            variant="tonal"
            class="last-login-chip"
          >
            {{ $t('login.last_login') }}
          </v-chip>
        </span>
      </v-btn>
    </v-form>
  </auth-entry-layout>
</template>

<style scoped>
.login-btn-label {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  width: 100%;
  gap: 12px;
}

.last-login-chip {
  flex-shrink: 0;
  margin-inline-start: auto;
  font-size: 11px;
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
