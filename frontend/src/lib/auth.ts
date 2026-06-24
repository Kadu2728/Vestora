import { api, tokenStorage } from "@/lib/api"
import type { TokenResponse, User } from "@/types/api"

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export async function registerUser(payload: RegisterPayload): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/register", payload)
  tokenStorage.setTokens(data.access_token, data.refresh_token)
  return data
}

export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", payload)
  tokenStorage.setTokens(data.access_token, data.refresh_token)
  return data
}

export async function loginAsDemo(): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/demo")
  tokenStorage.setTokens(data.access_token, data.refresh_token)
  return data
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/users/me")
  return data
}

export function logoutUser(): void {
  tokenStorage.clear()
}
