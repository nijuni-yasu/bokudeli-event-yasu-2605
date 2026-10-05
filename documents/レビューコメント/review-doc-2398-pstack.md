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
| [x] | RC-13 | 4177715886 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | D-05/D-14 の文書同期に加え、予約sandbox2603接続のローカルUIで新規隔離ブラウザのメールログイン→イベント→カートを実証。数量0→1、800円を確認。最新SHAのsandbox再デプロイ後確認は引渡し時に別途確認する。 |
| [x] | RC-14 | 4177716198 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | M | 第三者が fixture のOTPを発行・取得できる<br>公開 Callable とブラウザAPIを廃止<br>既存ADCのstore読取へ変更し許可projectも限定<br>旧sandbox関数の削除と修正後実機は未確認 |
| [x] | RC-15 | 4177716238 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | Issueが検証基盤の実装を範囲外にしている<br>ユーザーの導入実装・レビュー修正依頼で範囲が拡張<br>Issue #2398 の説明と追加完了条件を同期<br>夜間実行・マージ・本番は対象外のまま |
| [x] | RC-16 | 4177716280 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | 不正な記録が正常なOTP記録として補完される<br>converter に共通Db/Appスキーマを適用<br>Timestamp保存とmillis読取を明示<br>壊れた値の拒否・旧null run ID互換を7テストで確認 |
| [x] | RC-17 | 4177716311 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | OTP 再送で verification_run_id 欠落<br>pass-code で run ID を引き継ぎ |
| [x] | RC-18 | 5406274972 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | Copilot overview はOTP認可・run IDを指摘<br>認可経路はRC-14のADC化で修正<br>再送run IDは既存RC-17で修正済み<br>同じテーマを重複実装しない |
| [x] | RC-19 | 4178025835 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 旧runが生きたまま予約を再割当できる<br>予約確認と副作用の間にも切替が入る<br>終了確認・ロック内実行・pending発火記録を追加<br>API失敗やrun未登録の間は保持 |
| [x] | RC-20 | 4178025836 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | rebaseの祖先判定が逆<br>開始・再開と最終引渡しの適用も不足<br>origin/development→HEADの判定に統一<br>実rebaseの未証明はDoingとして保持 |
| [x] | RC-21 | 4178025840 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 前回Functionsの応答でも成功と数えうる<br>run未完了の画面確認を参考証拠へ限定<br>全対象runのsuccessとheadSha一致を必須化<br>新しいブラウザから検証し直して引き渡す |
| [x] | RC-22 | 4178025842 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 📄 ドキュメントのみ | S | 再検証seedで人の確認待ちのカートが消える<br>D-12に合わせ新規割当時だけ初期化<br>削除はstatus=in_cartに限定<br>同作業は追加前後の数量差で検証 |
| [x] | RC-23 | 5406607245 | 👌 修正不要 | — | — | — | — | — | 2026-10-04 23:12 の overview は目次<br>リンク先は RC-24 以降と既存 RC の再掲<br>目次自体に追加の修正要求はない |
| [x] | RC-24 | 4178012179 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 台帳 JSON の直接上書きで破損しうる<br>`_save_ledger` を一時ファイルと `os.replace` に変更 |
| [x] | RC-25 | 4178012202 | 👌 修正不要 | — | — | 🔒 セキュリティ | — | — | request-test-login は空チェックの直後に sandbox allowlist がある<br>本番 project では OTP を送る前に拒否する |
| [x] | RC-26 | 4178012213 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 未認証の outbox は read だけを検証していた<br>未認証 set の assertFails を追加 |
| [x] | RC-27 | 4178012235 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | sessionStorage 失敗時に再送へ run ID が渡らない<br>pass-code 遷移の state にも同じ値を載せる |
| [x] | RC-28 | 4178019087 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 明示・記憶済み先は台帳の同一環境をreserveし、予約結果から宛先を決定。runが異なるrepo/ref・remote・projectの副作用を拒否する。 |
| [x] | RC-29 | 4178019093 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 単体発火の例にも現在HEADのrecord-deployとSINCE記録を追加。ロック内の予約検査は既存runを利用する。 |
| [x] | RC-30 | 4178019097 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | target_shaをwatcher必須入力にし、run選択と終了後メタデータをSHA照合。結果にheadSha/status/conclusionを保存し、不一致・取得不能を成功にしない。 |
| [x] | RC-31 | 4178019100 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 自動修正の作業ツリー差分からコミット→origin/PR更新→同じ予約で再デプロイまで明記。限定依頼と最大2周・fixture保持を維持。 |
| [x] | RC-32 | 4178019105 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | M | 既存入口とAGENTS.mdに実装開始前のIssue再利用／起票→作業ブランチ→実装→コミットを接続。新規オーケストレーターは追加しない。 |
| [x] | RC-33 | 4178019108 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📋 仕様追加 | M | 認証本体の24時間定数を共有しexpires_atを保存、期限切れ取得を拒否。新規OTP発行時に古い100件までをstore経由で削除。旧記録はcreated_atから期限を導出。TTL設定・追加IAM・費用変更なし。発行がない期間の物理削除は次回まで保留。 |
| [x] | RC-34 | 4178019109 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | SHA が変わっても retry 回数が残る<br>target_sha が変わる record-deploy で retry を初期化する |
| [x] | RC-35 | 5980936304 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | 個人ホーム絶対パスを<メインクローン>の説明とsandbox_reservation.py pathへ置換。 |
| [ ] | RC-36 | なし | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | run ID省略で発行した OTP は取得 CLI から取得できない<br>`request-test-login.mjs` が `--run-id` を任意としている<br>この実行経路ではOTPを取り出せずログイン検証が止まる<br>run IDを必須にし、不足時は明示エラーで拒否する |

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
| [x] | RC-13 | 4177715886 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | D-05/D-14 の文書同期に加え、予約sandbox2603接続のローカルUIで新規隔離ブラウザのメールログイン→イベント→カートを実証。数量0→1、800円を確認。最新SHAのsandbox再デプロイ後確認は引渡し時に別途確認する。 |
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
| [x] | RC-13 | 4177715886 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | D-05/D-14 の文書同期に加え、予約sandbox2603接続のローカルUIで新規隔離ブラウザのメールログイン→イベント→カートを実証。数量0→1、800円を確認。最新SHAのsandbox再デプロイ後確認は引渡し時に別途確認する。 |
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

