import { afterEach, describe, expect, it, vi } from 'vitest'
import { deleteApp, initializeApp } from 'firebase/app'
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import { CreateCommunityFormRequestSchema, type FormFieldInput } from '@shokujii/common/apis/form.js'
import {
  changeFormFieldType,
  createChoiceOptions,
  formatDefaultFormName,
  nextDefaultOptionNumber,
} from './formFieldEditor.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('formatDefaultFormName', () => {
  const format = (communityName: string) => `${communityName}のフォーム`

  it('コミュニティ名をタイトルにする', () => {
    expect(formatDefaultFormName('  交流会  ', format, 100)).toBe('交流会のフォーム')
  })

  it('コミュニティ名が空のときはタイトルを作らない', () => {
    expect(formatDefaultFormName('   ', format, 100)).toBe('')
  })

  it('フォーム名の上限を超えるときは接尾辞を残してコミュニティ名だけ切り詰める', () => {
    const name = formatDefaultFormName('あ'.repeat(100), format, 100)
    expect(name).toHaveLength(100)
    expect(name.endsWith('のフォーム')).toBe(true)
  })
})

describe('nextDefaultOptionNumber', () => {
  const format = (number: number) => `選択肢 ${number}`

  it('既存ラベルと重ならない番号を返す', () => {
    expect(nextDefaultOptionNumber(['選択肢 1', '選択肢 3'], format)).toBe(2)
    expect(nextDefaultOptionNumber(['選択肢 1', '選択肢 2', '選択肢 3'], format)).toBe(4)
  })
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

  it('選択式へ変更すると旧IDを再利用せず、初期の選択肢を用意する', () => {
    const labels = ['選択肢 1', '選択肢 2', '選択肢 3']
    const textField: FormFieldInput = {
      field_id: field.field_id,
      type: 'text',
      label: field.label,
      description: field.description,
      required: field.required,
    }
    const choiceTypes: FormFieldInput['type'][] = ['radio', 'checkbox', 'select']
    for (const type of choiceTypes) {
      const changed = changeFormFieldType(textField, type, labels)
      expect(changed).not.toHaveProperty('field_id')
      expect(changed.options).toEqual(createChoiceOptions(labels))
      expect(changed.label).toBe(field.label)
    }
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
