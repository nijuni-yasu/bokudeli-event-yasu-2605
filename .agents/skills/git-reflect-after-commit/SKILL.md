---
name: git-reflect-after-commit
description: コミット完了後の次ステップ。origin へ push して PR 作成/更新（git-create-pull-request 全手順・手順 13 の AI レビュー待ち含む）し、ブランチに紐づく sandbox へ push・デプロイ（github-actions-deploy へ委譲）する。標準フローの実装依頼では git-commit-workflow から提案せず委譲する。コミットだけの依頼では、完了直後に「/git-reflect-after-commit を実行しますか？」と提案し、ユーザーが「して」「お願い」「反映して」等と答えたら実行する。「push して PR 作って sandbox にもデプロイ」「コミット後の反映」でも使用。本番 nijuniinc/bokudeli-event-new へはデプロイ発火しない。
---

# コミット後の反映（PR + sandbox デプロイ）

ローカルのコミット完了を起点に、PR 反映と sandbox デプロイをまとめて行うオーケストレーター。
コミット作成自体（新規/分割/fixup/squash）はこのスキルの範囲外で、完了済みを前提とする。
それぞれの詳細手順は委譲先スキルに従い、本スキルはルールを上書きしない。

標準フローの実装依頼の入口でもある（新しい委譲スキルは作らない）。A（PR）と B（予約してデプロイ）を同じターンで始め、レビュー待ちをデプロイの前条件にしない。修正で HEAD が変わったら同じ予約で再デプロイし、PR HEAD とデプロイ SHA を揃える。予約正本はメインクローンの `.agents/state/sandbox-reservations.json`（[sandbox-pool.md](../../../documents/AIエージェント/02_pstack/records/sandbox-pool.md)）。候補は selectable な環境だけ（現状 sandbox2603）。2606〜2608 へはデータ構築の別 PR まで push しない。

## 本番リポジトリは対象外（厳守）

本番リポ `nijuniinc/bokudeli-event-new` には **デプロイ発火を一切行わない**。
A の PR 用 push（origin への通常 push）は許可するが、B のデプロイ対象に origin/本番を選んではならない。
B は `github-actions-deploy` に委譲し、同スキル内で本番ブロックを実施する。

## 手順

### 1. 前提確認

- `git status` で未コミット変更が無いか確認する（このスキルはコミット完了が前提）。
- 直前が git-commit-workflow / git-fixup / git-squash の場合は rebase により履歴が書き換わっていることがある。
  upstream（本番 origin）へは fixup/squash 側で push していないことが多い（本番 upstream ブロックのため）。

### 1b. 最新 `origin/development`（R-1 / R-2）

push / デプロイ / 引き渡しの前に次を行う。

- `git fetch origin development`
- `origin/development` の SHA と確認時刻を記録する
- `git worktree list` で同じブランチが別 worktree にあれば止める
- `git merge-base --is-ancestor origin/development HEAD` が 1 なら rebase する。0 は取込済み、その他は検査失敗として停止する
- 未コミット差分があるときは `git stash push -u` で退避する。`--all` は使わず、gitignored の `.env` は含めない。rebase 後に戻す。競合したら意図を読んで解消し、仕様判断が必要なら止めて stash は残す
- 複数 Issue のコミットは rebase で 1 つにまとめない
- 未知の remote 専用コミットがある diverge、lease 不一致では無条件 force しない（手順 4 の既存判定）
- 基点 SHA と確認時刻を結果報告に含める

### 2. 実行範囲の決定

- ユーザー指定が無ければ **A・B の両方**を実行する。標準フローからの委譲も両方。A の完了を待ってから B を始めない。
- 「PR だけ」「sandbox だけ」と指定された場合はその片方に絞る。
- **AI レビュー待ち → evaluate** は `git-create-pull-request` 手順 13 で **デフォルト ON**（create-pr 内で `wait-ai-pr-review` を起動。本スキルで二重起動しない）。
- 会話に「評価待ちなし」「evaluate しない」「review wait しない」があれば create-pr 手順 13 もスキップする（手順 4 委譲時に伝播）。

### 3. lint・format・型・test チェック（PR verify 相当・A・B 両方の push 前に一度だけ実施）

`lint-and-format` スキルの手順に従い、build / lint / format / 型 / vitest をローカルで実行する（format 失敗時は自動修正）。

- **build・lint・build:types・test エラーがある場合**: ユーザーに報告して **中断する**（push もデプロイもしない）。
- **format エラーがある場合**: `lint-and-format` の自動修正手順に従い修正して続行する。
  - 自動修正で生じた変更の扱い（追加コミット / amend 等）はユーザーに確認する。
    勝手に既存コミットを書き換えない。

### 4. A) origin へ push して PR 作成/更新

- 現在ブランチを `ref` とする（`git branch --show-current`）。
- **push 先 ref の検証（厳守）** — push 実行前に必ず確認する:
  - **拒否**（ref の**完全一致**）: `development` / `main` / `production`、または `v` + 数字で始まるタグ ref（例: `v2.6.0`）
  - **許可**: 上記以外の作業ブランチ（feature / `release/*` / `sync/*` / `hotfix/*` 等）。ブランチ名への部分一致では判定しない（`sync/main-to-development` は許可）
  - 拒否条件に該当する場合は **push せず中断**し、保護 ref への直 push は人間のリリース手順に従う旨をユーザーに伝える
