import { HttpsError } from 'firebase-functions/https'
import type { Transaction } from 'firebase-admin/firestore'
import { FormResponse } from '@shokujii/common/schemas/FormResponse.js'
import type { FormCheckoutAttempt } from '@shokujii/common/schemas/FormCheckoutAttempt.js'
import type { CommunityForm } from '@shokujii/common/schemas/CommunityForm.js'
import type { FormField } from '@shokujii/common/schemas/formFields.js'
import type { FormAnswerSnapshot } from '@shokujii/common/schemas/FormResponse.js'
import { getFormCheckoutAttempt, getFormResponse, saveFormCheckoutAttempt, saveFormResponse } from '../stores/form.js'
import { loadEventFormReferenceIfPf } from './formAccess.js'
import type { ShokujiiEvent } from '../stores/event.js'

export function isAttemptForCurrentForm(attempt: FormCheckoutAttempt, form: CommunityForm): boolean {
  if (attempt.source_form_id === '') {
    return false
  }
  return attempt.source_form_id === form.id && attempt.definition_version === form.definition_version
}

export function isConfirmedResponseForCurrentForm(response: FormResponse, form: CommunityForm): boolean {
  if (response.source_form_id === '') {
    return false
  }
  return response.source_form_id === form.id && response.definition_version === form.definition_version
}

/** 初期表示用。版が上がっていても、同じフォームの過去回答を残っている設問へ載せる。 */
export function isConfirmedResponseForSameForm(response: FormResponse, form: CommunityForm): boolean {
  if (response.source_form_id === '') {
    return false
  }
  return response.source_form_id === form.id
}

export async function requireAttemptForLatestForm(params: {
  event: ShokujiiEvent
  userId: string
  attemptId: string | undefined
  form: CommunityForm
  transaction: Transaction
}): Promise<FormCheckoutAttempt> {
  if (params.attemptId == null || params.attemptId === '') {
    throw new HttpsError('failed-precondition', 'フォームの回答が必要です')
  }
  const attempt = await getFormCheckoutAttempt(
    params.event.community_id,
    params.event.id,
    params.attemptId,
    params.transaction,
  )
  if (attempt == null || attempt.user_id !== params.userId) {
    throw new HttpsError('failed-precondition', 'フォームの回答が見つかりません')
  }
  if (attempt.status === 'consumed') {
    throw new HttpsError('failed-precondition', 'この回答はすでに使用されています')
  }
  if (!isAttemptForCurrentForm(attempt, params.form)) {
    throw new HttpsError('failed-precondition', '設問が更新されています。回答画面でやり直してください')
  }
  return attempt
}

export type FormConfirmPlan =
  | { kind: 'none' }
  | { kind: 'reuse'; existing: FormResponse }
  | { kind: 'apply'; attempt: FormCheckoutAttempt; existing?: FormResponse }

export async function planFormConfirmation(params: {
  event: ShokujiiEvent
  userId: string
  attemptId: string | undefined
  transaction: Transaction
}): Promise<FormConfirmPlan> {
  const reference = await loadEventFormReferenceIfPf(params.event, params.transaction)
  if (reference == null) {
    return { kind: 'none' }
  }
  const existing = await getFormResponse(params.event.community_id, params.event.id, params.userId, params.transaction)
  if (params.attemptId != null && params.attemptId !== '') {
    const attempt = await requireAttemptForLatestForm({
      event: params.event,
      userId: params.userId,
      attemptId: params.attemptId,
      form: reference.form,
      transaction: params.transaction,
    })
    return { kind: 'apply', attempt, existing }
  }
  if (existing != null && isConfirmedResponseForCurrentForm(existing, reference.form)) {
    return { kind: 'reuse', existing }
  }
  throw new HttpsError('failed-precondition', 'フォームの回答が必要です')
}

export function mergeAttemptAnswersWithInactiveExisting(
  attemptAnswers: FormAnswerSnapshot[],
  existingAnswers: FormAnswerSnapshot[] | undefined,
  fields: FormField[] | undefined,
  sourceFormIds?: { existing?: string; attempt?: string },
): FormAnswerSnapshot[] {
  // 別フォームへ差し替えた再注文では、旧フォームだけの回答を新フォームへ混ぜない。
  if (sourceFormIds != null && (sourceFormIds.existing ?? '') !== (sourceFormIds.attempt ?? '')) {
    return [...attemptAnswers]
  }
  // 今回の設問に無い確定済み回答は残す。削除した設問や種類変更前の旧IDも上書きしない。
  const editableIds = new Set((fields ?? []).filter((field) => !field.hidden_for_new).map((field) => field.field_id))
  const attemptIds = new Set(attemptAnswers.map((answer) => answer.field_id))
  const kept = (existingAnswers ?? []).filter(
    (answer) => !editableIds.has(answer.field_id) && !attemptIds.has(answer.field_id),
  )
  return [...kept, ...attemptAnswers]
}

export async function applyAttemptToConfirmedResponse(params: {
  event: ShokujiiEvent
  userId: string
  attempt: FormCheckoutAttempt
  transaction: Transaction
  existing?: FormResponse
  ignoreDefinitionMismatch?: boolean
}): Promise<void> {
  const existing =
    params.existing ??
    (await getFormResponse(params.event.community_id, params.event.id, params.userId, params.transaction))
  if (existing != null && existing.revision > params.attempt.revision_basis) {
    params.attempt.status = 'consumed'
    await saveFormCheckoutAttempt(params.event.community_id, params.event.id, params.attempt, params.transaction)
    return
  }
  if (
    params.ignoreDefinitionMismatch !== true &&
    existing != null &&
    existing.source_form_id !== '' &&
    existing.source_form_id === params.attempt.source_form_id &&
    existing.definition_version > params.attempt.definition_version
  ) {
    params.attempt.status = 'consumed'
    await saveFormCheckoutAttempt(params.event.community_id, params.event.id, params.attempt, params.transaction)
    return
  }

  const now = Date.now()
  const nextRevision = (existing?.revision ?? 0) + 1
  const sameForm =
    existing != null && existing.source_form_id !== '' && existing.source_form_id === params.attempt.source_form_id
  const confirmed = new FormResponse(params.userId, {
    user_id: params.userId,
    source_form_id: params.attempt.source_form_id,
    definition_version: params.attempt.definition_version,
    revision: nextRevision,
    answers: mergeAttemptAnswersWithInactiveExisting(
      params.attempt.answers,
      sameForm ? existing.answers : undefined,
      params.attempt.fields_snapshot,
      { existing: existing?.source_form_id ?? '', attempt: params.attempt.source_form_id },
    ),
    answered_at: sameForm ? (existing.answered_at ?? now) : now,
    updated_at: now,
  })
  await saveFormResponse(params.event.community_id, params.event.id, confirmed, params.transaction)
  params.attempt.status = 'consumed'
  await saveFormCheckoutAttempt(params.event.community_id, params.event.id, params.attempt, params.transaction)
}
