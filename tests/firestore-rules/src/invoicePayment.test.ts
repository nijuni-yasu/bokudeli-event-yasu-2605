import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestContext,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

const PROJECT_ID = 'firestore-rules-invoice-payment'
const testDir = fileURLToPath(new URL('.', import.meta.url))

const SUPPORT_USER = 'support-user'
const MANAGER = 'manager-user'
const OUTSIDER = 'outsider'
const COMMUNITY_ID = 'community-1'
const EVENT_ID = 'event-1'

let testEnv: RulesTestEnvironment

function auth(userId: string) {
  return testEnv.authenticatedContext(userId)
}

function unauthenticated() {
  return testEnv.unauthenticatedContext()
}

function invoicePaymentRef(context: RulesTestContext) {
  return context
    .firestore()
    .collection('communities')
    .doc(COMMUNITY_ID)
    .collection('events')
    .doc(EVENT_ID)
    .collection('invoice_payments')
    .doc('current')
}

describe('invoice_payments firestore rules', () => {
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
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('configs')
        .doc('global')
        .set({
          support_user_ids: [SUPPORT_USER],
          system_id: 'system-user',
          maintenance_mode: false,
        })
      await context.firestore().collection('communities').doc(COMMUNITY_ID).set({
        community_id: COMMUNITY_ID,
        community_name: 'Community',
        community_account: 'community-1',
        is_approved: true,
        is_public: true,
      })
      await context
        .firestore()
        .collection('communities')
        .doc(COMMUNITY_ID)
        .collection('members')
        .doc(MANAGER)
        .set({
          roles: ['manager'],
        })
      await context.firestore().collection('communities').doc(COMMUNITY_ID).collection('events').doc(EVENT_ID).set({
        event_id: EVENT_ID,
        community_id: COMMUNITY_ID,
        event_name: 'Event',
        is_deleted: false,
        is_public: true,
      })
    })
  })

  it('support は read / write できる', async () => {
    await assertSucceeds(invoicePaymentRef(auth(SUPPORT_USER)).set({ status: 'unpaid', updated_by: SUPPORT_USER }))
    await assertSucceeds(invoicePaymentRef(auth(SUPPORT_USER)).get())
  })

  it('コミュマネは read / write できない', async () => {
    await assertFails(invoicePaymentRef(auth(MANAGER)).get())
    await assertFails(invoicePaymentRef(auth(MANAGER)).set({ status: 'paid' }))
  })

  it('未認証と一般ユーザーは read / write できない', async () => {
    await assertFails(invoicePaymentRef(unauthenticated()).get())
    await assertFails(invoicePaymentRef(auth(OUTSIDER)).get())
    await assertFails(invoicePaymentRef(auth(OUTSIDER)).set({ status: 'unpaid' }))
  })
})
