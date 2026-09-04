<script setup lang="ts">
import logo from '@/assets/images/shokujii/shokujii_logo_wide.png'
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-5 pa-0">
      <v-col lg="5" md="6" sm="10" cols="12" class="pa-0">
        <div class="auth-entry-shell">
          <v-row justify="center" class="mb-0">
            <v-img max-width="160" :src="logo" />
          </v-row>

          <v-row justify="center" class="mt-4 mb-0">
            <div class="auth-brand-welcome text-h4 font-weight-bold text-medium-emphasis text-center">
              {{ $t('login.brand_welcome') }}
            </div>
          </v-row>

          <v-sheet class="auth-entry-card mt-6 py-14 px-sm-12 px-5" elevation="0">
            <slot />
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.auth-entry-shell {
  --auth-card-radius: 12px;
}

.auth-entry-card {
  border-radius: var(--auth-card-radius);
  background: rgb(var(--v-theme-surface));
}

.auth-brand-welcome {
  line-height: 1.4;
}
</style>
