# ブランチ doc/security-diagnosis レビュー記録

PR #2439 の外部レビュー評価。診断記録の前提を直した項目と、仕様判断が残る項目を分ける。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 6085720072 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | 本番依存の見出しが直接依存だけに読める<br>`documents/セキュリティ診断/2026-10-10.md` の CVE 節<br>grpc と proxy-addr は推移依存なのに直接と誤読される<br>見出しを直接・推移の両方に変えた |
| [x] | RC-2 | 5473191524 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の overview が前提の修正が必要と書いている<br>公開プロフィールと invoker 既定の2点<br>追加の差分は示さず、open findings は 0<br>具体的な修正は RC-5 と RC-6 で評価する |
| [x] | RC-3 | 4232723267 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | 診断対象 SHA がこの PR の祖先に無い<br>`9937fe608` は `origin/ai/2428` にだけある<br>development へマージした文書からはそのコミットを復元できない<br>アプリ内容が同じ development の SHA に差し替えた |
| [x] | RC-4 | 4232723280 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | 名簿とチラシの PDF がログイン確認だけで返る<br>`namesprint` と `flyer`。権限チェックは `eventBillInvoice` にある<br>ログイン済みなら eventId を知る人が名簿を受け取れる<br>所見 S-6 として記録し #2440 を作った |
| [ ] | RC-5 | 4232723259 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | 友人一覧の未ログイン公開は Phase 1 の仕様<br>`02_友人一覧機能.md` と診断の S-2<br>high の不備として残すと #2431 が仕様の回帰になる<br>受容済みリスクへの書き換えは仕様ラベルのため自動修正していない |
| [x] | RC-6 | 4232723254 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | LINE 一斉配信の invoker 未指定は CLI が public にする<br>`lineBroadcast.ts` と Firebase CLI 15.15.0<br>low の条件付き所見では露出を小さく見積もる<br>重大度を high にし、#2433 に前提の訂正を書いた |
| [x] | RC-7 | 4232723272 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | grpc の経路を firebase-admin にまとめている<br>lockfile では 1.9.16 と 1.14.4 の二つ<br>Functions 側を firebase-admin の更新で直そうとして経路が残る<br>二つの経路とバージョンを記録し、#2437 に補足した |

---

## 評価セッション（2026-10-10 02:30・review-comments-evaluate）

- **評価日時**: 2026-10-10 02:30 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `doc/security-diagnosis`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439
- **since**: 2026-10-09T17:14:04Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3
  - GitHub id 6085687949（issue comment）: レビュー依頼の定型文
  - GitHub id 6085688682（issue comment）: Codex の活動サマリと接続案内のみ
  - GitHub id 5473209340（review）: Codex の "Here are some automated review suggestions" と接続案内のみ
- **重複除外**: なし
- **手順 4a 自動修正**: RC-1、RC-3、RC-4、RC-6、RC-7（🚨 2件 / 🟡 3件）
- **手順 4a 自動修正しない**: RC-5（🟡。ラベルが 📑 仕様書 と 🔒 セキュリティ）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 6085720072 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | 本番依存の見出しが直接依存だけに読める<br>`documents/セキュリティ診断/2026-10-10.md` の CVE 節<br>grpc と proxy-addr は推移依存なのに直接と誤読される<br>見出しを直接・推移の両方に変えた |
| [x] | RC-2 | 5473191524 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の overview が前提の修正が必要と書いている<br>公開プロフィールと invoker 既定の2点<br>追加の差分は示さず、open findings は 0<br>具体的な修正は RC-5 と RC-6 で評価する |
| [x] | RC-3 | 4232723267 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | 診断対象 SHA がこの PR の祖先に無い<br>`9937fe608` は `origin/ai/2428` にだけある<br>development へマージした文書からはそのコミットを復元できない<br>アプリ内容が同じ development の SHA に差し替えた |
| [x] | RC-4 | 4232723280 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | 名簿とチラシの PDF がログイン確認だけで返る<br>`namesprint` と `flyer`。権限チェックは `eventBillInvoice` にある<br>ログイン済みなら eventId を知る人が名簿を受け取れる<br>所見 S-6 として記録し #2440 を作った |
| [ ] | RC-5 | 4232723259 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | 友人一覧の未ログイン公開は Phase 1 の仕様<br>`02_友人一覧機能.md` と診断の S-2<br>high の不備として残すと #2431 が仕様の回帰になる<br>受容済みリスクへの書き換えは仕様ラベルのため自動修正していない |
| [x] | RC-6 | 4232723254 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | LINE 一斉配信の invoker 未指定は CLI が public にする<br>`lineBroadcast.ts` と Firebase CLI 15.15.0<br>low の条件付き所見では露出を小さく見積もる<br>重大度を high にし、#2433 に前提の訂正を書いた |
| [x] | RC-7 | 4232723272 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | grpc の経路を firebase-admin にまとめている<br>lockfile では 1.9.16 と 1.14.4 の二つ<br>Functions 側を firebase-admin の更新で直そうとして経路が残る<br>二つの経路とバージョンを記録し、#2437 に補足した |

