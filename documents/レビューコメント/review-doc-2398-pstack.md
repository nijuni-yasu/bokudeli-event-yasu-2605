# ブランチ doc/2398-pstack レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 4176899565 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | branch protection の 0-3 完了状態が台帳と矛盾<br>導入計画が 0-3-1/2 を未完了扱い<br>フェーズ5の可否を誤判定しうる<br>正本に合わせ 0-3-5 等のみ未完了と明記しチェックリスト同期 |
| [x] | RC-2 | 4176899566 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 既存 Playwright MCP 試行手順の再利用が未記載<br>フェーズ1で手順書二重化の恐れ<br>検証フローが乖離しうる<br>playwright-mcp 手順への参照を追加 |
| [x] | RC-3 | 4176899568 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 証拠が画面上の文言のみでも完了扱い<br>URL・ビルド・操作が残らない<br>人が後から検証できない<br>スクリーンショット等を必須化 |
| [x] | RC-4 | 4176899573 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | フェーズ3手順6が第6章を一律禁止<br>依頼時のコミット・PRと矛盾<br>lint 条件とも食い違う<br>採用条件に従う条件付き表現へ修正 |
| [x] | RC-5 | 4176899575 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | フェーズ5で自動マージが解禁候補に読める<br>第6章・第9章は禁止<br>誤解で運用が緩む<br>条件達成後もエージェント自動マージ禁止を明記 |
| [x] | RC-6 | 4176899580 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | STATE.md をフェーズ5まで作らない方針<br>Loop 方針は L1 前に STATE 必須<br>L1 で重複報告の恐れ<br>最初の L1 試行前作成へ変更 |
| [x] | RC-7 | 4176899582 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | フェーズ5の5条件に目標契約・上限が無い<br>Loop 方針の停止条件と不足<br>無制限反復の恐れ<br>Owner・上限・kill switch を条件に追加 |

| [x] | RC-8 | 5980202572 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | branch protection API 例が verify のみ<br>0-3-2b の test が外れる<br>verify+test の例に修正 |
| [x] | RC-9 | 5980202572 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | seed スクリプトの project 検証不足<br>sandbox ID allowlist を追加 |
| [x] | RC-10 | 5980202572 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 2-4-2 が 2-4-1 未完了で DONE<br>2-4-2 を Todo に戻す |
| [x] | RC-11 | 5980202572 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | M-2 のモデル実機確認が未記録<br>M-2 を Doing に変更 |
| [x] | RC-12 | 5980202572 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | verification_test_outbox の Rules テスト不足<br>enterprise rules テストに追加 |
| [ ] | RC-13 | 4177715886 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | ローカル未検証を全体完了に数えている<br>D-05/D-14 と検証スキルが矛盾<br>任意扱いを廃止し全体未完了へ修正<br>ローカル接続先整備と実機証明は未実施 |
| [x] | RC-14 | 4177716198 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | M | 第三者が fixture のOTPを発行・取得できる<br>公開 Callable とブラウザAPIを廃止<br>既存ADCのstore読取へ変更し許可projectも限定<br>旧sandbox関数の削除と修正後実機は未確認 |
| [x] | RC-15 | 4177716238 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | Issueが検証基盤の実装を範囲外にしている<br>ユーザーの導入実装・レビュー修正依頼で範囲が拡張<br>Issue #2398 の説明と追加完了条件を同期<br>夜間実行・マージ・本番は対象外のまま |
| [x] | RC-16 | 4177716280 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | 不正な記録が正常なOTP記録として補完される<br>converter に共通Db/Appスキーマを適用<br>Timestamp保存とmillis読取を明示<br>壊れた値の拒否・旧null run ID互換を7テストで確認 |
| [x] | RC-17 | 4177716311 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | OTP 再送で verification_run_id 欠落<br>pass-code で run ID を引き継ぎ |
| [x] | RC-18 | 5406274972 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | Copilot overview はOTP認可・run IDを指摘<br>認可経路はRC-14のADC化で修正<br>再送run IDは既存RC-17で修正済み<br>同じテーマを重複実装しない |
| [x] | RC-19 | 4178025835 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 旧runが生きたまま予約を再割当できる<br>予約確認と副作用の間にも切替が入る<br>終了確認・ロック内実行・pending発火記録を追加<br>API失敗やrun未登録の間は保持 |
| [x] | RC-20 | 4178025836 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | rebaseの祖先判定が逆<br>開始・再開と最終引渡しの適用も不足<br>origin/development→HEADの判定に統一<br>実rebaseの未証明はDoingとして保持 |
| [x] | RC-21 | 4178025840 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 前回Functionsの応答でも成功と数えうる<br>run未完了の画面確認を参考証拠へ限定<br>全対象runのsuccessとheadSha一致を必須化<br>新しいブラウザから検証し直して引き渡す |
| [x] | RC-22 | 4178025842 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 📄 ドキュメントのみ | S | 再検証seedで人の確認待ちのカートが消える<br>D-12に合わせ新規割当時だけ初期化<br>削除はstatus=in_cartに限定<br>同作業は追加前後の数量差で検証 |

