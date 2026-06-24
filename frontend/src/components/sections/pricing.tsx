"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    name: "Starter",
    price: "Grátis",
    description: "Para começar a organizar sua carteira.",
    features: [
      "Até 10 ativos",
      "Patrimônio consolidado",
      "Histórico de 3 meses",
      "1 corretora conectada",
    ],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Investidor",
    price: "R$ 29",
    period: "/mês",
    description: "Para quem acompanha a carteira de perto.",
    features: [
      "Ativos ilimitados",
      "Dividendos e proventos detalhados",
      "Comparação com CDI e IBOVESPA",
      "Histórico completo",
      "Corretoras ilimitadas",
      "Alertas inteligentes",
    ],
    cta: "Assinar Investidor",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "R$ 59",
    period: "/mês",
    description: "Para investidores avançados e consultores.",
    features: [
      "Tudo do plano Investidor",
      "Relatórios em PDF",
      "Múltiplas carteiras",
      "Exportação de dados",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="planos" className="py-24 md:py-32">
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
            Planos para cada tipo de investidor
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ ...defaultTransition, delay: 0.1 }}
            className="mt-4 text-lg leading-relaxed text-[var(--color-muted)]"
          >
            Comece de graça. Faça upgrade quando sua carteira crescer.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              transition={defaultTransition}
              whileHover={{ y: -6 }}
              className={cn(
                "relative rounded-[var(--radius-lg)] border p-8",
                plan.highlighted
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] shadow-[var(--shadow-glow)] md:-translate-y-4"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-8" variant="default">
                  Mais popular
                </Badge>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-[var(--color-muted)]">
                    {plan.period}
                  </span>
                )}
              </div>

              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? "default" : "secondary"}
                asChild
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                    <span className="text-[var(--color-muted)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
