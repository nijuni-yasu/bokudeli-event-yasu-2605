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
| [ ] | RC-8 | 6086024213 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | S-2 の high が、書いたあとの仕様説明と食い違う<br>友人一覧と限定公開コミュニティは現行仕様の公開<br>このままだと #2431 が仕様と逆の修正になる<br>RC-5 の続き。仕様ラベルのため自動修正していない |
| [x] | RC-9 | 5473379691 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の overview が S-2 の修正を求めている<br>具体的な文面は無く、open findings は 0<br>同じ内容は RC-8 で評価する<br>overview 自体には追加の差分が無い |
| [x] | RC-10 | 4232897070 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | レターのテスト送信がマネージャかを見ていない<br>`sendTestLetter`。`sendIndividualLetter` は見ている<br>ログイン済みなら下書きの内容を自分宛に受け取れる<br>所見 S-8 と #2442 のあと、このブランチでマネージャ確認を入れた |
| [x] | RC-11 | 4232897030 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | コミュニティ問い合わせの送信者をリクエストのまま使う<br>`communityContact` の名前、メール、replyTo<br>ログイン済みが別の返信先で管理者へ送れる<br>所見 S-7 として記録し #2441 を作った |
| [ ] | RC-12 | 4232897036 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | namesprint の JWT のみは仕様の案 A<br>`13_EventMemberOrder_名前印刷機能.md`<br>#2440 が仕様どおりの名簿印刷まで実装不備にしている<br>仕様ラベルのため、記録と Issue は自動では分けていない |
| [x] | RC-13 | 4232897017 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | proxy-addr の経路が Slack だけになっている<br>同じ 2.0.7 に firebase-functions の Express 5 もある<br>Slack だけ上げると Functions 側が残る<br>両方を記録したあと、このブランチで override により 2.0.8 にした |
| [x] | RC-14 | 4232897062 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | メールログインの確認コードに試行制限が無い<br>6 桁、24 時間、`confirmEmailLogin` は回数を見ない<br>登録メールへの要求のあと、期限内に照合を繰り返せる<br>所見 S-9 として記録し #2443 を作った |
| [x] | RC-15 | 4232897053 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | イベント説明の HTML をサニタイズせず表示している<br>`TinyMCEViewer` が `event_desc` を `v-html` に渡す<br>マネージャが保存した HTML が閲覧者の画面で実行されうる<br>所見 S-10 として記録し #2444 を作った |
| [ ] | RC-16 | 6094458194 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | S-2 の high が現行仕様の公開と食い違う<br>友人一覧と限定公開コミュニティは仕様どおり公開<br>#2431 の完了条件が仕様の回帰になる<br>RC-5 / RC-8 の続き。仕様ラベルのため自動修正していない |
| [ ] | RC-17 | 6094458194 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | namesprint の JWT のみは仕様の案 A<br>S-6 と #2440 が名簿印刷まで実装不備にしている<br>チラシは仕様の例外ではない<br>RC-12 の続き。仕様ラベルのため自動修正していない |
| [x] | RC-18 | 5477879651 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の overview が S-2 と S-6 の整合を求めている<br>open findings は 0<br>具体的な文面は RC-16 と RC-17<br>overview 自体には追加の差分が無い |
| [x] | RC-19 | 4236648341 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | letter.test.ts の mock が hoist 前の変数を参照する<br>CI で `@shokujii/common` が解決できると収集時に落ちる<br>`HttpsError` と同じ `vi.hoisted` に mock を移した |
| [x] | RC-20 | 4236648342 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | RC-10 と RC-13 の記録が実装後の差分と食い違う<br>RC-10 は関数を直したのにドキュメントのみと書いていた<br>RC-13 は lockfile を変えたのに変えていないと書いていた<br>通しサマリと判断理由を最終差分に合わせた |

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

## 評価セッション（2026-10-10 02:50・review-comments-evaluate）

- **日時**: 2026-10-10 02:50 JST
- **対象**: PR #2439 `doc/security-diagnosis` → `development`、HEAD `24fb35c6d7`
- **取得**: `since=2026-10-09T17:33:39Z`、`partial=false`
- **除外**: 重複 0、古い diff 0、スキップ 2（レビュー依頼テンプレ `6085991620`、Codex の定型 `5473412181`）
- **手順 4a**: 自動修正 5 件（🚨 4、🟡 1）。RC-8 と RC-12 は 📑 と 🔒 のため未着手のまま

