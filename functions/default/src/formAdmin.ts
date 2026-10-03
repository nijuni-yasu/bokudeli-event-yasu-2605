import { getFirestore, type Transaction } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/https'
import { CommunityForm } from '@shokujii/common/schemas/CommunityForm.js'
import { EventFormConfig } from '@shokujii/common/schemas/EventFormConfig.js'
import { cloneFormFields, FORM_FIELD_LIMITS, omitHiddenFormFields } from '@shokujii/common/schemas/formFields.js'
import {
  ArchiveCommunityFormRequestSchema,
  ClearEventFormConfigRequestSchema,
  CreateCommunityFormRequestSchema,
  DuplicateCommunityFormRequestSchema,
  GetCommunityFormRequestSchema,
  GetEventFormConfigRequestSchema,
  GetEventFormPresenceRequestSchema,
  GetEventFormResponseRequestSchema,
  ListCommunityFormsRequestSchema,
  ListEventFormResponsesRequestSchema,
  SetEventFormFromCommunityRequestSchema,
  UpdateCommunityFormRequestSchema,
  type ArchiveCommunityFormResponse,
  type ClearEventFormConfigResponse,
  type CreateCommunityFormResponse,
  type DuplicateCommunityFormResponse,
  type EventFormResponseListItem,
  type GetCommunityFormResponse,
  type GetEventFormConfigResponse,
  type GetEventFormPresenceResponse,
  type GetEventFormResponseResponse,
  type ListCommunityFormsResponse,
  type ListEventFormResponsesResponse,
  type SetEventFormFromCommunityResponse,
  type UpdateCommunityFormResponse,
} from '@shokujii/common/apis/form.js'
import { formatFormAnswerDisplay } from '@shokujii/common/utils/validateFormAnswers.js'
import { nextCommunityFormDefinitionVersion } from '@shokujii/common/utils/communityFormDefinition.js'
import { normalizeFormFields } from '@shokujii/common/utils/normalizeFormFields.js'
import { createModuleLogger } from './utils/logger.js'
import {
  assertEventFormEditable,
  assertPfEvent,
  parseOrThrow,
  requireAuthUid,
  requireCommunityManager,
  requirePfEventForForm,
  toCommunityFormDetail,
  toEventFormConfigDto,
} from './utils/formAccess.js'
import { getEventEnterpriseId } from './utils/enterpriseSubsidyOrders.js'
import { getEventInCommunity } from './stores/event.js'
import { getOrders } from './stores/memberOrder.js'
import { getUsersByUserIds } from './stores/user.js'
import {
  createCommunityForm as createCommunityFormDoc,
  deleteEventFormConfig,
  getCommunityForm,
  getEventFormConfig,
  getFormResponse,
  listCommunityForms,
  listFormResponses,
  saveCommunityForm,
  saveEventFormConfig,
} from './stores/form.js'

const logger = createModuleLogger('formAdmin')
const DUPLICATE_FORM_NAME_SUFFIX = ' のコピー'

function duplicateFormName(name: string): string {
  if (name.length + DUPLICATE_FORM_NAME_SUFFIX.length <= FORM_FIELD_LIMITS.maxName) {
    return `${name}${DUPLICATE_FORM_NAME_SUFFIX}`
  }
  return `${name.slice(0, FORM_FIELD_LIMITS.maxName - DUPLICATE_FORM_NAME_SUFFIX.length)}${DUPLICATE_FORM_NAME_SUFFIX}`
}

export const listCommunityFormsCallable = onCall(async (request): Promise<ListCommunityFormsResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id } = parseOrThrow(ListCommunityFormsRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  const forms = await listCommunityForms(community_id)
  return {
    forms: forms
      .sort((a, b) => b.updated_at - a.updated_at)
      .map((form) => ({
        form_id: form.id,
        name: form.name,
        description: form.description,
        purpose: form.purpose,
        archived: form.archived,
        field_count: omitHiddenFormFields(form.fields).length,
        updated_at: form.updated_at,
      })),
  }
})

export const getCommunityFormCallable = onCall(async (request): Promise<GetCommunityFormResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, form_id } = parseOrThrow(GetCommunityFormRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  const form = await getCommunityForm(community_id, form_id)
  if (form == null) {
    throw new HttpsError('not-found', 'フォームが見つかりません')
  }
  return { form: toCommunityFormDetail(form) }
})

