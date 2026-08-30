import { EventMenu } from '../schemas/EventMenu.js'

export function findEventMenu(eventMenus: EventMenu[], menuId: string): EventMenu | undefined {
  return eventMenus.find((m) => m.menu_id === menuId || m.id === menuId)
}