### サマリ

| 対応 | RC | GitHub | 評価 | ステータス | PRスコープ | ラベル | 変更種別 | 工数 | 要約 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [ ] | RC-8 | 6086024213 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | S-2 の high が、書いたあとの仕様説明と食い違う<br>友人一覧と限定公開コミュニティは現行仕様の公開<br>このままだと #2431 が仕様と逆の修正になる<br>RC-5 の続き。仕様ラベルのため自動修正していない |
| [x] | RC-9 | 5473379691 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の overview が S-2 の修正を求めている<br>具体的な文面は無く、open findings は 0<br>同じ内容は RC-8 で評価する<br>overview 自体には追加の差分が無い |
| [x] | RC-10 | 4232897070 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | レターのテスト送信がマネージャかを見ていない<br>`sendTestLetter`。`sendIndividualLetter` は見ている<br>ログイン済みなら下書きの内容を自分宛に受け取れる<br>所見 S-8 として記録し #2442 を作った |
| [x] | RC-11 | 4232897030 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | コミュニティ問い合わせの送信者をリクエストのまま使う<br>`communityContact` の名前、メール、replyTo<br>ログイン済みが別の返信先で管理者へ送れる<br>所見 S-7 として記録し #2441 を作った |
| [ ] | RC-12 | 4232897036 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | namesprint の JWT のみは仕様の案 A<br>`13_EventMemberOrder_名前印刷機能.md`<br>#2440 が仕様どおりの名簿印刷まで実装不備にしている<br>仕様ラベルのため、記録と Issue は自動では分けていない |
| [x] | RC-13 | 4232897017 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | proxy-addr の経路が Slack だけになっている<br>同じ 2.0.7 に firebase-functions の Express 5 もある<br>Slack だけ上げると Functions 側が残る<br>両方を記録し、#2436 にコメントした |
| [x] | RC-14 | 4232897062 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | メールログインの確認コードに試行制限が無い<br>6 桁、24 時間、`confirmEmailLogin` は回数を見ない<br>登録メールへの要求のあと、期限内に照合を繰り返せる<br>所見 S-9 として記録し #2443 を作った |
| [x] | RC-15 | 4232897053 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | イベント説明の HTML をサニタイズせず表示している<br>`TinyMCEViewer` が `event_desc` を `v-html` に渡す<br>マネージャが保存した HTML が閲覧者の画面で実行されうる<br>所見 S-10 として記録し #2444 を作った |

---

**識別子**: RC-8

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#issuecomment-6086024213

**評価**: 🟡 修正提案

**元コメント**:

> 🟡 **修正提案** [📄ドキュメントのみ/S]: `documents/セキュリティ診断/2026-10-10.md:50-56` は、友人一覧と限定公開コミュニティのプレビューを現行仕様に反する実装不備として high に分類していますが、`02_友人一覧機能.md:14` は未ログインを含む完全公開を明記し、`02_マイページ.md:93-103, 129` も限定公開コミュニティを他者に表示する仕様です。レビュー記録 RC-5 はこの仕様との矛盾と未決の仕様判断を説明していますが、現状の S-2 の high を実装不備として正当化できていません。受容済みリスクまたは仕様変更提案として明示し、S-2 の推奨・Issue の位置づけ・件数を整合させるのがよいです。

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 仕様の引用は RC-5 と同じく当たっている。前回は記録に理由を残し、診断本文の S-2 は high のままにした。このコメントは、その本文と #2431 と件数を仕様に合わせるところまで求めている。S-2 を受容済みリスクへ書き換える判断は仕様変更になるので、自動では直していない。

---

**識別子**: RC-9

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#pullrequestreview-5473379691

**評価**: 👌 修正不要

**元コメント**:

> S-2が現行の完全公開仕様をhighの不備として扱っており、診断結果とIssueの修正が必要です。
>
> **0 open findings**

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: Copilot の overview で、open findings は 0。同じ指摘の本文は RC-8。overview には追加の差分が無い。

---

