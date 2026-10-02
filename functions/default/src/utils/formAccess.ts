import { HttpsError } from 'firebase-functions/https'
import type { Transaction } from 'firebase-admin/firestore'
import { isEventFormEditableStatus, omitHiddenFormFields } from '@shokujii/common/schemas/formFields.js'
import type { CommunityForm } from '@shokujii/common/schemas/CommunityForm.js'
import type { EventFormConfig } from '@shokujii/common/schemas/EventFormConfig.js'
import type { FormField } from '@shokujii/common/schemas/formFields.js'
import type { CommunityFormDetail, EventFormConfigDto } from '@shokujii/common/apis/form.js'
import { getCommunity } from '../stores/community.js'
import { getConfigGlobal } from '../stores/config.js'
import { getEventInCommunity } from '../stores/event.js'
import { getCommunityForm, getEventFormConfig } from '../stores/form.js'
import { getEventEnterpriseId } from './enterpriseSubsidyOrders.js'
import type { ShokujiiEvent } from '../stores/event.js'
import type { ShokujiiCommunity } from '../stores/community.js'

export function parseOrThrow<T>(schema: { parse: (value: unknown) => T }, data: unknown): T {
  try {
    return schema.parse(data)
  } catch {
    throw new HttpsError('invalid-argument', '必須パラメータが不足しています')
  }
}

export async function requireAuthUid(uid: string | undefined): Promise<string> {
  if (uid == null) {
    throw new HttpsError('unauthenticated', '認証が必要です')
  }
  return uid
}

export async function requireCommunityManager(communityId: string, uid: string): Promise<ShokujiiCommunity> {
  const community = await getCommunity(communityId)
  if (community == null) {
    throw new HttpsError('not-found', 'コミュニティが見つかりません')
  }
  const config = await getConfigGlobal()
  const isSupport = config?.isSupport(uid) ?? false
  const isManager = await community.hasRole(uid, 'manager')
  if (!isSupport && !isManager) {
    throw new HttpsError('permission-denied', 'コミュニティ管理者のみ操作できます')
  }
  return community
}

export function assertPfEvent(event: ShokujiiEvent): void {
  if (getEventEnterpriseId(event) != null) {
    throw new HttpsError('failed-precondition', 'エンタープライズのイベントではフォームを利用できません')
  }
}

export async function requirePfEventForForm(communityId: string, eventId: string): Promise<ShokujiiEvent> {
  const event = await getEventInCommunity(communityId, eventId)
  if (event == null) {
    throw new HttpsError('not-found', 'イベントが見つかりません')
  }
  assertPfEvent(event)
  return event
}

export function assertEventFormEditable(event: ShokujiiEvent): void {
  if (event.event_status.value === 'event_canceled') {
    throw new HttpsError('failed-precondition', '中止したイベントのフォームは変更できません')
  }
  if (!isEventFormEditableStatus(event.event_status.value)) {
    throw new HttpsError('failed-precondition', 'この状態のイベントではフォームを変更できません')
  }
}

export function toCommunityFormDetail(form: CommunityForm): CommunityFormDetail {
  const fields = omitHiddenFormFields(form.fields)
  return {
    form_id: form.id,
    name: form.name,
    description: form.description,
    purpose: form.purpose,
    archived: form.archived,
    field_count: fields.length,
    fields,
    created_at: form.created_at,
    updated_at: form.updated_at,
  }
}

export function toEventFormConfigDto(config: EventFormConfig): EventFormConfigDto {
  return {
    source_form_id: config.source_form_id,
    updated_at: config.updated_at,
  }
}

export function visibleFieldsForNewAnswers(fields: FormField[]): FormField[] {
  return omitHiddenFormFields(fields)
}

export type EventFormReference = {
  config: EventFormConfig
  form: CommunityForm
}

export async function loadEventFormReferenceIfPf(
  event: ShokujiiEvent,
  transaction?: Transaction,
): Promise<EventFormReference | undefined> {
  if (getEventEnterpriseId(event) != null) {
    return undefined
  }
  const config = await getEventFormConfig(event.community_id, event.id, transaction)
  if (config == null) {
    return undefined
  }
  const form = await getCommunityForm(event.community_id, config.source_form_id, transaction)
  if (form == null) {
    return undefined
  }
  return { config, form }
}
