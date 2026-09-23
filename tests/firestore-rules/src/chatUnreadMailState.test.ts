import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assertFails,
  initializeTestEnvironment,
  type RulesTestContext,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

const PROJECT_ID = 'firestore-rules-chat-unread-mail'
const testDir = fileURLToPath(new URL('.', import.meta.url))

const USER_A = 'user-a'
const USER_B = 'user-b'

let testEnv: RulesTestEnvironment

function userAuth(userId: string) {
  return testEnv.authenticatedContext(userId)
}

function notificationStateRef(context: ReturnType<RulesTestEnvironment['authenticatedContext']>, userId: string) {
  return context.firestore().collection('users').doc(userId).collection('notification_states').doc('chat_unread_mail')
}

async function seedUser(context: RulesTestContext, userId: string): Promise<void> {
  await context.firestore().collection('users').doc(userId).set({
    user_id: userId,
    participated_event_count: 0,
    friend_count: 0,
    joined_community_count: 0,
    managed_community_count: 0,
    ordered_food_count: 0,
  })
  await context
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('notification_states')
    .doc('chat_unread_mail')
    .set({
      last_sent_at: new Date('2026-09-22T10:15:00+09:00'),
    })
}

describe('notification_states firestore rules', () => {
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
      await seedUser(context, USER_A)
      await seedUser(context, USER_B)
    })
  })

  it('owner cannot read own chat unread mail state', async () => {
    await assertFails(notificationStateRef(userAuth(USER_A), USER_A).get())
  })

  it('owner cannot write own chat unread mail state', async () => {
    await assertFails(
      notificationStateRef(userAuth(USER_A), USER_A).set({
        last_sent_at: new Date('2026-09-22T18:20:00+09:00'),
      }),
    )
  })

  it('other users cannot read or write chat unread mail state', async () => {
    await assertFails(notificationStateRef(userAuth(USER_B), USER_A).get())
    await assertFails(notificationStateRef(userAuth(USER_B), USER_A).delete())
  })

  it('unauthenticated clients cannot read chat unread mail state', async () => {
    await assertFails(notificationStateRef(testEnv.unauthenticatedContext(), USER_A).get())
  })
})
