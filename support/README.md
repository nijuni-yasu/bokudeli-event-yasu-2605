# support

Shokujii の運営（サポーター）向け管理画面です。

レガシー `manager`（Vue 2 / Vue CLI）の置き換えとして、`partner` と同じ現行標準スタックで実装しています。

- 仕様: [documents/09\_運営向け機能/03_managerパッケージの再実装.md](../documents/09_運営向け機能/03_managerパッケージの再実装.md)
- 移行の背景: [documents/07\_リファクタリング/24_managerパッケージの移行.md](../documents/07_リファクタリング/24_managerパッケージの移行.md)

ログインできるのは `configs/global` の `support_user_ids` に登録された UID のアカウントのみです。

開発に関しては [user](../user/README.md) を参照してください。