export const createCommunityForm = onCall(async (request): Promise<CreateCommunityFormResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const data = parseOrThrow(CreateCommunityFormRequestSchema, request.data)
  await requireCommunityManager(data.community_id, uid)
  const normalized = normalizeFormFields(data.fields)
  if (!normalized.ok) {
    throw new HttpsError('invalid-argument', normalized.message)
  }
  const form = new CommunityForm('', {
    community_id: data.community_id,
    name: data.name,
    description: data.description ?? '',
    purpose: data.purpose ?? '',
    fields: normalized.fields,
    definition_version: 1,
    archived: false,
    created_by: uid,
    updated_by: uid,
  })
  const created = await createCommunityFormDoc(data.community_id, form)
  logger.info('コミュニティフォームを作成した', { communityId: data.community_id, formId: created.id, userId: uid })
  return { form: toCommunityFormDetail(created) }
})

async function requireEditablePfEvent(communityId: string, eventId: string, transaction: Transaction): Promise<void> {
  const event = await getEventInCommunity(communityId, eventId, transaction)
  if (event == null) {
    throw new HttpsError('not-found', 'イベントが見つかりません')
  }
  assertPfEvent(event)
  assertEventFormEditable(event)
}

export const updateCommunityForm = onCall(async (request): Promise<UpdateCommunityFormResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const data = parseOrThrow(UpdateCommunityFormRequestSchema, request.data)
  await requireCommunityManager(data.community_id, uid)
  const updated = await getFirestore().runTransaction(async (transaction) => {
    const existing = await getCommunityForm(data.community_id, data.form_id, transaction)
    if (existing == null) {
      throw new HttpsError('not-found', 'フォームが見つかりません')
    }
    const normalized = normalizeFormFields(data.fields, existing.fields)
    if (!normalized.ok) {
      throw new HttpsError('invalid-argument', normalized.message)
    }
    const nextPurpose = data.purpose ?? ''
    const next = new CommunityForm(existing.id, {
      ...existing,
      name: data.name,
      description: data.description ?? '',
      purpose: nextPurpose,
      fields: normalized.fields,
      definition_version: nextCommunityFormDefinitionVersion({
        currentVersion: existing.definition_version,
        existingFields: existing.fields,
        existingPurpose: existing.purpose,
        nextFields: normalized.fields,
        nextPurpose,
      }),
      archived: data.archived ?? existing.archived,
      updated_by: uid,
    })
    await saveCommunityForm(data.community_id, next, transaction)
    return next
  })
  return { form: toCommunityFormDetail(updated) }
})

export const duplicateCommunityForm = onCall(async (request): Promise<DuplicateCommunityFormResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, form_id } = parseOrThrow(DuplicateCommunityFormRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  const existing = await getCommunityForm(community_id, form_id)
  if (existing == null) {
    throw new HttpsError('not-found', 'フォームが見つかりません')
  }
  const duplicated = new CommunityForm('', {
    community_id,
    name: duplicateFormName(existing.name),
    description: existing.description,
    purpose: existing.purpose,
    fields: cloneFormFields(existing.fields),
    definition_version: 1,
    archived: false,
    created_by: uid,
    updated_by: uid,
  })
  const created = await createCommunityFormDoc(community_id, duplicated)
  return { form: toCommunityFormDetail(created) }
})

export const archiveCommunityForm = onCall(async (request): Promise<ArchiveCommunityFormResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, form_id, archived } = parseOrThrow(ArchiveCommunityFormRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  const updated = await getFirestore().runTransaction(async (transaction) => {
    const existing = await getCommunityForm(community_id, form_id, transaction)
    if (existing == null) {
      throw new HttpsError('not-found', 'フォームが見つかりません')
    }
    const next = new CommunityForm(existing.id, { ...existing, archived, updated_by: uid })
    await saveCommunityForm(community_id, next, transaction)
    return next
  })
  return { form: toCommunityFormDetail(updated) }
})

export const getEventFormPresence = onCall(async (request): Promise<GetEventFormPresenceResponse> => {
  const { community_id, event_id } = parseOrThrow(GetEventFormPresenceRequestSchema, request.data)
  const event = await getEventInCommunity(community_id, event_id)
  if (event == null) {
    throw new HttpsError('not-found', 'イベントが見つかりません')
  }
  if (getEventEnterpriseId(event) != null) {
    return { has_form: false }
  }
  const config = await getEventFormConfig(community_id, event_id)
  if (config == null) {
    return { has_form: false }
  }
  const form = await getCommunityForm(community_id, config.source_form_id)
  return { has_form: form != null }
})