**コメント要約**: D-05/D-14 の文書同期に加え、予約sandbox2603接続のローカルUIで新規隔離ブラウザのメールログイン→イベント→カートを実証。数量0→1、800円を確認。最新SHAのsandbox再デプロイ後確認は引渡し時に別途確認する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: D-05/D-14 の文書同期に加え、予約sandbox2603接続のローカルUIで新規隔離ブラウザのメールログイン→イベント→カートを実証。数量0→1、800円を確認。最新SHAのsandbox再デプロイ後確認は引渡し時に別途確認する。

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

---

## 評価セッション（2026-10-05 11:54・review-comments-evaluate・auto）

- **評価日時**: 2026-10-05 11:54 JST
- **ブランチ名**: doc/2398-pstack
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2399
- **REVIEW_REQUEST_SINCE**: 2026-10-04T14:05:03Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 7（依頼定型文 5980844948、Codex 接続案内 5406614305、本文が空の review 5406620762 / 5406636379 / 5406636459 / 5406636526 / 5406636595）
- **重複除外**: 5980936304 の OTP Callable → RC-14、converter → RC-16。4178025835 → RC-19。4178025836 → RC-20。4178025840 → RC-21。4178025842 → RC-22
- **手順 4a 自動修正**: RC-24・RC-26・RC-27・RC-34（🚨 2件 / 🟡 2件）。予約テスト 14 件成功
- **自動修正しなかったもの**: RC-28〜RC-33・RC-35（方針が複数、仕様追加、セキュリティ文言、工数 M）
- **対応完了の返信**: 4178041581 / 4178041652 / 4178041734 / 4178041792 は既存 RC-13〜RC-16 の作業メモ。新規の修正要求は無いため追加 RC にしない

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-23 | 5406607245 | 👌 修正不要 | — | — | — | — | — | 2026-10-04 23:12 の overview は目次<br>リンク先は RC-24 以降と既存 RC の再掲<br>目次自体に追加の修正要求はない |
| [x] | RC-24 | 4178012179 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 台帳 JSON の直接上書きで破損しうる<br>`_save_ledger` を一時ファイルと `os.replace` に変更 |
| [x] | RC-25 | 4178012202 | 👌 修正不要 | — | — | 🔒 セキュリティ | — | — | request-test-login は空チェックの直後に sandbox allowlist がある<br>本番 project では OTP を送る前に拒否する |
| [x] | RC-26 | 4178012213 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 未認証の outbox は read だけを検証していた<br>未認証 set の assertFails を追加 |
| [x] | RC-27 | 4178012235 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | sessionStorage 失敗時に再送へ run ID が渡らない<br>pass-code 遷移の state にも同じ値を載せる |
| [x] | RC-28 | 4178019087 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 明示・記憶済み先は台帳の同一環境をreserveし、予約結果から宛先を決定。runが異なるrepo/ref・remote・projectの副作用を拒否する。 |
| [x] | RC-29 | 4178019093 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 単体発火の例にも現在HEADのrecord-deployとSINCE記録を追加。ロック内の予約検査は既存runを利用する。 |
| [x] | RC-30 | 4178019097 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | target_shaをwatcher必須入力にし、run選択と終了後メタデータをSHA照合。結果にheadSha/status/conclusionを保存し、不一致・取得不能を成功にしない。 |
| [x] | RC-31 | 4178019100 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 自動修正の作業ツリー差分からコミット→origin/PR更新→同じ予約で再デプロイまで明記。限定依頼と最大2周・fixture保持を維持。 |
| [x] | RC-32 | 4178019105 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | M | 既存入口とAGENTS.mdに実装開始前のIssue再利用／起票→作業ブランチ→実装→コミットを接続。新規オーケストレーターは追加しない。 |
| [x] | RC-33 | 4178019108 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📋 仕様追加 | M | 認証本体の24時間定数を共有しexpires_atを保存、期限切れ取得を拒否。新規OTP発行時に古い100件までをstore経由で削除。旧記録はcreated_atから期限を導出。TTL設定・追加IAM・費用変更なし。発行がない期間の物理削除は次回まで保留。 |
| [x] | RC-34 | 4178019109 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | SHA が変わっても retry 回数が残る<br>target_sha が変わる record-deploy で retry を初期化する |
| [x] | RC-35 | 5980936304 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 📄 ドキュメントのみ | S | 個人ホーム絶対パスを<メインクローン>の説明とsandbox_reservation.py pathへ置換。 |

**識別子**: RC-24（GitHub id: 4178012179）

**レビュワー**: Copilot

**指摘箇所**: `.agents/scripts/sandbox_reservation.py:77`

**該当コード（レビュー時点の diff）**: `(diff_hunk 未取得)`

**レビュワーのコメント（原文）**:

[must] 予約台帳を直接上書きしているため、書き込み途中のプロセス終了やPC停止でJSONが途中まで切れ、次回以降の全予約操作が読み込めなくなります。この台帳は再開時の正本なので、同一ディレクトリの一時ファイルへ書いてから `replace` する原子的更新にしてください。

**コメント要約**: 台帳 JSON の直接上書きで破損しうる<br>`_save_ledger` を一時ファイルと `os.replace` に変更<br>同じディレクトリの一時ファイルから置換する<br>予約テスト 14 件は成功

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 書き込み先は一つで、一時ファイルと `os.replace` に変えれば足りる。

---

**識別子**: RC-27（GitHub id: 4178012235）

**レビュワー**: Copilot

**指摘箇所**: `user/src/pages/login.vue:56`

**該当コード（レビュー時点の diff）**: `(diff_hunk 未取得)`

**レビュワーのコメント（原文）**:

[must] `sessionStorage.setItem` が失敗した場合、初回リクエストには run ID が付く一方、この遷移では `getPassCode` の state に run ID を渡していないため、`/pass-code` 側の再送で ID が失われます。`verificationRunId.ts` が `history.state` をフォールバックとして読む設計なので、遷移 state にも同じ値を引き継いでください。

**コメント要約**: sessionStorage 失敗時に再送へ run ID が渡らない<br>pass-code 遷移の state にも同じ値を載せる<br>既存の history.state 読み取りを使える<br>query と storage が無いときの再送を補う

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 読み取り側は既に state を見ている。ログイン遷移だけが渡していなかった。

---

**識別子**: RC-34（GitHub id: 4178019109）

**レビュワー**: Codex

