"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search, LogOut, ChevronDown, Sparkles } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function daysRemaining(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function Topbar({ title }: { title: string }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {user?.is_demo && (
        <div className="flex flex-wrap items-center justify-center gap-2 bg-[var(--color-accent)] px-4 py-2 text-center text-sm font-medium text-white">
          <Sparkles className="h-4 w-4" />
          Você está no modo demo — os dados são fictícios e não são salvos permanentemente.
          <Link href="/register" className="underline underline-offset-2 hover:no-underline">
            Criar minha conta real
          </Link>
        </div>
      )}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 px-6 py-4 backdrop-blur-xl lg:px-10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {user?.is_trial_active && user.trial_ends_at && !user.is_demo && (
            <Badge variant="default" className="hidden sm:inline-flex">
              Teste grátis · {daysRemaining(user.trial_ends_at)} dias restantes
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-muted)]">
            <Search className="h-4 w-4" />
            <span>Buscar ativo...</span>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-[var(--radius-md)] p-1 transition-colors hover:bg-[var(--color-surface)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-sm font-semibold text-[var(--color-accent)]">
                {user?.name.charAt(0).toUpperCase() ?? "?"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--color-muted)]" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-[var(--shadow-lg)]">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium">{user?.name}</p>
                    <p className="truncate text-xs text-[var(--color-muted)]">{user?.email}</p>
                  </div>
                  {user?.is_demo && (
                    <div className="px-1.5 pb-1.5">
                      <Button size="sm" className="w-full" asChild>
                        <Link href="/register">Criar conta real</Link>
                      </Button>
                    </div>
                  )}
                  <div className="my-1 h-px bg-[var(--color-border)]" />
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
