import { z } from 'zod'

/** メニュー説明文の最大文字数 */
export const MENU_DESCRIPTION_MAX_LENGTH = 300

/** Firestore 保存用のメニュー説明文 */
export const MenuDescriptionDbFieldSchema = z.string().trim().min(1).max(MENU_DESCRIPTION_MAX_LENGTH)

/** アプリ内で扱うメニュー説明文 */
export const MenuDescriptionAppFieldSchema = z.string().trim().max(MENU_DESCRIPTION_MAX_LENGTH).default('')
