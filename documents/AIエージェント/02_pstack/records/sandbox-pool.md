# pstack 初期 sandbox プール台帳

予約の操作正本は Git に入れない次のファイル。worktree からは `git rev-parse --git-common-dir` の親を使う。

`/Users/yasukawanaohiro/Github/bokudeli-event-new/.agents/state/sandbox-reservations.json`

コマンドは [`.agents/scripts/sandbox_reservation.py`](../../../../.agents/scripts/sandbox_reservation.py)（`pick` / `reconcile` / `check` / `switch` / `release`）。このファイルは説明用の写しである。

最終棚卸し: **2026-10-04**（GitHub API・workflow 実行履歴。Firebase コンソールのデータ内容は未確認）

## 環境一覧（F-2-1）

| 環境 ID | git remote | GitHub リポジトリ | GCP / Firebase プロジェクト | user URL | partner URL | selectable | 直近の feature 系 branch | 直近 user デプロイ |
| --- | --- | --- | --- | --- | --- | :---: | --- | --- |
| sandbox2603 | `sandbox2603` | `nijuni-yasu/bokudeli-event-yasu-2603-2` | `bokudeli-event-yasu-2603` | https://bokudeli-event-yasu-2603.web.app | https://bokudeli-event-yasu-2603-admin.web.app | はい | `doc/2398-pstack` | 2026-10-04 `doc/2398-pstack` 成功（`e97ee241b`） |
| sandbox2606 | `sandbox2606` | `nijuni-yasu/bokudeli-event-yasu-2606` | `bokudeli-event-yasu-2606` | https://bokudeli-event-yasu-2606.web.app | https://bokudeli-event-yasu-2606-admin.web.app | いいえ | なし（`development` のみ運用痕跡） | 2026-08-31 `development` 成功 |
| sandbox2607 | `sandbox2607` | `nijuni-yasu/bokudeli-event-yasu-2607` | `bokudeli-event-yasu-2607` | https://bokudeli-event-yasu-2607.web.app | https://bokudeli-event-yasu-2607-admin.web.app | いいえ | なし | 2026-08-30 `development` 成功 |
| sandbox2608 | `sandbox2608` | `nijuni-yasu/bokudeli-event-yasu-2608` | `bokudeli-event-yasu-2608` | https://bokudeli-event-yasu-2608.web.app | https://bokudeli-event-yasu-2608-admin.web.app | いいえ | `feat/957-form`（2026-10-01 storage/user デプロイあり） | 2026-10-01 `feat/957-form` 成功 |

共通: 2606〜2608 の構築手順は [sandbox2606-2608_環境構築手順.md](../../firebaseプロジェクト/sandbox2606-2608_環境構築手順.md)。**test データ移行は手順書上 ⏳**（2026-08-30 時点）。2606〜2608 の架空データ構築は別 PR。

**正本（データが揃うまで）**: 標準フローとイベント→カート検証は **sandbox2603**。2606〜2608 へ push・seed・`FUNCTIONS_ENV` 変更はしない。

## 予約（2026-10-04 初期）

| 予約 ID | 世代 | 環境 ID | Issue / branch | 所有者 | 状態 | 解放条件 | 備考 |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| `pstack-res-20261004-001` | 1 | sandbox2606 | #2398 / `doc/2398-pstack` | pstack 導入作業 | 切替済み（履歴） | — | 2026-10-04 に正本を 2603 へ切替 |
| `pstack-res-20261004-002` | 1 | **sandbox2603** | #2398 / `doc/2398-pstack` / PR 2399 | pstack 導入作業 | 占有 | PR マージ・クローズまたは明示返却（D-04） | JSON 台帳の現行予約 |

**操作**:

- `pick`: 同じブランチなら継続。無ければ selectable かつ空きを1つ取る。空きが無ければ失敗
- `reconcile`: 予約の PR が MERGED / CLOSED なら空きに戻す。エージェントはマージしない
- `check`: push / dispatch 前に予約 ID と世代を確認する。`sandboxRemote` は証明にしない
- `switch`: 人が別ブランチ指定をしたときだけ世代を増やす
- `release`: 人が返却を指示したとき

## 残件

- 2606〜2608 の横展開・データ構築は **別 PR**（`F-2-2` は Todo）
- 別マシンからの台帳共有は未実装
