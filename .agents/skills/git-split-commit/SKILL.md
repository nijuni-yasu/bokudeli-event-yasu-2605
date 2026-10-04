---
name: git-split-commit
description: 変更差分を論理単位で分割コミットする。各コミットのメッセージは git-commit-message に委譲する。「分割コミットして」「コミットを分けて」では承認を待たずにコミットまで実行する。「分割コミットを検討して」「分割案を出して」のときは案の出力までで止める。git-commit-workflow から分類 B として呼ばれたときも承認を待たずに実行する。[common][doc][ai] は必ず独立したコミットとする。
---

# 分割コミット

変更差分を論理単位で分割する。メッセージは [git-commit-message](../git-commit-message/SKILL.md) に委譲する。[common][doc][ai] は必ず独立したコミットとする。

## 実行と検討

| 依頼 | 動き |
| :--- | :--- |
| 「分割コミットして」「コミットを分けて」。git-commit-workflow / git-fixup / git-squash から分類 B として呼ばれた | 分割案を組み立て、承認を待たずに各コミットを実行する。残りが A 向きなら呼び出し元に戻る |
| 「分割コミットを検討して」「分割案を出して」「メッセージだけ」 | 分割案とメッセージを出力して止める |

対象の変更には、ステージング済みの変更のみ、未ステージのみ、両方がある場合がある。

## 手順

1. 変更差分とブランチ名を取得する

```
git status
git diff
git diff --cached
git branch --show-current
```

2. 分割案を検討する
   - 責務ごとに論理単位で分割する
   - 分類 B の詳細は [classification.md](../git-commit-workflow/references/classification.md) も参照
   - 以下の変更はそれぞれ独立した単独コミットにする。コミット順序を守る

   **コミット順序**
   1. [doc] documents/ 内の更新のみ。最初のコミットとする
   2. [ai] .cursor / .agents / .claude / CLAUDE.md / AGENTS.md / .github/copilot-instructions.md 等の AI エージェント向け指示・設定
   3. [ci] .github/workflows/（GitHub Actions）
   4. [terraform] terraform/
   5. [firebase] firebase.json、.firebaserc、firestore.rules、storage.rules、firestore.indexes.json
   6. [common] スキーマ変更（Zod スキーマ・型定義等）
   7. その他（user / partner / enterprise / base / functions）

   **[doc] の範囲**
   - documents/ ディレクトリ内の更新のみに限る
   - AGENTS.md / CLAUDE.md / .cursor / .agents / .claude 等は [doc] ではなく [ai] を使う

   **[ai] の範囲**
   - .cursor ディレクトリ（ルール、コマンド、hooks 等）
   - .agents ディレクトリ（スキル等）
   - .claude ディレクトリ（設定、スキル等）
   - CLAUDE.md / AGENTS.md 等のルート直下の AI 向け指示ファイル
   - .github/copilot-instructions.md（AI 向け指示。ワークフローは [ci]）

   **[ci] の範囲**
   - .github/workflows/ 内の GitHub Actions ワークフロー

   **[terraform] の範囲**
   - terraform/ ディレクトリ

   **[firebase] の範囲**
   - firebase.json、.firebaserc、firestore.rules、storage.rules、firestore.indexes.json

   **[common] の扱い**
   - common のスキーマ変更は必ず単独コミットにする
   - Zod スキーマ、型定義、common/src/ 以下の変更が該当する
   - common のスキーマ変更が他パッケージに影響する場合、common を先にコミットする

3. 各コミットのメッセージを生成する

   分割案の **コミットごと** に、上のコミット順序で次を行う。
   1. `git restore --staged .` で全解除
   2. 当該コミットの対象ファイルのみ stage する
   3. [git-commit-message](../git-commit-message/SKILL.md) を呼ぶ（内部で [issue-resolution full](../git-commit-message/references/issue-resolution.md#full-フロー) が走る。**コミットごとに Issue 番号が異なってよい**）
   4. **実行依頼**: 生成したメッセージで、承認を待たずにコミットする。`git commit` のメッセージは HEREDOC で渡す（タイトル、空行、本文）
   5. **検討のみ**: `git restore --staged .` して次の案へ進む。コミットしない

   メッセージフォーマットの正本は git-commit-message のみ。本スキルにフォーマット節を書かない。

4. 結果を出力する

   - 実行依頼: 各コミットのタイトルと `git log --oneline` の結果。未コミットが残っていれば呼び出し元に戻す
   - 検討のみ: 下記の分割案とメッセージ。コミットしていない

## 出力形式

### コミット1: （git-commit-message が生成したタイトル）

（git-commit-message が生成した本文）

対象ファイル: documents/...

### コミット2: （タイトル）

（本文）

対象ファイル: .agents/skills/...

## 出力例

```
### コミット1: [doc] #1800 イベント仕様書を更新

有料チケット機能の仕様を追記した。

変更詳細:
- documents/01_マネタイズと決済/04_有料チケット.md
  - 購入フローの説明を追加

対象ファイル: documents/01_マネタイズと決済/04_有料チケット.md

### コミット2: [user] #1800 イベント詳細画面に公開状態を表示

Event の status に応じて表示を切り替えるようにした。

変更詳細:
- user/src/pages/EventDetail.vue
  - status が draft の場合は下書き表示を追加

対象ファイル: user/src/pages/EventDetail.vue
```

## 制約

- [doc] は documents/ 内の更新のみ。最初のコミットとする
- [ai] / [ci] / [terraform] / [firebase] / [common] の単独コミット規則を守る
- メッセージは git-commit-message に委譲する

---

## コミット完了後の提案

分割コミットの実行がすべて正常に完了し、working tree が clean になったら:

> コミットが完了しました。`/git-reflect-after-commit` で origin への PR 反映と sandbox デプロイをまとめて実行しますか？

- 未コミット変更が残っている・コミット失敗時・分割案の実行前は提案しない
