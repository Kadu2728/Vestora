"use client"

import { motion } from "framer-motion"
import { Wallet, TrendingUp, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { fadeUp, staggerContainer, defaultTransition, cardHover } from "@/lib/animations"
import type { PortfolioSummary } from "@/types/api"

export function OverviewCards({ summary }: { summary: PortfolioSummary }) {
  const profitabilityValue = summary.total_patrimony - summary.total_invested

  const cards = [
    {
      label: "Patrimônio total",
      value: formatCurrency(summary.total_patrimony),
      icon: Wallet,
      footer: `Investido: ${formatCurrency(summary.total_invested)}`,
    },
    {
      label: "Rentabilidade",
      value: formatPercent(summary.total_profitability_pct),
      icon: TrendingUp,
      footer: `${formatCurrency(profitabilityValue)} de lucro`,
      positive: summary.total_profitability_pct >= 0,
    },
    {
      label: "Dividendos (mês)",
      value: formatCurrency(summary.monthly_dividends),
      icon: Coins,
      footer: `${formatPercent(summary.monthly_dividends_change_pct)} vs mês anterior`,
      positive: summary.monthly_dividends_change_pct >= 0,
    },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {cards.map((card) => {
        const Icon = card.icon
        const TrendIcon = card.positive === false ? ArrowDownRight : ArrowUpRight
        return (
          <motion.div
            key={card.label}
            variants={fadeUp}
            transition={defaultTransition}
            whileHover={cardHover.whileHover}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--color-muted)]">{card.label}</p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/15">
                    <Icon className="h-4 w-4 text-[var(--color-accent)]" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight">
                  {card.value}
                </p>
                <div
                  className={`mt-2 flex items-center gap-1 text-xs ${
                    card.positive === false
                      ? "text-[var(--color-danger)]"
                      : card.positive
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  {card.positive !== undefined && <TrendIcon className="h-3.5 w-3.5" />}
                  <span>{card.footer}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
