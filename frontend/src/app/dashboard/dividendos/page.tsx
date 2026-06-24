"use client"

import { Loader2 } from "lucide-react"

import { Topbar } from "@/components/dashboard/topbar"
import { DividendsList } from "@/components/dashboard/dividends-list"
import { useDividends, usePortfolioSummary } from "@/hooks/use-portfolio"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"

export default function DividendosPage() {
  const { data: dividends, isLoading } = useDividends()
  const { data: summary } = usePortfolioSummary()

  return (
    <>
      <Topbar title="Dividendos" />
      <main className="space-y-6 p-6 lg:p-10">
        {summary && (
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Recebido este mês</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {formatCurrency(summary.monthly_dividends)}
                </p>
              </div>
              <p
                className={`text-sm font-medium ${
                  summary.monthly_dividends_change_pct >= 0
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-danger)]"
                }`}
              >
                {formatPercent(summary.monthly_dividends_change_pct)} vs mês anterior
              </p>
            </CardContent>
          </Card>
        )}

        <div className="max-w-2xl">
          {isLoading || !dividends ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-muted)]" />
            </div>
          ) : (
            <DividendsList dividends={dividends} />
          )}
        </div>
      </main>
    </>
  )
}
