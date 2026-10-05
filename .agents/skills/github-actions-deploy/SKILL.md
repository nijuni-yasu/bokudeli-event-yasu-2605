---
name: github-actions-deploy
description: sandbox / fork 向け。台帳で予約してからローカル HEAD を sandbox へ push し、gh CLI で deploy_*.yml を workflow_dispatch 発火する。空きは pick が selectable 環境から選ぶ。監視はバックグラウンド watch + wake 1 回。mode=report は sentinel / pending wake から結果報告のみ。sandboxRemote は記憶であり予約の証明ではない。git-reflect-after-commit / github-sandbox-wip-deploy から委譲時は会話に sandbox と書かなくてよい。一時障害は同じ SHA・同じ予約で失敗工程を最大 2 回再発火。本番 nijuniinc/bokudeli-event-new では push も発火も拒否。
---

# GitHub Actions デプロイ（push + 手動発火）

## 目的

sandbox / fork 向けに、**ローカル HEAD を sandbox リモートへ push してから**、対象リポジトリで **workflow_dispatch** を発火する。

push なしでリモート上の既存 ref を再デプロイしたい場合は、ユーザーが **「push せず」「再デプロイだけ」** と明示したときのみ push を省略する。

本リポジトリのワークフロー定義は `.github/workflows/deploy_*.yml` である。fork や sandbox リポでも **同一ファイル名・同一 inputs** を前提にする。異なる場合はユーザーに確認する。

## 本番リポジトリは対象外（厳守）

次のリポジトリに対しては、このスキル経由で **push も `gh workflow run` も一切実行してはならない**。依頼が来ても **拒否し、理由をユーザーに伝える**。

- **本番リポジトリ**: `nijuniinc/bokudeli-event-new`  
  URL 例: `https://github.com/nijuniinc/bokudeli-event-new`

正規化のあと `OWNER/REPO` が上記と一致する場合はブロックする。

**リモート URL**（`git remote get-url <remote>`）が本番を指す場合も、**push もデプロイ発火も中止**する。

本番のデプロイは **GitHub の Web UI からの手動実行**や **既定のブランチへの push** など、チームの運用に任せる。

## 前提

- **GitHub CLI** `gh` がインストール済みであること
- `gh auth login` 済みで、対象リポジトリに **actions:write** 相当の権限があること
- ネットワークが利用できる実行環境であること

権限不足で 403 になる場合は、ユーザーに PAT のスコープや org の GitHub Actions ポリシーを確認してもらう。

## sandbox 先の決定（優先順）

**REMOTE**（ローカル git remote 名）・**OWNER/REPO**・**ref** を次の優先順で決める。いずれの段でも **本番リポ**に当たったらそこで打ち切る。

### 1a. ユーザーが `リモート名/ブランチ名` を明示している場合（最優先）

会話から `sandbox2510/...` や `sandbox2603/...` など **`sandbox` で始まるリモート名**の **`A/B` 形式**を取り出す。ブランチ名に `/` が含まれ得るため、**先頭の最初の `/` だけ**で左右に分割する。**sandbox 系以外の remote 名は 1a では使わない**（1b / 1c を検討）。

- 例: `sandbox2603/ai/1842` → REMOTE `sandbox2603`、ref `ai/1842`
- 例: `sandbox2510/feature/foo` → REMOTE `sandbox2510`、ref `feature/foo`

`git remote get-url <REMOTE>` の URL から `OWNER/REPO` を取る。

### 1b. `branch.<branch>.sandboxRemote` + 現在ブランチ（`git-reflect-after-commit` と同じ）

会話に 1a の明示が無く、次の **いずれか** に該当する場合:

1. 会話に「sandbox にデプロイ」等の依頼がある
2. **`git-reflect-after-commit` または `github-sandbox-wip-deploy` から委譲されている**（会話に sandbox と書かなくてよい）
3. `branch.<branch>.sandboxRemote` が**設定済み**で、会話にデプロイ依頼がある（「デプロイして」「sandbox だけ」等。リモート/ブランチの明示が無い場合）