**指摘箇所**: `.agents/scripts/sandbox_reservation.py:434`

**該当コード（レビュー時点の diff）**: `(diff_hunk 未取得)`

**レビュワーのコメント（原文）**:

新しいデプロイ SHA では再試行回数をリセットする。`target_sha` だけを書き換え、予約に残った `retry.count` と `retry.workflows` を維持している。SHA が変わる場合は retry 状態を初期化するか SHA ごとに管理してください。

**コメント要約**: SHA が変わっても retry 回数が残る<br>前 SHA の上限が次の SHA に引き継がれる<br>record-deploy で SHA が変わるとき retry を初期化する<br>同じ SHA の再記録では回数を残す

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: SHA が変わるときだけ初期化する方が、同じ SHA の再試行回数を消さない。

---

RC-25・RC-26・RC-28〜RC-33・RC-35 の原文は PR #2399 のインラインコメント id を参照する。RC-26 は未認証 `set` の `assertFails` を追加して対応済み。



---

## 評価セッション（2026-10-05 13:02・review-comments-evaluate・未着手の再検討）

- **評価日時**: 2026-10-05 13:02 JST
- **ブランチ名**: doc/2398-pstack
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2399
- **対象**: 既存の未着手8件のみ。新規 RC なし。既存番号・評価・対応状態は維持する。
- **Outdated 除外件数**: 0（現行コードで妥当性を再確認）
- **レビュー非該当スキップ件数**: 0
- **重複除外**: 既存 RC-13、RC-28〜33、RC-35 を再検討。追加採番なし。
- **実施範囲**: ユーザーの検討依頼に従い、実装修正・GitHub 投稿・コミット・push・デプロイは行わない。既存の未コミット変更を含む現状の静的確認。実機・テストは未実行。

### 未着手の再検討サマリ

| RC | 判断 | 推奨する対応 |
| --- | --- | --- |
| RC-13 | 実機確認が必要 | D-05/D-14 の両環境必須という決定は維持する。任意扱いを廃止した文書修正は済んでいるため、残作業はローカル接続先を確認し、新しいブラウザでログイン→イベント→カートを人の補助なしに通す証拠を残すこと。既存 sandbox の成功だけでは完了にしない。 |
| RC-28 | 優先して修正 | 明示・記憶済み REMOTE と pick が選んだ環境が一致する保証がない。run_reserved は予約 ID・世代を検査するが、実行コマンドの --repo と予約環境を照合していない。明示先がある場合は対応する selectable 環境を reserve し、空きがなければ停止する。指定がない場合は pick 結果から REMOTE・REPO・project・URL を一貫して決める。人の明示的な切替依頼がない限り他の予約を奪わない。 |
| RC-29 | 主要な修正は対応済み・例の補完を推奨 | 手順2.5で単体・再試行を含む record-deploy が必須となり、単体発火も run 経由に変更済み。run_reserved がロック内で予約を確認し、target_sha 未記録の dispatch を拒否するため、指摘時点の主要な欠落は解消している。ただし単体のコピー用コマンド例には record-deploy がなく、以前の target_sha が残っているだけでも実行できる。現在の HEAD を record-deploy する共通例を単体発火より前に置く軽微な補完は推奨する。新たな予約機構の実装は不要。今回は検討のみなので完了扱いへの変更は行わない。 |
| RC-30 | 優先して修正 | github_actions_deploy_check.py は候補 run の databaseId、watcher は run ID・URL・成否を記録するが、成功判定用の headSha がない。台帳への record-run の検査だけでは watcher の成功報告は防げない。監視開始時の対象 SHA と各 run の headSha を保存・照合し、不一致・不明は成功扱いしない。同じ branch/workflow の別 SHA の成功を拾うケースを確認する。 |
| RC-31 | 優先して修正 | 自動修正は作業ツリーを編集するため通常 HEAD は変わらず、HEAD 変更時だけの再デプロイ指示では反映されない。標準フロー内で修正・記録更新→セルフレビューと必要チェック→git-commit-workflow→origin/PR 更新→同じ予約へ再デプロイを明示する。fixture は初期化しない。検討だけ・コミットだけなどの限定依頼では、この一括反映を勝手に実行しない。 |
| RC-32 | 標準運用前に修正 | git-reflect-after-commit は実装依頼の入口と説明される一方、コミット済み・未コミット差分なしが前提で、実装前の Issue 作成とブランチ作成が接続されていない。新たな委譲スキルを増やさず、AGENTS.md と既存入口の開始手順に既存 Issue の確認／必要時作成→Issue に対応する作業ブランチ→実装→コミット→既存 reflect を明記する。再開時の重複 Issue 作成を避け、複数 Issue が同じブランチに混ざる許容は維持する。 |
| RC-33 | 継続運用前に修正 | outbox の保存・取得に expires_at や削除がなく、OTP 記録が蓄積する。公開取得経路は廃止済みなので、第三者が現在取得できるという問題と混同しない。また outbox が残ることと実際の OTP 認証が有効であることは別問題。取得直後の削除は再試行・再開時の再取得を妨げるため、有効期限と期限切れ取得拒否、期限後の削除を組み合わせる方針を推奨する。期限は認証本体と整合させ、削除設定の有効化と既存記録の扱いまで確認する。追加権限・費用が発生する設定変更は人に残す。 |
| RC-35 | 低優先度で修正 | sandbox-pool.md の個人ホーム絶対パスは他端末では利用できない。<メインクローン>/.agents/state/sandbox-reservations.json とし、実パスは sandbox_reservation.py path で取得する説明へ置き換える。ホームパスを認証情報の漏洩と同じ重大度には扱わない。worktree ごとに別台帳を作らない正本のルールは維持する。 |

### 既存 RC の評価根拠

#### RC-13（既存指摘の再検討）

