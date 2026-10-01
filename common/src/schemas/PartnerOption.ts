import { z } from 'zod'
import { TimestampSchema, EpochMillisSchema } from './firebase/index.js'
import {
  OPTION_ITEMS_MAX,
  OptionItemListSchema,
  OptionItemSchema,
  OptionSelectionSchema,
  PRICE_DELTA_MAX,
  PRICE_DELTA_MIN,
  hasDuplicateOptionItemNames,
} from './menuOption.js'

const PartnerOptionItemAppSchema = z.object({
  item_id: z.string().nonempty(),
  name: z.string().max(40).default(''),
  price_delta: z.number().int().min(PRICE_DELTA_MIN).max(PRICE_DELTA_MAX).default(0),
})

const nowMillis = () => Date.now()

const PartnerOptionDbSchema = z.object({
  partner_id: z.string().nonempty(),
  option_name: z.string().min(1).max(40),
  option_description: z.string().max(200).optional(),
  selection: OptionSelectionSchema,
  required: z.boolean(),
  option_items: OptionItemListSchema,
  created_at: TimestampSchema,
  updated_at: TimestampSchema,
})

const PartnerOptionAppSchema = z.object({
  partner_id: z.string().nonempty(),
  option_name: z.string().max(40).default(''),
  option_description: z.string().max(200).optional(),
  selection: OptionSelectionSchema.default('single'),
  required: z.boolean().default(false),
  option_items: z
    .array(PartnerOptionItemAppSchema)
    .max(OPTION_ITEMS_MAX)
    .default([])
    .refine((items) => new Set(items.map((item) => item.item_id)).size === items.length),
  created_at: EpochMillisSchema.optional(),
  updated_at: EpochMillisSchema.optional(),
})

const convertToDb = (option: PartnerOption) => {
  return {
    partner_id: option.partner_id,
    option_name: option.option_name,
    ...(option.option_description != null && option.option_description !== ''
      ? { option_description: option.option_description }
      : {}),
    selection: option.selection,
    required: option.required,
    option_items: option.option_items,
    created_at: EpochMillisSchema.default(nowMillis()).parse(option.created_at),
    updated_at: nowMillis(),
  }
}

export class PartnerOption {
  readonly id: string
  readonly option_id: string
  readonly partner_id: string
  option_name!: string
  option_description?: string
  selection!: 'single' | 'multiple'
  required!: boolean
  option_items!: z.infer<typeof OptionItemSchema>[]
  created_at: number
  updated_at: number

  constructor(partner_id: string, option_id: string, src: Partial<PartnerOption>) {
    Object.assign(this, PartnerOptionAppSchema.parse({ ...src, partner_id }))
    this.partner_id = partner_id
    this.id = option_id
    this.option_id = option_id
    this.created_at = EpochMillisSchema.default(nowMillis()).parse(src.created_at)
    this.updated_at = EpochMillisSchema.default(nowMillis()).parse(src.updated_at)
  }

  isValidForDatabase(): boolean {
    if (hasDuplicateOptionItemNames(this.option_items)) {
      return false
    }
    return PartnerOptionDbSchema.safeParse(convertToDb(this)).success
  }

  toFirestore(): z.infer<typeof PartnerOptionDbSchema> {
    return PartnerOptionDbSchema.parse(convertToDb(this))
  }
}
