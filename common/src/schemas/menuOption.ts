import { z } from 'zod'

export const OPTION_SELECTION_VALUES = ['single', 'multiple'] as const
export type OptionSelectionType = (typeof OPTION_SELECTION_VALUES)[number]

export const PRICE_DELTA_MIN = -10000
export const PRICE_DELTA_MAX = 10000
export const MENU_OPTION_IDS_MAX = 10
export const OPTION_ITEMS_MAX = 20

function hasUniqueValues(values: readonly string[]): boolean {
  return new Set(values).size === values.length
}

export const OptionIdListSchema = z.array(z.string().nonempty()).max(MENU_OPTION_IDS_MAX).refine(hasUniqueValues)
export const OptionSelectionSchema = z.enum(OPTION_SELECTION_VALUES)

export const OptionItemSchema = z.object({
  item_id: z.string().nonempty(),
  name: z.string().min(1).max(40),
  price_delta: z.number().int().min(PRICE_DELTA_MIN).max(PRICE_DELTA_MAX),
})
export type OptionItemType = z.infer<typeof OptionItemSchema>

function hasUniqueItemIds(items: readonly { item_id: string }[]): boolean {
  return hasUniqueValues(items.map((item) => item.item_id))
}

export const OptionItemListSchema = z
  .array(OptionItemSchema)
  .min(1)
  .max(OPTION_ITEMS_MAX)
  .refine(hasUniqueItemIds)
  .refine((items) => !hasDuplicateOptionItemNames(items))

export const EventMenuOptionSchema = z.object({
  option_id: z.string().nonempty(),
  option_name: z.string().min(1).max(40),
  option_description: z.string().max(200).optional(),
  selection: OptionSelectionSchema,
  required: z.boolean(),
  option_items: OptionItemListSchema,
})
export type EventMenuOptionType = z.infer<typeof EventMenuOptionSchema>

export const SelectedOptionSchema = z.object({
  option_id: z.string().nonempty(),
  option_name: z.string().nonempty(),
  item_id: z.string().nonempty(),
  item_name: z.string().nonempty(),
  price_delta: z.number().int().min(PRICE_DELTA_MIN).max(PRICE_DELTA_MAX),
})
export type SelectedOptionType = z.infer<typeof SelectedOptionSchema>

export const CartSelectedItemSchema = z.object({
  option_id: z.string().nonempty(),
  item_id: z.string().nonempty(),
})
export type CartSelectedItemType = z.infer<typeof CartSelectedItemSchema>

export function hasDuplicateOptionItemNames(items: readonly { name: string }[]): boolean {
  const names = items.map((item) => item.name)
  return new Set(names).size !== names.length
}
