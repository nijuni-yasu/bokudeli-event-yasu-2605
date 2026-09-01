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

const PROJECT_ID = 'firestore-rules-support-cross-tenant'
const testDir = fileURLToPath(new URL('.', import.meta.url))

const SUPPORT_USER = 'support-user'
const OUTSIDER = 'outsider'
const ORDER_USER = 'order-user'
const ENTERPRISE_ID = 'enterprise-a'

const PF_COMMUNITY = 'community-pf'
const ENTERPRISE_COMMUNITY = 'community-ent'
const PF_EVENT = 'event-pf'
const ENTERPRISE_EVENT = 'event-ent'
const ORDER_ID = 'order-1'

let testEnv: RulesTestEnvironment

function auth(userId: string) {
  return testEnv.authenticatedContext(userId)
}

function communityRef(context: RulesTestContext, communityId: string) {
  return context.firestore().collection('communities').doc(communityId)
}

function eventRef(context: RulesTestContext, communityId: string, eventId: string) {
  return communityRef(context, communityId).collection('events').doc(eventId)
}

function memberOrderRef(context: RulesTestContext, communityId: string, eventId: string, orderId: string) {
  return eventRef(context, communityId, eventId)
    .collection('members')
    .doc(ORDER_USER)
    .collection('member_orders')
    .doc(orderId)
}

async function seedGlobalConfig(context: RulesTestContext): Promise<void> {
  await context
    .firestore()
    .collection('configs')
    .doc('global')
    .set({
      support_user_ids: [SUPPORT_USER],
      system_id: 'system-user',
      maintenance_mode: false,
    })
}

async function seedCommunity(context: RulesTestContext, communityId: string, enterpriseId: string | null) {
  await communityRef(context, communityId).set({
    community_id: communityId,
    community_name: `Community ${communityId}`,
    community_account: communityId,
    is_public: true,
    is_approved: true,
    enterprise_id: enterpriseId,
  })
}

async function seedEvent(context: RulesTestContext, communityId: string, eventId: string, enterpriseId: string | null) {
  await eventRef(context, communityId, eventId).set({
    event_id: eventId,
    community_id: communityId,
    event_name: `Event ${eventId}`,
    is_deleted: false,
    is_public: true,
    enterprise_id: enterpriseId,
  })
}

async function seedMemberOrder(
  context: RulesTestContext,
  communityId: string,
  eventId: string,
  enterpriseId: string | null,
) {
  await memberOrderRef(context, communityId, eventId, ORDER_ID).set({
    order_id: ORDER_ID,
    user_id: ORDER_USER,
    event_id: eventId,
    community_id: communityId,
    status: 'ordered',
    enterprise_id: enterpriseId,
  })
}

describe('support cross-tenant read firestore rules', () => {
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
      await seedGlobalConfig(context)
      await seedCommunity(context, PF_COMMUNITY, null)
      await seedCommunity(context, ENTERPRISE_COMMUNITY, ENTERPRISE_ID)
      await seedEvent(context, PF_COMMUNITY, PF_EVENT, null)
      await seedEvent(context, ENTERPRISE_COMMUNITY, ENTERPRISE_EVENT, ENTERPRISE_ID)
      await seedMemberOrder(context, PF_COMMUNITY, PF_EVENT, null)
      await seedMemberOrder(context, ENTERPRISE_COMMUNITY, ENTERPRISE_EVENT, ENTERPRISE_ID)
    })
  })

  it('support can read enterprise community', async () => {
    await assertSucceeds(communityRef(auth(SUPPORT_USER), ENTERPRISE_COMMUNITY).get())
  })

  it('support can read enterprise event', async () => {
    await assertSucceeds(eventRef(auth(SUPPORT_USER), ENTERPRISE_COMMUNITY, ENTERPRISE_EVENT).get())
  })

  it('support can read enterprise member_order', async () => {
    await assertSucceeds(memberOrderRef(auth(SUPPORT_USER), ENTERPRISE_COMMUNITY, ENTERPRISE_EVENT, ORDER_ID).get())
  })

  it('support can list communities without enterprise_id filter', async () => {
    await assertSucceeds(auth(SUPPORT_USER).firestore().collection('communities').get())
  })

  it('support can run events collectionGroup query without enterprise_id filter', async () => {
    await assertSucceeds(auth(SUPPORT_USER).firestore().collectionGroup('events').get())
  })

  it('support can run member_orders collectionGroup query without enterprise_id filter', async () => {
    await assertSucceeds(auth(SUPPORT_USER).firestore().collectionGroup('member_orders').get())
  })

  it('non-support cannot read enterprise community', async () => {
    await assertFails(communityRef(auth(OUTSIDER), ENTERPRISE_COMMUNITY).get())
  })

  it('non-support cannot read enterprise event', async () => {
    await assertFails(eventRef(auth(OUTSIDER), ENTERPRISE_COMMUNITY, ENTERPRISE_EVENT).get())
  })

  it('non-support cannot read enterprise member_order', async () => {
    await assertFails(memberOrderRef(auth(OUTSIDER), ENTERPRISE_COMMUNITY, ENTERPRISE_EVENT, ORDER_ID).get())
  })

  it('non-support can still read PF community and event', async () => {
    await assertSucceeds(communityRef(auth(OUTSIDER), PF_COMMUNITY).get())
    await assertSucceeds(eventRef(auth(OUTSIDER), PF_COMMUNITY, PF_EVENT).get())
  })
})
