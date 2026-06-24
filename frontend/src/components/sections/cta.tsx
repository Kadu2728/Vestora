"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { fadeUp, defaultTransition } from "@/lib/animations"

export function CTA() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={defaultTransition}
          className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-16 text-center md:px-16 md:py-24"
        >
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--color-accent)" }}
          />

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={defaultTransition}
            className="relative text-3xl font-bold tracking-tight md:text-5xl"
          >
            Sua carteira merece mais clareza
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...defaultTransition, delay: 0.1 }}
            className="relative mx-auto mt-4 max-w-xl text-lg text-[var(--color-muted)]"
          >
            Conecte sua corretora em minutos e veja seu patrimônio, dividendos e
            rentabilidade em um só painel.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...defaultTransition, delay: 0.2 }}
            className="relative mt-10"
          >
            <Button size="lg" asChild>
              <Link href="/register">
                Começar gratuitamente
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