---

## 評価セッション（2026-10-04 18:17・review-comments-evaluate）

- **評価日時**: 2026-10-04 18:17 JST
- **ブランチ名**: doc/2398-pstack
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2399
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 4（Codex サマリボット、レビュー依頼定型文、Copilot 承知返信、Codex 接続案内レビュー本文）
- **重複除外**: なし
- **partial**: false

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 4176899565 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | branch protection の 0-3 完了状態が台帳と矛盾<br>導入計画が 0-3-1/2 を未完了扱い<br>フェーズ5の可否を誤判定しうる<br>正本に合わせ 0-3-5 等のみ未完了と明記しチェックリスト同期 |
| [x] | RC-2 | 4176899566 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 既存 Playwright MCP 試行手順の再利用が未記載<br>フェーズ1で手順書二重化の恐れ<br>検証フローが乖離しうる<br>playwright-mcp 手順への参照を追加 |
| [x] | RC-3 | 4176899568 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 証拠が画面上の文言のみでも完了扱い<br>URL・ビルド・操作が残らない<br>人が後から検証できない<br>スクリーンショット等を必須化 |
| [x] | RC-4 | 4176899573 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | フェーズ3手順6が第6章を一律禁止<br>依頼時のコミット・PRと矛盾<br>lint 条件とも食い違う<br>採用条件に従う条件付き表現へ修正 |
| [x] | RC-5 | 4176899575 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | フェーズ5で自動マージが解禁候補に読める<br>第6章・第9章は禁止<br>誤解で運用が緩む<br>条件達成後もエージェント自動マージ禁止を明記 |
| [x] | RC-6 | 4176899580 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | STATE.md をフェーズ5まで作らない方針<br>Loop 方針は L1 前に STATE 必須<br>L1 で重複報告の恐れ<br>最初の L1 試行前作成へ変更 |
| [x] | RC-7 | 4176899582 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | フェーズ5の5条件に目標契約・上限が無い<br>Loop 方針の停止条件と不足<br>無制限反復の恐れ<br>Owner・上限・kill switch を条件に追加 |

**識別子**: RC-1（GitHub id: 4176899565）

**レビュワー**: Codex

**指摘箇所**: `documents/AIエージェント/02_pstack/01_pstack導入計画.md:28`

**該当コード（レビュー時点の diff）**: （インライン指摘。PR #2399 commit `949409c`）

**レビュワーのコメント（原文）**:

branch protection の完了状態を同期する（0-3-1、0-3-2 が branch_protection では DONE、チェックリストは Todo のまま）。

**コメント要約**: 導入計画が 0-3-1/2/5 をすべて未完了と書いている。<br>`03_branch_protection.md` とチェックリストが食い違う。<br>フェーズ5の着手判定を誤る。<br>正本に合わせて文言とチェックリストを同期した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: #2119 実施済みの記録と整合。計画と Loop チェックリストを更新した。

---

