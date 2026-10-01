import { onCall, HttpsError } from 'firebase-functions/https'
import {
  GetOrderFormForCartRequestSchema,
  SaveOrderFormAttemptRequestSchema,
  type GetOrderFormForCartResponse,
  type SaveOrderFormAttemptResponse,
} from '@shokujii/common/apis/form.js'
import {
  answersToInputs,
  validateFormAnswers,
  type FormAnswerInput,
} from '@shokujii/common/utils/validateFormAnswers.js'
import type { FormField } from '@shokujii/common/schemas/formFields.js'
import type { FormAnswerSnapshot } from '@shokujii/common/schemas/FormResponse.js'
import { createModuleLogger } from './utils/logger.js'
import { parseOrThrow, requireAuthUid, requirePfEventForForm, visibleFieldsForNewAnswers } from './utils/formAccess.js'
import { getOrdersInCart } from './stores/memberOrder.js'
import {
  createFormCheckoutAttempt,
  getEventFormConfig,
  getFormResponse,
  listPendingFormCheckoutAttemptsForUser,
} from './stores/form.js'

const logger = createModuleLogger('formOrder')

function initialAnswersForVisibleFields(answers: FormAnswerSnapshot[], fields: FormField[]): FormAnswerInput[] {
  const fieldById = new Map(fields.map((field) => [field.field_id, field]))
  return answersToInputs(answers).flatMap((answer) => {
    const field = fieldById.get(answer.field_id)
    if (field == null) {
      return []
    }
    if (field.type === 'checkbox') {
      const allowed = new Set(
        field.options.filter((option) => !option.hidden_for_new).map((option) => option.option_id),
      )
      return [{ ...answer, option_ids: (answer.option_ids ?? []).filter((id) => allowed.has(id)) }]
    }
    if (field.type === 'radio' || field.type === 'select') {
      const allowed = new Set(
        field.options.filter((option) => !option.hidden_for_new).map((option) => option.option_id),
      )
      if (answer.option_id != null && !allowed.has(answer.option_id)) {
        return [{ field_id: answer.field_id }]
      }
    }
    return [answer]
  })
}

async function requireInCart(communityId: string, eventId: string, userId: string): Promise<void> {
  const cartOrders = await getOrdersInCart(communityId, eventId, userId)
  if (cartOrders.length === 0) {
    throw new HttpsError('failed-precondition', 'カートに注文があるときだけ回答できます')
  }
}

export const getOrderFormForCart = onCall(async (request): Promise<GetOrderFormForCartResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const { community_id, event_id } = parseOrThrow(GetOrderFormForCartRequestSchema, request.data)
  const event = await requirePfEventForForm(community_id, event_id)
  await requireInCart(community_id, event_id, uid)

  const config = await getEventFormConfig(community_id, event_id)
  if (config == null) {
    return { has_form: false, community_name: event.community_name, purpose: '' }
  }

  const [pendingAttempts, confirmed] = await Promise.all([
    listPendingFormCheckoutAttemptsForUser(community_id, event_id, uid),
    getFormResponse(community_id, event_id, uid),
  ])
  const latestPending = pendingAttempts
    .filter((attempt) => attempt.definition_version === config.definition_version)
    .sort((a, b) => b.updated_at - a.updated_at)[0]

  const fields = visibleFieldsForNewAnswers(config.fields)
  if (latestPending != null) {
    return {
      has_form: true,
      community_name: event.community_name,
      purpose: config.purpose,
      definition_version: config.definition_version,
      fields,
      initial_answers: initialAnswersForVisibleFields(latestPending.answers, fields),
      source: 'attempt',
    }
  }
  if (confirmed != null) {
    return {
      has_form: true,
      community_name: event.community_name,
      purpose: config.purpose,
      definition_version: config.definition_version,
      fields,
      initial_answers: initialAnswersForVisibleFields(confirmed.answers, fields),
      source: 'confirmed',
    }
  }
  return {
    has_form: true,
    community_name: event.community_name,
    purpose: config.purpose,
    definition_version: config.definition_version,
    fields,
    initial_answers: [],
    source: 'empty',
  }
})

export const saveOrderFormAttempt = onCall(async (request): Promise<SaveOrderFormAttemptResponse> => {
  const uid = await requireAuthUid(request.auth?.uid)
  const data = parseOrThrow(SaveOrderFormAttemptRequestSchema, request.data)
  await requirePfEventForForm(data.community_id, data.event_id)
  await requireInCart(data.community_id, data.event_id, uid)

  const config = await getEventFormConfig(data.community_id, data.event_id)
  if (config == null) {
    throw new HttpsError('failed-precondition', 'このイベントにフォームはありません')
  }
  const validated = validateFormAnswers({
    fields: config.fields,
    answers: data.answers,
    definitionVersion: config.definition_version,
    expectedDefinitionVersion: data.definition_version,
  })
  if (!validated.ok) {
    return { attempt_id: '', issues: validated.issues }
  }

  const confirmed = await getFormResponse(data.community_id, data.event_id, uid)
  const attempt = await createFormCheckoutAttempt(data.community_id, data.event_id, {
    user_id: uid,
    definition_version: config.definition_version,
    revision_basis: confirmed?.revision ?? 0,
    answers: validated.answers,
    fields_snapshot: config.fields,
    status: 'pending',
  })
  logger.info('注文フローの回答試行を保存した', {
    communityId: data.community_id,
    eventId: data.event_id,
    userId: uid,
    attemptId: attempt.id,
  })
  return { attempt_id: attempt.id }
})
