import { z } from "zod"

export const addHoldingSchema = z.object({
  ticker: z
    .string()
    .min(1, "Informe o ticker")
    .max(20, "Ticker muito longo")
    .transform((value) => value.toUpperCase()),
  name: z.string().optional(),
  asset_class: z.enum(["acoes", "fiis", "etf", "renda_fixa", "cripto", "internacional"]),
  quantity: z.coerce.number().positive("Quantidade precisa ser maior que zero"),
  average_price: z.coerce.number().positive("Preço médio precisa ser maior que zero"),
})

export type AddHoldingFormValues = z.input<typeof addHoldingSchema>