```bash
BRANCH=$(git branch --show-current)
REMOTE=$(git config --get branch."$BRANCH".sandboxRemote)
REF="$BRANCH"
```

- **未設定の場合**: 手順 2.5 の `pick` が selectable かつ空きの環境を選ぶ。成功したらその remote を保存する。空きが無ければデプロイせず報告する。人に候補一覧を出して選んでもらうのは、`pick` が失敗したあとの限定依頼だけ。

  ```bash
  git config branch."$BRANCH".sandboxRemote <pick した remote>
  ```

- `git remote get-url "$REMOTE"` の URL から `OWNER/REPO` を取る。

### 1c. ユーザーが URL または owner/repo とブランチを明示している場合（発火のみ）

- 完全 URL または `owner/repo` から `OWNER/REPO` を抽出する
- **ref**: ユーザーが会話で指定したブランチ名のみを使う
- **push は行わない**（ローカル remote との対応が不明なため）。**`SKIP_PUSH=true`** として手順 3 を省略し、手順 4 以降（発火のみ）に進む

### 1d. 上記いずれも満たさない場合

- **実行しない**
- 1b の委譲や「sandbox にデプロイ」があるときは 1d に落とさず、remote 未設定でも手順 2.5 の `pick` へ進む
- それ以外はユーザーに **`リモート名/ブランチ名`**、**owner/repo + ブランチ**、またはデプロイ依頼を求める

`@{upstream}` は **補助情報**（指定したリモート/ブランチと一致するか確認する）に使ってよいが、**ユーザー発話に無い ref で勝手に決めて実行してはならない**（1b の委譲・`sandboxRemote` 設定済みの場合を除く）。

## トリガー例

- `sandbox2510/feat/960-v2` にデプロイして
- sandbox にデプロイして（`sandboxRemote` 未設定なら `pick`）
- `/git-reflect-after-commit` 実行時（**B: sandbox デプロイ**。会話に sandbox と書かなくてよい）
- `/github-sandbox-wip-deploy` 実行時（同上）
- `https://github.com/nijuni-yasu/bokudeli-event-yasu-2603` のブランチ `ai/1842` を再デプロイ（**push 省略・発火のみ**）
- sandbox リポを workflow_dispatch で全部デプロイ（**リモート/ブランチまたは repo+ref が会話に含まれる場合**）

**NG**: `pick` が空き無しで失敗した「デプロイして」だけ → 占有状況を報告して止める。本番リポは拒否。

## 手順

### 0. 前提確認・モード判定

**mode=report**（結果報告のみ）に該当する場合は **手順 1〜7 をスキップ**し、**手順 9** へ:

- 会話または sentinel に `mode":"report"` がある
- `AGENT_LOOP_WAKE_deploy` sentinel を受信した
- `.agents/state/deploy-pending-wake.json` の未処理 wake を処理する（`deploy_id` を特定）

```bash
git status   # mode=report 以外では未コミット変更があれば中断
```

- **未コミット変更がある場合**（通常モード）: **中断**する（WIP 含めてデプロイしたい場合は `github-sandbox-wip-deploy` を案内）。
- 委譲元（`git-reflect-after-commit`）で clean 確認済みの場合は省略してよい。

pending wake 一覧:

```bash
python3 .agents/scripts/github_actions_deploy_wake.py list \
  --wake-file .agents/state/deploy-pending-wake.json
```

### 1. REMOTE・OWNER/REPO・ref の決定

上記 **sandbox 先の決定（優先順）** に従う。

### 2. 本番ブロックの最終確認

- `OWNER/REPO` が `nijuniinc/bokudeli-event-new` なら **中止**
- 1a / 1b で REMOTE を使う場合、`git remote get-url "$REMOTE"` が本番 URL なら **中止**

### 2.5 予約（push 前・必須）

台帳の正本はメインクローンの JSON。worktree からはスクリプトが `git-common-dir` で解決する。`branch.<branch>.sandboxRemote` は記憶であり、予約の証明にしない。

```bash
python3 .agents/scripts/sandbox_reservation.py path
```

