"use client"

import { Loader2 } from "lucide-react"

import { Topbar } from "@/components/dashboard/topbar"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { EvolutionChart } from "@/components/dashboard/evolution-chart"
import { AllocationChart } from "@/components/dashboard/allocation-chart"
import { DividendsList } from "@/components/dashboard/dividends-list"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import {
  usePortfolioSummary,
  useHoldings,
  useAllocation,
  useEvolution,
  useDividends,
} from "@/hooks/use-portfolio"

function LoadingState() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-[var(--color-muted)]" />
    </div>
  )
}

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = usePortfolioSummary()
  const { data: holdings, isLoading: holdingsLoading } = useHoldings()
  const { data: allocation, isLoading: allocationLoading } = useAllocation()
  const { data: evolution, isLoading: evolutionLoading } = useEvolution()
  const { data: dividends, isLoading: dividendsLoading } = useDividends()

  return (
    <>
      <Topbar title="Visão geral" />

      <main className="space-y-6 p-6 lg:p-10">
        {summaryLoading || !summary ? <LoadingState /> : <OverviewCards summary={summary} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {evolutionLoading || !evolution ? (
              <LoadingState />
            ) : (
              <EvolutionChart data={evolution} />
            )}
          </div>
          {allocationLoading || !allocation ? (
            <LoadingState />
          ) : (
            <AllocationChart data={allocation} />
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {holdingsLoading || !holdings ? (
              <LoadingState />
            ) : (
              <HoldingsTable holdings={holdings} />
            )}
          </div>
          {dividendsLoading || !dividends ? (
            <LoadingState />
          ) : (
            <DividendsList dividends={dividends} />
          )}
        </div>
      </main>
    </>
  )
}
