"use client"

import { motion } from "framer-motion"
import { Coins } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { fadeUp, defaultTransition } from "@/lib/animations"
import type { Dividend, DividendType } from "@/types/api"

const TYPE_LABEL: Record<DividendType, string> = {
  dividendo: "Dividendo",
  jcp: "JCP",
  rendimento: "Rendimento",
}

export function DividendsList({ dividends }: { dividends: Dividend[] }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ ...defaultTransition, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Dividendos recentes</CardTitle>
          <CardDescription>Últimos pagamentos recebidos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {dividends.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--color-muted)]">
              Nenhum dividendo recebido ainda.
            </p>
          ) : (
            dividends.map((dividend) => (
              <div
                key={dividend.id}
                className="flex items-center justify-between rounded-[var(--radius-md)] px-2 py-3 transition-colors hover:bg-[var(--color-surface-2)]/50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-success)]/15">
                    <Coins className="h-4 w-4 text-[var(--color-success)]" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{dividend.ticker}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {new Date(dividend.payment_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--color-success)]">
                    +{formatCurrency(dividend.amount)}
                  </p>
                  <Badge variant="muted" className="mt-0.5">
                    {TYPE_LABEL[dividend.type]}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