1. 人が「この sandbox を別ブランチで使う」と明示したときだけ `switch`。旧 deploy run の停止・完了を確認するまで切り替えない。スクリプトも active run / API 検査失敗時には予約を保持して拒否する。リモート名を書いただけでは奪わない
2. 明示先または記憶済み REMOTE / OWNER/REPO がある場合は、台帳で remote / github_repo に対応する環境 ID を解決し、その環境を `reserve --env "$ENV_ID"` する。他環境への自動フォールバックは禁止。未登録・non-selectable・他作業の占有中なら中止する。指定がない場合だけ `pick`（内部で `reconcile`）。空きが無ければ中止する。
3. 予約結果の `remote` / `github_repo` / `gcloud_project` / `user_url` を REMOTE / OWNER/REPO / GCLOUD_PROJECT / 確認URL の唯一の入力とする。先に決めた宛先と一致しなければ副作用前に停止する
4. 予約成功後、必要なら `git config branch."$BRANCH".sandboxRemote` に remote を記憶する
5. `new_assignment` が true のときだけ fixture を戻す（手順 2.6）
6. push の直前に `check`。失敗したら **push しない**。seed・push・dispatch は必ず `run -- ...` 経由で実行し、チェックから副作用の終了まで台帳ロックを保持する

```bash
python3 .agents/scripts/sandbox_reservation.py pick \
  --branch "$BRANCH" --issue "$ISSUE" --pr "$PR" --owner "$OWNER_LABEL"
python3 .agents/scripts/sandbox_reservation.py check \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION"
```

`gh workflow run` の前に必ず `record-deploy --sha <対象HEAD>` を行う（単体発火・再試行も同じ）。`run` は対象 SHA 未記録なら拒否し、発火前に pending 記録を保存する。Actions に run がまだ表示されない時間も、switch / release / reconcile は解放しない。全ての発火済み run（失敗・cancelled を含む）の終了を確認したら、各 ID を `record-run` に渡す。対象 SHA・ブランチ・workflow・発火時刻との一致をスクリプトで確認する。dispatch 前に workflow の存在を API で確認し、404・権限不足・通信失敗なら dispatch を試さず pending も追加しない。GitHub API が environment 必須入力の不足を HTTP 422 で明示的に拒否した場合だけ、その呼出しの pending を取り消す。その他の存在確認後の dispatch 失敗は、受理された可能性があるため pending を保持する。

既存の失敗 pending を回復する場合は、人が当該 workflow・発火時刻の**未発火を明示的に確認したときだけ**次を実行する。エージェントが空一覧・経過時間・CLI の失敗だけを根拠に確認フラグを付けてはならない。スクリプトは API の全ページを検査し、該当 run（終了済み・別 SHA も含む）がある場合や API の確認ができない場合は pending を保持する。run が存在する場合は `record-run` で処理する。

```bash
python3 .agents/scripts/sandbox_reservation.py recover-dispatch \
  --env <ENV> --reservation-id <ID> --generation <N> \
  --workflow <WF> --since <pending に記録された時刻> --confirmed-not-started
```

未知の発火結果は予約保持のまま診断する。

```bash
python3 .agents/scripts/sandbox_reservation.py record-run \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" \
  --run-id "$RUN_ID"
```

mode=report の結果報告時も現行予約の ID・世代が一致する場合だけ同じ記録を行う。重複 run ID では pending を再消費しない。

### 2.6 新規割当の fixture（該当時だけ）

`pick` / `switch` の `seed` が true のときだけ、予約した環境の `GCLOUD_PROJECT` で seed する。同じブランチの再デプロイでは走らせない。プロジェクト全体は消さない。

```bash
python3 .agents/scripts/sandbox_reservation.py run \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" -- \
  env GCLOUD_PROJECT="$GCLOUD_PROJECT" node scripts/pstack/seed-pstack-fixture.mjs
python3 .agents/scripts/sandbox_reservation.py record-fixture \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" \
  --result ok
```

失敗したら push せず、`--result` に失敗理由を残して報告する。

### 3. sandbox へ push（デフォルト）

**次のいずれかに該当する場合は push を省略**し、手順 4 へ:

- ユーザーが **「push せず」「再デプロイだけ」** と明示した
- 手順 1c（owner/repo + ブランチのみ・発火のみモード）

