"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, TrendingUp, Wallet, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/layout/container"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { fadeUp, fadeRight, staggerContainer, defaultTransition } from "@/lib/animations"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32">
      {/* Glow de fundo */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-accent)" }}
      />

      <Container className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} transition={defaultTransition}>
            <Badge variant="default">
              <Sparkles className="h-3.5 w-3.5" />
              Sua carteira, em tempo real
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ ...defaultTransition, delay: 0.05 }}
            className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl"
          >
            Acompanhe seu{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              patrimônio
            </span>{" "}
            sem planilhas
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ ...defaultTransition, delay: 0.1 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]"
          >
            O Vestora consolida ações, FIIs, renda fixa e cripto em um só painel.
            Veja dividendos, rentabilidade e a evolução da sua carteira
            atualizados em tempo real.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ ...defaultTransition, delay: 0.15 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/register">
                Começar gratuitamente
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#como-funciona">Ver como funciona</a>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ ...defaultTransition, delay: 0.2 }}
            className="mt-4 text-sm text-[var(--color-muted)]"
          >
            Sem cartão de crédito • Cancele quando quiser
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          transition={{ ...defaultTransition, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">
                  Patrimônio total
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  <AnimatedCounter
                    target={284750}
                    prefix="R$ "
                    decimals={2}
                  />
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/15">
                <Wallet className="h-5 w-5 text-[var(--color-accent)]" />
              </span>
            </div>

            <div className="mt-6 flex items-end gap-1.5 h-28">
              {[40, 55, 48, 62, 58, 70, 65, 78, 74, 88, 82, 95].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.04, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-1 rounded-t-[4px] bg-gradient-to-t from-[var(--color-accent)]/40 to-[var(--color-accent)]"
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-4">
                <div className="flex items-center gap-1.5 text-[var(--color-success)]">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold">+18,4%</span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  Rentabilidade (12m)
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  R$ 1.247,30
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  Dividendos este mês
                </p>
              </div>
            </div>
          </div>

          {/* Card flutuante de notificação */}
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -bottom-6 -left-6 hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-md)] sm:flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-success)]/15">
              <TrendingUp className="h-4 w-4 text-[var(--color-success)]" />
            </span>
            <div>
              <p className="text-sm font-medium">PETR4 +3,2%</p>
              <p className="text-xs text-[var(--color-muted)]">Hoje</p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