- **push の方法**（`ref` はリモート上のブランチ名。通常は現在ブランチ名）:
  - **履歴書き換え時**（会話内の fixup / squash / amend / rebase に限らない。判定は [`git-create-pull-request` 手順 9](../git-create-pull-request/SKILL.md) と同一。diverge でも、`origin/$ref` 専用コミットがすべて HEAD 上の書き換えなら可）:

    ```bash
    git push --force-with-lease origin HEAD:<ref>
    ```

    書き換え判定: `git cherry -v HEAD origin/$ref` が `-`、または `+` でも `origin/$ref..HEAD` に同じ作者かつ同じ件名のコミットがある。会話の外で rebase していてもこの判定を満たせば `--force-with-lease` してよい。

  - **通常**（ahead のみ）:

    ```bash
    git push origin HEAD:<ref>
    ```

    behind のみ、またはリモート専用に独自コミットがある diverge は **push せず中断**し、リモート更新の可能性をユーザーに伝えて確認する。通常 push が non-fast-forward で reject されたときも、上の書き換え判定を満たす場合だけ `--force-with-lease` で再試行してよい。満たさなければ再試行しない。`-f` は勝手に使わない。

  - **`--force-with-lease` を実行してよい条件**（いずれか。正本は create-pr 手順 9）:

    1. diverge のリモート専用コミットがすべてローカルの書き換え（rebase / amend / fixup / squash。会話外でも可）
    2. ユーザーが force push / `--force-with-lease` を明示指示した

- [`git-create-pull-request`](../git-create-pull-request/SKILL.md) スキルの**全手順**を実行する（手順 0 lint は本手順 3 済みのため create-pr 側でスキップ。**手順 11 reviewer 追加 + 手順 12 Copilot/Codex 依頼 + 手順 13 の wait 委譲**を含む）。
  **手順 9（origin push）は本手順 4 で push 済みのため create-pr 側でスキップ**される。
- 手順 13 委譲時は **wait-ai-pr-review 手順 3** の Shell 要件（`block_until_ms: 0` + `notify_on_output: ^AGENT_LOOP_WAKE_pr_review`）を満たすこと（reflect 側で watcher を二重起動しないが、Shell 要件は省略しない）。

### 5. B) sandbox を予約してデプロイ

git-commit-workflow / git-fixup / git-squash の upstream push（`branch.<branch>.remote`）とは **別系統**である。
PR 用は **origin**（手順 4）、動作確認用は台帳の予約と **`branch.<branch>.sandboxRemote`**（記憶）とする。

A の wait 起動のあと、レビュー完了を待たずに B を始める。

1. 現在ブランチ・Issue・PR 番号を控える
2. [`github-actions-deploy`](../github-actions-deploy/SKILL.md) に委譲する（手順 2.5 の `pick` / seed / `check`、push、発火、一時障害の再試行、watch を含む）
3. 本スキルでは B 専用の push を **重複実施しない**

- 手順 1 で clean 確認済みのため、`github-actions-deploy` 手順 0 は省略してよい
- B 実行時は `github-actions-deploy` の **1b** が委譲をトリガーとして成立する（会話に sandbox と書かなくてよい）
- ユーザーが sandbox 向けに **`sandbox*` リモート名/ブランチ名** を明示している場合は、`github-actions-deploy` 手順 1a がそれを優先する。占有中の環境を別名の作業が取るには人が `switch` を指示する
- `pick` が空き無しで失敗したらデプロイせず報告する。PR とレビューは続ける
- レビュー修正で HEAD が変わったら、同じ予約のまま再デプロイする。fixture は戻さない。台帳の `target_sha` と一致する run だけ成功にする
- 一時障害の再試行は deploy スキルが行う。ビルド失敗は再試行しない

### 6. 結果報告

標準フローの引き渡しでは [標準フロー §7](../../../documents/AIエージェント/02_pstack/04_作業依頼からsandbox確認までの標準フロー.md) の項目を書く。PR HEAD とデプロイ SHA が揃い、必要な workflow が成功するまで完了にしない。

- Issue / PR
- 確認 URL / sandbox ID / 予約 ID / 世代
- PR HEAD / デプロイ SHA / 対象コンポーネント
- CI・Copilot・Codex・RC 対応の結果
- デプロイ run と成否（台帳の `target_sha` と一致するもの）
- AI がデプロイ先で確認した操作・証拠。イベント→カートなら [`shokujii-user-event-cart-verify`](../shokujii-user-event-cart-verify/SKILL.md)。それ以外は開いた URL と未確認の操作
- 人のログイン方法・テストデータ・確認手順
- 未解決事項・未証明の範囲
- 予約の解放条件・切替履歴
- 人に依頼すること: sandbox 確認、PR 承認、development へのマージ

あわせて次も書く。

- AI レビュー監視（A 実行時・手順 13）: PR 番号、`REVIEW_REQUEST_SINCE`、watcher 起動済み
- sandbox デプロイは **reflect 完了時点では監視中**になり得る（wake 後に手順 9〜10 で結果報告）
- `branch.<branch>.sandboxRemote` を新規保存した場合はその旨（B 実行時）

引き渡し直前に手順 1b を再実行する。更新を取り込んで HEAD が変わったら、その HEAD への CI・必要な画面検証・レビュー更新・再デプロイが揃うまで完了扱いにしない。

## 注意

- 委譲先（`git-create-pull-request` / `wait-ai-pr-review` / `github-actions-deploy` / `lint-and-format`）のルールを上書きしない。
- AI レビュー wait は **create-pr 手順 13 のみ**から起動する（本スキルで wait を重複起動しない）。
- origin への push の **`--force-with-lease`** は、ローカル書き換えと判定できた diverge、またはユーザー明示承認時のみ。リモート専用の独自コミットがある diverge と behind のみは禁止。
  sandbox への push は **`github-actions-deploy` 手順 3** に委譲する。
- 本番への **デプロイ発火**は行わない（origin への PR 用 push は許可）。
- このスキルは Cursor / Claude エージェントがローカルで `git` と `gh` を実行する前提。
