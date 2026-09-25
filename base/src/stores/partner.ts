import { ref, computed, watch } from 'vue'
import type {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Unsubscribe,
} from 'firebase/firestore'
import { PartnerShop } from '@shokujii/common/schemas/PartnerShop.js'
import { PartnerMenu } from '@shokujii/common/schemas/PartnerMenu.js'
import { PartnerOption } from '@shokujii/common/schemas/PartnerOption.js'
import { defineStore } from 'pinia'
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  deleteDoc,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { getMenuImageStoragePath, getShopCoverStoragePath } from '@shokujii/common/utils/storagePaths.js'
import { uploadImage, convertStoragePathToURL } from '@shokujii/base/utils/storage.js'
import { reportClientError } from '@shokujii/base/utils/reportClientError.js'

export class BokudeliPartnerShop extends PartnerShop {
  constructor(partner_id: string, shop_id: string | null, src: Partial<PartnerShop>) {
    shop_id = shop_id ?? doc(collection(db, 'partners', partner_id, 'shops')).id
    super(partner_id, shop_id, { ...src, partner_id })
  }
}

export class BokudeliPartnerMenu extends PartnerMenu {
  constructor(partner_id: string, menu_id: string | null, src: Partial<PartnerMenu>) {
    menu_id = menu_id ?? doc(collection(db, 'partners', partner_id, 'menus')).id
    super(partner_id, menu_id, { ...src })
  }
}

export class BokudeliPartnerOption extends PartnerOption {
  constructor(partner_id: string, option_id: string | null, src: Partial<PartnerOption>) {
    option_id = option_id ?? doc(collection(db, 'partners', partner_id, 'options')).id
    super(partner_id, option_id, { ...src })
  }
}

/**
 * shopList で使用するので export するが、他では使用しないこと
 */
export const shopConverter: FirestoreDataConverter<BokudeliPartnerShop> = {
  toFirestore(shop: BokudeliPartnerShop): DocumentData {
    return shop.toFirestore()
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): BokudeliPartnerShop {
    const data = snapshot.data(options)
    const partner_id = snapshot.ref.parent.parent!.id
    return new BokudeliPartnerShop(partner_id, snapshot.id, data)
  },
}
const optionConverter: FirestoreDataConverter<BokudeliPartnerOption> = {
  toFirestore: (option: BokudeliPartnerOption): DocumentData => {
    return option.toFirestore()
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    const partner_id = snapshot.ref.parent.parent!.id
    return new BokudeliPartnerOption(partner_id, snapshot.id, data)
  },
}

export const getPartnerOptionRef = (partnerId: string, optionId: string): DocumentReference<BokudeliPartnerOption> => {
  return doc(db, 'partners', partnerId, 'options', optionId).withConverter(optionConverter)
}

const menuConverter: FirestoreDataConverter<BokudeliPartnerMenu> = {
  toFirestore: (menu: BokudeliPartnerMenu): DocumentData => {
    return menu.toFirestore()
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    const partner_id = snapshot.ref.parent.parent!.id
    return new BokudeliPartnerMenu(partner_id, snapshot.id, data)
  },
}

const db = getFirestore()

/**
 * 店舗の開店設定・運営承認だけを更新する。運営管理画面（support）の一覧スイッチ用。
 *
 * `updateShop()` は converter 経由でドキュメント全体を書き戻すため、レガシーデータでは
 * Zod バリデーションに落ちうる。スイッチ 2 項目の切り替えでは本関数を使うこと。
 * Rules 上 `partners/{id}/shops` の update は店舗本人または `isSupport()` に限定されている。
 */
export const updateShopStatus = async (
  partnerId: string,
  shopId: string,
  status: { is_open?: boolean; is_approved?: boolean },
): Promise<void> => {
  const shopRef = doc(db, 'partners', partnerId, 'shops', shopId).withConverter(shopConverter)
  await updateDoc(shopRef, { ...status, updatedAt: Timestamp.now() })
}

export type PartnerStore = ReturnType<typeof usePartnerStore>

