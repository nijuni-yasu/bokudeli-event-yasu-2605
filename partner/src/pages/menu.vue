<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import { usePartnerStore, BokudeliPartnerMenu, BokudeliPartnerOption } from '@shokujii/base/stores/partner.js'
import MenuEditCard from '@/components/MenuEditCard.vue'
import OptionEditCard from '@/components/OptionEditCard.vue'
import { isMenuMinTotalValid } from '@shokujii/common/utils/menuOption.js'
import MenuCard from '@shokujii/base/components/MenuCard.vue'
import { mdiPlus, mdiClose } from '@mdi/js'
import { useNotification } from '@shokujii/base/composable/notification.js'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

/** メニュー 0 件時のプレビュー用（新規作成ダイアログには使わない） */
const EXAMPLE_MENU_IMAGE_URL = '/deli_example.png'

const notification = useNotification()

const { t: $t } = useI18n()

const partnerId = getAuth().currentUser?.uid ?? ''
const partnerStore = usePartnerStore(partnerId)

const menus = computed<BokudeliPartnerMenu[]>(() => partnerStore.menus ?? [])
const options = computed<BokudeliPartnerOption[]>(() => partnerStore.options ?? [])

// 並び替え用のローカル状態
const sortMenuIds = ref<string[]>([])
const originalMenuIds = ref<string[]>([])

// メニュー変更時に並び順を同期
watch(
  menus,
  (newMenus) => {
    const currentMenuIds = newMenus.map((m) => m.menu_id)
    const isSynced =
      sortMenuIds.value.length === currentMenuIds.length &&
      sortMenuIds.value.every((id, index) => id === currentMenuIds[index])

    if (!isSynced) {
      sortMenuIds.value = [...currentMenuIds]
      originalMenuIds.value = [...currentMenuIds]
    }
  },
  { immediate: true },
)

// 並び替え済みメニュー（副作用なし）
const sortedMenus = computed<BokudeliPartnerMenu[]>({
  get: () =>
    sortMenuIds.value
      .map((id) => menus.value.find((menu) => menu.menu_id === id))
      .filter((menu): menu is BokudeliPartnerMenu => menu != null),
  set: (newMenus) => {
    sortMenuIds.value = newMenus.map((menu) => menu.menu_id).filter((id): id is string => id != null)
  },
})

const targetMenu: Ref<BokudeliPartnerMenu | null> = ref(null)

const dialog = computed({
  get: () => targetMenu.value != null,
  set: (value) => {
    if (!value) {
      targetMenu.value = null
    }
  },
})

const openDialog = (menu: BokudeliPartnerMenu) => {
  targetMenu.value = Object.assign(Object.create(Object.getPrototypeOf(menu)), menu)
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
      notification.show($t('menu.option_save_error'), 'error')
      return
    }
    if (!option.isValidForDatabase()) {
      notification.show($t('menu.option_save_error'), 'error')
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
    notification.show($t('menu.option_saved'), 'success')
    optionDialog.value = false
  } catch (e) {
    console.error(e)
    notification.show($t('menu.option_save_error'), 'error')
  }
}

const onDeleteOption = async (option: BokudeliPartnerOption) => {
  const result = window.confirm($t('menu.option_delete_confirm'))
  if (!result) {
    return
  }
  if (partnerStore.menus == null) {
    notification.show($t('menu.option_delete_error'), 'error')
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
    notification.show($t('menu.option_deleted'), 'success')
  } catch (e) {
    console.error(e)
    notification.show($t('menu.option_delete_error'), 'error')
  }
}

const saveMenu = async (menu: BokudeliPartnerMenu, file: File | null): Promise<boolean> => {
  try {
    if (partnerStore.options == null) {
      notification.show($t('menu.save_error'), 'error')
      return false
    }
    const attached = (menu.option_ids ?? [])
      .map((optionId) => options.value.find((option) => option.option_id === optionId))
      .filter((option): option is BokudeliPartnerOption => option != null)
    if (!isMenuMinTotalValid(menu.menu_price, attached)) {
      notification.show($t('menu_edit_card.error_min_total'), 'error')
      return false
    }
    // 新規作成の場合、menu_sort_number を設定
    if (menu.menu_id == null || menus.value.find((m) => m.menu_id === menu.menu_id) == null) {
      // 既存のメニュー数をカウントして最後の値にする
      const menuCount = menus.value?.length ?? 0
      menu.menu_sort_number = menuCount
    }
    // 編集保存の場合、menu_sort_number は既に targetMenu に設定されているので変更しない

    await partnerStore.updateMenu(menu, file ?? undefined)
    notification.show($t('menu.saved'), 'success')
    return true
  } catch (e) {
    console.error(e)
    notification.show($t('menu.save_error'), 'error')
    return false
  }
}
const onDelete = (menu: BokudeliPartnerMenu) => {
  if (menu.menu_id == null) {
    console.error('menu.menu_id is null')
    notification.show($t('menu.delete_error'), 'error')
    return
  }
  const result = window.confirm($t('menu.delete_confirm'))
  if (result) {
    try {
      partnerStore.deleteMenu(menu.menu_id)
      notification.show($t('menu.deleted'), 'success')
    } catch (e) {
      console.error(e)
      notification.show($t('menu.delete_error'), 'error')
    }
  }
}

