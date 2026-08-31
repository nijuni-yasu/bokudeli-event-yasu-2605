import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ShokujiiEvent } from './stores/event.js'
import { syncPartnerMenuSoldOutToEvents } from './eventMenusSoldOutSync.js'

const getAcceptingOrderEventsByPartnerMock = vi.fn()

vi.mock('./utils/logger.js', () => ({
  createModuleLogger: () => ({
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }),
}))

function makeEvent(params: {
  eventId: string
  communityId: string
  updateMenuSoldOut?: ReturnType<typeof vi.fn>
}): ShokujiiEvent {
  const updateMenuSoldOut = params.updateMenuSoldOut ?? vi.fn().mockResolvedValue('updated' as const)
  return {
    id: params.eventId,
    community_id: params.communityId,
    updateMenuSoldOut,
  } as unknown as ShokujiiEvent
}

describe('syncPartnerMenuSoldOutToEvents', () => {
  beforeEach(() => {
    getAcceptingOrderEventsByPartnerMock.mockReset()
  })

  it('対象イベントが 0 件のとき何もしない', async () => {
    getAcceptingOrderEventsByPartnerMock.mockResolvedValue([])

    await syncPartnerMenuSoldOutToEvents({
      partnerId: 'partner1',
      menuId: 'menu1',
      isSoldOut: true,
      nowMillis: Date.now(),
      getEvents: getAcceptingOrderEventsByPartnerMock,
    })

    expect(getAcceptingOrderEventsByPartnerMock).toHaveBeenCalledOnce()
  })

  it('EventMenu があるイベントの is_sold_out を更新する', async () => {
    const updateMenuSoldOut = vi.fn().mockResolvedValue('updated')
    const event = makeEvent({
      eventId: 'event1',
      communityId: 'community1',
      updateMenuSoldOut,
    })
    getAcceptingOrderEventsByPartnerMock.mockResolvedValue([event])

    await syncPartnerMenuSoldOutToEvents({
      partnerId: 'partner1',
      menuId: 'menu1',
      isSoldOut: true,
      nowMillis: Date.now(),
      getEvents: getAcceptingOrderEventsByPartnerMock,
    })

    expect(updateMenuSoldOut).toHaveBeenCalledOnce()
    expect(updateMenuSoldOut).toHaveBeenCalledWith('menu1', true)
  })

  it('EventMenu がないイベントは skip する', async () => {
    const updateMenuSoldOut = vi.fn().mockResolvedValue('not_found')
    const event = makeEvent({
      eventId: 'event1',
      communityId: 'community1',
      updateMenuSoldOut,
    })
    getAcceptingOrderEventsByPartnerMock.mockResolvedValue([event])

    await syncPartnerMenuSoldOutToEvents({
      partnerId: 'partner1',
      menuId: 'menu1',
      isSoldOut: true,
      nowMillis: Date.now(),
      getEvents: getAcceptingOrderEventsByPartnerMock,
    })

    expect(updateMenuSoldOut).toHaveBeenCalledOnce()
  })

  it('1 件でも失敗したら throw する', async () => {
    const failingEvent = makeEvent({
      eventId: 'event1',
      communityId: 'community1',
      updateMenuSoldOut: vi.fn().mockRejectedValue(new Error('save failed')),
    })
    getAcceptingOrderEventsByPartnerMock.mockResolvedValue([failingEvent])

    await expect(
      syncPartnerMenuSoldOutToEvents({
        partnerId: 'partner1',
        menuId: 'menu1',
        isSoldOut: true,
        nowMillis: Date.now(),
        getEvents: getAcceptingOrderEventsByPartnerMock,
      }),
    ).rejects.toThrow('Failed to sync sold-out to events')
  })
})
