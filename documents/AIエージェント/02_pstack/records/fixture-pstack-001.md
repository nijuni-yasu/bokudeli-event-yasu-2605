# pstack fixture `pstack-001`（D-06）

専用の架空データ。development / test の丸ごとコピーは使わない。投入は [scripts/pstack/seed-pstack-fixture.mjs](../../../scripts/pstack/seed-pstack-fixture.mjs)。

| キー | 値 |
| --- | --- |
| `userId` | `pstack-user-participant-001` |
| `userEmail` | `pstack.participant@verify.shokujii.test` |
| `communityAccount` | `pstack-verify` |
| `communityId` | `pstack-community-001` |
| `eventId` | `pstack-event-cart-001` |
| `menuId` | `pstack-menu-001` |
| `menuDisplayName` | `pstack検証弁当` |
| `menuPrice` | 800（円） |
| `quantity`（検証初期） | 1 |

## URL

| 環境 | イベント URL |
| --- | --- |
| sandbox2606 user | https://bokudeli-event-yasu-2606.web.app/c/pstack-verify/e/pstack-event-cart-001 |
| ローカル | `http://<dev-server>/c/pstack-verify/e/pstack-event-cart-001` |

## 初期状態

- 当該ユーザーの当該イベントの `in_cart` 注文は seed 実行時に削除する。
- イベントは `accepting_order`、締切は seed 実行から 7 日後。

## 認証（D-05 / D-07）

- メールログイン + `VERIFICATION_TEST_OUTBOX_MODE=record_skip_send` で OTP を `fetchVerificationTestPassCode` から取得する（`@verify.shokujii.test` のみ）。
- 詳細: [2026-10-04-検証用ログイン採用.md](./2026-10-04-検証用ログイン採用.md)
