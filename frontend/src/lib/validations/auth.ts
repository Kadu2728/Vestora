import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome completo"),
    email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
