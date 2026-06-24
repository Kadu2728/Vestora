"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { fadeUp, defaultTransition } from "@/lib/animations"
import type { AllocationSlice, AssetClass } from "@/types/api"

// A API não envia cor — definimos uma paleta fixa por classe de ativo no front
const ASSET_CLASS_COLORS: Record<AssetClass, string> = {
  acoes: "var(--color-accent)",
  fiis: "#8b5cf6",
  etf: "#3b82f6",
  renda_fixa: "#22c55e",
  cripto: "#f59e0b",
  internacional: "#ec4899",
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: AllocationSlice }[]
}) {
  if (!active || !payload?.length) return null
  const slice = payload[0].payload
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-[var(--shadow-md)]">
      <p className="text-xs text-[var(--color-muted)]">{slice.label}</p>
      <p className="text-sm font-semibold">{formatCurrency(slice.value)}</p>
    </div>
  )
}

export function AllocationChart({ data }: { data: AllocationSlice[] }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ ...defaultTransition, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Alocação por classe</CardTitle>
          <CardDescription>Distribuição atual da carteira</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--color-muted)]">
              Adicione ativos para ver a alocação da carteira.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={54}
                      outerRadius={76}
                      paddingAngle={3}
                      animationDuration={800}
                    >
                      {data.map((slice) => (
                        <Cell
                          key={slice.asset_class}
                          fill={ASSET_CLASS_COLORS[slice.asset_class]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-2.5">
                {data.map((slice) => (
                  <div
                    key={slice.asset_class}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] px-1 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: ASSET_CLASS_COLORS[slice.asset_class] }}
                      />
                      <span className="truncate text-[var(--color-muted)]">{slice.label}</span>
                    </div>
                    <span className="shrink-0 font-medium tabular-nums">{slice.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