const example = new BokudeliPartnerMenu(partnerId, null, {
  menu_name: $t('menu.example.name'),
  menu_description: $t('menu.example.description'),
  menu_price: 800,
  menu_sort_number: 0,
})

// 並び順保存処理（ドラッグ終了時に自動呼び出し）
const saveSortOrder = async () => {
  try {
    const menuIds = sortedMenus.value.map((m) => m.menu_id)
    const originalIds = originalMenuIds.value
    // 並び順が実際に変更されたかチェック
    const hasChanged = menuIds.length === originalIds.length && menuIds.some((id, index) => id !== originalIds[index])

    if (hasChanged) {
      await partnerStore.updateMenuSortOrder(menuIds)
      originalMenuIds.value = [...menuIds]
      notification.show($t('menu.sort_order_saved'), 'success')
    }
  } catch (e) {
    console.error(e)
    notification.show($t('menu.sort_order_save_error'), 'error')
  }
}
</script>

<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="12" md="12" class="px-0">
      <div class="ma-4 d-flex justify-start align-center ga-2">
        <v-btn
          color="primary"
          size="x-large"
          :prepend-icon="mdiPlus"
          @click="openDialog(new BokudeliPartnerMenu(partnerId, null, {}))"
        >
          {{ $t('menu.add') }}
        </v-btn>
        <v-btn color="secondary" size="x-large" :prepend-icon="mdiPlus" @click="openOptionDialog(createBlankOption())">
          {{ $t('menu.add_option') }}
        </v-btn>
      </div>
      <div class="ma-4">
        <h2 class="text-h6 mb-2">{{ $t('menu.option_section') }}</h2>
        <v-list>
          <v-list-item v-for="option in options" :key="option.option_id" @click="openOptionDialog(option)">
            <v-list-item-title>{{ option.option_name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{
                option.selection === 'single'
                  ? $t('option_edit_card.selection_single')
                  : $t('option_edit_card.selection_multiple')
              }}
              /
              {{ option.required ? $t('option_edit_card.required') : '' }}
              {{ $t('option_edit_card.items') }} {{ option.option_items.length }}
            </v-list-item-subtitle>
            <template #append>
              <v-btn variant="text" size="small" @click.stop="onDeleteOption(option)">
                {{ $t('option_edit_card.remove_item') }}
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
      <draggable v-model="sortedMenus" class="d-flex flex-wrap" @end="saveSortOrder">
        <div v-for="menu in sortedMenus" :key="menu.menu_id" class="menu-item-wrapper">
          <MenuCard
            class="menu-card clickable draggable-item"
            :menu="menu"
            :image-url="partnerStore.menuImageUrls.get(menu.menu_id) ?? ''"
            @click="openDialog(menu)"
          >
            <v-btn
              :icon="mdiClose"
              class="close-button"
              size="x-small"
              color="#FFFFFF88"
              @click.stop="onDelete(menu)"
            />
          </MenuCard>
        </div>
      </draggable>
      <v-row>
        <v-col v-if="menus.length === 0" cols="12" sm="6" md="4" lg="3">
          <MenuCard class="menu-card" :menu="example" :image-url="EXAMPLE_MENU_IMAGE_URL" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-dialog v-if="targetMenu != null" v-model="dialog" max-width="600px">
    <MenuEditCard
      v-model="targetMenu"
      :image-url="partnerStore.menuImageUrls.get(targetMenu.menu_id) ?? ''"
      :options="options"
      @save="
        async (menu, imageFile) => {
          const saved = await saveMenu(menu, imageFile)
          if (saved) {
            dialog = false
          }
        }
      "
      @cancel="dialog = false"
    >
      <template #title> {{ targetMenu.menu_id == null ? $t('menu.add') : $t('menu.edit') }} </template>
    </MenuEditCard>
  </v-dialog>
  <v-dialog v-if="targetOption != null" v-model="optionDialog" max-width="600px">
    <OptionEditCard v-model="targetOption" @save="saveOption" @cancel="optionDialog = false">
      <template #title>
        {{ targetOption.option_name === '' ? $t('menu.add_option') : $t('menu.option_section') }}
      </template>
    </OptionEditCard>
  </v-dialog>
</template>

<style scoped lang="scss">
.menu-card {
  height: 100%;
  width: 100%;
  min-height: 300px;
  margin: 16px;

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    color: black;
  }
}

.clickable {
  cursor: pointer;
}

.draggable-item {
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.menu-item-wrapper {
  position: relative;
  height: 100%;
  flex: 0 0 calc(100% - 16px);
  margin: 8px;

  @media (min-width: 600px) {
    flex: 0 0 calc(50% - 16px);
  }

  @media (min-width: 960px) {
    flex: 0 0 calc(33.333% - 16px);
  }

  @media (min-width: 1264px) {
    flex: 0 0 calc(25% - 16px);
  }
}
</style>
