import { z } from 'zod'
import { TimestampSchema, EpochMillisSchema } from './firebase/index.js'
import { LimitPerEventAppFieldSchema, LimitPerEventDbFieldSchema } from './limitPerEventField.js'
import {
  MenuAllergenListSchema,
  MenuBadgeListSchema,
  OptionIdListSchema,
  type MenuAllergenType,
  type MenuBadgeType,
} from './menuOption.js'

const PartnerMenuDbSchema = z.object({
  updatedAt: TimestampSchema,
  menu_description: z.string().nonempty(),
  menu_name: z.string().nonempty(),
  menu_price: z.number().int().positive(),
  is_sold_out: z.boolean(),
  menu_sort_number: z.number().int().nonnegative(),
  limit_per_event: LimitPerEventDbFieldSchema,
  // Optional
  menu_date_start: TimestampSchema.nullable(),
  menu_date_end: TimestampSchema.nullable(),
  is_deleted: z.boolean().optional(),
  deleted_at: TimestampSchema.optional(),
  option_ids: OptionIdListSchema.optional(),
  allergens: MenuAllergenListSchema.optional(),
  is_vegan: z.boolean().optional(),
  is_halal: z.boolean().optional(),
  badges: MenuBadgeListSchema.optional(),
})

const PartnerMenuAppSchema = z.object({
  // Default
  menu_description: z.string().default(''),
  menu_name: z.string().default(''),
  menu_price: z.number().int().positive().default(1000),
  is_sold_out: z.boolean().default(false),
  menu_sort_number: z.number().int().nonnegative().default(0),
  limit_per_event: LimitPerEventAppFieldSchema,
  // Optional
  menu_date_start: EpochMillisSchema.nullable().default(null),
  menu_date_end: EpochMillisSchema.nullable().default(null),
  is_deleted: z.boolean().default(false),
  deleted_at: EpochMillisSchema.optional(),
  option_ids: OptionIdListSchema.default([]),
  allergens: MenuAllergenListSchema.default([]),
  is_vegan: z.boolean().default(false),
  is_halal: z.boolean().default(false),
  badges: MenuBadgeListSchema.default([]),
})

const convertToDb = (menu: PartnerMenu) => {
  return {
    ...menu,
    updatedAt: Date.now(),
  }
}

export class PartnerMenu {
  // Mandatory
  readonly id: string
  readonly menu_id: string
  readonly partner_id: string
  updatedAt: number
  menu_description!: string
  menu_name!: string
  menu_price!: number
  is_sold_out!: boolean
  menu_sort_number!: number
  limit_per_event!: number | null
  // Optional
  menu_date_start!: number | null
  menu_date_end!: number | null
  is_deleted!: boolean
  deleted_at?: number
  option_ids!: string[]
  allergens!: MenuAllergenType[]
  is_vegan!: boolean
  is_halal!: boolean
  badges!: MenuBadgeType[]

  constructor(partner_id: string, menu_id: string, src: Partial<PartnerMenu>) {
    Object.assign(this, PartnerMenuAppSchema.parse(src))
    this.partner_id = partner_id
    this.id = menu_id
    this.menu_id = menu_id
    this.updatedAt = Date.now()
  }

  isValidForDatabase(): boolean {
    return PartnerMenuDbSchema.safeParse(convertToDb(this)).success
  }

  toFirestore(): z.infer<typeof PartnerMenuDbSchema> {
    return PartnerMenuDbSchema.parse(convertToDb(this))
  }
}
