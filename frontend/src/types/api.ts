// Tipos que espelham 1:1 os schemas Pydantic do backend (app/schemas/*.py)
// Mantemos os mesmos nomes de campo (snake_case) para evitar uma camada de
// mapeamento — o que vem da API é exatamente o que os componentes recebem.

export type AssetClass = "acoes" | "fiis" | "etf" | "renda_fixa" | "cripto" | "internacional"

export type User = {
  id: string
  name: string
  email: string
  plan: "trial" | "free" | "investidor" | "pro"
  is_verified: boolean
  is_demo: boolean
  trial_ends_at: string | null
  is_trial_active: boolean
  has_active_access: boolean
}

export type TokenResponse = {
  access_token: string
  refresh_token: string
  token_type: string
}

export type PortfolioSummary = {
  total_patrimony: number
  total_invested: number
  total_profitability_pct: number
  monthly_dividends: number
  monthly_dividends_change_pct: number
  last_updated: string
}

export type AllocationSlice = {
  asset_class: AssetClass
  label: string
  value: number
  percentage: number
}

export type EvolutionPoint = {
  date: string
  total_value: number
}

export type HoldingWithQuote = {
  id: string
  ticker: string
  name: string
  asset_class: AssetClass
  quantity: number
  average_price: number
  current_price: number
  total_invested: number
  current_value: number
  profitability_pct: number
}

export type DividendType = "dividendo" | "jcp" | "rendimento"

export type Dividend = {
  id: string
  ticker: string
  type: DividendType
  amount: number
  payment_date: string
}
