<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import { usePartnerStore, BokudeliPartnerMenu, BokudeliPartnerOption } from '@shokujii/base/stores/partner.js'
import OptionEditCard from '@/components/OptionEditCard.vue'
import { isMenuMinTotalValid } from '@shokujii/common/utils/menuOption.js'
import { mdiPlus } from '@mdi/js'
import { useNotification } from '@shokujii/base/composable/notification.js'

const notification = useNotification()
const { t: $t } = useI18n()

const partnerId = getAuth().currentUser?.uid ?? ''
const partnerStore = usePartnerStore(partnerId)

const menus = computed<BokudeliPartnerMenu[]>(() => partnerStore.menus ?? [])
const options = computed<BokudeliPartnerOption[]>(() => partnerStore.options ?? [])

const targetOption: Ref<BokudeliPartnerOption | null> = ref(null)
const optionDialog = computed({
  get: () => targetOption.value != null,
  set: (value) => {
    if (!value) {
      targetOption.value = null
    }
  },
})

const createBlankOption = () =>
  new BokudeliPartnerOption(partnerId, null, {
    option_items: [{ item_id: crypto.randomUUID(), name: '', price_delta: 0 }],
  })

const openOptionDialog = (option: BokudeliPartnerOption) => {
  targetOption.value = new BokudeliPartnerOption(partnerId, option.option_id, {
    ...option,
    option_items: option.option_items.map((item) => ({ ...item })),
  })
}

const saveOption = async (option: BokudeliPartnerOption) => {
  try {
    if (partnerStore.menus == null) {
      notification.show($t('options.save_error'), 'error')
      return
    }
    if (!option.isValidForDatabase()) {
      notification.show($t('options.save_error'), 'error')
      return
    }
    const invalidMenu = menus.value.find((menu) => {
      if (!(menu.option_ids ?? []).includes(option.option_id)) {
        return false
      }
      const attached = (menu.option_ids ?? [])
        .map((optionId) =>
          optionId === option.option_id ? option : options.value.find((item) => item.option_id === optionId),
        )
        .filter((item): item is BokudeliPartnerOption => item != null)
      return !isMenuMinTotalValid(menu.menu_price, attached)
    })
    if (invalidMenu != null) {
      notification.show($t('menu_edit_card.error_min_total'), 'error')
      return
    }
    await partnerStore.updateOption(option)
    notification.show($t('options.saved'), 'success')
    optionDialog.value = false
  } catch (e) {
    console.error(e)
    notification.show($t('options.save_error'), 'error')
  }
}

const onDeleteOption = async (option: BokudeliPartnerOption) => {
  const result = window.confirm($t('options.delete_confirm'))
  if (!result) {
    return
  }
  if (partnerStore.menus == null) {
    notification.show($t('options.delete_error'), 'error')
    return
  }
  try {
    const attachedMenus = menus.value.filter((menu) => (menu.option_ids ?? []).includes(option.option_id))
    await Promise.all(
      attachedMenus.map((menu) => {
        const next = new BokudeliPartnerMenu(partnerId, menu.menu_id, {
          ...menu,
          option_ids: (menu.option_ids ?? []).filter((id) => id !== option.option_id),
        })
        return partnerStore.updateMenu(next)
      }),
    )
    await partnerStore.deleteOption(option.option_id)
    notification.show($t('options.deleted'), 'success')
  } catch (e) {
    console.error(e)
    notification.show($t('options.delete_error'), 'error')
  }
}
</script>

<template>
  <v-row class="justify-center">
    <v-col cols="12" class="px-0">
      <div class="ma-4 d-flex justify-start align-center">
        <v-btn color="primary" size="x-large" :prepend-icon="mdiPlus" @click="openOptionDialog(createBlankOption())">
          {{ $t('options.add') }}
        </v-btn>
      </div>
      <div class="ma-4">
        <p v-if="options.length === 0" class="text-medium-emphasis">{{ $t('options.empty') }}</p>
        <v-list v-else>
          <v-list-item v-for="option in options" :key="option.option_id" @click="openOptionDialog(option)">
            <v-list-item-title>{{ option.option_name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{
                option.selection === 'single'
                  ? $t('option_edit_card.selection_single')
                  : $t('option_edit_card.selection_multiple')
              }}
              <template v-if="option.required"> / {{ $t('option_edit_card.required') }}</template>
              / {{ $t('option_edit_card.items') }} {{ option.option_items.length }}
            </v-list-item-subtitle>
            <template #append>
              <v-btn variant="text" size="small" @click.stop="onDeleteOption(option)">
                {{ $t('options.delete') }}
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-col>
  </v-row>
  <v-dialog v-if="targetOption != null" v-model="optionDialog" max-width="600px">
    <OptionEditCard v-model="targetOption" @save="saveOption" @cancel="optionDialog = false">
      <template #title>
        {{ targetOption.option_name === '' ? $t('options.add') : $t('options.edit') }}
      </template>
    </OptionEditCard>
  </v-dialog>
</template>
