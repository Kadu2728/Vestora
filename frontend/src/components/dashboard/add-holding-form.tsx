"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Loader2 } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { useAddHolding } from "@/hooks/use-portfolio"
import { addHoldingSchema, type AddHoldingFormValues } from "@/lib/validations/holding"

const ASSET_CLASS_OPTIONS = [
  { value: "acoes", label: "Ações" },
  { value: "fiis", label: "FIIs" },
  { value: "etf", label: "ETFs" },
  { value: "renda_fixa", label: "Renda Fixa" },
  { value: "cripto", label: "Cripto" },
  { value: "internacional", label: "Internacional" },
]

export function AddHoldingForm() {
  const addHolding = useAddHolding()
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddHoldingFormValues>({
    resolver: zodResolver(addHoldingSchema),
    defaultValues: { asset_class: "acoes" },
  })

  const onSubmit = async (values: AddHoldingFormValues) => {
    setSuccess(false)
    await addHolding.mutateAsync({
      ticker: values.ticker,
      name: values.name,
      asset_class: values.asset_class,
      quantity: Number(values.quantity),
      average_price: Number(values.average_price),
    })
    reset({ asset_class: "acoes", ticker: "", name: "", quantity: undefined, average_price: undefined })
    setSuccess(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar ativo</CardTitle>
        <CardDescription>Inclua um novo ativo na sua carteira</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ticker">Ticker</Label>
              <Input id="ticker" placeholder="PETR4" {...register("ticker")} />
              {errors.ticker && (
                <p className="text-xs text-[var(--color-danger)]">{errors.ticker.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="asset_class">Classe</Label>
              <Select id="asset_class" {...register("asset_class")}>
                {ASSET_CLASS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nome (opcional)</Label>
            <Input id="name" placeholder="Petrobras PN" {...register("name")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input id="quantity" type="number" step="any" placeholder="100" {...register("quantity")} />
              {errors.quantity && (
                <p className="text-xs text-[var(--color-danger)]">{errors.quantity.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="average_price">Preço médio</Label>
              <Input
                id="average_price"
                type="number"
                step="any"
                placeholder="28.40"
                {...register("average_price")}
              />
              {errors.average_price && (
                <p className="text-xs text-[var(--color-danger)]">{errors.average_price.message}</p>
              )}
            </div>
          </div>

          {addHolding.isError && (
            <p className="text-sm text-[var(--color-danger)]">
              Não foi possível adicionar o ativo. Tente novamente.
            </p>
          )}
          {success && (
            <p className="text-sm text-[var(--color-success)]">Ativo adicionado com sucesso!</p>
          )}

          <Button type="submit" className="w-full" disabled={addHolding.isPending}>
            {addHolding.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Adicionar à carteira
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
