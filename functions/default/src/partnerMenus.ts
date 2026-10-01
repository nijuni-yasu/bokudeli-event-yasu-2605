import { onCall } from 'firebase-functions/https'
import {
  savePartnerMenuHandler,
  savePartnerOptionHandler,
  deletePartnerOptionHandler,
  deletePartnerMenuHandler,
  sortPartnerMenusHandler,
} from './utils/partnerMenuOperations.js'

export const savePartnerMenu = onCall(savePartnerMenuHandler)
export const savePartnerOption = onCall(savePartnerOptionHandler)
export const deletePartnerOption = onCall(deletePartnerOptionHandler)
export const deletePartnerMenu = onCall(deletePartnerMenuHandler)
export const sortPartnerMenus = onCall(sortPartnerMenusHandler)
