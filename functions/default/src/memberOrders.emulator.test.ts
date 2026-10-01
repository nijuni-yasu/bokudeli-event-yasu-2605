import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeApp, deleteApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

vi.mock('./orderConfirmedSideEffects.js', () => ({ applyOrderConfirmedSideEffects: vi.fn() }))
import { applyOrderConfirmedSideEffects } from './orderConfirmedSideEffects.js'

const auth = {
  uid: 'user-1',
  token: {
    uid: 'user-1',
    sub: 'user-1',
    aud: 'demo-zero-order',
    iss: 'https://securetoken.google.com/demo-zero-order',
    auth_time: 1,
    iat: 1,
    exp: 9999999999,
    firebase: { identities: {}, sign_in_provider: 'custom' },
  },
}
const eventPath = 'communities/community-1/events/event-1'
const orderPath = `${eventPath}/members/user-1/member_orders`

describe.skipIf(process.env.FIRESTORE_EMULATOR_HOST == null)('0円事前決済の確定（エミュレータ）', () => {
  let app: ReturnType<typeof initializeApp>
  let confirmOrder: typeof import('./memberOrders.js').confirmOrderHandler
  beforeAll(async () => {
    app = initializeApp({ projectId: 'demo-zero-order' })
    confirmOrder = (await import('./memberOrders.js')).confirmOrderHandler
  })
  afterAll(async () => {
    await deleteApp(app)
  })
  beforeEach(async () => {
    vi.mocked(applyOrderConfirmedSideEffects).mockClear()
    const db = getFirestore()
    await db.recursiveDelete(db.collection('communities'))
    await db.doc(eventPath).set({
      event_id: 'event-1',
      community_id: 'community-1',
      community_name: 'テスト',
      community_account: 'test',
      event_payment: 'user_advance',
      event_status: { value: 'accepting_order' },
      event_deadline_datetime: Timestamp.fromMillis(Timestamp.now().toMillis() + 86400000),
    })
    await db.doc(`${eventPath}/menus/menu-zero`).set({
      menu_name: '注文なしで参加',
      menu_price: 0,
      menu_sort_number: 0,
      menu_description: '参加のみ',
    })
    await db.doc(`${orderPath}/order-zero`).set({
      order_id: 'order-zero',
      menu_id: 'menu-zero',
      menu_name: '注文なしで参加',
      menu_price: 0,
      community_id: 'community-1',
      event_id: 'event-1',
      user_id: 'user-1',
      status: 'in_cart',
    })
  })
  const request = (orderIds = ['order-zero']) => ({
    auth,
    data: { community_id: 'community-1', event_id: 'event-1', order_ids: orderIds },
  })

  it('0円の注文を決済記録なしで確定し、通常の確定後処理を呼ぶ', async () => {
    await expect(confirmOrder(request())).resolves.toEqual({})
    const order = (await getFirestore().doc(`${orderPath}/order-zero`).get()).data()
    expect(order?.status).toBe('ordered')
    expect(order?.ordered_at).toBeDefined()
    expect(order?.stripe_id).toBeUndefined()
    expect((await getFirestore().collection(`${eventPath}/stripes`).get()).empty).toBe(true)
    expect(applyOrderConfirmedSideEffects).toHaveBeenCalledOnce()
  })

  it('0円と有料を混ぜても有料分を無決済で確定できない', async () => {
    const db = getFirestore()
    await db.doc(`${eventPath}/menus/menu-paid`).set({
      menu_name: '弁当',
      menu_price: 1000,
      menu_sort_number: 1,
      menu_description: '弁当',
    })
    await db.doc(`${orderPath}/order-paid`).set({
      order_id: 'order-paid',
      menu_id: 'menu-paid',
      menu_name: '弁当',
      menu_price: 1000,
      community_id: 'community-1',
      event_id: 'event-1',
      user_id: 'user-1',
      status: 'in_cart',
    })
    await expect(confirmOrder(request(['order-zero', 'order-paid']))).rejects.toMatchObject({
      code: 'failed-precondition',
    })
    expect((await db.doc(`${orderPath}/order-zero`).get()).get('status')).toBe('in_cart')
    expect((await db.doc(`${orderPath}/order-paid`).get()).get('status')).toBe('in_cart')
    expect(applyOrderConfirmedSideEffects).not.toHaveBeenCalled()
  })

  it('0円でも締切超過と二重確定を拒否する', async () => {
    await confirmOrder(request())
    await expect(confirmOrder(request())).rejects.toMatchObject({ code: 'failed-precondition' })
    await getFirestore().doc(`${orderPath}/order-zero`).update({ status: 'in_cart' })
    await getFirestore()
      .doc(eventPath)
      .update({ event_deadline_datetime: Timestamp.fromMillis(1) })
    await expect(confirmOrder(request())).rejects.toMatchObject({ code: 'failed-precondition' })
    expect((await getFirestore().doc(`${orderPath}/order-zero`).get()).get('status')).toBe('in_cart')
  })
})
