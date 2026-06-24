"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { fadeUp, defaultTransition } from "@/lib/animations"
import type { EvolutionPoint } from "@/types/api"

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const formattedLabel = label
    ? new Date(label).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : ""
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-[var(--shadow-md)]">
      <p className="text-xs text-[var(--color-muted)]">{formattedLabel}</p>
      <p className="text-sm font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export function EvolutionChart({ data }: { data: EvolutionPoint[] }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={defaultTransition}
    >
      <Card>
        <CardHeader>
          <CardTitle>Evolução do patrimônio</CardTitle>
          <CardDescription>Últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent className="pl-0">
          {data.length === 0 ? (
            <p className="py-16 text-center text-sm text-[var(--color-muted)]">
              Adicione seu primeiro ativo para começar a acompanhar a evolução da carteira.
            </p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="evolutionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: string) =>
                      new Date(value).toLocaleDateString("pt-BR", { month: "short" })
                    }
                  />
                  <YAxis
                    stroke="var(--color-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    width={48}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total_value"
                    stroke="var(--color-accent)"
                    strokeWidth={2.5}
                    fill="url(#evolutionGradient)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
