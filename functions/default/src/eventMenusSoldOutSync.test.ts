import { describe, expect, it, vi, beforeEach } from 'vitest'
import { EventMenu } from '@shokujii/common/schemas/EventMenu.js'
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
  menus: EventMenu[]
  saveMenu?: ReturnType<typeof vi.fn>
  getMenus?: ReturnType<typeof vi.fn>
}): ShokujiiEvent {
  const saveMenu = params.saveMenu ?? vi.fn().mockResolvedValue(undefined)
  const getMenus = params.getMenus ?? vi.fn().mockResolvedValue(params.menus)
  return {
    id: params.eventId,
    community_id: params.communityId,
    getMenus,
    saveMenu,
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
    const saveMenu = vi.fn().mockResolvedValue(undefined)
    const event = makeEvent({
      eventId: 'event1',
      communityId: 'community1',
      menus: [
        new EventMenu('event1', 'menu1', {
          menu_name: 'Menu 1',
          menu_price: 1000,
          is_sold_out: false,
          is_selected: true,
          menu_sort_number: 0,
        }),
      ],
      saveMenu,
    })
    getAcceptingOrderEventsByPartnerMock.mockResolvedValue([event])

    await syncPartnerMenuSoldOutToEvents({
      partnerId: 'partner1',
      menuId: 'menu1',
      isSoldOut: true,
      nowMillis: Date.now(),
      getEvents: getAcceptingOrderEventsByPartnerMock,
    })

    expect(saveMenu).toHaveBeenCalledOnce()
    expect(saveMenu.mock.calls[0]?.[0]?.is_sold_out).toBe(true)
  })

  it('EventMenu がないイベントは skip する', async () => {
    const saveMenu = vi.fn().mockResolvedValue(undefined)
    const event = makeEvent({
      eventId: 'event1',
      communityId: 'community1',
      menus: [],
      saveMenu,
    })
    getAcceptingOrderEventsByPartnerMock.mockResolvedValue([event])

    await syncPartnerMenuSoldOutToEvents({
      partnerId: 'partner1',
      menuId: 'menu1',
      isSoldOut: true,
      nowMillis: Date.now(),
      getEvents: getAcceptingOrderEventsByPartnerMock,
    })

    expect(saveMenu).not.toHaveBeenCalled()
  })

  it('1 件でも失敗したら throw する', async () => {
    const failingEvent = makeEvent({
      eventId: 'event1',
      communityId: 'community1',
      menus: [
        new EventMenu('event1', 'menu1', {
          menu_name: 'Menu 1',
          menu_price: 1000,
          is_sold_out: false,
          is_selected: true,
          menu_sort_number: 0,
        }),
      ],
      saveMenu: vi.fn().mockRejectedValue(new Error('save failed')),
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
