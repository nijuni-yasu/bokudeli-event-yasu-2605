# pstack 適用経路

フェーズ2 `2-3-1`。公式の「自分の流儀に合わせる」を調べたうえで、**同梱 Playbook は編集せず**、このリポジトリの規則を勝たせる経路を1つに決めた。フェーズ3のバグ修正手順は [§5](#5-バグ修正) に置く。

## 1. 公式が用意している拡張

出典は公式 [Make it yours](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/09-make-it-yours.md)（本の第37章に相当）。確認日 2026-10-04。path commit は `e43c7ee`。

| 公式の手段 | この導入での扱い |
| --- | --- |
| `/automate-me` で個人 `-mode` を履歴から生成する | 使わない。履歴採掘と PR 作成が入り、フェーズ2の対象外 |
| `/reflect` でセッション教訓を Skill に残す | 使わない。同梱・個人 Skill を増やす作業は後続 |
| `/poteto-mode` から Skill を書く | 使わない。検証スキルは既に [shokujii-user-event-cart-verify](../../../.agents/skills/shokujii-user-event-cart-verify/SKILL.md) がある |
| `/create-verification-skill` | 使わない。正本は既存スキル。上書きしない |
| 同梱 Playbook / Principle の直接編集 | **禁止**。更新で消える |

採用する経路は、**リポジトリ側の文書を先に読む**ことである。プラグイン側のファイルは読んでもよいが、衝突したら下表の採用側を使う。

## 2. 導入直後から勝つもの

優先順（上ほど強い）:

1. [AGENTS.md](../../../AGENTS.md) と既存 Skill（コミット / PR / レビュー / sandbox / セルフレビュー）
2. [導入計画 §6](01_pstack導入計画.md#6-既存ルールが優先される操作) の採用表
3. 本ファイル
4. 対象画面の検証は [shokujii-user-event-cart-verify](../../../.agents/skills/shokujii-user-event-cart-verify/SKILL.md) と [feature-map.md](../../../.agents/skills/shokujii-user-event-cart-verify/feature-map.md)
5. pstack 同梱 Playbook / Principle（上と衝突しない範囲だけ）

`/poteto-mode` が Feature や Investigation を選んでも、C1〜C3 の操作・証拠・片付けは検証スキルを Playbook より優先する。Playbook の「verify」を別ハーネスで置き換えない。

## 3. 操作ごとの入口

| 操作 | 使うもの | 使わないもの |
| --- | --- | --- |
| バグ修正 | 本ファイル [§5](#5-バグ修正) | 同梱 Bugfix Playbook を正本にしない |
| イベント→カート検証 | `shokujii-user-event-cart-verify` | 同梱の verification 生成、control-ui |
| コミット | `git-commit-workflow` / `git-commit-message` | Playbook の Conventional Commits 例をそのまま |
| PR / push | `git-create-pull-request` / `git-reflect-after-commit` | Opening a PR を単独の正本にしない |
| sandbox デプロイ | `github-actions-deploy`（予約済み環境） | 本番 `firebase deploy` |
| セルフレビュー | `shokujii-code-review` | `/interrogate` だけを完了条件にしない |
| 仕様未決 | `grill-me` | 観察実験だけで仕様を決める |
| マージ / 本番 / 保護ブランチ / `tree/` | 禁止（フックと AGENTS） | Shipping / Babysit の land |

## 4. `/poteto-mode` の範囲

- 対象会話の先頭だけ付ける。全チャットの Custom Mode にはしない。
- やめると言えば、その会話では poteto 前提で動かない。
- 次の作業は新しい会話で明示起動する。
- `cursor-team-kit`（`/deslop`、control-ui / control-cli）は入れない。画面操作は検証スキルと Playwright MCP。

## 5. バグ修正

バグ修正を頼まれたら、同梱 Playbook のコピーを作らず、この節を読む。画面操作の証拠は対象機能の検証スキル（イベント→カートなら [shokujii-user-event-cart-verify](../../../.agents/skills/shokujii-user-event-cart-verify/SKILL.md)）を使う。別画面の不具合は、その画面の同じ操作を成功証拠にする。機能追加の手順は、バグ修正が1件通ってから別作業で足す。

### 5.1 6手順

1. **再現する。** 検証スキルまたは対象画面で、届くところまで自分で操作する。人に再現を頼むのは、届かない理由を書いたあとだけ。
2. **安い失敗テスト。** 書けるなら製品コードを直す前に、今の不具合で落ちるテストを実行し、落ちた出力を残す。モックだけのテストは足さない。書けないときは理由を記録し、grep / ビルド計測など実行結果を失敗証拠にする。
3. **根本原因を直す。** 効くかもしれない対策は入れない。Firestore / Zod / Functions / store に触るときは既存 Skill（`shokujii-firestore`、`shokujii-common-schemas`、`shokujii-functions-implementation`）へ従う。
4. **直す前と同じ操作の成功証拠。** 単体テストの成功だけを画面の成功にしない。モックだけの成功も画面の成功にしない。
5. **セルフレビュー。** [品質管理の slop 確認](06_モデル運用と品質管理.md) を含めて [`shokujii-code-review`](../../../.agents/skills/shokujii-code-review/SKILL.md) を行う。push や PR を頼まれているときだけ [`lint-and-format`](../../../.agents/skills/lint-and-format/SKILL.md) を行う。
6. **禁止操作。** [導入計画 §6](01_pstack導入計画.md#6-既存ルールが優先される操作) に従う。ユーザーが依頼したコミット、PR、push、sandbox デプロイは所定の Skill で実行してよい。無依頼のコミット・push・PR、マージ、本番、`tree/` への push はしない。

優先は [§2](#2-導入直後から勝つもの) と同じ。衝突したら AGENTS と既存 Skill が勝つ。

### 5.2 再現できないとき

確認した範囲、停止理由、追加で必要な入力を記録して止まる。ユーザーへ再現を丸投げしない。推測だけの製品修正で埋めない。届かない理由を書いたあとだけ、人に再現を頼む。
