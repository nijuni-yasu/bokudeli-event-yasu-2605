import { describe, expect, it } from 'vitest'
import { PartnerMenu } from '../schemas/PartnerMenu.js'
import { NO_ORDER_PARTICIPATION_MENU_ID } from '../schemas/EventItemType.js'
import {
  buildNoOrderParticipationEventMenu,
  convertFromPartnerMenuToEventMenu,
  convertPartnerMenusToEventMenus,
} from './eventMenuConverter.js'

const EVENT_ID = 'event1'
const EVENT_START = 1_700_000_000_000

function makePartnerMenu(menuId: string, overrides: Partial<PartnerMenu> = {}): PartnerMenu {
  return new PartnerMenu('partner1', menuId, {
    menu_name: `Menu ${menuId}`,
    menu_description: `Desc ${menuId}`,
    menu_price: 1000,
    is_sold_out: false,
    menu_sort_number: 0,
    ...overrides,
  })
}

describe('convertFromPartnerMenuToEventMenu', () => {
  it('売り切れメニューも is_sold_out: true で EventMenu に変換する', () => {
    const partnerMenu = makePartnerMenu('menu1', { is_sold_out: true })
    const result = convertFromPartnerMenuToEventMenu(partnerMenu, EVENT_ID, EVENT_START, ['menu1'])

    expect(result).not.toBeNull()
    expect(result?.is_sold_out).toBe(true)
    expect(result?.is_selected).toBe(true)
    expect(result?.item_type).toBe('partner_menu')
  })

  it('論理削除済みメニューは null を返す', () => {
    const partnerMenu = makePartnerMenu('menu1', { is_deleted: true })
    const result = convertFromPartnerMenuToEventMenu(partnerMenu, EVENT_ID, EVENT_START, ['menu1'])

    expect(result).toBeNull()
  })

  it('提供期間外のメニューは null を返す', () => {
    const partnerMenu = makePartnerMenu('menu1', {
      menu_date_start: EVENT_START + 86_400_000,
      menu_date_end: EVENT_START + 172_800_000,
    })
    const result = convertFromPartnerMenuToEventMenu(partnerMenu, EVENT_ID, EVENT_START, ['menu1'])

    expect(result).toBeNull()
  })

  it('limit_per_event を EventMenu にコピーする', () => {
    const partnerMenu = makePartnerMenu('menu1', { limit_per_event: 20 })
    const result = convertFromPartnerMenuToEventMenu(partnerMenu, EVENT_ID, EVENT_START, ['menu1'])

    expect(result?.limit_per_event).toBe(20)
  })
})

describe('convertPartnerMenusToEventMenus', () => {
  it('売り切れメニューを配列に含める', () => {
    const partnerMenus = [
      makePartnerMenu('menu1', { is_sold_out: false }),
      makePartnerMenu('menu2', { is_sold_out: true }),
    ]
    const result = convertPartnerMenusToEventMenus(partnerMenus, EVENT_ID, EVENT_START, ['menu1', 'menu2'])

    expect(result).toHaveLength(2)
    expect(result.find((m) => m.menu_id === 'menu2')?.is_sold_out).toBe(true)
  })

  it('予約ドキュメントを含めない', () => {
    const partnerMenus = [makePartnerMenu('menu-1', { menu_name: 'A', menu_description: 'desc', menu_price: 100 })]
    const result = convertPartnerMenusToEventMenus(partnerMenus, EVENT_ID, null, ['menu-1'])

    expect(result).toHaveLength(1)
    expect(result.every((m) => m.item_type === 'partner_menu')).toBe(true)
    expect(result.some((m) => m.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)).toBe(false)
  })
})

describe('eventMenuConverter no_order_participation', () => {
  it('buildNoOrderParticipationEventMenu が予約ドキュメントを生成する', () => {
    const menu = buildNoOrderParticipationEventMenu('event-1', true)
    expect(menu.menu_id).toBe(NO_ORDER_PARTICIPATION_MENU_ID)
    expect(menu.item_type).toBe('organizer_menu')
    expect(menu.menu_price).toBe(0)
    expect(menu.is_selected).toBe(true)
  })
})