export const usePartnerStore = (partnerId: string) => {
  const store = defineStore(`/partners/${partnerId}`, () => {
    const partnerRef: DocumentReference = doc(db, 'partners', partnerId)
    const _shops = ref<BokudeliPartnerShop[] | null>(null)
    const _menus = ref<BokudeliPartnerMenu[] | null>(null)
    const _options = ref<BokudeliPartnerOption[] | null>(null)
    const _shopImageCacheBusters = ref<Map<string, number>>(new Map())
    const _menuImageCacheBusters = ref<Map<string, number>>(new Map())

    let unsubscribeShops: Unsubscribe | null = null
    const subscribeShops = () => {
      if (unsubscribeShops == null) {
        unsubscribeShops = onSnapshot(collection(partnerRef, 'shops').withConverter(shopConverter), (shopsSnapshot) => {
          _shops.value = shopsSnapshot.docs.flatMap((shopDoc) => {
            try {
              return shopDoc.data()
            } catch (err) {
              console.error(err)
              reportClientError(err, { documentPath: shopDoc.ref.path, severity: 'warn' })
              return []
            }
          })
        })
      }
    }

    const shops = computed(() => {
      subscribeShops()
      return _shops.value
    })

    let unsubscribeMenus: Unsubscribe | null = null
    const subscribeMenus = () => {
      if (unsubscribeMenus == null) {
        unsubscribeMenus = onSnapshot(collection(partnerRef, 'menus').withConverter(menuConverter), (menusSnapshot) => {
          _menus.value = menusSnapshot.docs.flatMap((menuDoc) => {
            try {
              return menuDoc.data()
            } catch (err) {
              console.error(err)
              reportClientError(err, { documentPath: menuDoc.ref.path, severity: 'warn' })
              return []
            }
          })
        })
      }
    }

    let unsubscribeOptions: Unsubscribe | null = null
    const subscribeOptions = () => {
      if (unsubscribeOptions == null) {
        unsubscribeOptions = onSnapshot(
          collection(partnerRef, 'options').withConverter(optionConverter),
          (optionsSnapshot) => {
            _options.value = optionsSnapshot.docs.flatMap((optionDoc) => {
              try {
                return optionDoc.data()
              } catch (err) {
                console.error(err)
                reportClientError(err, { documentPath: optionDoc.ref.path, severity: 'warn' })
                return []
              }
            })
          },
        )
      }
    }

    const options = computed(() => {
      subscribeOptions()
      return _options.value
    })

    const menus = computed(() => {
      subscribeMenus()
      if (_menus.value == null) {
        return null
      }
      // 論理削除されたメニューを除外
      const activeMenus = _menus.value.filter((menu) => !menu.is_deleted)
      // menu_sort_numberでソート（昇順）、未設定の場合はupdatedAtでソート（降順）
      const sortedMenus = [...activeMenus].sort((a, b) => {
        if (a.menu_sort_number != null && b.menu_sort_number != null) {
          return a.menu_sort_number - b.menu_sort_number
        }
        if (a.menu_sort_number != null) return -1
        if (b.menu_sort_number != null) return 1
        return (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
      })
      return sortedMenus
    })

    const shopImageUrls = computed<Map<string, string>>(() => {
      const map = new Map<string, string>()
      _shops.value?.forEach((shop) => {
        const base = convertStoragePathToURL(getShopCoverStoragePath(partnerRef.id, shop.shop_id))
        const buster = _shopImageCacheBusters.value.get(shop.shop_id) ?? 0
        map.set(shop.shop_id, buster > 0 ? `${base}&t=${buster}` : base)
      })
      return map
    })

    const menuImageUrls = computed<Map<string, string>>(() => {
      const map = new Map<string, string>()
      _menus.value?.forEach((menu) => {
        const base = convertStoragePathToURL(getMenuImageStoragePath(partnerRef.id, menu.menu_id))
        const buster = _menuImageCacheBusters.value.get(menu.menu_id) ?? 0
        map.set(menu.menu_id, buster > 0 ? `${base}&t=${buster}` : base)
      })
      return map
    })

    /**
     * @param timeout [ms]
     * @returns Promise<BokudeliPartnerShop[]> when the shops are loaded
     * @throws Error when the shops are not loaded within the timeout
     */
    const getLoadedShops = async (timeout: number = 5000): Promise<BokudeliPartnerShop[]> => {
      return await new Promise((resolve, reject) => {
        let unwatch: (() => void) | undefined
        const timeoutId = setTimeout(() => {
          unwatch?.()
          reject(new Error(`Shops not loaded within ${timeout}ms`))
        }, timeout)
        unwatch = watch(
          shops,
          (s) => {
            if (s != null) {
              clearTimeout(timeoutId)
              unwatch?.()
              resolve(s)
            }
          },
          { immediate: true },
        )
      })
    }

    const updateShop = async (data: BokudeliPartnerShop, image?: File) => {
      if (image != null) {
        await uploadImage(image, getShopCoverStoragePath(partnerRef.id, data.shop_id))
        _shopImageCacheBusters.value = new Map(_shopImageCacheBusters.value).set(data.shop_id, Date.now())
      }
      const shopRef = doc(partnerRef, 'shops', data.shop_id).withConverter(shopConverter)
      return await setDoc(shopRef, data, { merge: true })
    }

    const updateMenu = async (data: BokudeliPartnerMenu, image?: File) => {
      if (image != null) {
        await uploadImage(image, getMenuImageStoragePath(partnerRef.id, data.menu_id))
        _menuImageCacheBusters.value = new Map(_menuImageCacheBusters.value).set(data.menu_id, Date.now())
      }
      const menuRef = doc(partnerRef, 'menus', data.menu_id).withConverter(menuConverter)
      return await setDoc(menuRef, data, { merge: true })
    }

    const deleteMenu = async (menuId: string) => {
      const menuRef = doc(partnerRef, 'menus', menuId).withConverter(menuConverter)
      const snap = await getDoc(menuRef)
      if (!snap.exists()) {
        return
      }
      await updateDoc(menuRef, { is_deleted: true, deleted_at: Timestamp.now() })
    }

    const updateOption = async (data: BokudeliPartnerOption) => {
      const optionRef = getPartnerOptionRef(partnerId, data.option_id)
      return await setDoc(optionRef, data)
    }

    const deleteOption = async (optionId: string) => {
      const optionRef = getPartnerOptionRef(partnerId, optionId)
      await deleteDoc(optionRef)
    }

    const updateMenuSortOrder = async (menuIds: string[]) => {
      const batch = writeBatch(db)
      menuIds.forEach((menuId, index) => {
        const menuRef = doc(partnerRef, 'menus', menuId)
        batch.update(menuRef, { menu_sort_number: index })
      })
      await batch.commit()
    }

    return {
      shops,
      menus,
      options,
      shopImageUrls,
      menuImageUrls,
      getLoadedShops,
      updateShop,
      updateMenu,
      deleteMenu,
      updateOption,
      deleteOption,
      updateMenuSortOrder,
      unsubscribe: () => {
        unsubscribeShops?.()
        unsubscribeShops = null
        unsubscribeMenus?.()
        unsubscribeMenus = null
        unsubscribeOptions?.()
        unsubscribeOptions = null
      },
    }
  })

  return store()
}
