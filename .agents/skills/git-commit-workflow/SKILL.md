---
name: git-commit-workflow
description: 未コミット変更を分析し fixup / squash / 分割 / 新規 / amend を自律判断して、同じターンでコミットまで実行する。メッセージ案・分割案・吸収先の承認は待たない。「コミットして」「コミットお願い」「コミット整理して」「変更を適切なコミットに反映して」「レビュー修正をコミットに反映して」と依頼された時に使用。吸収先はいま作業中のブランチ上のコミットに限定する。
---

# git-commit-workflow

未コミット変更に対し、fixup / squash / 分割 / 新規1件 / amend を自律的に選び実行するオーケストレーター。判断ロジックの正本は [classification.md](references/classification.md)。rebase 等の実行手順は leaf スキルに委譲する。

## 他スキルとの関係

| ユーザー依頼                                                                 | 使うスキル                                                                   |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| コミットして / コミットお願い / コミット整理 / レビュー修正反映             | **git-commit-workflow**（本スキル。確認せず同じターンで実行）               |
| fixup のみ / squash のみ / 分割のみ | 各 leaf スキル（分類は classification.md を参照） |
| メッセージのみ                      | **git-commit-message**                            |

| leaf スキル                                                      | 役割                                                           |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| [git-split-commit](../git-split-commit/SKILL.md)                 | B: 分割案と実行                                                |
| [git-commit-message](../git-commit-message/SKILL.md)             | メッセージ生成（C / A2 / A0 / 分割各コミット。Issue 解決含む） |
| [git-fixup](../git-fixup/SKILL.md)                               | A1: fixup + autosquash                                         |
| [git-squash](../git-squash/SKILL.md)                             | A2: squash + autosquash                                        |
| [git-reflect-after-commit](../git-reflect-after-commit/SKILL.md) | 完了後の PR / sandbox 反映                                     |

## 手順

1. [classification.md](references/classification.md) を読む

2. 分類を実行する
   - 事前コマンドを実行する
   - 各未コミット変更を B / C / D / A0 / A1 / A2 に分類する
   - A 系は [classification.md A1 判定](references/classification.md#a1-判定fixup-向きか) に従う（**デフォルト A1-fast**。昇格時のみ coherence-full）

3. 分類・A1 判定・実行計画を組み立てる（classification.md の出力フォーマット）

   **実行依頼**（「コミットして」「コミットお願い」「コミット整理して」「変更を適切なコミットに反映して」「レビュー修正をコミットに反映して」、および fixup / squash / 分割の実行依頼）では、計画をチャットに書いた時点でターンを終えない。承認を待たず、同じ応答の中で手順5へ進む。完了報告に分類とコミットハッシュを含める。

   **検討のみ**（「メッセージだけ」「分割案を出して」「分割コミットを検討して」「どう分類するか」）は計画を出して止める。

4. **D（判断不能）がある場合**

   - 実行依頼: その変更は **C（新規コミット）** に倒し、確認せず手順5へ進む。完了報告に、D だった理由と C にした理由を書く
   - 検討のみ: 停止し、判断を待つ

5. 実行計画どおりに leaf スキルを **読んで従う**（本スキル内に rebase 手順を複製しない）

   **順序**: B → C → A0 / A1 / A2

   | 分類 | 実行                                                                                                                                                                      |
   | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | B    | [git-split-commit](../git-split-commit/SKILL.md) を実行モードで最後まで行う（承認を待たない。各コミットで issue-resolution full）。戻ったら残りの A を続ける           |
   | C    | 対象を stage → [git-commit-message](../git-commit-message/SKILL.md)（issue-resolution full）→ 承認を待たず `git commit`                                                 |
   | A0   | 下記「A0 amend」                                                                                                                         |
   | A1   | [git-fixup](../git-fixup/SKILL.md) **手順5以降**（A1-fast 済み。full は classification 側で完了していること）                          |
   | A2   | [git-squash](../git-squash/SKILL.md) **手順4以降**（issue-resolution full 含む。手順3は本スキルで済みとしてスキップ可）                  |

6. working tree が clean になったら [git-reflect-after-commit](../git-reflect-after-commit/SKILL.md) を提案する（勝手に実行しない）

## A0 amend（HEAD 向け）

吸収先が **HEAD** のときのみ。非 HEAD では amend 不可（A1 fixup または A2 squash を使う）。

1. `git restore --staged .` でいったん全解除する
2. 対象差分を stage する
3. A1-fast 相当の確認（HEAD タイトル + パス整合）
   - OK: `git commit --amend --no-edit`
   - 乖離（明白）または A1-full 昇格: [git-commit-message](../git-commit-message/SKILL.md) を **amend + full** コンテキストで呼び（issue-resolution 含む）、`git commit --amend -F` または `-m` で反映
4. `git log -1 --oneline` で確認する

## 制約

- main / development ブランチでは実行しない
- 分類の正本は classification.md。本スキルに分類表を重複記述しない
- メッセージフォーマット・イシュー解決の正本は git-commit-message / issue-resolution のみ
- B/C を無理に fixup/squash しない
- 実行依頼ではメッセージ・分割案・吸収先の承認を待たない。A2 squash は計画を書いたあと自動実行する。D は C として自動実行する
- 検討のみの依頼だけ、計画を出して停止する（D もここで止める）

---

## コミット完了後の提案

すべての実行が正常に完了し、working tree が clean になったら:

> コミットが完了しました。`/git-reflect-after-commit` で origin への PR 反映と sandbox デプロイをまとめて実行しますか？

- 未コミット変更が残っている・途中失敗時は提案しない