（RC-2〜RC-7 は同一ファイルへのドキュメント修正。手順4aで `01_pstack導入計画.md` と `01_Loop_Engineering/02_導入チェックリスト.md` を更新済み。各 RC の原文は GitHub PR #2399 のインラインコメント id 4176899566〜4176899582 を参照。）

---

## 評価セッション（2026-10-04 22:05・review-comments-evaluate・auto）

- **評価日時**: 2026-10-04 22:05 JST
- **ブランチ名**: doc/2398-pstack
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2399
- **REVIEW_REQUEST_SINCE**: 2026-10-04T12:53:19Z
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼定型文 id 5980137260、Codex 接続案内レビュー id 5406274641）
- **重複除外**: なし
- **partial**: false
- **手順 4a 自動修正**: RC-8〜RC-12・RC-17（🚨 3件 / 🟡 3件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-8 | 5980202572 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | branch protection API 例が verify のみ<br>0-3-2b の test が外れる<br>verify+test の例に修正 |
| [x] | RC-9 | 5980202572 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | seed スクリプトの project 検証不足<br>sandbox ID allowlist を追加 |
| [x] | RC-10 | 5980202572 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 2-4-2 が 2-4-1 未完了で DONE<br>2-4-2 を Todo に戻す |
| [x] | RC-11 | 5980202572 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | M-2 のモデル実機確認が未記録<br>M-2 を Doing に変更 |
| [x] | RC-12 | 5980202572 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | verification_test_outbox の Rules テスト不足<br>enterprise rules テストに追加 |
| [ ] | RC-13 | 4177715886 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | ローカル未検証を全体完了に数えている<br>D-05/D-14 と検証スキルが矛盾<br>任意扱いを廃止し全体未完了へ修正<br>ローカル接続先整備と実機証明は未実施 |
| [x] | RC-14 | 4177716198 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | M | 第三者が fixture のOTPを発行・取得できる<br>公開 Callable とブラウザAPIを廃止<br>既存ADCのstore読取へ変更し許可projectも限定<br>旧sandbox関数の削除と修正後実機は未確認 |
| [x] | RC-15 | 4177716238 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | Issueが検証基盤の実装を範囲外にしている<br>ユーザーの導入実装・レビュー修正依頼で範囲が拡張<br>Issue #2398 の説明と追加完了条件を同期<br>夜間実行・マージ・本番は対象外のまま |
| [x] | RC-16 | 4177716280 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | 不正な記録が正常なOTP記録として補完される<br>converter に共通Db/Appスキーマを適用<br>Timestamp保存とmillis読取を明示<br>壊れた値の拒否・旧null run ID互換を7テストで確認 |
| [x] | RC-17 | 4177716311 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | OTP 再送で verification_run_id 欠落<br>pass-code で run ID を引き継ぎ |
| [x] | RC-18 | 5406274972 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | Copilot overview はOTP認可・run IDを指摘<br>認可経路はRC-14のADC化で修正<br>再送run IDは既存RC-17で修正済み<br>同じテーマを重複実装しない |

（自動修正しなかった RC: RC-13〜16・18 — 仕様判断・セキュリティ設計・Issue スコープ・スキーマ化。詳細は GitHub コメント原文を参照。）


## 評価セッション（2026-10-04 23:20・shokujii-code-review）