---

**識別子**: RC-1（GitHub id: 6085720072）

**レビュワー**: Copilot

**指摘箇所**: `documents/セキュリティ診断/2026-10-10.md`（会話コメント。レビュー時点の見出しは CVE 節）

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

🟡 修正提案 [📄ドキュメントのみ/S]: `documents/セキュリティ診断/2026-10-10.md:95` の「本番の依存として直接あるもの」は、表に `@grpc/grpc-js`（firebase / firebase-admin 経由）と `proxy-addr`（Slack Bolt / Express 経由）という推移依存も含むため、見出しが不正確です。「本番で使われる依存（直接・推移）」などにすると誤読を防げます。

**コメント要約**: 本番依存の見出しが直接依存だけに読める
`documents/セキュリティ診断/2026-10-10.md` の CVE 節
grpc と proxy-addr は推移依存なのに直接と誤読される
見出しを直接・推移の両方に変えた

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 表の axios と sharp は直接依存で、grpc と proxy-addr は推移依存である。見出しが「直接あるもの」だと、後者まで直接依存と読める。指摘どおり見出しを「本番で使われる依存（直接・推移）」に変えた。認可や仕様の判断は不要で、文言の修正方針は一意だった。

---

**識別子**: RC-2（GitHub id: 5473191524）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: PR レビュー本文

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

### 🔵 Needs a closer look

公開プロフィール仕様と Callable の invoker 既定動作について、診断の前提に修正が必要です。

**0 open findings**

<details>
<summary><strong>What changed in this PR</strong></summary>

静的セキュリティ診断結果と対応 Issue を記録するドキュメント追加です。

**Changes:**
- Rules・Callable・設定の所見を整理
- npm audit 結果を用途別に分類
- 各所見と対応 Issue を紐付け

| File | Description |
| ---- | ----------- |
| `documents/​セキュリティ診断/​2026-10-10.md` | 診断結果、依存関係の脆弱性、対応 Issue を記録 |
</details>

🧠 **Review effort:** Balanced

---

💡 <a href="/nijuniinc/bokudeli-event-new/new/development?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

**コメント要約**: Copilot の overview が前提の修正が必要と書いている
公開プロフィールと invoker 既定の2点
追加の差分は示さず、open findings は 0
具体的な修正は RC-5 と RC-6 で評価する

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: overview は二つの前提が違うと書いているだけで、直す文面は示していない。open findings は 0。公開プロフィールは RC-5、invoker 既定は RC-6 で評価する。この本文自体には追加の修正要求がない。

---

**識別子**: RC-3（GitHub id: 4232723267）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `documents/セキュリティ診断/2026-10-10.md:5`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・該当行付近）
+- 対象: `ai/2428` の `9937fe608`（`origin/development` に診断スキルのコミットを足した状態。アプリの Rules と Functions はその development と同じ）
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  診断対象を到達可能なコミットで固定する**

記載された `9937fe608` は、この変更の親を含む全 ref と reflog を検索しても存在せず、`git cat-file` でも解決できませんでした。このままでは新しい clone で診断時点の Rules・Functions・lockfile を復元できず、行番号や CVE 件数の検証もできません。診断対象と同じアプリ内容を持つ到達可能な development の完全 SHA、またはこの PR の履歴に含まれるコミットへ差し替えてください。

Useful? React with 👍 / 👎.

