---
name: git-commit-message
description: ステージング diff からコミットメッセージを生成する。gh で内容一致する Issue があればタイトルに番号を付け、無ければ番号なしで生成する。git-commit-workflow / git-fixup / git-squash / git-split-commit から委譲される。メッセージフォーマットの正本は本スキルのみ。
---

# コミットメッセージ生成

git-commit-workflow / git-fixup / git-squash / git-split-commit から委譲される。本スキルはコミットメッセージの**生成まで**を担う。`git commit` は呼び出し元が行う。単体で「メッセージだけ」と頼まれたときは生成して止め、コミットしない。実行依頼の途中で呼ばれたときは、メッセージを返したあと呼び出し元が同じターンでコミットする。メッセージ案の承認は待たない。

実行依頼（「コミットして」等）で本スキルだけを開いた場合は、メッセージを出して止めない。`/git-commit-workflow` を読み、同じターンでコミットまで実行する。

イシュー番号解決の正本は [issue-resolution.md](references/issue-resolution.md)。

## 手順

1. 呼び出し元コンテキスト（下記）を確認し、解決モードを決める
2. `git diff --cached --stat` でステージング差分のサマリーを取得する
3. `git diff --cached` で全差分を取得する
4. [issue-resolution.md](references/issue-resolution.md) を **full**（または inherit → 不一致時 full）で実行し、採用を `#NNNN` または番号なしに決める
   - 番号なしも解決済み。メッセージ生成を止めない
   - 出力に `### イシュー` セクションを含める
5. 下記フォーマットに従いコミットメッセージを生成する。採用が `#NNNN` のときだけタイトルにその番号を書く

fixup の A1-fast では issue-resolution は不要（classification + coherence-lite）。A1-full 昇格時は coherence-full、メッセージ書き換えは squash / amend / C で full。

## 呼び出し元コンテキスト

| コンテキスト                                        | 解決モード     | 入力                             | 生成方針                                                                          |
| --------------------------------------------------- | -------------- | -------------------------------- | --------------------------------------------------------------------------------- |
| **通常**（C 新規1件、分割各コミット、ユーザー依頼） | full           | ステージング diff のみ           | diff に基づく新規メッセージ                                                       |
| **squash 書き換え**（A2）                           | full           | 元メッセージ全文 + 統合後 diff   | 統合後全体を正確に説明。元 `#` を候補に含め、必要なら更新                         |
| **amend**（A0）                                     | full / inherit | 現 HEAD メッセージ + 追加分 diff | 乖離なしなら呼び出し元が `--no-edit`。更新時は full で `#` 解決後にメッセージ生成 |
| **ユーザー明示 `#`**                                | inherit        | 明示 `#` + diff                  | 実在確認後、不一致なら full へ降格                                                |

**squash 書き換え時の参照コマンド**

```
git log -1 --format=%B <吸収先ハッシュ>
git show <squashコミット>
```

**amend 時の参照コマンド**

```
git log -1 --format=%B HEAD
git diff --cached
```

---

## フォーマット

### タイトル

内容が一致する Issue があるとき:

```
[タグ] #イシュー番号 変更内容を端的に表す日本語タイトル
```

一致する Issue が無いとき（番号は書かない）:

```
[タグ] 変更内容を端的に表す日本語タイトル
```

タグは変更したディレクトリ・領域に対応するものを選ぶ。複数可。
使用可能なタグ: `[user]` `[partner]` `[enterprise]` `[base]` `[common]` `[functions]` `[doc]` `[ci]` `[terraform]` `[firebase]` `[ai]`

- [doc]: documents/ ディレクトリ内の更新のみ
- [ci]: .github/workflows/（GitHub Actions の CI/CD）
- [terraform]: terraform/ ディレクトリ
- [firebase]: firebase.json、.firebaserc、firestore.rules、storage.rules、firestore.indexes.json
- [ai]: .cursor / .agents / .claude / CLAUDE.md / AGENTS.md / .github/copilot-instructions.md 等の AI エージェント向け指示・設定ファイル

