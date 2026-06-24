"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { LineChart, Loader2, AlertCircle, Check, Sparkles } from "lucide-react"
import { isAxiosError } from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth"

const TRIAL_HIGHLIGHTS = [
  "15 dias grátis, sem cartão de crédito",
  "Sua carteira começa zerada — você adiciona seus próprios ativos",
  "Cancele quando quiser",
]

export default function RegisterPage() {
  const { register: registerUser, loginDemo } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    setIsSubmitting(true)
    try {
      await registerUser(values)
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.detail) {
        setServerError(error.response.data.detail)
      } else {
        setServerError("Não foi possível criar sua conta. Tente novamente.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setServerError(null)
    setIsDemoLoading(true)
    try {
      await loginDemo()
    } catch {
      setServerError("Não foi possível abrir a conta demo. Tente novamente.")
    } finally {
      setIsDemoLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] shadow-[var(--shadow-glow)]">
            <LineChart className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight">Vestora</span>
        </Link>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-lg)]">
          <h1 className="text-2xl font-bold tracking-tight">Comece seu teste grátis</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Crie sua conta e veja sua carteira em segundos.
          </p>

          <ul className="mt-4 space-y-2">
            {TRIAL_HIGHLIGHTS.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                {highlight}
              </li>
            ))}
          </ul>

          {serverError && (
            <div className="mt-5 flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3.5 py-3 text-sm text-[var(--color-danger)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" placeholder="Seu nome" autoComplete="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-[var(--color-danger)]">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@email.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-[var(--color-danger)]">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-[var(--color-danger)]">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[var(--color-danger)]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar conta grátis
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-muted)]">ou</span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
          >
            {isDemoLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Só quero testar (conta demo)
          </Button>
          <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
            Sem cadastro — entra direto com uma carteira de exemplo já populada.
          </p>

          <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
