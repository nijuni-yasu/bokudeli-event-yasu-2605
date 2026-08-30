import { onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { EventMenu } from '@shokujii/common/schemas/EventMenu.js'
import { createModuleLogger } from './utils/logger.js'
import { getAcceptingOrderEventsByPartner, type ShokujiiEvent } from './stores/event.js'

const logger = createModuleLogger('eventMenusSoldOutSync')

export async function syncPartnerMenuSoldOutToEvents(params: {
  partnerId: string
  menuId: string
  isSoldOut: boolean
  nowMillis: number
  getEvents?: typeof getAcceptingOrderEventsByPartner
}): Promise<void> {
  const { partnerId, menuId, isSoldOut, nowMillis } = params
  const getEvents = params.getEvents ?? getAcceptingOrderEventsByPartner

  const events = await getEvents(partnerId, nowMillis)
  if (events.length === 0) {
    logger.info('No accepting_order events for partner; skip sold-out sync', { partnerId, menuId })
    return
  }

  const results = await Promise.allSettled(
    events.map(async (event) => syncSoldOutToEventMenu(event, menuId, isSoldOut)),
  )

  const failedEventIds = results.flatMap((result, index) => {
    if (result.status === 'rejected') {
      return [events[index]?.id ?? 'unknown']
    }
    return []
  })

  if (failedEventIds.length > 0) {
    logger.error('Failed to sync sold-out to some events', {
      partnerId,
      menuId,
      isSoldOut,
      failedEventIds,
      failedCount: failedEventIds.length,
      totalCount: events.length,
    })
    throw new Error(`Failed to sync sold-out to events: ${failedEventIds.join(', ')}`)
  }
}

async function syncSoldOutToEventMenu(event: ShokujiiEvent, menuId: string, isSoldOut: boolean): Promise<void> {
  const eventMenus = await event.getMenus()
  const targetMenu = eventMenus.find((menu) => menu.menu_id === menuId)
  if (targetMenu == null) {
    logger.info('EventMenu not found for sold-out sync; skip', {
      communityId: event.community_id,
      eventId: event.id,
      menuId,
    })
    return
  }

  if (targetMenu.is_sold_out === isSoldOut) {
    return
  }

  const updatedMenu = new EventMenu(event.id, menuId, {
    ...targetMenu,
    is_sold_out: isSoldOut,
  })
  await event.saveMenu(updatedMenu)
}

export const onPartnerMenuSoldOutChanged = onDocumentUpdated(
  {
    document: 'partners/{partnerId}/menus/{menuId}',
    region: 'asia-northeast1',
    retry: true,
  },
  async (event) => {
    logger.info('onPartnerMenuSoldOutChanged invoked', {
      partnerId: event.params.partnerId,
      menuId: event.params.menuId,
      hasBefore: event.data?.before.exists ?? false,
      hasAfter: event.data?.after.exists ?? false,
    })

    const change = event.data
    if (change == null || !change.after.exists) {
      logger.info('PartnerMenu deleted; skip sold-out sync', { menuId: event.params.menuId })
      return
    }

    const beforeSoldOut = change.before.exists ? change.before.get('is_sold_out') : undefined
    const afterSoldOut = change.after.get('is_sold_out')
    if (typeof afterSoldOut !== 'boolean') {
      logger.warn('PartnerMenu is_sold_out is missing or invalid; skip', {
        partnerId: event.params.partnerId,
        menuId: event.params.menuId,
      })
      return
    }

    if (beforeSoldOut === afterSoldOut) {
      return
    }

    await syncPartnerMenuSoldOutToEvents({
      partnerId: event.params.partnerId,
      menuId: event.params.menuId,
      isSoldOut: afterSoldOut,
      nowMillis: Date.now(),
    })
  },
)