**コメント要約**: 診断対象 SHA がこの PR の祖先に無い
`9937fe608` は `origin/ai/2428` にだけある
development へマージした文書からはそのコミットを復元できない
アプリ内容が同じ development の SHA に差し替えた

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `9937fe608` は `origin/ai/2428` にあり、全 ref に無いという指摘は取りすぎである。一方でこの PR の祖先ではなく、development に文書だけがマージされると、その SHA ではアプリを復元できない。`826402eafa036082bee03586f2c7f08231472159` はこの文書の基点で、Rules、Functions、lockfile の差分は `9937fe608` との間に無かった。対象 SHA をそちらへ差し替えた。

---

**識別子**: RC-4（GitHub id: 4232723280）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `documents/セキュリティ診断/2026-10-10.md:14`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・該当行付近）
+| アプリ / Rules / 設定の所見 | 0 | 2 | 2 | 1 | 4 |
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  PDF 用 HTTP 関数の認可漏れを診断対象へ追加する**

この要約には、`functions/default/src/namesPrint.ts:27-78` と `flyer.ts:138-195` の認可漏れが含まれていません。両関数は Firebase ID トークンが有効かだけを確認し、指定イベントの店舗・コミュニティ管理者・サポートであることを検証しないため、任意のログインユーザーが知っている `eventId` を指定できます。特に `namesprint` は Admin SDK で注文を取得し、参加者の表示名・プロフィール画像・注文メニューを PDF で返すので、enterprise イベントを含む別テナントの参加者情報が漏れる経路になります。アプリ所見の high として記録し、イベントに対する管理権限と tenant scope の検証を Issue 化してください。

Useful? React with 👍 / 👎.

**コメント要約**: 名簿とチラシの PDF がログイン確認だけで返る
`namesprint` と `flyer`。権限チェックは `eventBillInvoice` にある
ログイン済みなら eventId を知る人が名簿を受け取れる
所見 S-6 として記録し #2440 を作った

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `namesprint` と `flyer` は `verifyIdToken` のあとイベントを読み、役割を見ていない。`eventBillInvoice` はサポートかコミュニティのマネージャでなければ 403 を返す。名簿 PDF は参加者の表示名、画像、メニューを含む。この PR は診断記録なので、関数の実装は変えず、所見 S-6 と #2440 を追加した。本番 invoker の実値は未確認である。

---

**識別子**: RC-5（GitHub id: 4232723259）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `documents/セキュリティ診断/2026-10-10.md:55`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・該当行付近）
+### S-2 友人一覧が未ログインの Callable から返る
+
+- 重大度: high
+- 推奨: このリポジトリで、未ログインには友人と非公開コミュニティを返さない。仕様が公開でよいなら、Rules の「本人のみ」と Callable の差を仕様書に書く。
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  S-2 に既存の完全公開仕様を反映する**

`documents/03_参加者獲得/02_友人一覧機能.md` の14・63・226・243行では、Phase 1 の友人一覧を未ログインにも完全公開し、Firestore の直接 read は禁止したまま Callable に公開処理を集約することが明記されています。そのため「公開でよいなら Rules と Callable の差を仕様書に書く」という推奨は既に満たされており、この差を high の実装不備として扱うと、意図された仕様を回帰として起票して要約件数も誤らせます。セキュリティ方針として変更を提案するなら、現行仕様に対する受容済みリスクまたは仕様変更案であることを明記してください。

Useful? React with 👍 / 👎.

**コメント要約**: 友人一覧の未ログイン公開は Phase 1 の仕様
`02_友人一覧機能.md` と診断の S-2
high の不備として残すと #2431 が仕様の回帰になる
受容済みリスクへの書き換えは仕様ラベルのため自動修正していない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `02_友人一覧機能.md` は Phase 1 の友人一覧を未ログインも含めて完全公開とし、Firestore の直接 read は禁止、Callable に集約すると書いている。`02_マイページ.md` の 4.2.0 と 5.2.1 も、限定公開のコミュニティを他者のプロフィールプレビューに返す。S-2 を high の実装不備のままにすると、#2431 の完了条件が仕様と逆になる。指摘は妥当である。ラベルが 📑 仕様書 と 🔒 セキュリティ のため、自動修正の対象外として未着手のまま残す。診断本文の S-2 と #2431 はまだ変えていない。

