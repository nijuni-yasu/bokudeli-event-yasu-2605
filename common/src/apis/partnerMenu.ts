import { z } from 'zod'
import { EpochMillisSchema } from '../schemas/firebase/index.js'
import { LimitPerEventDbFieldSchema } from '../schemas/limitPerEventField.js'
import { MenuDescriptionDbFieldSchema } from '../schemas/menuDescriptionField.js'
import { OptionIdListSchema, OptionItemListSchema, OptionSelectionSchema } from '../schemas/menuOption.js'

const PartnerDocumentIdSchema = z
  .string()
  .min(1)
  .max(1500)
  .refine(
    (id) =>
      !id.includes('/') &&
      id !== '.' &&
      id !== '..' &&
      !/^__.*__$/.test(id) &&
      new TextEncoder().encode(id).length <= 1500,
  )
const InputDateSchema = z.number().int().positive().pipe(EpochMillisSchema).nullable()

export const SavePartnerMenuRequestSchema = z
  .object({
    menu_id: PartnerDocumentIdSchema,
    menu_name: z.string().min(1),
    menu_description: MenuDescriptionDbFieldSchema,
    menu_price: z.number().int().positive(),
    is_sold_out: z.boolean(),
    menu_sort_number: z.number().int().nonnegative(),
    limit_per_event: LimitPerEventDbFieldSchema,
    menu_date_start: InputDateSchema,
    menu_date_end: InputDateSchema,
    option_ids: OptionIdListSchema.pipe(z.array(PartnerDocumentIdSchema)),
  })
  .strict()
export type SavePartnerMenuRequest = z.infer<typeof SavePartnerMenuRequestSchema>

export const SavePartnerOptionRequestSchema = z
  .object({
    option_id: PartnerDocumentIdSchema,
    create: z.boolean(),
    option_name: z.string().min(1).max(40),
    option_description: z.string().max(200).optional(),
    selection: OptionSelectionSchema,
    required: z.boolean(),
    option_items: OptionItemListSchema,
  })
  .strict()
export type SavePartnerOptionRequest = z.infer<typeof SavePartnerOptionRequestSchema>

export const DeletePartnerOptionRequestSchema = z.object({ option_id: PartnerDocumentIdSchema }).strict()
export type DeletePartnerOptionRequest = z.infer<typeof DeletePartnerOptionRequestSchema>
export const DeletePartnerMenuRequestSchema = z.object({ menu_id: PartnerDocumentIdSchema }).strict()
export type DeletePartnerMenuRequest = z.infer<typeof DeletePartnerMenuRequestSchema>
export const SortPartnerMenusRequestSchema = z
  .object({
    menu_ids: z.array(PartnerDocumentIdSchema).refine((ids) => new Set(ids).size === ids.length),
  })
  .strict()
export type SortPartnerMenusRequest = z.infer<typeof SortPartnerMenusRequestSchema>
