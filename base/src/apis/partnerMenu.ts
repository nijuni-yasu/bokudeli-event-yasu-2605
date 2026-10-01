import { functions } from '@shokujii/base/firebase'
import { httpsCallable, type HttpsCallableResult } from 'firebase/functions'
import type {
  SavePartnerMenuRequest,
  SavePartnerOptionRequest,
  DeletePartnerOptionRequest,
  DeletePartnerMenuRequest,
  SortPartnerMenusRequest,
} from '@shokujii/common/apis/partnerMenu.js'

export const savePartnerMenu = (input: SavePartnerMenuRequest): Promise<HttpsCallableResult<void>> =>
  httpsCallable<SavePartnerMenuRequest, void>(functions, 'savePartnerMenu')(input)
export const savePartnerOption = (input: SavePartnerOptionRequest): Promise<HttpsCallableResult<void>> =>
  httpsCallable<SavePartnerOptionRequest, void>(functions, 'savePartnerOption')(input)
export const deletePartnerOption = (input: DeletePartnerOptionRequest): Promise<HttpsCallableResult<void>> =>
  httpsCallable<DeletePartnerOptionRequest, void>(functions, 'deletePartnerOption')(input)
export const deletePartnerMenu = (input: DeletePartnerMenuRequest): Promise<HttpsCallableResult<void>> =>
  httpsCallable<DeletePartnerMenuRequest, void>(functions, 'deletePartnerMenu')(input)
export const sortPartnerMenus = (input: SortPartnerMenusRequest): Promise<HttpsCallableResult<void>> =>
  httpsCallable<SortPartnerMenusRequest, void>(functions, 'sortPartnerMenus')(input)
