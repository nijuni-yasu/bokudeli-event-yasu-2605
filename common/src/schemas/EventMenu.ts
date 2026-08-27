import { z } from 'zod'
import { TimestampSchema } from './firebase/index.js'
import { LimitPerEventAppFieldSchema, LimitPerEventDbFieldSchema } from './limitPerEventField.js'
import { EventItemTypeSchema, type EventItemTypeType } from './EventItemType.js'

const partnerMenuPriceRefine = (data: { item_type: EventItemTypeType; menu_price: number }, ctx: z.RefinementCtx) => {
  if (data.item_type === 'partner_menu' && data.menu_price <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'partner_menu requires menu_price > 0',
      path: ['menu_price'],
    })
  }
}

const EventMenuDbSchema = z
  .object({
    updatedAt: TimestampSchema,
    menu_description: z.string().nonempty(),
    menu_name: z.string().nonempty(),
    menu_price: z.number().int().nonnegative(),
    is_sold_out: z.boolean(),
    menu_sort_number: z.number().int().nonnegative(),
    is_selected: z.boolean(),
    limit_per_event: LimitPerEventDbFieldSchema,
    item_type: EventItemTypeSchema,
  })
  .superRefine(partnerMenuPriceRefine)

const EventMenuAppSchema = z
  .object({
    // Mandatory
    menu_name: z.string().nonempty(),
    // Default
    menu_price: z.number().int().nonnegative().default(100),
    menu_description: z.string().default(''),
    is_sold_out: z.boolean().default(false),
    is_selected: z.boolean().default(true),
    item_type: EventItemTypeSchema,
    // Mandatory
    menu_sort_number: z.number().int().nonnegative(),
    limit_per_event: LimitPerEventAppFieldSchema,
  })
  .superRefine(partnerMenuPriceRefine)

const convertToDb = (menu: EventMenu) => {
  return {
    ...menu,
    updatedAt: Date.now(),
  }
}

export class EventMenu {
  // Mandatory
  readonly id: string
  readonly menu_id: string
  readonly event_id: string
  updatedAt: number
  menu_description!: string
  menu_name!: string
  menu_price!: number
  is_sold_out!: boolean
  menu_sort_number!: number
  is_selected!: boolean
  limit_per_event!: number | null
  item_type!: EventItemTypeType

  constructor(event_id: string, menu_id: string, src: Partial<EventMenu>) {
    Object.assign(this, EventMenuAppSchema.parse(src))
    this.event_id = event_id
    this.id = menu_id
    this.menu_id = menu_id
    this.updatedAt = Date.now()
  }

  isValidForDatabase(): boolean {
    return EventMenuDbSchema.safeParse(convertToDb(this)).success
  }

  toFirestore(): z.infer<typeof EventMenuDbSchema> {
    return EventMenuDbSchema.parse(convertToDb(this))
  }
}
