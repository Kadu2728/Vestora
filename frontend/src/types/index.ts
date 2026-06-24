export type AssetClass = "acoes" | "fiis" | "renda_fixa" | "cripto" | "internacional"

export type Asset = {
  id: string
  ticker: string
  name: string
  assetClass: AssetClass
  quantity: number
  averagePrice: number
  currentPrice: number
  totalInvested: number
  currentValue: number
  profitability: number
}

export type DividendEntry = {
  id: string
  ticker: string
  paymentDate: string
  amount: number
  type: "dividendo" | "jcp" | "rendimento"
}

export type PortfolioSnapshot = {
  date: string
  totalValue: number
}

export type PortfolioSummary = {
  totalPatrimony: number
  totalInvested: number
  totalProfitability: number
  monthlyDividends: number
  monthlyDividendsChange: number
}

export type AllocationSlice = {
  assetClass: AssetClass
  label: string
  value: number
  percentage: number
  color: string
}