export const getEventFormConfigCallable = onCall(async (request): Promise<GetEventFormConfigResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, event_id } = parseOrThrow(GetEventFormConfigRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  await requirePfEventForForm(community_id, event_id)
  const config = await getEventFormConfig(community_id, event_id)
  return { config: config == null ? null : toEventFormConfigDto(config) }
})

export const setEventFormFromCommunity = onCall(async (request): Promise<SetEventFormFromCommunityResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, event_id, form_id } = parseOrThrow(SetEventFormFromCommunityRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  const next = await getFirestore().runTransaction(async (transaction) => {
    await requireEditablePfEvent(community_id, event_id, transaction)
    const form = await getCommunityForm(community_id, form_id, transaction)
    if (form == null || form.archived) {
      throw new HttpsError('not-found', 'フォームが見つかりません')
    }
    const existing = await getEventFormConfig(community_id, event_id, transaction)
    const config = new EventFormConfig('current', {
      source_form_id: form.id,
      created_at: existing?.created_at,
    })
    await saveEventFormConfig(community_id, event_id, config, transaction)
    return config
  })
  logger.info('イベントへフォームを設定した', {
    communityId: community_id,
    eventId: event_id,
    formId: form_id,
    userId: uid,
  })
  return { config: toEventFormConfigDto(next) }
})

export const clearEventFormConfig = onCall(async (request): Promise<ClearEventFormConfigResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, event_id } = parseOrThrow(ClearEventFormConfigRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  await getFirestore().runTransaction(async (transaction) => {
    await requireEditablePfEvent(community_id, event_id, transaction)
    await deleteEventFormConfig(community_id, event_id, transaction)
  })
  return { cleared: true }
})

function toResponseItem(
  userId: string,
  displayName: string,
  participation: 'confirmed' | 'canceled',
  answeredAt: number,
  updatedAt: number,
  answers: EventFormResponseListItem['answers'],
): EventFormResponseListItem {
  return {
    user_id: userId,
    display_name: displayName,
    participation,
    answered_at: answeredAt,
    updated_at: updatedAt,
    answers,
  }
}

async function buildResponseItems(communityId: string, eventId: string): Promise<EventFormResponseListItem[]> {
  const [responses, ordered, canceled] = await Promise.all([
    listFormResponses(communityId, eventId),
    getOrders(communityId, eventId, 'ordered'),
    getOrders(communityId, eventId, 'canceled'),
  ])
  const orderedUsers = new Set(ordered.map((order) => order.user_id))
  const canceledUsers = new Set(canceled.map((order) => order.user_id))
  const usersById = await getUsersByUserIds(responses.map((response) => response.user_id))
  return responses
    .map((response) => {
      const participation = orderedUsers.has(response.user_id) ? 'confirmed' : 'canceled'
      const user = usersById.get(response.user_id)
      return toResponseItem(
        response.user_id,
        user?.user_name ?? response.user_id,
        participation,
        response.answered_at,
        response.updated_at,
        response.answers.map((answer) => ({
          field_id: answer.field_id,
          field_label: answer.field_label,
          display_value: formatFormAnswerDisplay(answer),
        })),
      )
    })
    .filter((item) => orderedUsers.has(item.user_id) || canceledUsers.has(item.user_id))
}

export const listEventFormResponses = onCall(async (request): Promise<ListEventFormResponsesResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, event_id, filter } = parseOrThrow(ListEventFormResponsesRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  await requirePfEventForForm(community_id, event_id)
  const items = await buildResponseItems(community_id, event_id)
  return { responses: items.filter((item) => item.participation === filter) }
})

export const getEventFormResponse = onCall(async (request): Promise<GetEventFormResponseResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, event_id, user_id } = parseOrThrow(GetEventFormResponseRequestSchema, request.data)
  await requireCommunityManager(community_id, uid)
  await requirePfEventForForm(community_id, event_id)
  const items = await buildResponseItems(community_id, event_id)
  const response = items.find((item) => item.user_id === user_id)
  if (response == null) {
    const raw = await getFormResponse(community_id, event_id, user_id)
    if (raw == null) {
      throw new HttpsError('not-found', '回答が見つかりません')
    }
    throw new HttpsError('not-found', '参加確定または取消済みの回答が見つかりません')
  }
  return { response }
})
