"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  fetchCurrentUser,
  loginAsDemo,
  loginUser,
  logoutUser,
  registerUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/auth"
import { tokenStorage } from "@/lib/api"
import type { User } from "@/types/api"

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  loginDemo: () => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    if (!tokenStorage.getAccessToken()) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
    } catch {
      tokenStorage.clear()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carregamento inicial da sessão é intencional
    refreshUser()
  }, [refreshUser])

  const login = useCallback(
    async (payload: LoginPayload) => {
      await loginUser(payload)
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
      router.push("/dashboard")
    },
    [router]
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerUser(payload)
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
      router.push("/dashboard")
    },
    [router]
  )

  const loginDemo = useCallback(async () => {
    await loginAsDemo()
    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
    router.push("/dashboard")
  }, [router])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        loginDemo,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>")
  }
  return context
}
