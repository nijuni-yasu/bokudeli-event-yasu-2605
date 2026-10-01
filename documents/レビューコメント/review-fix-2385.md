# ブランチ fix/2385 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 5929420946 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 保存失敗時に UID 確認より先にエラー報告している<br>アカウント切替後の UID に旧失敗が紐づくため、確認を報告より前へ移した |
| [x] | RC-2 | 5378000019 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 完了条件を満たし未解決の問題はない、という overview<br>指摘はなく、コード変更は不要 |

---

## 評価セッション（2026-10-01 19:23・review-comments-evaluate）

- **評価日時**: 2026-10-01 19:23 JST
- **ブランチ名**: fix/2385
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2386
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（依頼コメント 5929389389、Codex ステータス要約 5929390172、Codex 問題なし 5929433105）
- **手順 4a 自動修正**: RC-1（🚨 0件 / 🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 5929420946 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 保存失敗時に UID 確認より先にエラー報告している<br>アカウント切替後の UID に旧失敗が紐づくため、確認を報告より前へ移した |

---

**識別子**: RC-1（GitHub id: 5929420946）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/TagSettingsDialog.vue:95`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

```

> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

この環境では Files changed へのインライン投稿手段がないため、該当ファイル・行を明記して回答します。

🟡 **修正提案** [🔧微修正/S]: `base/src/components/TagSettingsDialog.vue:95` UID 切替後に旧アカウントの保存が失敗すると、UID 確認より先に `reportClientError` が呼ばれます。この報告処理は実行時点の `getAuth().currentUser?.uid` を記録するため、旧アカウントの失敗が新アカウントの UID に紐づく可能性があります。`uidStillSame()` の確認を報告より前に行い、古い応答を UI とエラー報告の双方で無視するのが安全です。
```

**コメント要約**: 保存失敗時に UID 確認より先にエラー報告している。
アカウント切替後の UID に旧失敗が紐づくため、確認を報告より前へ移した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `reportClientError` は報告時点の `getAuth().currentUser?.uid` を記録する。catch に入った時点で UID が変わっていれば、旧アカウントの失敗が新アカウントに紐づく。画面のエラー表示は既に UID 確認の後だったので、報告も同じ確認の後に移した。

---

---

## 評価セッション（2026-10-01 19:25・review-comments-evaluate auto / PR #2386）

- **評価日時**: 2026-10-01 19:25 JST
- **ブランチ名**: fix/2385
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2386
- **since**: 2026-10-01T10:19:04Z
- **partial**: true（Codex 未レビューまたは limits/connect のみ）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（依頼コメント 5929389389、Codex ステータス要約 5929390172、Codex 問題なし 5929433105）
- **同一指摘のため RC 採番しない**: 5929420946（RC-1 と同一）
- **手順 4a 自動修正**: 対象なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-2 | 5378000019 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 完了条件を満たし未解決の問題はない、という overview<br>指摘はなく、コード変更は不要 |

---

**識別子**: RC-2（GitHub id: 5378000019）

**レビュワー**: Copilot

**指摘箇所**: PR レビュー overview

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

```
<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟢 Approval recommended

Issue #2385の完了条件を満たしており、未解決の問題は確認できませんでした。

**Review effort:** Balanced  
**Findings:** None

<details>
<summary><strong>What changed in this PR</strong></summary>

タグ選択の大小文字不一致と、保存中のアカウント切替による古い状態反映を修正します。

**Changes:**
- タグの選択判定を大小文字非依存に統一
- 保存応答時にUID変更を検知して画面更新を中止
- レビュー評価記録を更新

| File | Description |
| ---- | ----------- |
| `base/​src/​components/​TagInput.vue` | タグ選択キーを統一 |
| `base/​src/​components/​TagSettingsDialog.vue` | UID切替時の古い応答を破棄 |
| `documents/​レビューコメント/​review-ui-2375.md` | RC-18〜20を記録 |
</details>

---

💡 <a href="/nijuniinc/bokudeli-event-new/new/development?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>
```

**コメント要約**: 完了条件を満たし未解決の問題はない、という overview。
指摘はなく、コード変更は不要。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: overview は Issue #2385 の完了条件を満たし Findings は None と書いている。具体的な修正依頼はない。

---
