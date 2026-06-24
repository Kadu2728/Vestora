import Link from "next/link"
import { LineChart } from "lucide-react"

import { Container } from "@/components/layout/container"

const COLUMNS = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "#funcionalidades" },
      { label: "Planos", href: "#planos" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Carreiras", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "#" },
      { label: "Termos de uso", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]">
                <LineChart className="h-4 w-4 text-white" />
              </span>
              <span className="text-base font-bold tracking-tight">Vestora</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
              Acompanhe patrimônio, dividendos e rentabilidade da sua carteira em
              tempo real, em um só lugar.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-[var(--color-text)]">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row">
          <p className="text-sm text-[var(--color-muted)]">
            © {new Date().getFullYear()} Vestora. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Feito no Brasil 🇧🇷
          </p>
        </div>
      </Container>
    </footer>
  )
}