**それ以外は必ず push してから発火する**（リモートの古いコミットをデプロイしないため）。

push 直前に手順 2.5 の `check` が成功していること。

```bash
python3 .agents/scripts/sandbox_reservation.py run \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" -- \
  git push --force-with-lease "$REMOTE" HEAD:"$REF"
```

- `-u`（`--set-upstream`）は付けない（追跡設定を変えないため）
- `--force-with-lease` 失敗時はリモートが他で更新された場合の可能性を伝え、`-f` で強制 push するか確認する

### 4. workflow_dispatch の environment 入力

ワークフローは `workflow_dispatch` の入力 **environment** に `development` または `production` が必須である。

**sandbox 系 fork** では setup ジョブ側でこの値は実質参照されず GitHub Environment は `sandbox` 固定だが、YAML 上は必須のため **`development` を渡す**。

```bash
-f environment=development
```

### 5. 発火するワークフローを選ぶ

対象は **リポジトリ内のデプロイ用ワークフロー 6 本のみ**。Lint や他用途のワークフローは動かさない。`deploy_manager.yml`（hosting manager）は #2087 で削除済み（フェーズ5で `deploy_support.yml` として新規追加予定）。

| ファイル名 | ざっくりした対象 |
|------------|------------------|
| deploy_user.yml | hosting user |
| deploy_partner.yml | hosting partner |
| deploy_enterprise.yml | hosting enterprise |
| deploy_functions.yml | functions |
| deploy_firestore.yml | firestore |
| deploy_storage.yml | storage |

- ユーザーが **特定パッケージだけ** と言ったら、対応する 1 本だけ `gh workflow run` する（例: user だけ → `deploy_user.yml`、enterprise / エンプラ だけ → `deploy_enterprise.yml`）
- **全体デプロイ**や指定がなければ、上記 6 本を **一括発火**する（**デフォルト**）
- **禁止**: 1 本ごとに `gh run watch` で完了を待ってから次を発火する直列パターン
- 同一リポの負荷を抑えたい場合やユーザーが明示した場合のみ、6 本を **順次発火**してよい
- sandbox fork に `deploy_enterprise.yml` が無い場合、その WF の `gh workflow run` は 404 等で失敗し得る。**他 WF は続行**し、失敗した WF だけユーザーに報告する

### 6. gh で実行するコマンド形

**1 本だけ発火する場合**

```bash
python3 .agents/scripts/sandbox_reservation.py record-deploy \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" \
  --sha "$(git rev-parse HEAD)"
SINCE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
python3 .agents/scripts/sandbox_reservation.py run \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" -- \
  gh workflow run deploy_user.yml --repo OWNER/REPO --ref REF -f environment=development
```

**6 本一括発火する場合（デフォルト・発火のみ・監視は手順 7）**

一括発火の直前に **基準時刻 `SINCE` を 1 回だけ**控え、手順 2.5 の `check` を繰り返す。失敗したら発火しない。対象 SHA を台帳に残す。

```bash
python3 .agents/scripts/sandbox_reservation.py check \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION"
python3 .agents/scripts/sandbox_reservation.py record-deploy \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" \
  --sha "$(git rev-parse HEAD)"
SINCE=$(date -u +%Y-%m-%dT%H:%M:%SZ)

for WF in deploy_user.yml deploy_partner.yml deploy_enterprise.yml \
          deploy_functions.yml deploy_firestore.yml deploy_storage.yml; do
  python3 .agents/scripts/sandbox_reservation.py run \
    --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" -- \
    gh workflow run "$WF" --repo OWNER/REPO --ref REF -f environment=development
done
```

`gh workflow run` は即座に返る。6 本を **watch 完了まで待たず** 連続発火する。

### 7. バックグラウンド監視起動（Shell 要件・厳守）

手順 6 の発火後、**エージェント内で `gh run watch` してはならない**。バックグラウンド watcher に委譲する。

発火前に `TARGET_SHA=$(git rev-parse HEAD)` を固定し、台帳の target_sha と一致させる。watcher はこの SHA に一致する run のみを監視し、終了後の headSha / status / conclusion を results に保存・再照合する。不一致・取得不能は success にしない。

