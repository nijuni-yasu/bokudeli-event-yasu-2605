import { beforeEach, describe, expect, it, vi } from 'vitest'

const { HttpsError } = vi.hoisted(() => {
  class HttpsError extends Error {
    constructor(
      public code: string,
      message: string,
    ) {
      super(message)
    }
  }
  return { HttpsError }
})

const hasRoleMock = vi.fn()
const sgMailSendMock = vi.fn()
const getCommunityMock = vi.fn()
const getLetterMock = vi.fn()
const getUserPersonalInformationMock = vi.fn()
const getCommunityUrlForCommunityMock = vi.fn()
const getEventInCommunityMock = vi.fn()

vi.mock('firebase-functions/https', () => ({
  HttpsError,
  onCall: (_opts: unknown, handler: unknown) => handler,
}))

vi.mock('./stores/community.js', () => ({
  getCommunity: (...args: unknown[]) => getCommunityMock(...args),
}))

vi.mock('./stores/letter.js', () => ({
  getLetter: (...args: unknown[]) => getLetterMock(...args),
  getLetterRef: vi.fn(),
  getScheduledLetters: vi.fn(),
  updateLetterStatusWithCheck: vi.fn(),
}))

vi.mock('./stores/user.js', () => ({
  getUser: vi.fn(),
  getUserPersonalInformation: (...args: unknown[]) => getUserPersonalInformationMock(...args),
}))

vi.mock('./stores/event.js', () => ({
  getEventInCommunity: (...args: unknown[]) => getEventInCommunityMock(...args),
}))

vi.mock('./stores/memberOrder.js', () => ({
  getMemberIds: vi.fn(),
}))

vi.mock('./utils/sendgrid.js', () => ({
  send: (...args: unknown[]) => sgMailSendMock(...args),
}))

vi.mock('./utils/sendgridBulk.js', () => ({
  sendDynamicTemplateWithPersonalizations: vi.fn(),
}))

vi.mock('./utils/mail.js', () => ({
  DEFAULT_FROM: 'from@example.com',
  SUPPORT_MAIL: 'support@example.com',
}))

vi.mock('./utils/urls.js', () => ({
  getCommunityUrlForCommunity: (...args: unknown[]) => getCommunityUrlForCommunityMock(...args),
  getEventUrlForCommunity: vi.fn(),
}))

vi.mock('./utils/enterpriseMail.js', () => ({
  isEnterpriseCommunity: () => false,
}))

vi.mock('./utils/logger.js', () => ({
  createModuleLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}))

import { sendTestLetter } from './letter.js'

const callSendTestLetter = sendTestLetter as unknown as (request: {
  auth?: { uid: string }
  data: { communityId: string; letterId: string }
}) => Promise<void>

beforeEach(() => {
  vi.clearAllMocks()
  hasRoleMock.mockResolvedValue(false)
  sgMailSendMock.mockResolvedValue(undefined)
  getCommunityMock.mockResolvedValue({
    community_name: 'Test Community',
    hasRole: hasRoleMock,
  })
  getLetterMock.mockResolvedValue({
    letter_title: '下書き',
    letter_content: '本文',
    letter_type: 'broadcast',
    status: 'draft',
  })
  getUserPersonalInformationMock.mockResolvedValue({ user_email: 'manager@example.com' })
  getCommunityUrlForCommunityMock.mockResolvedValue('https://example.com/communities/test')
  getEventInCommunityMock.mockResolvedValue(undefined)
})

describe('sendTestLetter', () => {
  it('マネージャ以外は permission-denied で送らない', async () => {
    await expect(
      callSendTestLetter({
        auth: { uid: 'member-1' },
        data: { communityId: 'community-1', letterId: 'letter-1' },
      }),
    ).rejects.toMatchObject({ code: 'permission-denied' })

    expect(hasRoleMock).toHaveBeenCalledWith('member-1', 'manager')
    expect(sgMailSendMock).not.toHaveBeenCalled()
    expect(getLetterMock).not.toHaveBeenCalled()
    expect(getUserPersonalInformationMock).not.toHaveBeenCalled()
  })

  it('コミュニティが無いときは not-found で送らない', async () => {
    getCommunityMock.mockResolvedValue(undefined)

    await expect(
      callSendTestLetter({
        auth: { uid: 'manager-1' },
        data: { communityId: 'missing', letterId: 'letter-1' },
      }),
    ).rejects.toMatchObject({ code: 'not-found' })

    expect(sgMailSendMock).not.toHaveBeenCalled()
  })

  it('マネージャは本人のメールアドレスへ送る', async () => {
    hasRoleMock.mockResolvedValue(true)

    await expect(
      callSendTestLetter({
        auth: { uid: 'manager-1' },
        data: { communityId: 'community-1', letterId: 'letter-1' },
      }),
    ).resolves.toBeUndefined()

    expect(hasRoleMock).toHaveBeenCalledWith('manager-1', 'manager')
    expect(getUserPersonalInformationMock).toHaveBeenCalledWith('manager-1')
    expect(sgMailSendMock).toHaveBeenCalledTimes(1)
    expect(sgMailSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'manager@example.com',
        from: 'from@example.com',
      }),
    )
  })
})
