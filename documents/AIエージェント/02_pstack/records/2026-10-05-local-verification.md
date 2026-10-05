# ローカルUIのイベント→カート検証

- 実行日時: 2026-10-05 13:46〜13:52 JST
- クライアント: Codex。既存 `.mcp.json` の Playwright MCP を stdio 起動（1.64.0-alpha-1790635538000、isolated/headless）。人のブラウザ・既存セッションは再利用していない。
- ローカル起動: `npm -w user run dev -- -m sandbox2603`、ログに出た URL は `http://localhost:5173/`。
- 接続先: env の `VITE_PROJECT_ID=bokudeli-event-yasu-2603`、Auth domainも同プロジェクト。Auth/Firestore/Functionsエミュレーター設定なし。Firebaseネットワークでも同sandboxを確認。
- ローカルソース: `4046f41d5` + 今回の未コミット修正。Functionsはこの時点の既存sandbox。最新版のデプロイ成功証拠としては扱わない。
- run ID: `pstack-local-20261005-1350`。

## C1〜C3

1. 新しい隔離ブラウザで `/login?verification_run_id=...` を開き、架空メール `pstack.participant@verify.shokujii.test` を入力してメールログインした。
2. `/pass-code` へ遷移。公開Callableではなく既存ADCとコンパイル済みstoreを使うCLIで受け口を読み、OTPを画面へ入力した。OTP・認証トークンは記録しない。
3. イベントURL `/c/pstack-verify/e/pstack-event-cart-001` がログイン要求へ戻らず表示された。C1成功。
4. 追加前の `/cart` は「カートに商品はありません。」で数量0だった。fixtureは初期化していない。
5. イベントで「注文して参加する」→個数1のダイアログ→「カートに追加」を操作した。`/cart`へ遷移。C2成功。
6. カートの行が `pstack検証弁当 / 1 / ¥800` となり、数量差+1を確認。C3成功。「お支払いに進む」は操作していない。

証拠: [カートのスナップショット](evidence/2026-10-05-local-cart.md)。初回Viteの依存最適化後の再読込を待って操作した。Channel.ioの401は出たが、ログインとカート追加は成功した。

最終PR HEADとsandboxのSHA一致・修正後Functionsの実機確認は別途必須。既存カート1個は確認用に保持する。
