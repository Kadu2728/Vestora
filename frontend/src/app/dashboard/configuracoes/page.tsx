"use client"

import Link from "next/link"
import { LogOut, Mail, User as UserIcon, Crown } from "lucide-react"

import { Topbar } from "@/components/dashboard/topbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const PLAN_LABEL: Record<string, string> = {
  trial: "Teste grátis",
  free: "Gratuito",
  investidor: "Investidor",
  pro: "Pro",
}

export default function ConfiguracoesPage() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <>
      <Topbar title="Configurações" />
      <main className="max-w-2xl space-y-6 p-6 lg:p-10">
        <Card>
          <CardHeader>
            <CardTitle>Sua conta</CardTitle>
            <CardDescription>Informações da sua conta Vestora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <UserIcon className="h-4 w-4 text-[var(--color-muted)]" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-[var(--color-muted)]" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Crown className="h-4 w-4 text-[var(--color-muted)]" />
              <Badge variant={user.has_active_access ? "success" : "muted"}>
                {user.is_demo ? "Conta demo" : PLAN_LABEL[user.plan]}
              </Badge>
              {user.is_trial_active && user.trial_ends_at && !user.is_demo && (
                <span className="text-xs text-[var(--color-muted)]">
                  até {new Date(user.trial_ends_at).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
            {user.is_demo && (
              <p className="text-sm text-[var(--color-muted)]">
                Esta é uma conta de demonstração com dados fictícios. Para guardar sua
                carteira de verdade,{" "}
                <Link href="/register" className="font-medium text-[var(--color-accent)] hover:underline">
                  crie uma conta real
                </Link>
                .
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessão</CardTitle>
            <CardDescription>Encerrar sua sessão neste dispositivo</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="danger" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sair da conta
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