### タグの判定（優先順位）

1. アプリ/パッケージのソース（user / partner / enterprise / base / common / functions）に該当 → そのタグ（複数可）
2. 該当しないが ci / terraform / firebase / doc / ai に該当 → 対応タグ（複数可）
3. いずれにも該当しないモノレポ横断設定 → **接頭辞なし**

パッケージ配下の package.json（例: user/package.json）は [user] 等。ルート直下の package.json / package-lock.json のみ接頭辞なし。

### タグを付けない場合

次のような変更では接頭辞を付けない。無理に当てはめない。

- ルート直下の package.json / package-lock.json
- eslint.config.mjs / .prettierrc / tsconfig\*.json 等、特定アプリパッケージに属さないリポジトリルートの設定
- 上記パッケージタグ・ci・terraform・firebase・doc・ai のいずれにも該当しない変更

このとき、一致する Issue がある例:

```
#イシュー番号 変更内容を端的に表す日本語タイトル
```

一致する Issue が無い例:

```
変更内容を端的に表す日本語タイトル
```

**`#イシュー番号` は一致する Issue があるときだけ付ける**。無いときは番号なしでメッセージを生成し、コミットを中断しない。コミットのためだけに Issue を作らない。

AGENTS.md に無い新しい角括弧タグを増やさない。

### 本文

- 変更の目的・背景を1〜2文で説明する
- 追加・変更・削除したファイルごとに内容を箇条書きで記述する
- 技術的な判断や注意点があれば補足する

詳細に記述する場合、以下も含めてよい：

- 影響範囲（どの画面・機能・API に影響するか）
- 破壊的変更やマイグレーションの有無
- 関連 Issue / PR
- レビューで確認してほしい観点

---

## 制約

- バッククォート と 丸括弧 と ダブルクォート は使用しない
- 日本語で記述する
- タイトルは1行に収める
- 本文は変更の規模に応じて詳細度を調整する
- イシュー番号は [issue-resolution.md](references/issue-resolution.md) で解決する。一致したときだけ `#` を付ける。ブランチ名だけを根拠に `#` を付けない

---

## コミット完了後の提案

ユーザーが本スキルで検討したメッセージどおりにコミットを実行し、正常に完了して working tree が clean になったら、次をユーザーに提案する（勝手に実行しない）:

> コミットが完了しました。`/git-reflect-after-commit` で origin への PR 反映と sandbox デプロイをまとめて実行しますか？

- ユーザーが同意したら `git-reflect-after-commit` スキルを実行する
- 「PR だけ」「sandbox だけ」と言われたら実行範囲を絞る
- 未コミット変更が残っている・コミット失敗時・コミット依頼が無かった場合は提案しない

---

## 出力例

```
### イシュー
- 採用: #1778（理由: 内容一致）
- 却下: #2100（ブランチ候補だが Issue 内容と diff が不一致）

[doc] #1778 AIエージェント向け指示ファイルをリファクタリング

トークン効率の改善とAIツール間の一貫性確保を目的に、
AGENTS.md・CLAUDE.md・copilot-instructions.md を整理した。

変更詳細:

- AGENTS.md
  - 冗長な汎用ベストプラクティスを削除し95行に削減
  - プロジェクト固有のルールのみを残した
```

## 出力例（ci / firebase）

```
### イシュー
- 採用: #1901（理由: 検索で発見）

[ci] #1901 Firestore デプロイ前に firestore.indexes.json の重複検証ステップを追加

deploy_firestore ワークフローで Firebase へデプロイする直前に、indexes 配列の重複検査を挟む。

変更詳細:

- .github/workflows/deploy_firestore.yml
  - Checkout 直後に Node ワンライナーで JSON 重複を検証するステップを追加
```

## 出力例（タグなし）

```
### イシュー
- 採用: なし（理由: 内容一致する open Issue が無い）

ルート依存を更新

npm audit fix 後に package-lock.json を再生成した。

変更詳細:

- package.json
  - ルート workspaces の devDependencies を更新
- package-lock.json
  - 依存ツリーを再生成
```