- **評価日時**: 2026-10-04 23:20 JST
- **評価者**: Codex Agent（shokujii-code-review）
- **ブランチ名**: doc/2398-pstack
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2399
- **レビュー対象 HEAD**: 5036a425232252572e1d97a1c552741cc6f2f6fa と本タスクの未コミット修正
- **Outdated / レビュー非該当**: 該当なし
- **重複除外**: 既存RC-13〜16・18は再採番せず対応追記。RC-17は対応済みを維持
- **検証**: lint-and-format の全ステップ成功。予約管理14テスト、共通outboxスキーマ7テスト、送信境界8テスト成功。実DB初期化・デプロイ・ブラウザ操作は未実施
- **原文の整形**: GitHub overview の Markdown 改行用行末空白のみ除去。本文は変更なし
- **再レビュー**: 修正差分の型・Zod・store・認証境界・予約競合・デプロイSHA・手順整合を再確認。指摘の修正は最大2周以内

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-19 | 4178025835 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 旧runが生きたまま予約を再割当できる<br>予約確認と副作用の間にも切替が入る<br>終了確認・ロック内実行・pending発火記録を追加<br>API失敗やrun未登録の間は保持 |
| [x] | RC-20 | 4178025836 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | rebaseの祖先判定が逆<br>開始・再開と最終引渡しの適用も不足<br>origin/development→HEADの判定に統一<br>実rebaseの未証明はDoingとして保持 |
| [x] | RC-15 | 4177716238 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | Issueが検証基盤の実装を範囲外にしている<br>ユーザーの導入実装・レビュー修正依頼で範囲が拡張<br>Issue #2398 の説明と追加完了条件を同期<br>夜間実行・マージ・本番は対象外のまま |
| [x] | RC-21 | 4178025840 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 前回Functionsの応答でも成功と数えうる<br>run未完了の画面確認を参考証拠へ限定<br>全対象runのsuccessとheadSha一致を必須化<br>新しいブラウザから検証し直して引き渡す |
| [x] | RC-22 | 4178025842 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 📄 ドキュメントのみ | S | 再検証seedで人の確認待ちのカートが消える<br>D-12に合わせ新規割当時だけ初期化<br>削除はstatus=in_cartに限定<br>同作業は追加前後の数量差で検証 |
| [ ] | RC-13 | 4177715886 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | ローカル未検証を全体完了に数えている<br>D-05/D-14 と検証スキルが矛盾<br>任意扱いを廃止し全体未完了へ修正<br>ローカル接続先整備と実機証明は未実施 |
| [x] | RC-16 | 4177716280 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | 不正な記録が正常なOTP記録として補完される<br>converter に共通Db/Appスキーマを適用<br>Timestamp保存とmillis読取を明示<br>壊れた値の拒否・旧null run ID互換を7テストで確認 |
| [x] | RC-14 | 4177716198 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | M | 第三者が fixture のOTPを発行・取得できる<br>公開 Callable とブラウザAPIを廃止<br>既存ADCのstore読取へ変更し許可projectも限定<br>旧sandbox関数の削除と修正後実機は未確認 |
| [x] | RC-18 | 5406274972 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | Copilot overview はOTP認可・run IDを指摘<br>認可経路はRC-14のADC化で修正<br>再送run IDは既存RC-17で修正済み<br>同じテーマを重複実装しない |

---

**識別子**: RC-19（GitHub id: 4178025835）

**レビュワー**: Codex Agent（shokujii-code-review）

**指摘箇所**: `.agents/scripts/sandbox_reservation.py:193`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,689 @@
+            reason = "reconcile_merged" if state == "MERGED" else "reconcile_closed"
+            _append_history(ledger, env_id=env_id, reservation=reservation, reason=reason)
+            env["reservation"] = None
+            env["status"] = "empty"
+            released.append({"env_id": env_id, "pr": pr, "state": state, "reason": reason})
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/M]: PR の merge/close だけで予約を解放すると、旧ブランチの deploy run が実行中でも次の作業が seed・deploy を開始でき、旧 Functions が新環境を上書きします。switch/release/reconcile の前に旧 deploy run の終了を確認し、API 確認失敗時も保持してください。また check と副作用の間の予約切替を防ぐため、seed・push・dispatch を台帳ロック内で実行する経路が必要です。

**コメント要約**: 旧runが生きたまま予約を再割当できる<br>予約確認と副作用の間にも切替が入る<br>終了確認・ロック内実行・pending発火記録を追加<br>API失敗やrun未登録の間は保持

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 旧deploy run/API確認失敗時に切替・返却・自動解放を拒否。seed/push/dispatch は run コマンドで予約のロックを保持する。dispatch前にpendingを保存し、対象SHA・branch・workflow・時刻が一致する終了済みrunの記録まで保持。14テスト成功。単一PCの共通台帳を前提とし、旧エージェントがラッパーを無視する経路や複数PCの排他は未証明。

