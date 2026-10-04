/**
 * pstack 専用架空 fixture を Firestore / Auth に投入する（D-06）。
 *
 * 使い方（sandbox2606 例）:
 *   GCLOUD_PROJECT=bokudeli-event-yasu-2606 node scripts/pstack/seed-pstack-fixture.mjs
 *
 * 前提: Application Default Credentials で対象プロジェクトに書き込み権限があること。
 * 既存の pstack 固定 ID は merge 更新する。
 */
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const FIXTURE = {
  userId: 'pstack-user-participant-001',
  userEmail: 'pstack.participant@verify.shokujii.test',
  userName: 'pstack検証参加者',
  communityId: 'pstack-community-001',
  communityAccount: 'pstack-verify',
  communityName: 'pstack検証コミュニティ',
  eventId: 'pstack-event-cart-001',
  eventName: 'pstackカート検証イベント',
  menuId: 'pstack-menu-001',
  menuName: 'pstack検証弁当',
  menuPrice: 800,
  partnerId: 'pstack-partner-001',
  shopId: 'pstack-shop-001',
  shopName: 'pstack検証店舗',
}

const projectId = process.env.GCLOUD_PROJECT
if (projectId == null || projectId === '') {
  console.error('GCLOUD_PROJECT を設定してください')
  process.exit(1)
}

initializeApp({ projectId })
const db = getFirestore()
const auth = getAuth()

const now = Timestamp.now()
const nowMs = now.toMillis()
const deadline = Timestamp.fromMillis(nowMs + 7 * 24 * 60 * 60 * 1000)
const eventStart = Timestamp.fromMillis(nowMs + 14 * 24 * 60 * 60 * 1000)
const eventEnd = Timestamp.fromMillis(nowMs + 14 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)

const userRef = db.collection('users').doc(FIXTURE.userId)
const upiRef = db.collection('users_personal_information').doc(FIXTURE.userId)
const communityRef = db.collection('communities').doc(FIXTURE.communityId)
const eventRef = communityRef.collection('events').doc(FIXTURE.eventId)
const menuRef = eventRef.collection('menus').doc(FIXTURE.menuId)

try {
  await auth.getUser(FIXTURE.userId)
  await auth.updateUser(FIXTURE.userId, { email: FIXTURE.userEmail, emailVerified: true })
} catch {
  await auth.createUser({
    uid: FIXTURE.userId,
    email: FIXTURE.userEmail,
    emailVerified: true,
    displayName: FIXTURE.userName,
  })
}

await userRef.set(
  {
    user_id: FIXTURE.userId,
    user_name: FIXTURE.userName,
    created_at: now,
    updated_at: now,
    participated_event_count: 0,
    friend_count: 0,
    joined_community_count: 1,
    managed_community_count: 0,
    ordered_food_count: 0,
    is_deleted: false,
  },
  { merge: true },
)

await upiRef.set(
  {
    user_email: FIXTURE.userEmail,
    is_deleted: false,
  },
  { merge: true },
)

await communityRef.set(
  {
    community_id: FIXTURE.communityId,
    community_name: FIXTURE.communityName,
    community_account: FIXTURE.communityAccount,
    is_public: true,
    is_approved: true,
    is_show_member: true,
    subdomain_tags: [],
    enterprise_id: null,
    created_at: now,
    updated_at: now,
  },
  { merge: true },
)

await eventRef.set(
  {
    event_id: FIXTURE.eventId,
    community_id: FIXTURE.communityId,
    community_name: FIXTURE.communityName,
    community_account: FIXTURE.communityAccount,
    event_postalcode: '1000001',
    event_address_base: '東京都千代田区',
    event_address_detail: 'pstack fixture',
    event_start_datetime: eventStart,
    event_end_datetime: eventEnd,
    event_deadline_datetime: deadline,
    partner_id: FIXTURE.partnerId,
    shop_id: FIXTURE.shopId,
    shop_name: FIXTURE.shopName,
    event_name: FIXTURE.eventName,
    event_payment: 'user_advance',
    event_max_people: 25,
    organizer_fullname: 'pstack主催者',
    organizer_company: 'pstack fixture',
    organizer_email: 'organizer@verify.shokujii.test',
    organizer_phone_personal: '0312345678',
    organizer_memo: 'pstack fixture',
    is_public: true,
    event_status: { value: 'accepting_order' },
    is_deleted: false,
    created_at: now,
    updated_at: now,
    created_by: FIXTURE.userId,
    updated_by: FIXTURE.userId,
    members: [userRef],
    event_num_members: 1,
    enterprise_id: null,
  },
  { merge: true },
)

await menuRef.set(
  {
    menu_name: FIXTURE.menuName,
    menu_price: FIXTURE.menuPrice,
    menu_description: 'pstack フェーズ1用の架空メニュー',
    is_sold_out: false,
    is_selected: true,
    menu_sort_number: 0,
    limit_per_event: null,
    options: [],
    updatedAt: now,
  },
  { merge: true },
)

// カート初期化（当該ユーザーの in_cart を削除）
const ordersSnap = await eventRef.collection('members').doc(FIXTURE.userId).collection('member_orders').get()
const batch = db.batch()
for (const doc of ordersSnap.docs) {
  batch.delete(doc.ref)
}
await batch.commit()

console.log(
  JSON.stringify(
    {
      projectId,
      eventUrlPath: `/c/${FIXTURE.communityAccount}/e/${FIXTURE.eventId}`,
      userEmail: FIXTURE.userEmail,
      menuName: FIXTURE.menuName,
      menuPrice: FIXTURE.menuPrice,
      quantityDefault: 1,
    },
    null,
    2,
  ),
)
