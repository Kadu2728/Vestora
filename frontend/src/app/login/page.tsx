"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { LineChart, Loader2, AlertCircle, Sparkles } from "lucide-react"
import { isAxiosError } from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"

export default function LoginPage() {
  const { login, loginDemo } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    setIsSubmitting(true)
    try {
      await login(values)
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.detail) {
        setServerError(error.response.data.detail)
      } else {
        setServerError("Não foi possível entrar. Tente novamente.")
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
          <h1 className="text-2xl font-bold tracking-tight">Entrar na sua conta</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Acompanhe sua carteira em tempo real.
          </p>

          {serverError && (
            <div className="mt-5 flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3.5 py-3 text-sm text-[var(--color-danger)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-[var(--color-danger)]">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Entrar
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
            Testar com conta demo
          </Button>
          <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
            Sem cadastro — entra direto com uma carteira de exemplo já populada.
          </p>

          <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
            Ainda não tem conta?{" "}
            <Link href="/register" className="font-medium text-[var(--color-accent)] hover:underline">
              Comece seu teste grátis
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
