import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

const ACCESS_TOKEN_KEY = "vestora_access_token"
const REFRESH_TOKEN_KEY = "vestora_refresh_token"

export const tokenStorage = {
  getAccessToken: () => (typeof window === "undefined" ? null : localStorage.getItem(ACCESS_TOKEN_KEY)),
  getRefreshToken: () => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_TOKEN_KEY)),
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
})

// Anexa o access token em toda requisição
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Se o access token expirar (401), tenta renovar com o refresh token UMA vez.
// Várias requisições simultâneas compartilham a mesma renovação em andamento.
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken })
    const { access_token, refresh_token } = response.data
    tokenStorage.setTokens(access_token, refresh_token)
    return access_token
  } catch {
    tokenStorage.clear()
    return null
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })

      const newToken = await refreshPromise
      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }

      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)
