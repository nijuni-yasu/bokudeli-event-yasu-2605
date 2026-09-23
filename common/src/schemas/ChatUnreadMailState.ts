import { z } from 'zod'
import { EpochMillisSchema, TimestampSchema } from './firebase/index.js'

export const CHAT_UNREAD_MAIL_STATE_DOC_ID = 'chat_unread_mail'

const ChatUnreadMailStateDbSchema = z.object({
  last_sent_at: TimestampSchema,
})

const ChatUnreadMailStateAppSchema = z.object({
  last_sent_at: EpochMillisSchema,
})

const convertToDb = (state: ChatUnreadMailState) => {
  return {
    last_sent_at: EpochMillisSchema.parse(state.last_sent_at),
  }
}

export class ChatUnreadMailState {
  readonly id: string
  last_sent_at: number

  constructor(id: string, src: Partial<ChatUnreadMailState>) {
    const parsed = ChatUnreadMailStateAppSchema.parse(src)
    this.id = id
    this.last_sent_at = parsed.last_sent_at
  }

  isValidForDatabase(): boolean {
    return ChatUnreadMailStateDbSchema.safeParse(convertToDb(this)).success
  }

  toFirestore(): z.infer<typeof ChatUnreadMailStateDbSchema> {
    return ChatUnreadMailStateDbSchema.parse(convertToDb(this))
  }
}
