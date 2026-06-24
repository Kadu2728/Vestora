"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { Container } from "@/components/layout/container"
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations"
import { cn } from "@/lib/utils"

const FAQS = [
  {
    question: "O Vestora tem acesso aos meus dados bancários?",
    answer:
      "Não. A conexão com sua corretora é somente leitura, usada apenas para consolidar a posição da sua carteira. O Vestora nunca movimenta dinheiro nem realiza operações em seu nome.",
  },
  {
    question: "Quais corretoras são suportadas?",
    answer:
      "Suportamos as principais corretoras do Brasil, incluindo XP, Clear, Rico, Inter Invest, NuInvest e BTG Pactual. Novas integrações são adicionadas continuamente.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Sim. Não há fidelidade. Você pode cancelar a assinatura a qualquer momento direto no painel, sem burocracia.",
  },
  {
    question: "Os dados são atualizados em tempo real?",
    answer:
      "Sim, o patrimônio, a rentabilidade e os dividendos são atualizados automaticamente conforme o mercado e suas corretoras informam novos dados.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 md:py-32">
      <Container className="max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.h2
            variants={fadeUp}
            transition={defaultTransition}
            className="text-3xl font-bold tracking-tight md:text-5xl"
          >
            Perguntas frequentes
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-12 space-y-3"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={faq.question}
                variants={fadeUp}
                transition={defaultTransition}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-muted)]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}
