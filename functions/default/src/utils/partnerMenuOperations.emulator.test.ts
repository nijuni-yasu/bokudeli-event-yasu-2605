import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest'
import { initializeApp, deleteApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import type { SavePartnerMenuRequest, SavePartnerOptionRequest } from '@shokujii/common/apis/partnerMenu.js'
import {
  savePartnerMenuHandler,
  savePartnerOptionHandler,
  deletePartnerOptionHandler,
  deletePartnerMenuHandler,
  sortPartnerMenusHandler,
} from './partnerMenuOperations.js'
import { Partner } from '../stores/partner.js'

const auth = { uid: 'partner-a' }
const optionInput = (optionId = 'opt-1'): SavePartnerOptionRequest => ({
  option_id: optionId,
  create: true,
  option_name: 'サイズ',
  selection: 'single',
  required: true,
  option_items: [{ item_id: 'large', name: '大盛', price_delta: 100 }],
})
const menuInput = (menuId = 'menu-1'): SavePartnerMenuRequest => ({
  menu_id: menuId,
  menu_name: '弁当',
  menu_description: '説明',
  menu_price: 1000,
  menu_sort_number: 0,
  is_sold_out: false,
  limit_per_event: null,
  menu_date_start: null,
  menu_date_end: null,
  option_ids: ['opt-1'],
})

// モックではなく実際の Firestore transaction の競合・ロールバックを検証する。
describe.skipIf(process.env.FIRESTORE_EMULATOR_HOST == null)('店舗メニュー原子更新（エミュレータ）', () => {
  const projectId = 'demo-partner-menu-operations'
  let app: ReturnType<typeof initializeApp>
  beforeAll(() => {
    app = initializeApp({ projectId })
  })
  afterAll(async () => {
    await deleteApp(app)
  })
  beforeEach(async () => {
    await getFirestore().recursiveDelete(getFirestore().collection('partners'))
  })

  it('未認証・不正入力では書き込まない', async () => {
    await expect(savePartnerOptionHandler({ data: optionInput() })).rejects.toMatchObject({ code: 'unauthenticated' })
    await expect(
      savePartnerOptionHandler({ auth, data: { ...optionInput(), partner_id: 'partner-b' } }),
    ).rejects.toMatchObject({ code: 'invalid-argument' })
    await expect(
      savePartnerOptionHandler({
        auth,
        data: { ...optionInput(), option_items: [{ item_id: 'a', name: '大盛', price_delta: 10001 }] },
      }),
    ).rejects.toMatchObject({ code: 'invalid-argument' })
  })

  it('他店舗だけに存在するID・存在しないIDをメニューへ保存できない', async () => {
    await savePartnerOptionHandler({ auth: { uid: 'partner-b' }, data: optionInput() })
    await expect(savePartnerMenuHandler({ auth, data: menuInput() })).rejects.toMatchObject({
      code: 'failed-precondition',
    })
    expect(await new Partner(auth.uid).getMenus()).toHaveLength(0)
  })

  it('正常保存・参照全件解除・削除後の再保存拒否', async () => {
    await savePartnerOptionHandler({ auth, data: optionInput() })
    await savePartnerMenuHandler({ auth, data: menuInput('menu-a') })
    await savePartnerMenuHandler({ auth, data: menuInput('menu-b') })
    await deletePartnerOptionHandler({ auth, data: { option_id: 'opt-1' } })
    expect(await new Partner(auth.uid).getOptions()).toHaveLength(0)
    const menus = await new Partner(auth.uid).getMenus()
    expect(menus).toHaveLength(2)
    expect(
      menus.every((menu) => menu.option_ids.length === 0 && menu.menu_price === 1000 && menu.menu_name === '弁当'),
    ).toBe(true)
    await expect(savePartnerMenuHandler({ auth, data: menuInput('menu-a') })).rejects.toMatchObject({
      code: 'failed-precondition',
    })
    await expect(savePartnerOptionHandler({ auth, data: { ...optionInput(), create: false } })).rejects.toMatchObject({
      code: 'not-found',
    })
  })

  it('削除途中で保存検証が失敗したら参照も本体もすべて残る', async () => {
    await savePartnerOptionHandler({ auth, data: optionInput() })
    await savePartnerMenuHandler({ auth, data: menuInput('menu-a') })
    await savePartnerMenuHandler({ auth, data: menuInput('menu-z') })
    // 既存の不正データで2件目の converter 検証を失敗させる。
    await getFirestore().doc('partners/partner-a/menus/menu-z').update({ menu_name: '' })
    await expect(deletePartnerOptionHandler({ auth, data: { option_id: 'opt-1' } })).rejects.toThrow()
    expect(await new Partner(auth.uid).getOptions()).toHaveLength(1)
    expect((await new Partner(auth.uid).getMenus()).every((menu) => menu.option_ids.includes('opt-1'))).toBe(true)
  })

  it('削除と新規参照保存が競合しても削除済みIDが残らない', async () => {
    await savePartnerOptionHandler({ auth, data: optionInput() })
    const results = await Promise.allSettled([
      deletePartnerOptionHandler({ auth, data: { option_id: 'opt-1' } }),
      savePartnerMenuHandler({ auth, data: menuInput('concurrent') }),
    ])
    expect(results[0].status).toBe('fulfilled')
    const menus = await new Partner(auth.uid).getMenus()
    expect(menus.every((menu) => !menu.option_ids.includes('opt-1'))).toBe(true)
    expect(await new Partner(auth.uid).getOptions()).toHaveLength(0)
  })

  it('オプション編集時に既存メニューを1円未満にできない', async () => {
    await savePartnerOptionHandler({ auth, data: optionInput() })
    await savePartnerMenuHandler({ auth, data: menuInput() })
    await expect(
      savePartnerOptionHandler({
        auth,
        data: {
          ...optionInput(),
          create: false,
          option_items: [{ item_id: 'large', name: '大盛', price_delta: -1000 }],
        },
      }),
    ).rejects.toMatchObject({ code: 'invalid-argument' })
    expect((await new Partner(auth.uid).getOptions())[0].option_items[0].price_delta).toBe(100)
  })

  it('正の必須オプションを外して残りが1円未満になる削除を拒否する', async () => {
    await savePartnerOptionHandler({
      auth,
      data: {
        ...optionInput(),
        option_items: [{ item_id: 'plus', name: '追加', price_delta: 1000 }],
      },
    })
    await savePartnerOptionHandler({
      auth,
      data: {
        ...optionInput('discount'),
        option_items: [{ item_id: 'minus', name: '割引', price_delta: -500 }],
      },
    })
    await savePartnerMenuHandler({
      auth,
      data: {
        ...menuInput(),
        menu_price: 100,
        option_ids: ['opt-1', 'discount'],
      },
    })
    await expect(deletePartnerOptionHandler({ auth, data: { option_id: 'opt-1' } })).rejects.toMatchObject({
      code: 'invalid-argument',
    })
    expect(await new Partner(auth.uid).getOptions()).toHaveLength(2)
    expect((await new Partner(auth.uid).getMenu('menu-1'))?.option_ids).toEqual(['opt-1', 'discount'])
  })

  it('説明のクリア・並べ替え・メニュー削除を維持する', async () => {
    await savePartnerOptionHandler({ auth, data: { ...optionInput(), option_description: '説明' } })
    await savePartnerOptionHandler({ auth, data: { ...optionInput(), create: false, option_description: '' } })
    expect((await new Partner(auth.uid).getOptions())[0].option_description).toBeUndefined()
    await savePartnerMenuHandler({ auth, data: menuInput('menu-a') })
    await savePartnerMenuHandler({ auth, data: menuInput('menu-b') })
    await sortPartnerMenusHandler({ auth, data: { menu_ids: ['menu-b', 'menu-a'] } })
    expect((await new Partner(auth.uid).getMenu('menu-a'))?.menu_sort_number).toBe(1)
    await deletePartnerMenuHandler({ auth, data: { menu_id: 'menu-a' } })
    expect((await new Partner(auth.uid).getMenu('menu-a'))?.is_deleted).toBe(true)
    await expect(savePartnerMenuHandler({ auth, data: menuInput('menu-a') })).rejects.toMatchObject({
      code: 'not-found',
    })
  })
})
