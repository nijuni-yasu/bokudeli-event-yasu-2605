/** カート内に店舗メニューがあるときに「食事は持参」を追加できない（addToCart failed-precondition） */
export const NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_IN_CART_MESSAGE =
  'カートに店舗メニューが入っているため、「食事は持参」は追加できません。カートから店舗メニューを削除してから、もう一度「カートに追加」してください。'

/** 店舗メニューが確定済みのときに「食事は持参」を追加できない（addToCart failed-precondition） */
export const NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_ORDERED_MESSAGE =
  '店舗メニューの注文が確定しているため、「食事は持参」は追加できません。注文をキャンセルしてから、もう一度「カートに追加」してください。'

/** 店舗メニューが決済処理中のときに「食事は持参」を追加できない（addToCart failed-precondition） */
export const NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_PROCESSING_MESSAGE =
  '店舗メニューの決済処理中のため、「食事は持参」は追加できません。決済の完了または中止後、もう一度「カートに追加」してください。'
