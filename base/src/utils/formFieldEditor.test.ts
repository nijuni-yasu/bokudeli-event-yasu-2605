import { afterEach, describe, expect, it, vi } from 'vitest'
import { deleteApp, initializeApp } from 'firebase/app'
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import { CreateCommunityFormRequestSchema, type FormFieldInput } from '@shokujii/common/apis/form.js'
import { changeFormFieldType } from './formFieldEditor.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('changeFormFieldType', () => {
  const field: FormFieldInput = {
    field_id: 'existing-field',
    type: 'radio',
    label: '参加のきっかけ',
    description: '差し支えない範囲で教えてください',
    required: true,
    options: [{ option_id: 'old-option', label: '紹介' }],
  }

  it('種類を変えると旧IDと選択肢を除き、設問の内容を維持する', () => {
    const changed = changeFormFieldType(field, 'textarea')
    expect(changed).not.toHaveProperty('field_id')
    expect(changed).not.toHaveProperty('options')
    expect(changed).toMatchObject({
      type: 'textarea',
      label: field.label,
      description: field.description,
      required: true,
    })
    expect(field.field_id).toBe('existing-field')
  })

  it('同じ種類を再選択しても設問IDと回答選択肢を維持する', () => {
    expect(changeFormFieldType(field, 'radio')).toBe(field)
  })

  it('選択式へ変更すると旧IDを再利用せず、新しい選択肢を用意する', () => {
    const changed = changeFormFieldType(field, 'checkbox')
    expect(changed).not.toHaveProperty('field_id')
    expect(changed.options).toEqual([{ label: '', hidden_for_new: false }])
  })

  it('種類変更後も実際のFirebase Callableのシリアライズを通して作成APIの検証に通る', async () => {
    let sentBody = ''
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(async (_input, init) => {
        sentBody = typeof init?.body === 'string' ? init.body : ''
        return new Response(JSON.stringify({ data: {} }), { status: 200 })
      }),
    )
    const app = initializeApp({ projectId: 'demo-form-editor', apiKey: 'test-key' }, 'form-editor-test')
    const functions = getFunctions(app)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
    try {
      const createForm = httpsCallable(functions, 'createCommunityForm')
      await createForm({
        community_id: 'community',
        name: '事前アンケート',
        fields: [changeFormFieldType(field, 'textarea')],
      })
      expect(sentBody).not.toContain('null')
      expect(CreateCommunityFormRequestSchema.safeParse(JSON.parse(sentBody).data).success).toBe(true)
    } finally {
      await deleteApp(app)
    }
  })
})