**識別子**: RC-10

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#discussion_r4232897070

**評価**: 🚨 必須修正

**元コメント**:

> **<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  sendTestLetter の認可漏れを診断に追加する**
>
> Callable の診断には `functions/default/src/letter.ts:379-398` の `sendTestLetter` も追加が必要です。この関数はログインだけを確認して `communityId` と `letterId` を Admin SDK で読み、コミュニティ管理者かを検証せず、下書きレターの件名・本文・イベント情報を呼び出しユーザー自身へ送信します。たとえば権限を外された元管理者が既知のレター ID を保持している場合、その後の下書き内容を読み続けられます。同じファイルの `sendIndividualLetter` は明示的に `community.hasRole(uid, 'manager')` を確認しているため、テスト送信側の認可漏れを所見と対応 Issue に追加してください。

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 評価時は診断へ S-8 を足し #2442 を作った。その後このブランチで `sendTestLetter` にマネージャ確認を入れ、関数テストを足した。

---

**識別子**: RC-11

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#discussion_r4232897030

**評価**: 🚨 必須修正

**元コメント**:

> **<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  communityContact の送信者偽装を診断に追加する**
>
> Callable を確認した範囲では、`functions/default/src/communityMail.ts:189-197` の `communityContact` も診断から漏れています。この関数は `request.auth` の存在しか確認せず、`user_id`・`user_name`・`user_email`・`user_profile_url` をすべてリクエストから受け取り、そのままメールテンプレートと `replyTo` に使用します。そのため任意のログインユーザーが別ユーザーを名乗り、任意の返信先やプロフィール URL をコミュニティ管理者とサポートへ送信できます。Callable を実施範囲に含めた診断として、このなりすまし経路を所見と対応 Issue に追加してください。

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `communityContact` は `request.auth` の有無だけを見て、名前、メール、プロフィール URL、replyTo をリクエストの値で送る。診断に S-7 を足し、#2441 を作った。関数のコードは変えていない。

---

**識別子**: RC-12

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#discussion_r4232897036

**評価**: 🟡 修正提案

**元コメント**:

> **<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  namesprint を仕様変更として切り分ける**
>
> 診断対象 SHA に含まれる `documents/07_リファクタリング/13_EventMemberOrder_名前印刷機能.md:53-54` は、`namesprint` の認可を「案 A で確定」とし、JWT の正当性だけを検証して `partner_id` やロールを照合しないことを明記しています。したがって `namesprint` は現行仕様どおりの実装であり、`flyer` とまとめて実装不備と記録すると、#2440 でコードだけを変更して仕様と実装を不整合にするおそれがあります。`namesprint` は受容済みリスクに対する仕様変更として明記し、仕様書の更新も対応範囲に含めてください。

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 名前印刷の仕様は案 A で、JWT の正当性だけを見る、と書いている。`flyer` にはその文が無い。S-6 と #2440 が名簿印刷まで実装不備にしている点は当たっている。仕様の切り分けは自動修正の対象外なので、記録と Issue はこのセッションでは分けていない。

---

**識別子**: RC-13

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#discussion_r4232897017

**評価**: 🟡 修正提案

**元コメント**:

> **<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  proxy-addr の Firebase Functions 経路も記録する**
>
> 診断対象 SHA の `package-lock.json` を確認すると、`proxy-addr@2.0.7` には記載済みの `@slack/bolt → express@4.22.2` に加え、`firebase-functions@7.3.2 → express@5.2.1` という本番経路もあります（`package-lock.json:10006-10031`）。Slack Bolt 経由だけと記録すると、#2436 で Slack 側のみを更新した際に Functions 側の脆弱な依存を残すおそれがあるため、両方の経路を明記してください。

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 評価時は CVE 表に Slack と Functions の両方の経路を書き、#2436 にコメントした。その後このブランチでルートの override により `proxy-addr` を `2.0.8` にし、lockfile を更新した。

---

**識別子**: RC-14

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#discussion_r4232897062

**評価**: 🚨 必須修正

**元コメント**:

> **<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  PF の OTP 総当たり経路を診断に追加する**
>
> App Check の確認結果には、PF ログインの重大な未認証経路が含まれていません。診断対象 SHA では `PassCode.ts:4-10` が `Math.random()` で生成した6桁コードを24時間有効にし、`user.ts:66-80` の `confirmEmailLogin` は App Check・試行回数・レート制限なしで何度でも照合して、成功時にカスタムトークンを返します。登録メールは `requestEmailLogin` の `not-found` 応答でも列挙できるため、対象メールに OTP を発行した後、100万通りを総当たりできる状態です。プロフィール系 Callable の未強制を info に留めるだけでなく、PF アカウント奪取につながる独立した high/critical 所見として記録し、短い有効期限と試行制限等を Issue 化してください。

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `generatePassCode` は 6 桁を `Math.random()` で作り、有効期限は 24 時間。`confirmEmailLogin` は不一致でもコードを消さず、回数と App Check を見ていない。`requestEmailLogin` は未登録メールに `not-found` を返す。診断に S-9 を足し、#2443 を作った。照合の手順は書いていない。関数のコードは変えていない。

---

**識別子**: RC-15

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#discussion_r4232897053

**評価**: 🚨 必須修正

**元コメント**:

> **<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  event_desc の格納型 XSS を診断対象に追加する**
>
> 「ユーザー入力の HTML を未サニタイズで渡す箇所は切り出せなかった」という記録は、診断対象 SHA の `base/src/components/EventDetailsCard.vue:416` と `TinyMCEViewer.vue:5` に反します。Firestore 由来の `event.event_desc` がサニタイズなしで `v-html` に渡され、Rules はコミュニティマネージャーによる `event_desc` 更新を制限していないため、`onerror` 属性などを保存すると公開イベントページの閲覧者上で実行できます。さらに本書の S-1 により任意のログインユーザーが承認済みコミュニティのマネージャーになれるので、攻撃経路も成立します。この false negative を削除し格納型 XSS を high の所見として Issue 化してください。

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `EventDetailsCard` は `event.event_desc` を `TinyMCEViewer` に渡し、viewer は `v-html` で出す。初版の「切り出せなかった」は当たっていない。診断に S-10 を足し、確認して所見にしなかったものの文を S-10 へ向け、#2444 を作った。表示のコードは変えていない。

---

## 評価セッション（2026-10-10 15:07・review-comments-evaluate）

- **日時**: 2026-10-10 15:07 JST
- **対象**: PR #2439 `doc/security-diagnosis` → `development`、HEAD `598a62274`
- **取得**: `since=2026-10-10T05:56:38Z`、`partial=false`
- **除外**: 重複 0、古い diff 0、スキップ 2（レビュー依頼テンプレ `6094417607`、Codex の定型 `5477893204`）
- **手順 4a**: 自動修正 2 件（🚨 1、🟡 1）。RC-16 と RC-17 は 📑 と 🔒 のため未着手のまま

### サマリ

| 対応 | RC | GitHub | 評価 | ステータス | PRスコープ | ラベル | 変更種別 | 工数 | 要約 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [ ] | RC-16 | 6094458194 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | S-2 の high が現行仕様の公開と食い違う<br>友人一覧と限定公開コミュニティは仕様どおり公開<br>#2431 の完了条件が仕様の回帰になる<br>RC-5 / RC-8 の続き。仕様ラベルのため自動修正していない |
| [ ] | RC-17 | 6094458194 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 🔒 セキュリティ | 📄 ドキュメントのみ | S | namesprint の JWT のみは仕様の案 A<br>S-6 と #2440 が名簿印刷まで実装不備にしている<br>チラシは仕様の例外ではない<br>RC-12 の続き。仕様ラベルのため自動修正していない |
| [x] | RC-18 | 5477879651 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の overview が S-2 と S-6 の整合を求めている<br>open findings は 0<br>具体的な文面は RC-16 と RC-17<br>overview 自体には追加の差分が無い |
| [x] | RC-19 | 4236648341 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | letter.test.ts の mock が hoist 前の変数を参照する<br>CI で `@shokujii/common` が解決できると収集時に落ちる<br>`HttpsError` と同じ `vi.hoisted` に mock を移した |
| [x] | RC-20 | 4236648342 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 📄 ドキュメントのみ | S | RC-10 と RC-13 の記録が実装後の差分と食い違う<br>RC-10 は関数を直したのにドキュメントのみと書いていた<br>RC-13 は lockfile を変えたのに変えていないと書いていた<br>通しサマリと判断理由を最終差分に合わせた |