---

**識別子**: RC-6（GitHub id: 4232723254）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `documents/セキュリティ診断/2026-10-10.md:85`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・該当行付近）
+### S-5 LINE の一斉配信用 HTTP にアプリ内の検証が無い
+
+- 重大度: low
+- 内容: `broadcast_event_message_request` は `onRequest` で、リクエストの署名や共有秘密を見ていない。`invoker: 'public'` は付いていない。第 2 世代 Functions の既定は呼び出しに IAM 認証が要る、という理解で書いている。
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  S-5 を公開エンドポイントとして再評価する**

確認した `deploy_functions.yml` はローカルの deploy action を通じて Firebase CLI 15.15.0 を使用しますが、Firebase CLI は第2世代 HTTP Function の新規作成時に `endpoint.httpsTrigger.invoker || ['public']` として未指定の invoker を公開します（[Firebase CLI 実装](https://github.com/firebase/firebase-tools/blob/main/src/deploy/functions/release/fabricator.ts#L3386-L3395)）。したがって、この関数は「デプロイ設定で既定が外れた場合」だけでなく通常の新規デプロイ時から未認証で呼び出せ、任意の GET/POST が LINE 一斉配信を起動します。low の条件付き所見では実際の露出を過小評価するため、公開済みとして重大度と対処を見直してください。

Useful? React with 👍 / 👎.

**コメント要約**: LINE 一斉配信の invoker 未指定は CLI が public にする
`lineBroadcast.ts` と Firebase CLI 15.15.0
low の条件付き所見では露出を小さく見積もる
重大度を high にし、#2433 に前提の訂正を書いた

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `.github/actions/deploy/action.yml` の既定は firebase-tools 15.15.0 である。その版の `fabricator.ts` は、HTTPS 関数の作成時に `endpoint.httpsTrigger.invoker || ["public"]` とする。`lineBroadcast.ts` は invoker を指定していない。初版の「IAM 認証が既定」は、このデプロイ経路では誤りである。重大度を high に上げ、#2433 にコメントした。本番に付いている invoker の実値は見ていない。関数の実装は変えていない。

---

**識別子**: RC-7（GitHub id: 4232723272）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `documents/セキュリティ診断/2026-10-10.md:101`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・該当行付近）
+| @grpc/grpc-js | high | `firebase` / `firebase-admin` 経由 | [GHSA-m9gg-hp2v-232j](https://github.com/advisories/GHSA-m9gg-hp2v-232j) | 監査の修正先は `firebase@9.14.0` へのダウングレード。現行より古いので、そのままは採らない |
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  @grpc/grpc-js の実際の依存経路を記録する**

対象の `package-lock.json` では、脆弱な `@grpc/grpc-js@1.9.16` は `firebase → @firebase/firestore` 経由であり、Functions 側の `@grpc/grpc-js@1.14.4` は直接依存の `@google-cloud/firestore → google-gax` 経由です。`firebase-admin` の依存としてまとめると、サーバー側を直す際に無関係な `firebase-admin` を更新し、実際の Functions 側パスを残すおそれがあります。また `firebase@9.14.0` へのダウングレード案は前者に対する audit の提案にすぎません。2つの経路と各バージョンを分け、Functions 側は `@google-cloud/firestore`／`google-gax` の更新または override を検討対象として記録してください。

Useful? React with 👍 / 👎.

**コメント要約**: grpc の経路を firebase-admin にまとめている
lockfile では 1.9.16 と 1.14.4 の二つ
Functions 側を firebase-admin の更新で直そうとして経路が残る
二つの経路とバージョンを記録し、#2437 に補足した

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: lockfile では `@grpc/grpc-js@1.9.16` が `firebase@11.7.3` から `@firebase/firestore` 経由、`@grpc/grpc-js@1.14.4` が `@google-cloud/firestore@7.11.6` から `google-gax` 経由である。`firebase-admin@13.10.0` はこの grpc を直接依存していない。監査の firebase 9.14.0 へのダウングレードは前者への提案なので採らない、という記録は維持し、経路を二つに分けた。#2437 に同じ内容をコメントした。依存の上げ下げ自体はこの PR ではしていない。

---
