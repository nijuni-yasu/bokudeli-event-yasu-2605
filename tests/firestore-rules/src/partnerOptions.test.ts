import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

const PROJECT_ID = 'firestore-rules-partner-options'
const testDir = fileURLToPath(new URL('.', import.meta.url))

const PARTNER_A = 'partner-a'
const PARTNER_B = 'partner-b'

const validOption = {
  partner_id: PARTNER_A,
  option_name: 'サイズ',
  selection: 'single',
  required: true,
  option_items: [{ item_id: 'large', name: '大盛', price_delta: 100 }],
}

let testEnv: RulesTestEnvironment

function partnerAuth(partnerId: string) {
  return testEnv.authenticatedContext(partnerId)
}

function optionRef(partnerId: string, optionId: string, context = partnerAuth(partnerId)) {
  return context.firestore().collection('partners').doc(partnerId).collection('options').doc(optionId)
}

function menuRef(partnerId: string, menuId: string, context = partnerAuth(partnerId)) {
  return context.firestore().collection('partners').doc(partnerId).collection('menus').doc(menuId)
}

describe('partner options / menu option fields firestore rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: readFileSync(resolve(testDir, '../../../firestore.rules'), 'utf8'),
      },
    })
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  beforeEach(async () => {
    await testEnv.clearFirestore()
  })

  it('店舗アカウントは自店舗のオプションを作成できる', async () => {
    await assertSucceeds(optionRef(PARTNER_A, 'opt-1').set(validOption))
  })

  it('他店舗アカウントはオプションを作成できない', async () => {
    await assertFails(optionRef(PARTNER_A, 'opt-1', partnerAuth(PARTNER_B)).set(validOption))
  })

  it('未ログインはオプションを作成できない', async () => {
    const unauthed = testEnv.unauthenticatedContext()
    await assertFails(optionRef(PARTNER_A, 'opt-1', unauthed).set(validOption))
  })

  it('option_name が空なら作成できない', async () => {
    await assertFails(optionRef(PARTNER_A, 'opt-1').set({ ...validOption, option_name: '' }))
  })

  it('option_description は 200 文字まで保存できる', async () => {
    await assertSucceeds(optionRef(PARTNER_A, 'opt-1').set({ ...validOption, option_description: 'あ'.repeat(200) }))
  })

  it('option_description が 201 文字なら作成できない', async () => {
    await assertFails(optionRef(PARTNER_A, 'opt-1').set({ ...validOption, option_description: 'あ'.repeat(201) }))
  })

  it('option_description が文字列以外なら作成できない', async () => {
    await assertFails(optionRef(PARTNER_A, 'opt-1').set({ ...validOption, option_description: 1 }))
  })

  it('option_items が空なら作成できない', async () => {
    await assertFails(optionRef(PARTNER_A, 'opt-1').set({ ...validOption, option_items: [] }))
  })

  it('店舗アカウントは自店舗のオプションを削除できる', async () => {
    await assertSucceeds(optionRef(PARTNER_A, 'opt-1').set(validOption))
    await assertSucceeds(optionRef(PARTNER_A, 'opt-1').delete())
  })

  it('店舗アカウントは option_ids をメニューに保存できる', async () => {
    await assertSucceeds(
      menuRef(PARTNER_A, 'menu-1').set({
        menu_name: 'バーガー',
        menu_description: '説明',
        option_ids: ['opt-1'],
      }),
    )
  })

  it('option_ids の重複は保存できない', async () => {
    await assertFails(
      menuRef(PARTNER_A, 'menu-1').set({
        menu_name: 'バーガー',
        menu_description: '説明',
        option_ids: ['opt-1', 'opt-1'],
      }),
    )
  })

  it('option_ids が 10 件を超えると保存できない', async () => {
    await assertFails(
      menuRef(PARTNER_A, 'menu-1').set({
        menu_name: 'バーガー',
        menu_description: '説明',
        option_ids: Array.from({ length: 11 }, (_, i) => `opt-${i}`),
      }),
    )
  })

  it('menu_description は 300 文字まで保存できる', async () => {
    await assertSucceeds(
      menuRef(PARTNER_A, 'menu-1').set({
        menu_name: 'バーガー',
        menu_description: 'あ'.repeat(300),
      }),
    )
  })

  it('menu_description が 301 文字なら作成できない', async () => {
    await assertFails(
      menuRef(PARTNER_A, 'menu-1').set({
        menu_name: 'バーガー',
        menu_description: 'あ'.repeat(301),
      }),
    )
  })

  it('menu_description が空なら作成できない', async () => {
    await assertFails(
      menuRef(PARTNER_A, 'menu-1').set({
        menu_name: 'バーガー',
        menu_description: '',
      }),
    )
  })

  it('menu_description が無いと作成できない', async () => {
    await assertFails(
      menuRef(PARTNER_A, 'menu-1').set({
        menu_name: 'バーガー',
      }),
    )
  })
})