---

**識別子**: RC-20（GitHub id: 4178025836）

**レビュワー**: Codex Agent（shokujii-code-review）

**指摘箇所**: `.agents/skills/git-commit-workflow/SKILL.md:32`

**該当コード（レビュー時点の diff）**:

```diff
@@ -25,6 +25,16 @@ description: 未コミット変更を分析し fixup / squash / 分割 / 新規
+   - `origin/development` の SHA と確認時刻を控える
+   - `git worktree list` で同じブランチが別 worktree にあれば止める
+   - 作業ブランチが `origin/development` の祖先でない（未取り込みがある）ときは rebase する
+   - 未コミット差分があるときは `git stash push -u` で退避する。`--all` は使わず、gitignored の `.env` は含めない。rebase 後に戻す。競合したら意図を読んで解消し、仕様判断が必要なら止めて stash は残す
+   - 複数 Issue のコミットは rebase で 1 つにまとめない
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [📄ドキュメントのみ/S]: 祖先関係の向きが逆です。未取り込みの判定は `git merge-base --is-ancestor origin/development HEAD` が 1 の場合です（0 は取込済み、その他は検査失敗）。開始・再開時と引き渡し直前にもこの確認を適用してください。

**コメント要約**: rebaseの祖先判定が逆<br>開始・再開と最終引渡しの適用も不足<br>origin/development→HEADの判定に統一<br>実rebaseの未証明はDoingとして保持

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 祖先判定を origin/development → HEAD に修正。AGENTSの開始・再開とreflectの最終確認にも適用。実rebase試行はR-4で未証明のためR-1の状態をDoingへ戻した。

---

**識別子**: RC-15（GitHub id: 4177716238）

**レビュワー**: Copilot

**指摘箇所**: `.agents/skills/shokujii-user-event-cart-verify/SKILL.md:3`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,183 @@
+---
+name: shokujii-user-event-cart-verify
+description: Shokujii user アプリで、注文受付中イベントのメニューをカートに追加し /cart で内容を確認する検証手順。pstack フェーズ1・標準フローの画面証拠用。イベント→カート、D-14、検証スキル、画面確認、Playwright で触るときは必ずこのスキルを使う。
+---
+
```

**レビュワーのコメント（原文）**:

[must] Issue #2398 は検証スキルの実装を本 Issue の範囲外として別作業にする方針ですが、この PR はスキル実装と検証基盤まで含めて #2398 を close します。追跡範囲と完了条件が一致するよう、実装を別 Issue に分けるか #2398 側のスコープを更新してください。

**コメント要約**: Issueが検証基盤の実装を範囲外にしている<br>ユーザーの導入実装・レビュー修正依頼で範囲が拡張<br>Issue #2398 の説明と追加完了条件を同期<br>夜間実行・マージ・本番は対象外のまま

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: ユーザーが doc/2398-pstack の導入実装とその修正を明示依頼した範囲に Issue #2398 を更新した。未確認の追加完了条件は未チェック。PR説明の範囲保留も同期済み。

---

**識別子**: RC-21（GitHub id: 4178025840）

**レビュワー**: Codex Agent（shokujii-code-review）

**指摘箇所**: `.agents/skills/shokujii-user-event-cart-verify/SKILL.md:27`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,183 @@
+4. 最低限 `deploy_user.yml` / `deploy_functions.yml` / `deploy_firestore.yml` を発火する。`deploy_enterprise.yml` は sandbox で hosting target 未設定のためスキップしてよい。
+5. 6 本一括発火すると、同じブランチの Deploy functions が重なり **cancelled** になり得る。functions が cancelled または長時間 in_progress なら **`deploy_functions.yml` を単体で再発火**する。
+6. 成功判定: 対象 Hosting URL が開き、検証に必要な Callable（`requestEmailLogin` / `fetchVerificationTestPassCode` / `addToCart`）が応答する。デプロイ run が success ならそれを優先記録する。run 未完了でも Callable が動けば画面検証は進めてよい（証拠に「run 未確定」と書く）。
+
+## 接続先と外部作用（1-2-2）
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [📄ドキュメントのみ/S]: Callable の応答だけでは、前回デプロイの Functions を検証している可能性があります。途中の参考確認と完了判定を分け、必要な user/functions/firestore run が completed/success かつ対象 PR HEAD の headSha であることを確認してから C1〜C3 を実行・合格判定してください。

