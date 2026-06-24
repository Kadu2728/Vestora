"use client"

import { motion } from "framer-motion"
import {
  Wallet,
  TrendingUp,
  Coins,
  PieChart,
  Bell,
  ShieldCheck,
} from "lucide-react"

import { Container } from "@/components/layout/container"
import { fadeUp, staggerContainer, defaultTransition, cardHover } from "@/lib/animations"

const FEATURES = [
  {
    icon: Wallet,
    title: "Patrimônio consolidado",
    description:
      "Veja o valor total da sua carteira somando ações, FIIs, renda fixa e cripto em um único número, atualizado em tempo real.",
    span: "lg:col-span-2",
  },
  {
    icon: Coins,
    title: "Dividendos e proventos",
    description:
      "Histórico completo de dividendos, JCP e rendimentos recebidos por ativo e por mês.",
    span: "",
  },
  {
    icon: TrendingUp,
    title: "Rentabilidade real",
    description:
      "Compare sua rentabilidade com CDI, IBOVESPA e IFIX automaticamente.",
    span: "",
  },
  {
    icon: PieChart,
    title: "Evolução da carteira",
    description:
      "Gráficos de evolução patrimonial e alocação por classe de ativo, dia a dia.",
    span: "lg:col-span-2",
  },
  {
    icon: Bell,
    title: "Alertas inteligentes",
    description: "Receba alertas de preço, vencimento e novos pagamentos.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Dados criptografados",
    description: "Conexão somente leitura com suas corretoras, com criptografia de ponta a ponta.",
    span: "",
  },
]

export function Features() {
  return (
    <section id="funcionalidades" className="py-24 md:py-32">
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
            Tudo que você precisa para investir com clareza
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ ...defaultTransition, delay: 0.1 }}
            className="mt-4 text-lg leading-relaxed text-[var(--color-muted)]"
          >
            Substitua planilhas manuais por um painel único, sempre atualizado.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                transition={defaultTransition}
                whileHover={cardHover.whileHover}
                className={`group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition-colors hover:border-[var(--color-border-hover)] ${feature.span}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/15 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6 text-[var(--color-accent)]" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}