発火前に **`DEPLOY_ID`**（UUID）と **`SINCE`**（手順 6 で控えた値）、発火した **`WORKFLOWS`**（カンマ区切り）を控える。

| パラメータ | 値 |
|-----------|-----|
| `block_until_ms` | `0` |
| `notify_on_output.pattern` | `^AGENT_LOOP_WAKE_deploy` |
| `notify_on_output.reason` | `deploy wake` |

手順 6 と連続実行する場合、**`SINCE` は手順 6 の値をそのまま使う**（手順 7 で再取得しない）。

```bash
DEPLOY_ID=$(python3 -c 'import uuid; print(uuid.uuid4())')
WORKFLOWS="deploy_user.yml,deploy_partner.yml,deploy_enterprise.yml,deploy_functions.yml,deploy_firestore.yml,deploy_storage.yml"

.agents/scripts/github_actions_deploy_watch.sh \
  --owner "$OWNER" \
  --repo "$REPO" \
  --ref "$REF" \
  --since "$SINCE" \
  --workflows "$WORKFLOWS" \
  --deploy-id "$DEPLOY_ID" \
  --target-sha "$TARGET_SHA"
```

- **`notify_on_output` を付けない起動は未完成**とみなし、手順 7 完了と報告してはならない
- 1 本だけ発火した場合は `WORKFLOWS` をその 1 ファイルにする
- `--created ">=$SINCE"` が使えない環境では、`gh run list` の `startedAt`／`createdAt` を確認し、基準時刻より後の run か目視で照合してから watch する
- 6 本を一括発火しても、GitHub Actions の **同時実行枠**の都合で run が **Queued** になることはある（発火は並列・実行はキュー待ちになり得る）

### 8. 即時報告

ユーザーへ次を伝える（各 run の成否はまだ確定しない）:

- **OWNER/REPO**・**ref**・**DEPLOY_ID**
- 発火した **workflow ファイル名**
- **バックグラウンド監視中**である旨（完了後 sentinel で自動 wake）
- push 省略時はその旨

### 9. sentinel 受信時 → 結果読み取り・失敗解析

stdout の sentinel 例:

```
AGENT_LOOP_WAKE_deploy {"prompt":"/github-actions-deploy","mode":"report","deploy_id":"<uuid>"}
```

- 結果 JSON: `.agents/state/deploy-results/<deploy_id>.json`

- **`notify_on_output` による wake 受信後、同一ターンで** 手順 10（報告 + consume）まで完走する
- 各 run の **成否** と **run URL** を results JSON から報告
- 失敗 run について `gh run view "$RUN_ID" --repo OWNER/REPO --log-failed` で解析（修正はしない）

**results JSON スキーマ（概要）**:

| フィールド | 説明 |
|-----------|------|
| `overall_status` | `success` / `failure` / `partial` |
| `runs[].workflow` | ワークフローファイル名 |
| `runs[].run_id` | GitHub run ID（特定失敗時は null） |
| `runs[].url` | run URL |
| `runs[].success` | 成否 |

### 10. 結果をユーザーに伝える

- push した **REMOTE**・**OWNER/REPO**・**ref**（push 省略時はその旨）
- 発火した **workflow ファイル名**、**environment 入力の値**
- 各 run の **成否** と **run の URL**
- 失敗時は **手順 9 の分類と原因サマリ**（下表）
- `branch.<branch>.sandboxRemote` を新規保存した場合はその旨