**識別子**: RC-13（GitHub id: 4177715886）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `documents/AIエージェント/02_pstack/01_pstack導入計画.md:152`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略）
+1. **成果物を信じる。** エージェントの「直しました」は判断の報告である。動いている画面、書き込まれた値、出力を、エージェントが実行し、人が見られる形で残す。ビルドやテストの成功は、動いた証拠の代わりにしない。
+2. **確かめ方を再実行できる形にする。** 一度きりの目視より、同じ操作をもう一度実行できる手順をリポジトリに残す。同じ指摘が2回出たら、会話ではなく lint、CI、Skill、フックのいずれかに移す。
+3. **記憶はコードベースに置く。** 会話は消える。Feature Map はアプリが変わっても CI が落ちないので、実物と照合して古さを検出する。壊れた挙動に合わせて Map を直すことはしない。
+4. **自動化は最後。** 直接検証できる、手順がある、判断が残っている、推奨の実装が1本に絞られている、悪い実装を機械が止める。この5つがそろった仕事だけ、時刻やイベントで回す。
+
+本のおわりにが提案する最初の1週間は、次の4ステップである。フェーズ1の TODO はこの4つに対応する。
+
+1. 失敗しても困らない、本物の小さな仕事を1つ選ぶ。練習用の課題にはしない。
+2. 完了条件を、実行して合否が出る文で書く。
+3. テスト通過の報告ではなく、エージェントにアプリを起動させ、変えた機能を動かし、証拠を出させる。止まったら、起動方法、操作手段、テスト用ユーザーのどれが欠けていたかを記録する。
+4. 同じ注意が2回出たら、文章ではなく仕組みに残す。
+
+---
+
+## 5. 今のリポジトリとの対応
+
+pstack は汎用の進め方である。Shokujii のドメイン規則は、すでに Skill と `AGENTS.md` にある。置き換えない。
+
+| 本が求めるもの | 今あるもの | この計画での扱い |
+|:---------------|:-----------|:-----------------|
+| 機械的な検証 | `lint-and-format`、`pr-verify.yml`（lint / format / 型 / vitest） | そのまま隣に置く。画面の証明にはしない |
+| レビューの記録 | `shokujii-code-review`、`review-comments-evaluate`、`documents/レビューコメント/` | コード変更の完了条件として残す |
+| 危険操作の停止 | `protect-git-release`、機密ファイルの保護 | pstack の自律より優先する |
+| 実装前の方針決定 | `grill-me` | 仕様が未確定の機能追加では、Playbook より先に使う |
+| 並列の作業ディレクトリ | `wt/tree-*` | 継続して使う。`tree/` ブランチへのコミットは禁止のまま |
+| PR の見守り | `wait-ai-pr-review`、`github-actions-deploy` | 標準フローから既存の見守りを起動する。Babysit の自動マージには接続しない |
+| 画面を操作する道具 | Playwright MCP | 検証スキルの操作手段の候補。[`documents/テスト方針・テスト項目書/playwright-mcp/`](../../テスト方針・テスト項目書/playwright-mcp/) の PhaseA/B 試行手順を棚卸しし、フェーズ1では対象機能向けに再利用・分割する。Feature Map は未作成 |
+| 仕事の種類から手順を選ぶ入口 | 無し。`AGENTS.md` の表から人が Skill を選ぶ | フェーズ2以降。全チャットの既定にはしない |
+| 判断の原則を必要なときだけ読む | 無し。`AGENTS.md` はセッション開始時にまとめて入る | プラグインの Principle に任せる。`AGENTS.md` は削らない |
+| 長時間作業の台帳 | 方針書の `STATE.md` は未作成 | 最初の L1 試行（CI 赤信号の報告のみ）の前に `documents/AIエージェント/loops/ci-triage/STATE.md` を作る。夜間 `/loop` はフェーズ5の条件がそろうまで始めない |
+
+---
+
+## 6. 既存ルールが優先される操作
+
+pstack の Principle「戻せる作業は人に確認せず進める」と、`/poteto-mode` の Autonomy は、このリポジトリの規則と同時に効く。衝突したときは次の表の「採用」を使う。フェーズ2で書くプロジェクト側の指示にも、この表をそのまま入れる。
+
+| 場面 | pstack 側の既定 | 採用 |
+|:-----|:----------------|:-----|
+| 製品の方針、文言の好み、仕様の未決 | 観察できることは実験し、好みは人に聞く | `grill-me` で人に聞く。決まったことだけを実装に渡す |
+| コミット | 作業の区切りでコミットしうる | 標準フローの実装依頼に含む。個別に聞き直さず `AGENTS.md` と既存のコミット手順に従う。計画・調査だけの依頼では実行しない |
+| PR の作成と push | Opening a PR が PR を開く | 標準フローの実装依頼に含む。`git-create-pull-request` / `git-reflect-after-commit` を使う。PRまで等の限定依頼を優先する |
+| マージ | Babysit は自分ではマージしない。Shipping は頼まれたときだけ | エージェントはマージしない |
+| 本番デプロイ、`firebase deploy`、`.env` / `.secret` | 戻せない操作の前で止まる | 既存のフックとスキルの禁止を優先する。sandboxは標準フローの依頼に含むが、事前に認めたプールから予約し、既存デプロイSkillで実行する。本番は含まない |
+| `development` / `main` / `production` への直 push、`npm version` | force-push とデプロイの前で止まる | 既存の禁止を優先する。本流は `main` ではなく `development` |
+| `tree/` ブランチ | worktree で作業する | 作業ブランチは `feat/` `fix/` など。`tree/` にはコミットも push もしない |
+| コミットメッセージ | Conventional Commits の例がある | 日本語。変更ディレクトリのタグ。一致する Issue があるときだけ番号を付ける |
+| Firestore | 境界で検証する、という一般原則 | DB 操作は store 経由。`xxxRef` は withConverter 付き。Zod は `common/src/schemas` と `common/src/apis` だけ |
+| Functions の export | 一般の手順には無い | `functions/default/src/index.ts` の export を同じ変更に含める |
+| 画面確認 | 検証スキルでエージェントが行う | 人がブラウザで見る確認が残っている間は、完了条件に「証拠が残ったか」を入れる。証拠が無い完了は認めない |
+
+プラグイン同梱の Playbook ファイルは編集しない。更新で消える。差し替えはリポジトリ側に書き、書き方は入れる時点の pstack 0.15.9 の第37章「自分の流儀に合わせる」と README を正本にする。
+
+---
+
+## 7. フェーズ
+
+```
+フェーズ0  ルールの優先と、対象画面を1つ決める
+フェーズ1  その画面の検証を1周させる（プラグインなしでよい）
+フェーズ2  pstack を入れ、その会話だけで /poteto-mode を使う
+フェーズ3  バグ修正用のプロジェクト手順を1枚足す
+フェーズ4  差分の影響と、直す前の失敗テストを足す
+フェーズ5  自動化を検討する（条件がそろうまで着手しない）
+```
+
+フェーズ2のプラグイン追加は、フェーズ1と並行して始めてよい。フェーズ2はフェーズ1の完了を置き換えない。検証の1周が無い状態で `/poteto-mode` を全チャットの既定にすると、アプリを操作する手段が無い Playbook は再現と確認を `skip` する。
+
+### フェーズ0: 対象を固定する
+
+人が決めるのは次の2つだけである。D-14で対象シナリオを決定し、以下の表に記録した。具体的なfixtureと操作対象は実装を調べて固定する。
+
+- 最初の画面。推奨は、一般ユーザーアプリのイベントページでメニューを見てカートへ進む流れのうち、1画面。D-14ではイベントからカートまでを1機能の検証として選んだ。理由は、参加者の画面で、CI の vitest がコンポーネントを見ていないから。別の画面にする場合も、決済の確定、本番データ、アカウント削除は選ばない。
+- その画面の完了条件を、操作と見える結果の文で1〜3個書く。
+
+| 項目 | 決定 |
+|:-----|:-----|
+| 画面 | userのイベントページでメニューを選び、カートに反映されるまで（D-14）。カート確認を同じ1機能の範囲に含む |
+| アプリ | user |
+| 完了条件 | ①ローカル・sandboxの両方で新しいブラウザから人の補助なしにテストユーザーとしてログインできる。②架空の注文受付中イベントで指定メニューを選びカートへ追加できる。③カートのメニューと数量が選択した内容に一致する。決済確定は含めない。fixtureの具体値は実装調査で固定する |
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  ローカル検証の完了条件を正本と揃える**

