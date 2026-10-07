# ブランチ fix/2400 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 6040229567 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 遅延で先に作った store は、後の通常呼び出しでも購読を始めない<br>`useEventStore` の setup 初回だけが `deferLiveSubscription` を見ている<br>コミュニティ一覧など `ensureSubscribed` を呼ばない画面でイベント更新が止まる<br>通常呼び出しの出口で既存 store の購読を始める |
| [x] | RC-2 | 5443961475 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot review overview は指摘本文ではなく目次<br>開いている指摘は RC-4 と、同じ不具合の再掲である RC-1<br>目次自体に追加の修正要求はない<br>各リンク先の指摘で評価する |
| [x] | RC-3 | 4208244256 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 遅延 store は一覧の再取得結果を event に反映しない<br>`eventList.ts` が既存 Pinia store に `doc.data()` を渡しても setup は再実行されない<br>トップ再訪後もイベント名や日時が古いまま残る<br>購読していない store に取得結果を反映する |
| [x] | RC-4 | 4208255586 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 詳細を開いて離脱した store をトップが再利用すると最新文書が捨てられる<br>`eventList.ts` の `useEventStore(doc.data())`<br>トップのカードに古い event が残る<br>購読していないときだけ一覧の取得結果で event を更新する |

---

## 評価セッション（2026-10-07 23:45・review-comments-evaluate）

- **評価日時**: 2026-10-07 23:45 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: fix/2400
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2402
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（GitHub id 6040194164 レビュー依頼定型文、5443948217 Codex 接続案内のみ）
- **重複除外**: なし
- **手順 4a 自動修正**: RC-1・RC-4（🚨 2件）。RC-3 は同じ反映処理で解消
- **対象**: `created_at` / `submitted_at` >= 2026-10-07T14:32:38Z。partial: false

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 6040229567 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 遅延で先に作った store は、後の通常呼び出しでも購読を始めない<br>`useEventStore` の setup 初回だけが `deferLiveSubscription` を見ている<br>コミュニティ一覧など `ensureSubscribed` を呼ばない画面でイベント更新が止まる<br>通常呼び出しの出口で既存 store の購読を始める |
| [x] | RC-2 | 5443961475 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot review overview は指摘本文ではなく目次<br>開いている指摘は RC-4 と、同じ不具合の再掲である RC-1<br>目次自体に追加の修正要求はない<br>各リンク先の指摘で評価する |
| [x] | RC-3 | 4208244256 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 遅延 store は一覧の再取得結果を event に反映しない<br>`eventList.ts` が既存 Pinia store に `doc.data()` を渡しても setup は再実行されない<br>トップ再訪後もイベント名や日時が古いまま残る<br>購読していない store に取得結果を反映する |
| [x] | RC-4 | 4208255586 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 詳細を開いて離脱した store をトップが再利用すると最新文書が捨てられる<br>`eventList.ts` の `useEventStore(doc.data())`<br>トップのカードに古い event が残る<br>購読していないときだけ一覧の取得結果で event を更新する |

---

**識別子**: RC-1（GitHub id: 6040229567）

**レビュワー**: Copilot

**指摘箇所**: `PR トップレベル`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S] — `base/src/stores/event.ts:852` で `deferLiveSubscription` を `defineStore` setup 内だけで判定しています。同一 Pinia ID の store がトップ一覧から deferred で先に作られると、後の通常 `useEventStore(...)` は setup を再実行しないため、`ensureSubscribed()` を呼ばない既存利用ではイベント購読が開始されません。非 deferred 呼び出し時にも既存 store の購読を開始する処理に移し、その呼び出し順を検証するテストを追加してください。この指摘は前回のレビューで挙げた問題と同じで、現行差分にも残っています。

対象行への Files changed インラインコメント作成機能がこの環境では提供されていないため、この依頼コメントへの返信で報告しています。

**コメント要約**: 遅延で先に作った store は、後の通常呼び出しでも購読を始めない。
`useEventStore` の setup 初回だけが `deferLiveSubscription` を見ている。
コミュニティ一覧など `ensureSubscribed` を呼ばない画面でイベント更新が止まる。
通常呼び出しの出口で既存 store の購読を始める。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `deferLiveSubscription` は Pinia の store ID に含まれず、setup は初回生成時しか走らない。トップ一覧が先に遅延 store を作ると、コミュニティ一覧など `ensureSubscribed()` を呼ばない `useEventStore` は購読を開始できない。#2400 で入れた遅延購読の穴なのでスコープ内。`store()` の戻り値に対し、通常呼び出しのときだけ `ensureSubscribed()` するよう移し、その順のテストを追加した。

---

**識別子**: RC-2（GitHub id: 5443961475）

**レビュワー**: Copilot

