"use client"

import { motion } from "framer-motion"

import { Container } from "@/components/layout/container"

const BROKERS = [
  "XP Investimentos",
  "Clear",
  "Rico",
  "Inter Invest",
  "NuInvest",
  "BTG Pactual",
]

export function SocialProof() {
  return (
    <section className="border-y border-[var(--color-border)] py-10">
      <Container>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-[var(--color-muted)]"
        >
          Integra com as principais corretoras do Brasil
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {BROKERS.map((broker) => (
            <motion.span
              key={broker}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="text-base font-semibold text-[var(--color-muted)]/60 transition-colors hover:text-[var(--color-muted)]"
            >
              {broker}
            </motion.span>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
