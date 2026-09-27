<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import { usePartnerStore, BokudeliPartnerMenu, BokudeliPartnerOption } from '@shokujii/base/stores/partner.js'
import OptionEditCard from '@/components/OptionEditCard.vue'
import { isMenuMinTotalValid } from '@shokujii/common/utils/menuOption.js'
import { priceString } from '@shokujii/base/schemes/converter'
import { mdiPlus, mdiDelete } from '@mdi/js'
import { useNotification } from '@shokujii/base/composable/notification.js'

const notification = useNotification()
const { t: $t } = useI18n()

const partnerId = getAuth().currentUser?.uid ?? ''
const partnerStore = usePartnerStore(partnerId)

const menus = computed<BokudeliPartnerMenu[]>(() => partnerStore.menus ?? [])
const options = computed<BokudeliPartnerOption[]>(() => partnerStore.options ?? [])

const attachedMenusByOptionId = computed(() => {
  const attached = new Map<string, { menuId: string; name: string }[]>()
  for (const menu of menus.value) {
    for (const optionId of menu.option_ids ?? []) {
      const current = attached.get(optionId) ?? []
      current.push({ menuId: menu.menu_id, name: menu.menu_name })
      attached.set(optionId, current)
    }
  }
  return attached
})

const attachedMenus = (optionId: string): { menuId: string; name: string }[] =>
  attachedMenusByOptionId.value.get(optionId) ?? []

const namedItems = (option: BokudeliPartnerOption): BokudeliPartnerOption['option_items'] =>
  option.option_items.filter((item) => item.name.trim() !== '')

const formatPriceDelta = (priceDelta: number): string => {
  if (priceDelta > 0) {
    return `+¥${priceString(priceDelta)}`
  }
  if (priceDelta < 0) {
    return `-¥${priceString(Math.abs(priceDelta))}`
  }
  return `¥${priceString(0)}`
}

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
      <p class="options-intro mx-4 text-body-2 text-medium-emphasis">{{ $t('options.intro') }}</p>
      <div class="ma-4">
        <p v-if="options.length === 0" class="text-medium-emphasis">{{ $t('options.empty') }}</p>
        <div v-else class="d-flex flex-column ga-3">
          <v-card
            v-for="option in options"
            :key="option.option_id"
            class="option-row"
            tabindex="0"
            role="button"
            @click="openOptionDialog(option)"
            @keydown.enter="openOptionDialog(option)"
          >
            <div class="d-flex align-start ga-2 pa-4">
              <div class="option-row__body">
                <div class="text-h6">{{ option.option_name }}</div>
                <div
                  v-if="(option.option_description ?? '').trim() !== ''"
                  class="text-body-2 text-medium-emphasis text-truncate"
                >
                  {{ option.option_description }}
                </div>
                <div class="d-flex flex-wrap ga-1 mt-2">
                  <v-chip size="small" label variant="outlined">
                    {{
                      option.selection === 'single'
                        ? $t('option_edit_card.selection_single')
                        : $t('option_edit_card.selection_multiple')
                    }}
                  </v-chip>
                  <v-chip size="small" label variant="outlined">
                    {{ option.required ? $t('option_edit_card.required') : $t('option_edit_card.optional') }}
                  </v-chip>
                </div>
                <div v-if="namedItems(option).length > 0" class="d-flex flex-wrap align-center ga-1 mt-2">
                  <v-chip
                    v-for="item in namedItems(option)"
                    :key="item.item_id"
                    size="small"
                    label
                    color="primary"
                    variant="tonal"
                  >
                    {{ item.name }} {{ formatPriceDelta(item.price_delta) }}
                  </v-chip>
                </div>
                <div v-if="attachedMenus(option.option_id).length > 0" class="d-flex flex-wrap align-center ga-1 mt-2">
                  <v-chip
                    v-for="menu in attachedMenus(option.option_id)"
                    :key="menu.menuId"
                    size="small"
                    label
                    color="warning"
                    variant="tonal"
                  >
                    {{ menu.name }}
                  </v-chip>
                </div>
                <div v-else class="d-flex flex-wrap ga-1 mt-2">
                  <v-chip size="small" label variant="outlined">{{ $t('options.unused') }}</v-chip>
                </div>
              </div>
              <v-btn
                :icon="mdiDelete"
                :aria-label="$t('options.delete')"
                variant="text"
                size="small"
                @click.stop="onDeleteOption(option)"
                @keydown.enter.stop
              />
            </div>
          </v-card>
        </div>
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

<style scoped lang="scss">
.option-row {
  cursor: pointer;
}

.options-intro {
  white-space: pre-line;
}

.option-row__body {
  flex-grow: 1;
  min-width: 0;
}
</style>
