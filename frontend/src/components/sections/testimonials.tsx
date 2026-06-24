"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Card, CardContent } from "@/components/ui/card"
import { fadeUp, staggerContainer, defaultTransition, cardHover } from "@/lib/animations"

const TESTIMONIALS = [
  {
    name: "Daiana D.",
    role: "Investidor pessoa física",
    quote:
      "Parei de atualizar planilha toda semana. Hoje abro o Vestora e já sei exatamente quanto recebi de dividendos no mês.",
  },
  {
    name: "Mayk M.",
    role: "Investidora em FIIs",
    quote:
      "A visão de evolução da carteira mudou como eu acompanho meus aportes. Consigo ver o impacto de cada compra no patrimônio total.",
  },
  {
    name: "Carlos E.",
    role: "Investidor de longo prazo",
    quote:
      "Comparar minha rentabilidade com o CDI direto no painel me ajudou a perceber que parte da carteira não estava valendo a pena.",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 md:py-32">
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
            Quem usa, recomenda
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={fadeUp}
              transition={defaultTransition}
              whileHover={cardHover.whileHover}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 text-[var(--color-accent)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]">
                    “{testimonial.quote}”
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-sm font-semibold text-[var(--color-accent)]">
                      {testimonial.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
