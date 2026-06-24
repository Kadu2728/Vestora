"use client"

import { motion } from "framer-motion"

import { Container } from "@/components/layout/container"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations"

const STATS = [
  { value: 38000, suffix: "+", label: "Investidores ativos" },
  { value: 1.2, decimals: 1, prefix: "R$ ", suffix: "B", label: "Patrimônio monitorado" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Uptime da plataforma" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Avaliação média" },
]

export function Stats() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={defaultTransition}
              className="text-center"
            >
              <p className="text-4xl font-black tracking-tight md:text-5xl">
                <AnimatedCounter
                  target={stat.value}
                  decimals={stat.decimals ?? 0}
                  prefix={stat.prefix ?? ""}
                  suffix={stat.suffix ?? ""}
                />
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