**コメント要約**: 前回Functionsの応答でも成功と数えうる<br>run未完了の画面確認を参考証拠へ限定<br>全対象runのsuccessとheadSha一致を必須化<br>新しいブラウザから検証し直して引き渡す

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 必要な全runの completed/success と対象PR HEADのheadShaを必須にした。旧functionsの応答と途中の画面確認は参考証拠に限定。修正後の実デプロイ・画面証明は未実施。

---

**識別子**: RC-22（GitHub id: 4178025842）

**レビュワー**: Codex Agent（shokujii-code-review）

**指摘箇所**: `.agents/skills/shokujii-user-event-cart-verify/SKILL.md:68`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,183 @@
+### データの準備・復元
+
+リポジトリルートで seed する（再検証前は再実行を推奨。seed は当該ユーザーの当該イベントの `in_cart` を削除する）。
+
+```text
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [📄ドキュメントのみ/S]: 再検証前の seed 推奨は D-12（同じ作業の修正・再デプロイ・人の確認待ちでは初期化しない）と矛盾し、人が確認中のカートを消します。seed は新規割当時だけに限定し、同じ作業の再実行では追加前の数量を記録して +1 を検証してください。seed 本体も説明に合わせ `status=in_cart` のみを削除する必要があります。

**コメント要約**: 再検証seedで人の確認待ちのカートが消える<br>D-12に合わせ新規割当時だけ初期化<br>削除はstatus=in_cartに限定<br>同作業は追加前後の数量差で検証

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: seedは新規割当時だけ、status=in_cartだけを削除する。再検証では追加前の数量Nを記録してN+1を検証し、既存データを保持する。seed project検査も形式正規表現から登録済みIDに限定。実DBでseedは実行していない。

---

**識別子**: RC-13（GitHub id: 4177715886）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `documents/AIエージェント/02_pstack/01_pstack導入計画.md:152`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,275 @@
+| 画面 | userのイベントページでメニューを選び、カートに反映されるまで（D-14）。カート確認を同じ1機能の範囲に含む |
+| アプリ | user |
+| 完了条件 | ①ローカル・sandboxの両方で新しいブラウザから人の補助なしにテストユーザーとしてログインできる。②架空の注文受付中イベントで指定メニューを選びカートへ追加できる。③カートのメニューと数量が選択した内容に一致する。決済確定は含めない。fixtureの具体値は実装調査で固定する |
+
+### フェーズ1: 検証を1周させる
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  ローカル検証の完了条件を正本と揃える**

前回指摘後の新しい証拠として、最終版の検証スキルはローカルを「主経路の成功判定に使わない」と明記し、受け口などを自力で整備できない限り停止する手順へ変わっていますが、この完了条件は依然としてローカルと sandbox の両方での無人ログインを要求しています。チェックリストではフェーズ1を完了扱いにしているため、このままではローカル未検証のまま条件達成と誤判定されます。ローカルを完了条件から外すか、再現可能なローカル認証手順と証拠を用意して正本間を同期してください。

AGENTS.md reference: [AGENTS.md:L53-L55](https://github.com/nijuniinc/bokudeli-event-new/blob/e97ee241b35be1802e84edd005588a5cedec682a/AGENTS.md#L53-L55)

Useful? React with 👍 / 👎.

**コメント要約**: ローカル未検証を全体完了に数えている<br>D-05/D-14 と検証スキルが矛盾<br>任意扱いを廃止し全体未完了へ修正<br>ローカル接続先整備と実機証明は未実施

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 手順とチェックリスト・フェーズ1サマリは同期済み。ローカルの env 接続先と新ブラウザ C1〜C3 の実機証拠は未完了のため、RC は未着手のまま保持する。

---

**識別子**: RC-16（GitHub id: 4177716280）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stores/verificationTestOutbox.ts:29`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,74 @@
+  },
+  fromFirestore(snapshot: QueryDocumentSnapshot): VerificationTestOutboxRecord {
+    const data = snapshot.data()
+    return {
+      id: snapshot.id,
```

**レビュワーのコメント（原文）**:

[must] この converter は共通 Zod スキーマを通さず、不正な `email` / `pass_code` を空文字、壊れた日時を現在時刻へ置換してデータ破損を隠します。既存の `PassCode` と converter（`common/src/schemas/PassCode.ts:11-48`, `functions/default/src/stores/passCode.ts:24-30`）と同様に common の Db/AppSchema で検証してください。

**コメント要約**: 不正な記録が正常なOTP記録として補完される<br>converter に共通Db/Appスキーマを適用<br>Timestamp保存とmillis読取を明示<br>壊れた値の拒否・旧null run ID互換を7テストで確認

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: common の VerificationTestOutboxDbSchema / AppSchema を converter に適用。欠落・不正データを拒否し、Timestamp.now() による不正データ補完を削除。必要な null run ID の互換は維持。

---

**識別子**: RC-14（GitHub id: 4177716198）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/verificationTest.ts:11`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,30 @@
+  FetchVerificationTestPassCodeRequest,
+  Promise<FetchVerificationTestPassCodeResponse>
+>(async (request) => {
+  if (getVerificationTestOutboxMode() === 'off') {
+    throw new HttpsError('permission-denied', 'verification test outbox is disabled')
```

**レビュワーのコメント（原文）**:

[must] この Callable は認証・認可なしで OTP を返します。fixture のメールアドレスはリポジトリ内で公開されており、`requestEmailLogin` も未認証で呼べるため、第三者が自分で OTP を発行・取得して fixture ユーザーとしてログインできます。取得スクリプトは ADC で Firestore を直接読む形にするか、IAM 認証された非公開 endpoint に変更してください。

**コメント要約**: 第三者が fixture のOTPを発行・取得できる<br>公開 Callable とブラウザAPIを廃止<br>既存ADCのstore読取へ変更し許可projectも限定<br>旧sandbox関数の削除と修正後実機は未確認

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 公開 Callable・index export・未使用 API 型/クライアントを削除。CLI は既存 ADC を用い、run ID 必須・登録済み sandbox と架空宛先のみ読む。記録モードも許可 project 以外は off。追加権限の付与はない。コード修正完了であり、稼働中 sandbox の旧関数削除は未実施。

---

**識別子**: RC-18（GitHub id: 5406274972）

**レビュワー**: Codex Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/verificationTest.ts:11`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,30 @@
+  FetchVerificationTestPassCodeRequest,
+  Promise<FetchVerificationTestPassCodeResponse>
+>(async (request) => {
+  if (getVerificationTestOutboxMode() === 'off') {
+    throw new HttpsError('permission-denied', 'verification test outbox is disabled')
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

未認証で OTP を取得できる Callable と再送時の run ID 欠落を解消する必要があります。

**Review effort:** Balanced
**Findings:** 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 3 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (4)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [未認証CallableがOTPを返し第三者ログインを許す](#discussion_r4177716198) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Issue #2398のスコープとPRの完了条件が不一致](#discussion_r4177716238) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [スキーマ未検証で不正データを空値や現在時刻に置換する](#discussion_r4177716280) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [再送時にrun IDが欠落し古いOTPを取得する](#discussion_r4177716311) · New
</details>

**コメント要約**: Copilot overview はOTP認可・run IDを指摘<br>認可経路はRC-14のADC化で修正<br>再送run IDは既存RC-17で修正済み<br>同じテーマを重複実装しない

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-14 と RC-17 の変更で overview の実装対象を解消した。評価は 🟡 のまま、ステータスのみ更新。
