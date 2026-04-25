import { EventMemberOrderStatusType } from '@shokujii/common/schemas/EventMemberOrder.js'

export type FriendsAction = 'ADD' | 'REMOVE' | 'NOOP'

export const judgeOrderTransition = (
  beforeStatus?: EventMemberOrderStatusType,
  afterStatus?: EventMemberOrderStatusType,
): FriendsAction => {
  const wasOrdered = beforeStatus === 'ordered'
  const isOrdered = afterStatus === 'ordered'

  if (!wasOrdered && isOrdered) {
    return 'ADD'
  }

  if (wasOrdered && !isOrdered) {
    return 'REMOVE'
  }

  return 'NOOP'
}
