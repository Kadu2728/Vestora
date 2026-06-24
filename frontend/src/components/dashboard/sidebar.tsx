"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LineChart,
  LayoutDashboard,
  Wallet,
  Coins,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const NAV_ITEMS = [
  { label: "Visão geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Carteira", href: "/dashboard/carteira", icon: Wallet },
  { label: "Dividendos", href: "/dashboard/dividendos", icon: Coins },
  { label: "Alocação", href: "/dashboard/alocacao", icon: PieChart },
  { label: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[var(--color-border)] bg-[var(--color-surface)]/50">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] shadow-[var(--shadow-glow)]">
          <LineChart className="h-5 w-5 text-white" />
        </span>
        <span className="text-lg font-bold tracking-tight">Vestora</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-[var(--color-text)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]/60"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[var(--radius-md)] bg-[var(--color-surface-2)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 px-3 pb-6">
        {user && (
          <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-xs font-semibold text-[var(--color-accent)]">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{user.name}</p>
              <p className="truncate text-xs text-[var(--color-muted)]">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]/60 hover:text-[var(--color-text)]"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
