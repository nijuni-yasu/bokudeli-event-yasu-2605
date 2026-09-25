import { z } from 'zod'
import { TimestampSchema } from './firebase/index.js'
import { LimitPerEventAppFieldSchema, LimitPerEventDbFieldSchema } from './limitPerEventField.js'
import {
  EventMenuOptionSchema,
  MenuAllergenListSchema,
  MenuBadgeListSchema,
  type MenuAllergenType,
  type MenuBadgeType,
} from './menuOption.js'

const EventMenuDbSchema = z.object({
  updatedAt: TimestampSchema,
  menu_description: z.string().nonempty(),
  menu_name: z.string().nonempty(),
  menu_price: z.number().int().positive(),
  is_sold_out: z.boolean(),
  menu_sort_number: z.number().int().nonnegative(),
  is_selected: z.boolean(),
  limit_per_event: LimitPerEventDbFieldSchema,
  options: z.array(EventMenuOptionSchema).optional(),
  allergens: MenuAllergenListSchema.optional(),
  is_vegan: z.boolean().optional(),
  is_halal: z.boolean().optional(),
  badges: MenuBadgeListSchema.optional(),
})

const EventMenuAppSchema = z.object({
  // Mandatory
  menu_name: z.string().nonempty(),
  // Default
  menu_price: z.number().int().positive().default(100),
  menu_description: z.string().default(''),
  is_sold_out: z.boolean().default(false),
  is_selected: z.boolean().default(true),
  // Mandatory
  menu_sort_number: z.number().int().nonnegative(),
  limit_per_event: LimitPerEventAppFieldSchema,
  options: z.array(EventMenuOptionSchema).default([]),
  allergens: MenuAllergenListSchema.default([]),
  is_vegan: z.boolean().default(false),
  is_halal: z.boolean().default(false),
  badges: MenuBadgeListSchema.default([]),
})

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
  options!: z.infer<typeof EventMenuOptionSchema>[]
  allergens!: MenuAllergenType[]
  is_vegan!: boolean
  is_halal!: boolean
  badges!: MenuBadgeType[]

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
