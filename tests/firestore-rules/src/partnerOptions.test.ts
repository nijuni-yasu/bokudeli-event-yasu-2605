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

const testDir = fileURLToPath(new URL('.', import.meta.url))
const PARTNER_A = 'partner-a'
let testEnv: RulesTestEnvironment

// 保存時の内容検証は Callable、Rules は検証経路を迂回する書き込みを拒否する。
describe('店舗メニュー・オプションは Callable 専用', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-partner-options-rules',
      firestore: { rules: readFileSync(resolve(testDir, '../../../firestore.rules'), 'utf8') },
    })
  })
  afterAll(async () => {
    await testEnv.cleanup()
  })
  beforeEach(async () => {
    await testEnv.clearFirestore()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      for (const collection of ['menus', 'options']) {
        await context
          .firestore()
          .doc(`partners/${PARTNER_A}/${collection}/existing`)
          .set({
            option_name: 'サイズ',
            option_ids: ['existing'],
            menu_sort_number: 0,
            option_items: [{ item_id: 'large', name: '大盛', price_delta: 100 }],
          })
      }
    })
  })
  for (const collection of ['menus', 'options']) {
    for (const uid of [PARTNER_A, 'partner-b', null]) {
      it(`${collection}: ${uid ?? '未認証'} は作成・変更・削除できない`, async () => {
        const context = uid == null ? testEnv.unauthenticatedContext() : testEnv.authenticatedContext(uid)
        const docs = context.firestore().collection(`partners/${PARTNER_A}/${collection}`)
        await assertFails(docs.doc('new').set({ option_ids: ['missing'] }))
        await assertFails(docs.doc('existing').update({ option_items: [{ price_delta: 'invalid' }] }))
        await assertFails(docs.doc('existing').update({ menu_sort_number: 1 }))
        await assertFails(docs.doc('existing').delete())
      })
    }
    it(`${collection}: 公開読取を維持する`, async () => {
      await assertSucceeds(
        testEnv.unauthenticatedContext().firestore().doc(`partners/${PARTNER_A}/${collection}/existing`).get(),
      )
    })
  }
})