| 分類 | ログの手がかり | 典型的な原因 | 推奨アクション（提案のみ） |
|------|----------------|--------------|----------------------------|
| 一時的エラー | `HTTP Error: 503` / `500` / `429`、`service is currently unavailable` | Firebase / Google API 側の一時障害 | 同じ SHA・同じ予約で失敗工程だけ再発火（最大 2 回） |
| Rules コンパイルエラー | `compilation errors`、`firestore.rules` / `storage.rules` | ルールの構文・参照ミス | 該当ルールの修正が必要 |
| インデックス | `firestore.indexes.json` 関連の Error | indexes 定義の不整合 | indexes 定義の見直し |
| 権限・認証 | `403`、`PERMISSION_DENIED`、`GOOGLE_APPLICATION_CREDENTIALS`、IAM 系 | サービスアカウント権限・Secrets 設定 | リポの Secrets / IAM 設定確認 |
| API 未有効化 | `has not been used in project`、`API ... is disabled` | 必要 API が無効 | GCP で該当 API を有効化 |
| ビルド失敗 | `tsc`、`npm run build`、Functions のビルドエラー、`npm -w enterprise run build` | アプリ側のビルド不良 | ソース修正（このスキルでは修正しない） |

- **重要**: ビルド失敗・権限不足・Rules / indexes は解析して止める。**一時的エラーだけ**次の再試行を行う

**一時障害の再試行（D-11）**

1. 分類が一時的エラーである
2. 同じ SHA・同じ予約。`check` が成功する
3. 旧 run の終了を確認する
4. 失敗した workflow だけ再発火する。成功済みは繰り返さない
5. 追加は最大 2 回（初回を含め最大 3 回）。回数を台帳に残す

```bash
python3 .agents/scripts/sandbox_reservation.py record-retry \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" \
  --workflow "$WF" --count "$RETRY_COUNT"
```

上限に達したら未完了として報告する。予約は解放しない。報告時の成功は、台帳の `target_sha` と一致する run だけにする。古い SHA の成功を最新版の成功にしない。

**報告完了後**に pending wake を consume する（中断時の復旧のため、報告前に consume しない）:

```bash
python3 .agents/scripts/github_actions_deploy_wake.py consume \
  --wake-file .agents/state/deploy-pending-wake.json \
  --deploy-id "$DEPLOY_ID"
```

## スクリプト

| ファイル | 役割 |
|---------|------|
| [`.agents/scripts/github_actions_deploy_watch.sh`](../../scripts/github_actions_deploy_watch.sh) | バックグラウンド RUN_ID 特定 + 並列 watch + sentinel |
| [`.agents/scripts/github_actions_deploy_state.py`](../../scripts/github_actions_deploy_state.py) | watcher PID 管理 |
| [`.agents/scripts/github_actions_deploy_wake.py`](../../scripts/github_actions_deploy_wake.py) | 結果報告 pending wake |
| [`.agents/scripts/github_actions_deploy_check.py`](../../scripts/github_actions_deploy_check.py) | RUN_ID 特定・results JSON 構築 |
| [`.agents/scripts/sandbox_reservation.py`](../../scripts/sandbox_reservation.py) | 予約台帳の pick / check / reconcile / switch / release |

開発用テスト:

```bash
python3 .agents/hooks/test-github-actions-deploy-watch.py
python3 .agents/scripts/sandbox_reservation_test.py
bash -n .agents/scripts/github_actions_deploy_watch.sh
```

## トラブルシュート

### pending wake / sentinel が出ない

watcher ログと [`.agents/state/deploy-watch.json`](../../state/deploy-watch.json) を確認し、手動で mode=report（results JSON 参照）を実行する。

## 注意

- このスキルは **ローカルの Cursor エージェントが `git` と `gh` を実行する**前提
- **本番 `nijuniinc/bokudeli-event-new` は必ず拒否**（push も発火も）
- **デフォルトは push → 発火**。push 省略はユーザー明示または 1c（発火のみ）のみ
- **`branch.<branch>.sandboxRemote`** は割当先の記憶である。予約の証明は台帳の ID と世代
- 6 本すべて発火すると Functions や Hosting（user / partner / enterprise）がまとめて動く。ユーザーが「user だけ」「enterprise だけ」と言った場合は絞る
- 6 本一括は **一括発火 → バックグラウンド並列 watch → wake 1 回で結果報告** がデフォルト
- デプロイ失敗時は原因を解析する。一時的エラーだけ同じ SHA・同じ予約で失敗工程を最大 2 回再発火する

## 関連ドキュメント

sandbox や Environment の意味は `documents/実装メモ/sandboxデプロイのGitHub Actions.md` を参照する。
