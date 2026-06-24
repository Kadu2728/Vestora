"use client"

import { Loader2 } from "lucide-react"

import { Topbar } from "@/components/dashboard/topbar"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import { AddHoldingForm } from "@/components/dashboard/add-holding-form"
import { useHoldings } from "@/hooks/use-portfolio"

export default function CarteiraPage() {
  const { data: holdings, isLoading } = useHoldings()

  return (
    <>
      <Topbar title="Carteira" />
      <main className="space-y-6 p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLoading || !holdings ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-muted)]" />
              </div>
            ) : (
              <HoldingsTable holdings={holdings} />
            )}
          </div>
          <AddHoldingForm />
        </div>
      </main>
    </>
  )
}