---

**識別子**: RC-16

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#issuecomment-6094458194

**評価**: 🟡 修正提案

**元コメント**:

> 🟡 **修正提案** [📄ドキュメントのみ/S]: `documents/セキュリティ診断/2026-10-10.md:55-65` は、S-2 を high の実装不備として扱い、未ログイン時の公開を止めるよう推奨しています。しかし `02_友人一覧機能.md:14,63` は Phase 1 の完全公開を明記し、`02_マイページ.md:93-103,129` も他者への限定公開コミュニティ表示を仕様化しています。#2431 の対応方針・完了条件もこの仕様と逆です。受容済みリスクとして記録するのか仕様変更案として扱うのかを明示し、推奨、#2431 の位置づけ、high 件数の整合をお願いします。

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 仕様の引用は RC-5 / RC-8 と同じく当たっている。S-2 を受容済みリスクへ書き換える判断は仕様変更になるので、自動では直していない。

---

**識別子**: RC-17

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#issuecomment-6094458194

**評価**: 🟡 修正提案

**元コメント**:

> 🟡 **修正提案** [📄ドキュメントのみ/S]: `documents/セキュリティ診断/2026-10-10.md:103-113` は `namesprint` と `flyer` をまとめて認可不備としていますが、`13_EventMemberOrder_名前印刷機能.md:53-54` は `namesprint` を JWT の正当性のみ確認する案 A として確定しています。`flyer` の認可不備は所見として残しつつ、`namesprint` は仕様どおりの受容済みリスク／仕様変更提案に切り分けてください。#2440 の対応方針と完了条件も現仕様に反しているため、同様に範囲を整合してください。

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 名前印刷の仕様は案 A で JWT の正当性だけを見る。`flyer` にはその文が無い。S-6 と #2440 の切り分けは仕様判断なので、自動では分けていない。

---

**識別子**: RC-18

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#pullrequestreview-5477879651

**評価**: 👌 修正不要

**元コメント**:

> S-2とS-6の診断内容が現行仕様と矛盾しており、関連Issueを含めた整合が必要です。
>
> **0 open findings**

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: Copilot の overview で、open findings は 0。同じ指摘の本文は RC-16 と RC-17。overview には追加の差分が無い。

---

**識別子**: RC-19

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#discussion_r4236648341

**評価**: 🚨 必須修正

**元コメント**:

> **<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  モック関数を `vi.hoisted` へ移してください**
>
> `vi.mock` は import より前へ巻き上げられるため、通常の CI のように `@shokujii/common` を解決できる状態では、この factory が初期化前の `getCommunityMock` を参照して `ReferenceError: Cannot access 'getCommunityMock' before initialization` となり、追加したテストは収集段階で全件失敗します。`HttpsError` と同様に、factory から参照する `hasRoleMock`、`getCommunityMock` などを `vi.hoisted` の戻り値として初期化してください。

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `vi.mock` の factory が hoist 前の `vi.fn()` を参照している。CI で収集時に落ちうる。`HttpsError` と同じ `vi.hoisted` に mock を移した。

---

**識別子**: RC-20

**GitHub**: https://github.com/nijuniinc/bokudeli-event-new/pull/2439#discussion_r4236648342

**評価**: 🟡 修正提案

**元コメント**:

> **<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  実装後の状態を RC 記録へ反映してください**
>
> 同じコミットで `sendTestLetter` の認可コードとテストを追加しているにもかかわらず、RC-10 は「関数のコードは変えていない」、変更種別も「ドキュメントのみ」のままです。RC-13 も `package-lock.json` を 2.0.8 へ更新した後なのに「lockfile は変えていない」と記録されており、後からこのファイルを参照すると対応内容を誤認します。通しサマリ、該当 RC ブロックの変更種別・判断理由・要約を最終差分に合わせて更新してください。

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: RC-10 と RC-13 は評価時点の記録のままだった。通しサマリの種別と要約、各ブロックの判断理由を、このブランチでの実装後の差分に合わせた。評価は変えていない。

---
