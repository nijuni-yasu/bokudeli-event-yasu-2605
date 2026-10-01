import { HttpsError } from 'firebase-functions/https'
import { getFirestore } from 'firebase-admin/firestore'
import { DateTime } from 'luxon'
import {
  SavePartnerMenuRequestSchema,
  SavePartnerOptionRequestSchema,
  DeletePartnerOptionRequestSchema,
  DeletePartnerMenuRequestSchema,
  SortPartnerMenusRequestSchema,
} from '@shokujii/common/apis/partnerMenu.js'
import { PartnerMenu } from '@shokujii/common/schemas/PartnerMenu.js'
import { PartnerOption } from '@shokujii/common/schemas/PartnerOption.js'
import {
  findMissingOptionIds,
  isMenuMinTotalValid,
  MENU_MIN_TOTAL_INVALID_MESSAGE,
} from '@shokujii/common/utils/menuOption.js'
import { Partner } from '../stores/partner.js'

type PartnerRequest = { auth?: { uid: string }; data: unknown }

function authenticatedPartner(request: PartnerRequest): Partner {
  const uid = request.auth?.uid
  if (uid == null) throw new HttpsError('unauthenticated', '認証が必要です')
  // 保存先をリクエストから受け取らず、認証した店舗に固定する。
  return new Partner(uid)
}

function assertMenuOptions(menu: PartnerMenu, options: PartnerOption[]): void {
  if (findMissingOptionIds(menu.option_ids, options).length > 0) {
    throw new HttpsError('failed-precondition', '削除済み、または自店舗に存在しないオプションが含まれています')
  }
  const attached = options.filter((option) => menu.option_ids.includes(option.id))
  if (!isMenuMinTotalValid(menu.menu_price, attached)) {
    throw new HttpsError('invalid-argument', MENU_MIN_TOTAL_INVALID_MESSAGE)
  }
}

export async function savePartnerMenuHandler(request: PartnerRequest): Promise<void> {
  const partner = authenticatedPartner(request)
  const parsed = SavePartnerMenuRequestSchema.safeParse(request.data)
  if (!parsed.success) throw new HttpsError('invalid-argument', 'メニューの入力が正しくありません')
  const input = parsed.data
  await getFirestore().runTransaction(async (transaction) => {
    const existing = await partner.getMenu(input.menu_id, transaction)
    if (existing?.is_deleted === true) throw new HttpsError('not-found', 'メニューは削除されています')
    // オプションの読取を同じトランザクションに含め、削除・編集と直列化する。
    const loaded = await Promise.all(input.option_ids.map((id) => partner.getOption(id, transaction)))
    const options = loaded.filter((option): option is PartnerOption => option != null)
    const menu = new PartnerMenu(partner.id, input.menu_id, {
      ...existing,
      ...input,
      menu_sort_number: existing?.menu_sort_number ?? input.menu_sort_number,
    })
    assertMenuOptions(menu, options)
    await partner.saveMenu(menu, transaction)
  })
}

export async function savePartnerOptionHandler(request: PartnerRequest): Promise<void> {
  const partner = authenticatedPartner(request)
  const parsed = SavePartnerOptionRequestSchema.safeParse(request.data)
  if (!parsed.success) throw new HttpsError('invalid-argument', 'オプションの入力が正しくありません')
  const input = parsed.data
  await getFirestore().runTransaction(async (transaction) => {
    const existing = await partner.getOption(input.option_id, transaction)
    if (input.create && existing != null) throw new HttpsError('already-exists', 'オプションは既に存在します')
    if (!input.create && existing == null) throw new HttpsError('not-found', 'オプションは削除されています')
    const option = new PartnerOption(partner.id, input.option_id, {
      ...existing,
      ...input,
      option_description: input.option_description,
    })
    const menus = await partner.getMenusUsingOption(input.option_id, transaction)
    const options = await partner.getOptions(transaction)
    const nextOptions = [...options.filter((item) => item.id !== option.id), option]
    for (const menu of menus) {
      if (!menu.is_deleted) assertMenuOptions(menu, nextOptions)
    }
    partner.saveOption(option, transaction)
  })
}

export async function deletePartnerOptionHandler(request: PartnerRequest): Promise<void> {
  const partner = authenticatedPartner(request)
  const parsed = DeletePartnerOptionRequestSchema.safeParse(request.data)
  if (!parsed.success) throw new HttpsError('invalid-argument', 'オプションIDが正しくありません')
  const { option_id: optionId } = parsed.data
  await getFirestore().runTransaction(async (transaction) => {
    // 参照追加側と同じドキュメントを読む。キャッシュに無いメニューも解除対象にする。
    await partner.getOption(optionId, transaction)
    const menus = await partner.getMenusUsingOption(optionId, transaction)
    const options = await partner.getOptions(transaction)
    const remainingOptions = options.filter((option) => option.id !== optionId)
    for (const menu of menus) {
      menu.option_ids = menu.option_ids.filter((id) => id !== optionId)
      if (!menu.is_deleted) assertMenuOptions(menu, remainingOptions)
    }
    // store 内では同じ transaction に write を追加し、全件を一度に commit する。
    await Promise.all(menus.map((menu) => partner.saveMenu(menu, transaction)))
    partner.deleteOption(optionId, transaction)
  })
}

export async function deletePartnerMenuHandler(request: PartnerRequest): Promise<void> {
  const partner = authenticatedPartner(request)
  const parsed = DeletePartnerMenuRequestSchema.safeParse(request.data)
  if (!parsed.success) throw new HttpsError('invalid-argument', 'メニューIDが正しくありません')
  await getFirestore().runTransaction(async (transaction) => {
    const menu = await partner.getMenu(parsed.data.menu_id, transaction)
    if (menu == null || menu.is_deleted) return
    menu.is_deleted = true
    menu.deleted_at = DateTime.now().toMillis()
    await partner.saveMenu(menu, transaction)
  })
}

export async function sortPartnerMenusHandler(request: PartnerRequest): Promise<void> {
  const partner = authenticatedPartner(request)
  const parsed = SortPartnerMenusRequestSchema.safeParse(request.data)
  if (!parsed.success) throw new HttpsError('invalid-argument', 'メニューの並び順が正しくありません')
  await getFirestore().runTransaction(async (transaction) => {
    const menus = await Promise.all(parsed.data.menu_ids.map((id) => partner.getMenu(id, transaction)))
    if (menus.some((menu) => menu == null || menu.is_deleted)) {
      throw new HttpsError('failed-precondition', 'メニューが変更されています。再読み込みしてください')
    }
    await Promise.all(
      menus.map(async (menu, index) => {
        if (menu == null) return
        menu.menu_sort_number = index
        await partner.saveMenu(menu, transaction)
      }),
    )
  })
}
