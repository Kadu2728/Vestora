"use client"

import { motion } from "framer-motion"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { fadeUp, defaultTransition } from "@/lib/animations"
import type { AssetClass, HoldingWithQuote } from "@/types/api"

const CLASS_LABEL: Record<AssetClass, string> = {
  acoes: "Ações",
  fiis: "FIIs",
  etf: "ETFs",
  renda_fixa: "Renda Fixa",
  cripto: "Cripto",
  internacional: "Internacional",
}

export function HoldingsTable({ holdings }: { holdings: HoldingWithQuote[] }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ ...defaultTransition, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Seus ativos</CardTitle>
          <CardDescription>Posição consolidada por ativo</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          {holdings.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-[var(--color-muted)]">
              Você ainda não tem ativos na carteira.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                    <th className="px-6 py-3 font-medium">Ativo</th>
                    <th className="px-6 py-3 font-medium">Classe</th>
                    <th className="px-6 py-3 font-medium text-right">Quantidade</th>
                    <th className="px-6 py-3 font-medium text-right">Valor atual</th>
                    <th className="px-6 py-3 font-medium text-right">Rentabilidade</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => (
                    <tr
                      key={holding.id}
                      className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-2)]/40"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium">{holding.ticker}</p>
                        <p className="text-xs text-[var(--color-muted)]">{holding.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="muted">{CLASS_LABEL[holding.asset_class]}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--color-muted)]">
                        {holding.quantity.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {formatCurrency(holding.current_value)}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-medium ${
                          holding.profitability_pct >= 0
                            ? "text-[var(--color-success)]"
                            : "text-[var(--color-danger)]"
                        }`}
                      >
                        {formatPercent(holding.profitability_pct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
