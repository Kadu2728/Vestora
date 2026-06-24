"use client"

import { motion } from "framer-motion"
import { Link2, LayoutDashboard, Rocket } from "lucide-react"

import { Container } from "@/components/layout/container"
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations"

const STEPS = [
  {
    icon: Link2,
    title: "Conecte sua corretora",
    description:
      "Integração somente leitura em segundos. Suportamos as principais corretoras do Brasil.",
  },
  {
    icon: LayoutDashboard,
    title: "Veja tudo consolidado",
    description:
      "Patrimônio, dividendos e rentabilidade organizados automaticamente em um painel único.",
  },
  {
    icon: Rocket,
    title: "Tome decisões melhores",
    description:
      "Acompanhe a evolução da carteira em tempo real e ajuste sua estratégia com dados, não com achismo.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 md:py-32">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            transition={defaultTransition}
            className="text-3xl font-bold tracking-tight md:text-5xl"
          >
            Como funciona
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ ...defaultTransition, delay: 0.1 }}
            className="mt-4 text-lg leading-relaxed text-[var(--color-muted)]"
          >
            Em três passos simples, sua carteira inteira fica visível.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                transition={defaultTransition}
                className="relative"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
                    <Icon className="h-5 w-5 text-[var(--color-accent)]" />
                  </span>
                  <span className="text-sm font-mono text-[var(--color-muted)]">
                    Passo {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] max-w-sm">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}
