# pstack 初期 sandbox プール台帳（手動予約）

F-2-3 の原子的予約の正本ではない。複数 tree からの排他は未実装。更新時は **予約 ID・世代** を増やし、旧行を削除しない。

最終棚卸し: **2026-10-04**（GitHub API・workflow 実行履歴。Firebase コンソールのデータ内容は未確認）

## 環境一覧（F-2-1）

| 環境 ID | git remote | GitHub リポジトリ | GCP / Firebase プロジェクト | user URL | partner URL | 直近の feature 系 branch | 直近 user デプロイ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| sandbox2603 | `sandbox2603` | `nijuni-yasu/bokudeli-event-yasu-2603-2` | `bokudeli-event-yasu-2603` | https://bokudeli-event-yasu-2603.web.app | https://bokudeli-event-yasu-2603-admin.web.app | `doc/2398-pstack` | 2026-10-04 `doc/2398-pstack` 成功（`e97ee241b`） |
| sandbox2606 | `sandbox2606` | `nijuni-yasu/bokudeli-event-yasu-2606` | `bokudeli-event-yasu-2606` | https://bokudeli-event-yasu-2606.web.app | https://bokudeli-event-yasu-2606-admin.web.app | なし（`development` のみ運用痕跡） | 2026-08-31 `development` 成功 |
| sandbox2607 | `sandbox2607` | `nijuni-yasu/bokudeli-event-yasu-2607` | `bokudeli-event-yasu-2607` | https://bokudeli-event-yasu-2607.web.app | https://bokudeli-event-yasu-2607-admin.web.app | なし | 2026-08-30 `development` 成功 |
| sandbox2608 | `sandbox2608` | `nijuni-yasu/bokudeli-event-yasu-2608` | `bokudeli-event-yasu-2608` | https://bokudeli-event-yasu-2608.web.app | https://bokudeli-event-yasu-2608-admin.web.app | `feat/957-form`（2026-10-01 storage/user デプロイあり） | 2026-10-01 `feat/957-form` 成功 |

共通: 2606〜2608 の構築手順は [sandbox2606-2608_環境構築手順.md](../../firebaseプロジェクト/sandbox2606-2608_環境構築手順.md)。**test データ移行は手順書上 ⏳**（2026-08-30 時点）。2606〜2608 の架空データ構築は別 PR。空き判定は branch とデプロイ履歴からの推定であり、Firestore の実データ・他利用者の予約は未確認。

**正本（データが揃うまで）**: 標準フローとイベント→カート検証は **sandbox2603**。2606〜2608 へ push・seed・`FUNCTIONS_ENV` 変更はしない。

## 予約

| 予約 ID | 世代 | 環境 ID | Issue / branch | 所有者 | 状態 | 解放条件 | 備考 |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| `pstack-res-20261004-001` | 1 | sandbox2606 | #2398 / `doc/2398-pstack` | pstack 導入作業 | 切替済み（行は残す） | 明示返却または PR マージ・クローズ | 2026-10-04 に正本を 2603 へ切替。2606 へは以後 push / dispatch しない |
| `pstack-res-20261004-002` | 1 | **sandbox2603** | #2398 / `doc/2398-pstack` | pstack 導入作業 | 占有 | PR マージ・クローズまたは明示返却（D-04） | 利用者が 2603 を指定。2606〜2608 はデータ未整備のためプール運用しない |

**競合時**: 同じ環境に別予約がある場合は push・workflow_dispatch しない。台帳を更新してから人に確認する。

## 次の作業（F-2-2 以降）

- sandbox2603 で固定 ID の fixture と D-07 受け口を使う（既存データは消さない）
- sandbox2606 では fixture と受け口を実施済み。2606〜2608 の横展開・データ構築は **別 PR**（`F-2-2` は Todo のまま）
- `F-2-3` 以降で Git 管理下の JSON 台帳＋世代検査へ移行
