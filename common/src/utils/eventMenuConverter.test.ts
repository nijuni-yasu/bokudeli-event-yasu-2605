import { describe, expect, it } from 'vitest'
import { PartnerMenu } from '../schemas/PartnerMenu.js'
import { convertFromPartnerMenuToEventMenu, convertPartnerMenusToEventMenus } from './eventMenuConverter.js'

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
})