**指摘箇所**: `PR レビュー本文`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

既存の停止済み Pinia store が再利用されると、トップ一覧で取得した最新イベント文書が反映されません。

**Review effort:** Balanced  
**Findings:** 2 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (2)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [既存ストア再利用時に一覧の最新イベントが反映されない](#discussion_r4208255586) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [既存の遅延ストアが通常呼び出しで購読開始されない](#discussion_r4181918423)
</details>

**コメント要約**: Copilot review overview は指摘本文ではなく目次。
開いている指摘は RC-4 と、同じ不具合の再掲である RC-1。
目次自体に追加の修正要求はない。
各リンク先の指摘で評価する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: overview は目次である。`#discussion_r4208255586` は RC-4。`#discussion_r4181918423` は今回の since より前のインラインで、同じ不具合を since 以降に再掲したのが RC-1。目次自体に追加の修正要求はない。

---

**識別子**: RC-3（GitHub id: 4208244256）

**レビュワー**: Codex

**指摘箇所**: `base/src/stores/eventList.ts:95`

**該当コード（レビュー時点の diff）**:

```diff
@@ -84,7 +89,10 @@ export const useEventListStore = (
         eventsSnapsthot.push(...querySnapshot.docs)
         eventStores.value = eventsSnapsthot.flatMap((doc) => {
           try {
-            return useEventStore(doc.data())
+            return useEventStore(
+              doc.data(),
+              options.deferEventSubscription === true ? { deferLiveSubscription: true } : {},
+            )
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  再取得した文書を遅延 store に反映する**

`deferEventSubscription` を使うトップ一覧で同じイベント ID の store が既に存在する場合、`reload()` が最新の文書を取得しても `useEventStore()` は Pinia の既存インスタンスを返し、引数の `doc.data()` を `event` に反映しません。さらに遅延 store は `onSnapshot` でも更新されないため、トップを一度表示した後は再訪・再読み込みを行ってもイベント名や日時、受付状態などがセッション中ずっと古いままになります。既存 store に取得結果を適用するか、一覧再取得時に遅延 store を再生成してください。

AGENTS.md reference: [AGENTS.md:L292-L295](https://github.com/nijuniinc/bokudeli-event-new/blob/e40d1582551472e22d66fa5bc6da4f04e83ee331/AGENTS.md#L292-L295)

Useful? React with 👍 / 👎.

**コメント要約**: 遅延 store は一覧の再取得結果を event に反映しない。
`eventList.ts` が既存 Pinia store に `doc.data()` を渡しても setup は再実行されない。
トップ再訪後もイベント名や日時が古いまま残る。
購読していない store に取得結果を反映する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: P2。遅延 store は onSnapshot を張らないため、一覧の再取得が既存 store の `event` を更新しないとトップの表示が古いまま残る。#2400 の遅延購読に伴う不具合。購読中はスナップショットを正とし、購読していないときだけ取得結果を `event` に反映する。原文は再生成との二案だが、RC-4 の必須修正で同じ反映処理を入れたため、この指摘も解消している。

---

**識別子**: RC-4（GitHub id: 4208255586）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/eventList.ts:95`

**該当コード（レビュー時点の diff）**:

```diff
@@ -84,7 +89,10 @@ export const useEventListStore = (
         eventsSnapsthot.push(...querySnapshot.docs)
         eventStores.value = eventsSnapsthot.flatMap((doc) => {
           try {
-            return useEventStore(doc.data())
+            return useEventStore(
+              doc.data(),
+              options.deferEventSubscription === true ? { deferLiveSubscription: true } : {},
+            )
```

**レビュワーのコメント（原文）**:

[must] `deferLiveSubscription` は Pinia の store ID に含まれず、`defineStore` の setup も初回生成時しか実行されません。詳細を先に開いて離脱したイベントでは、既存 store は `unsubscribe()` 済みのまま再利用され、この `doc.data()` と新しい option の両方が無視されます。そのためトップが最新文書を取得してもカードには古い `event` が残ります。既存 store に一覧取得結果を安全に反映する hydrate 処理を用意するか、一覧表示データを event store から分離してください。

**コメント要約**: 詳細を開いて離脱した store をトップが再利用すると最新文書が捨てられる。
`eventList.ts` の `useEventStore(doc.data())`。
トップのカードに古い event が残る。
購読していないときだけ一覧の取得結果で event を更新する。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: Copilot の must。詳細を先に開いて `unsubscribe()` した store をトップが再利用すると、`doc.data()` も遅延オプションも無視され、カードが古い event のままになる。一覧表示用の store 分離は本 PR の範囲を超えるため、購読していない既存 store へ取得結果を反映する方を採った。ライブ購読中は上書きしないテストを追加した。

---
