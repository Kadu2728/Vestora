"use client"

import { Loader2 } from "lucide-react"

import { Topbar } from "@/components/dashboard/topbar"
import { AllocationChart } from "@/components/dashboard/allocation-chart"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import { useAllocation, useHoldings } from "@/hooks/use-portfolio"

export default function AlocacaoPage() {
  const { data: allocation, isLoading: allocationLoading } = useAllocation()
  const { data: holdings, isLoading: holdingsLoading } = useHoldings()

  return (
    <>
      <Topbar title="Alocação" />
      <main className="space-y-6 p-6 lg:p-10">
        <div className="max-w-2xl">
          {allocationLoading || !allocation ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-muted)]" />
            </div>
          ) : (
            <AllocationChart data={allocation} />
          )}
        </div>

        {holdingsLoading || !holdings ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--color-muted)]" />
          </div>
        ) : (
          <HoldingsTable holdings={holdings} />
        )}
      </main>
    </>
  )
}