前回指摘後の新しい証拠として、最終版の検証スキルはローカルを「主経路の成功判定に使わない」と明記し、受け口などを自力で整備できない限り停止する手順へ変わっていますが、この完了条件は依然としてローカルと sandbox の両方での無人ログインを要求しています。チェックリストではフェーズ1を完了扱いにしているため、このままではローカル未検証のまま条件達成と誤判定されます。ローカルを完了条件から外すか、再現可能なローカル認証手順と証拠を用意して正本間を同期してください。

AGENTS.md reference: [AGENTS.md:L53-L55](https://github.com/nijuniinc/bokudeli-event-new/blob/e97ee241b35be1802e84edd005588a5cedec682a/AGENTS.md#L53-L55)

Useful? React with 👍 / 👎.

**コメント要約**: D-05/D-14 の文書同期に加え、予約sandbox2603接続のローカルUIで新規隔離ブラウザのメールログイン→イベント→カートを実証。数量0→1、800円を確認。最新SHAのsandbox再デプロイ後確認は引渡し時に別途確認する。
D-05/D-14 と検証スキルが矛盾
任意扱いを廃止し全体未完了へ修正
ローカル接続先整備と実機証明は未実施

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: D-05/D-14 の文書同期に加え、予約sandbox2603接続のローカルUIで新規隔離ブラウザのメールログイン→イベント→カートを実証。数量0→1、800円を確認。最新SHAのsandbox再デプロイ後確認は引渡し時に別途確認する。

---

#### RC-28（既存指摘の再検討）

**識別子**: RC-28（GitHub id: 4178019087）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `.agents/skills/github-actions-deploy/SKILL.md:148`

**該当コード（レビュー時点の diff）**:

```diff
@@ -126,6 +127,40 @@ python3 .agents/scripts/github_actions_deploy_wake.py list \
 - `OWNER/REPO` が `nijuniinc/bokudeli-event-new` なら **中止**
 - 1a / 1b で REMOTE を使う場合、`git remote get-url "$REMOTE"` が本番 URL なら **中止**
 
+### 2.5 予約（push 前・必須）
+
+台帳の正本はメインクローンの JSON。worktree からはスクリプトが `git-common-dir` で解決する。`branch.<branch>.sandboxRemote` は記憶であり、予約の証明にしない。
+
+```bash
+python3 .agents/scripts/sandbox_reservation.py path
+```
+
+1. 人が「この sandbox を別ブランチで使う」と明示したときだけ `switch`。リモート名を書いただけでは奪わない
+2. それ以外は `pick`（内部で `reconcile`）。同じブランチなら既存予約。selectable かつ空きが無ければ **中止**
+3. 予約成功後、必要なら `git config branch."$BRANCH".sandboxRemote` に remote を記憶する
+4. `new_assignment` が true のときだけ fixture を戻す（手順 2.6）
+5. push の直前に `check`。失敗したら **push しない**
+
+```bash
+python3 .agents/scripts/sandbox_reservation.py pick \
+  --branch "$BRANCH" --issue "$ISSUE" --pr "$PR" --owner "$OWNER_LABEL"
+python3 .agents/scripts/sandbox_reservation.py check \
+  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION"
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  明示された sandbox と同じ環境を予約する**

`sandbox2510/feat/...` のように 1a で `REMOTE` が明示されても、ここでは環境指定のない `pick` を実行するため、台帳が sandbox2603 を予約・seed したまま sandbox2510 へ push / dispatch できます。これでは sandbox2510 の既存予約を検査せず上書きし、逆に予約した sandbox2603 のデータだけ初期化するため、明示先に対応する環境を `reserve` / `check` するか、`pick` の結果で `REMOTE` を必ず上書きしてください。

AGENTS.md reference: [AGENTS.md:L57-L57](https://github.com/nijuniinc/bokudeli-event-new/blob/5036a425232252572e1d97a1c552741cc6f2f6fa/AGENTS.md#L57-L57)

Useful? React with 👍 / 👎.

**コメント要約**: 明示・記憶済み先は台帳の同一環境をreserveし、予約結果から宛先を決定。runが異なるrepo/ref・remote・projectの副作用を拒否する。
reserve するか pick 結果で REMOTE を上書きするかが併記

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 明示・記憶済み先は台帳の同一環境をreserveし、予約結果から宛先を決定。runが異なるrepo/ref・remote・projectの副作用を拒否する。

---

#### RC-29（既存指摘の再検討）

**識別子**: RC-29（GitHub id: 4178019093）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `.agents/skills/github-actions-deploy/SKILL.md:228`

**該当コード（レビュー時点の diff）**:

```diff
@@ -181,9 +218,14 @@ gh workflow run deploy_user.yml --repo OWNER/REPO --ref REF -f environment=devel
 
 **6 本一括発火する場合（デフォルト・発火のみ・監視は手順 7）**
 
-一括発火の直前に **基準時刻 `SINCE` を 1 回だけ**控える。
+一括発火の直前に **基準時刻 `SINCE` を 1 回だけ**控え、手順 2.5 の `check` を繰り返す。失敗したら発火しない。対象 SHA を台帳に残す。
 
 ```bash
+python3 .agents/scripts/sandbox_reservation.py check \
+  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION"
+python3 .agents/scripts/sandbox_reservation.py record-deploy \
+  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" \
+  --sha "$(git rev-parse HEAD)"
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  単一 workflow の発火前にも予約と SHA を記録する**

`user だけ`など 1 本だけを発火する経路では、直前の `check` と `record-deploy` がこの「6 本一括」節にしかないため、push 後に予約が切り替わっても stale な dispatch が実行され、台帳の `target_sha` も更新されません。単一 workflow の経路にも同じ直前検査と SHA 記録を共通手順として適用しないと、後段で PR HEAD とデプロイ SHA の一致を確認できません。

AGENTS.md reference: [AGENTS.md:L57-L57](https://github.com/nijuniinc/bokudeli-event-new/blob/5036a425232252572e1d97a1c552741cc6f2f6fa/AGENTS.md#L57-L57)

Useful? React with 👍 / 👎.

**コメント要約**: 単体発火の例にも現在HEADのrecord-deployとSINCE記録を追加。ロック内の予約検査は既存runを利用する。
6本一括と同じ直前検査を共通化する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 単体発火の例にも現在HEADのrecord-deployとSINCE記録を追加。ロック内の予約検査は既存runを利用する。

---

#### RC-30（既存指摘の再検討）

**識別子**: RC-30（GitHub id: 4178019097）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `.agents/skills/github-actions-deploy/SKILL.md:337`

**該当コード（レビュー時点の diff）**:

```diff
@@ -269,14 +311,30 @@ AGENT_LOOP_WAKE_deploy {"prompt":"/github-actions-deploy","mode":"report","deplo
 
 | 分類 | ログの手がかり | 典型的な原因 | 推奨アクション（提案のみ） |
 |------|----------------|--------------|----------------------------|
-| 一時的エラー | `HTTP Error: 503` / `500` / `429`、`service is currently unavailable` | Firebase / Google API 側の一時障害 | 再実行を提案 |
+| 一時的エラー | `HTTP Error: 503` / `500` / `429`、`service is currently unavailable` | Firebase / Google API 側の一時障害 | 同じ SHA・同じ予約で失敗工程だけ再発火（最大 2 回） |
 | Rules コンパイルエラー | `compilation errors`、`firestore.rules` / `storage.rules` | ルールの構文・参照ミス | 該当ルールの修正が必要 |
 | インデックス | `firestore.indexes.json` 関連の Error | indexes 定義の不整合 | indexes 定義の見直し |
 | 権限・認証 | `403`、`PERMISSION_DENIED`、`GOOGLE_APPLICATION_CREDENTIALS`、IAM 系 | サービスアカウント権限・Secrets 設定 | リポの Secrets / IAM 設定確認 |
 | API 未有効化 | `has not been used in project`、`API ... is disabled` | 必要 API が無効 | GCP で該当 API を有効化 |
 | ビルド失敗 | `tsc`、`npm run build`、Functions のビルドエラー、`npm -w enterprise run build` | アプリ側のビルド不良 | ソース修正（このスキルでは修正しない） |
 
-- **重要**: 解析までで止める。修正や自動再実行は行わない
+- **重要**: ビルド失敗・権限不足・Rules / indexes は解析して止める。**一時的エラーだけ**次の再試行を行う
+
+**一時障害の再試行（D-11）**
+
+1. 分類が一時的エラーである
+2. 同じ SHA・同じ予約。`check` が成功する
+3. 旧 run の終了を確認する
+4. 失敗した workflow だけ再発火する。成功済みは繰り返さない
+5. 追加は最大 2 回（初回を含め最大 3 回）。回数を台帳に残す
+
+```bash
+python3 .agents/scripts/sandbox_reservation.py record-retry \
+  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" \
+  --workflow "$WF" --count "$RETRY_COUNT"
+```
+
+上限に達したら未完了として報告する。予約は解放しない。報告時の成功は、台帳の `target_sha` と一致する run だけにする。古い SHA の成功を最新版の成功にしない。
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  watcher の結果に実行 SHA を保存する**

ここで `target_sha` と一致する run だけを成功扱いするよう要求していますが、確認した `.agents/scripts/github_actions_deploy_watch.sh:161-213` は run ID・URL・成否しか保存せず、`github_actions_deploy_check.py` も `headSha` を取得しません。同じ ref / workflow が基準時刻後に複数回起動すると最新 run を拾っても SHA を比較できず、別コミットの成功を今回の成功として報告し得るため、run の `headSha` を results に含めて機械的に照合してください。

AGENTS.md reference: [AGENTS.md:L57-L57](https://github.com/nijuniinc/bokudeli-event-new/blob/5036a425232252572e1d97a1c552741cc6f2f6fa/AGENTS.md#L57-L57)

Useful? React with 👍 / 👎.

**コメント要約**: target_shaをwatcher必須入力にし、run選択と終了後メタデータをSHA照合。結果にheadSha/status/conclusionを保存し、不一致・取得不能を成功にしない。
別コミットの成功を今回の成功と報告しうる

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: target_shaをwatcher必須入力にし、run選択と終了後メタデータをSHA照合。結果にheadSha/status/conclusionを保存し、不一致・取得不能を成功にしない。

---

#### RC-31（既存指摘の再検討）

**識別子**: RC-31（GitHub id: 4178019100）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `.agents/skills/review-comments-evaluate/SKILL.md:254`

**該当コード（レビュー時点の diff）**:

```diff
@@ -251,6 +251,7 @@ PR でレビュー依頼した Copilot、Codex、kokufu によるレビューを
 4. 修正した RC の **ステータス** を **✅ 対応済み**、**対応**列を **`[x]`** に更新する（手順 4 記録時に反映。**評価**は変更しない）
 5. 未対応の自動修正対象 RC が残る場合、手順 4a を**最大 2 周**繰り返す（同一 evaluate セッション内・🚨 と 🟡 合算）
 6. 2 周後も自動修正できない RC（対象外含む）が残る場合は一覧を完了報告に含める
+7. **標準フロー**: 修正で HEAD が変わったら、同じ予約のまま [`github-actions-deploy`](../github-actions-deploy/SKILL.md) を再実行する。fixture は戻さない。必須修正が残るときは完了にしない
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  自動修正をコミットしてから再デプロイする**

手順 4a の自動修正はファイル編集と lint まででコミット処理を行わないため、通常は HEAD が変わらず、この条件は成立しません。仮に作業ツリーの変更を検知して直接 `github-actions-deploy` へ進んでも、同スキルの手順 0 は未コミット変更があると中断するので、RC を対応済みにした修正が PR と sandbox のどちらにも反映されません。標準フローでは自動修正後にコミット、origin 更新、PR 更新を行ってから同じ予約へ再デプロイする手順を明示してください。

AGENTS.md reference: [AGENTS.md:L57-L57](https://github.com/nijuniinc/bokudeli-event-new/blob/5036a425232252572e1d97a1c552741cc6f2f6fa/AGENTS.md#L57-L57)

Useful? React with 👍 / 👎.

**コメント要約**: 自動修正の作業ツリー差分からコミット→origin/PR更新→同じ予約で再デプロイまで明記。限定依頼と最大2周・fixture保持を維持。
未コミットのまま deploy すると中断する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 自動修正の作業ツリー差分からコミット→origin/PR更新→同じ予約で再デプロイまで明記。限定依頼と最大2周・fixture保持を維持。

---

#### RC-32（既存指摘の再検討）

**識別子**: RC-32（GitHub id: 4178019105）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `.agents/skills/git-reflect-after-commit/SKILL.md:12`

**該当コード（レビュー時点の diff）**:

```diff
@@ -9,6 +9,8 @@ description: コミット完了後の次ステップ。origin へ push して PR
 コミット作成自体（新規/分割/fixup/squash）はこのスキルの範囲外で、完了済みを前提とする。
 それぞれの詳細手順は委譲先スキルに従い、本スキルはルールを上書きしない。
 
+標準フローの実装依頼の入口でもある（新しい委譲スキルは作らない）。A（PR）と B（予約してデプロイ）を同じターンで始め、レビュー待ちをデプロイの前条件にしない。修正で HEAD が変わったら同じ予約で再デプロイし、PR HEAD とデプロイ SHA を揃える。予約正本はメインクローンの `.agents/state/sandbox-reservations.json`（[sandbox-pool.md](../../../documents/AIエージェント/02_pstack/records/sandbox-pool.md)）。候補は selectable な環境だけ（現状 sandbox2603）。2606〜2608 へはデータ構築の別 PR まで push しない。
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  標準フローで Issue 作成をコミット前に実行する**

このスキルを標準フローの入口としていますが、手順 1 はコミット済みを前提とし、以降も PR と sandbox の処理しかなく、`git-create-issue` への委譲がありません。さらに呼び出し元の `git-commit-workflow` は作業ツリーが clean になった後で初めて本スキルへ進むため、一致する Issue がない実装依頼では Issue 番号の検索・作成、Issue 番号に基づく作業ブランチ、番号付きコミットを行わないまま PR まで進みます。標準フローの入口を実装前へ置くか、Issue 検索・作成と作業ブランチ作成をコミット前の明示手順として接続してください。

AGENTS.md reference: [AGENTS.md:L57-L57](https://github.com/nijuniinc/bokudeli-event-new/blob/5036a425232252572e1d97a1c552741cc6f2f6fa/AGENTS.md#L57-L57)

Useful? React with 👍 / 👎.

**コメント要約**: 既存入口とAGENTS.mdに実装開始前のIssue再利用／起票→作業ブランチ→実装→コミットを接続。新規オーケストレーターは追加しない。
入口を実装前に置くか手順を足すかは未決

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: M

**判断理由**: 既存入口とAGENTS.mdに実装開始前のIssue再利用／起票→作業ブランチ→実装→コミットを接続。新規オーケストレーターは追加しない。

---

#### RC-33（既存指摘の再検討）

**識別子**: RC-33（GitHub id: 4178019108）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/stores/verificationTestOutbox.ts:56`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,74 @@
+import {
+  FirestoreDataConverter,
+  getFirestore,
+  QueryDocumentSnapshot,
+  Timestamp,
+  type DocumentData,
+} from 'firebase-admin/firestore'
+
+export type VerificationTestOutboxRecord = {
+  id: string
+  email: string
+  pass_code: string
+  kind: 'user_pass_code'
+  verification_run_id: string | null
+  created_at: Timestamp
+}
+
+const converter: FirestoreDataConverter<VerificationTestOutboxRecord> = {
+  toFirestore(record: VerificationTestOutboxRecord): DocumentData {
+    return {
+      email: record.email,
+      pass_code: record.pass_code,
+      kind: record.kind,
+      verification_run_id: record.verification_run_id,
+      created_at: record.created_at,
+    }
+  },
+  fromFirestore(snapshot: QueryDocumentSnapshot): VerificationTestOutboxRecord {
+    const data = snapshot.data()
+    return {
+      id: snapshot.id,
+      email: typeof data.email === 'string' ? data.email : '',
+      pass_code: typeof data.pass_code === 'string' ? data.pass_code : '',
+      kind: 'user_pass_code',
+      verification_run_id: typeof data.verification_run_id === 'string' ? data.verification_run_id : null,
+      created_at: data.created_at instanceof Timestamp ? data.created_at : Timestamp.now(),
+    }
+  },
+}
+
+const collection = () => getFirestore().collection('verification_test_outbox').withConverter(converter)
+
+export const saveVerificationTestOutboxRecord = async (input: {
+  email: string
+  pass_code: string
+  verification_run_id: string | null
+}): Promise<void> => {
+  const ref = collection().doc()
+  await ref.set({
+    id: ref.id,
+    email: input.email,
+    pass_code: input.pass_code,
+    kind: 'user_pass_code',
+    verification_run_id: input.verification_run_id,
+    created_at: Timestamp.now(),
+  })
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  OTP outbox レコードに有効期限を設定する**

`record_skip_send` でログインを試すたびに自動 ID の新規ドキュメントを保存しますが、取得後の削除処理も TTL 用フィールドもなく、リポジトリ内にこのコレクションを掃除する経路がありません。継続的な sandbox 検証で平文 OTP と複合インデックスが無期限に蓄積するため、`expires_at` を保存して Firestore TTL を設定するか、コードが不要になった時点で確実に削除してください。

Useful? React with 👍 / 👎.

**コメント要約**: 認証本体の24時間定数を共有しexpires_atを保存、期限切れ取得を拒否。新規OTP発行時に古い100件までをstore経由で削除。旧記録はcreated_atから期限を導出。TTL設定・追加IAM・費用変更なし。発行がない期間の物理削除は次回まで保留。
expires_at か取得後削除かは未決

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 認証本体の24時間定数を共有しexpires_atを保存、期限切れ取得を拒否。新規OTP発行時に古い100件までをstore経由で削除。旧記録はcreated_atから期限を導出。TTL設定・追加IAM・費用変更なし。発行がない期間の物理削除は次回まで保留。

---

#### RC-35（既存指摘の再検討）

**識別子**: RC-35（GitHub id: 5980936304）

**レビュワー**: 既存 GitHub コメント（id: 5980936304）

**指摘箇所**: PR トップレベル（`documents/AIエージェント/02_pstack/records/sandbox-pool.md:3-5`）

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ / S] `documents/AIエージェント/02_pstack/records/sandbox-pool.md:3-5`: 台帳の説明に特定端末のユーザーホームを含む絶対パスが記載されており、他の環境では再利用できず、個人を識別する情報も含みます。リポジトリ相対の説明またはプレースホルダーに置き換えてください。

**コメント要約**: 個人ホーム絶対パスを<メインクローン>の説明とsandbox_reservation.py pathへ置換。
プレースホルダーへ置き換える

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 個人ホーム絶対パスを<メインクローン>の説明とsandbox_reservation.py pathへ置換。

---

---

## 修正結果（2026-10-05 13:52 JST）

- RC-13: ✅ 対応済み。D-05/D-14 の文書同期に加え、予約sandbox2603接続のローカルUIで新規隔離ブラウザのメールログイン→イベント→カートを実証。数量0→1、800円を確認。最新SHAのsandbox再デプロイ後確認は引渡し時に別途確認する。
- RC-28: ✅ 対応済み。明示・記憶済み先は台帳の同一環境をreserveし、予約結果から宛先を決定。runが異なるrepo/ref・remote・projectの副作用を拒否する。
- RC-29: ✅ 対応済み。単体発火の例にも現在HEADのrecord-deployとSINCE記録を追加。ロック内の予約検査は既存runを利用する。
- RC-30: ✅ 対応済み。target_shaをwatcher必須入力にし、run選択と終了後メタデータをSHA照合。結果にheadSha/status/conclusionを保存し、不一致・取得不能を成功にしない。
- RC-31: ✅ 対応済み。自動修正の作業ツリー差分からコミット→origin/PR更新→同じ予約で再デプロイまで明記。限定依頼と最大2周・fixture保持を維持。
- RC-32: ✅ 対応済み。既存入口とAGENTS.mdに実装開始前のIssue再利用／起票→作業ブランチ→実装→コミットを接続。新規オーケストレーターは追加しない。
- RC-33: ✅ 対応済み。認証本体の24時間定数を共有しexpires_atを保存、期限切れ取得を拒否。新規OTP発行時に古い100件までをstore経由で削除。旧記録はcreated_atから期限を導出。TTL設定・追加IAM・費用変更なし。発行がない期間の物理削除は次回まで保留。
- RC-35: ✅ 対応済み。個人ホーム絶対パスを<メインクローン>の説明とsandbox_reservation.py pathへ置換。

検証: PR verify相当の全ステップ成功。予約ユニット15件、監視回帰3件、既存watchテスト8件成功。OTPスキーマ9件、outbox store4件、受け口境界8件成功（全体Vitestでも通過）。Firestore Emulatorで未認証outbox read/write拒否の対象テスト1件成功。セルフレビューは今回の差分を確認。既存のRC-24/26/27/34の未コミット修正も同じIssueの差分として検証済み。

ローカル画面証拠: [カートのPlaywright MCPスナップショット](../AIエージェント/02_pstack/records/evidence/2026-10-05-local-cart.md)。本時点はコミット前（4046f41d5 + 今回差分）・接続先Functionsは既存sandboxの版。最新PR HEADのデプロイ成否・画面確認・公開OTP関数削除は後続の引渡しで確認し、未確認のままフェーズ1全体を完了としない。

---

## 評価セッション（2026-10-05 13:57・shokujii-code-review）

- **評価日時**: 2026-10-05 13:57 JST
- **ブランチ名**: doc/2398-pstack
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2399
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 0
- **重複除外**: なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-36 | なし | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | run ID省略で発行した OTP は取得 CLI から取得できない<br>`request-test-login.mjs` が `--run-id` を任意としている<br>この実行経路ではOTPを取り出せずログイン検証が止まる<br>run IDを必須にし、不足時は明示エラーで拒否する |

#### RC-36

**識別子**: RC-36（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `scripts/pstack/request-test-login.mjs:8-9`

**該当コード（レビュー時点の diff）**:

```diff
+const emailIdx = args.indexOf('--email')
+const runIdx = args.indexOf('--run-id')
+const email = emailIdx >= 0 ? args[emailIdx + 1] : undefined
+const runId = runIdx >= 0 ? args[runIdx + 1] : undefined
+
+if (email == null) {
+  console.error('usage: --email <addr> [--run-id <id>]')
+  process.exit(1)
+}
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `--run-id` を省略可能にしていますが、`fetch-test-pass-code.mjs` は必須としており、run ID なしで発行した sandbox OTP は取得できません。`request-test-login.mjs` の usage も省略を案内するため、記載どおりの実行では OTP 取得ができず検証が止まります。`--run-id` を必須化して入力不足時に終了するか、両 CLI を同じ run ID 規約に合わせてください。

**コメント要約**: run ID省略で発行した OTP は取得 CLI から取得できない。`request-test-login.mjs` が `--run-id` を任意としており、この実行経路ではOTPを取り出せずログイン検証が止まる。run IDを必須にし、不足時は明示エラーで拒否する。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: OTP発行側はrun IDを任意としている一方、取得CLIはrun IDを必須としているため、記載された任意引数の使い方では発行済みOTPを取得できず、pstackのログイン検証が完了できない。既存のrun ID必須方針に合わせ、発行前に入力不足を拒否するのが最小の修正となる。

---
