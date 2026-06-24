import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type {
  AllocationSlice,
  Dividend,
  EvolutionPoint,
  HoldingWithQuote,
  PortfolioSummary,
} from "@/types/api"

const REFETCH_INTERVAL_MS = 30_000 // mantém o dashboard "vivo" sem precisar de F5

export function usePortfolioSummary() {
  return useQuery({
    queryKey: ["portfolio", "summary"],
    queryFn: async () => {
      const { data } = await api.get<PortfolioSummary>("/portfolio/summary")
      return data
    },
    refetchInterval: REFETCH_INTERVAL_MS,
  })
}

export function useHoldings() {
  return useQuery({
    queryKey: ["holdings"],
    queryFn: async () => {
      const { data } = await api.get<HoldingWithQuote[]>("/holdings")
      return data
    },
    refetchInterval: REFETCH_INTERVAL_MS,
  })
}

export function useAllocation() {
  return useQuery({
    queryKey: ["portfolio", "allocation"],
    queryFn: async () => {
      const { data } = await api.get<AllocationSlice[]>("/portfolio/allocation")
      return data
    },
    refetchInterval: REFETCH_INTERVAL_MS,
  })
}

export function useEvolution(days = 365) {
  return useQuery({
    queryKey: ["portfolio", "evolution", days],
    queryFn: async () => {
      const { data } = await api.get<EvolutionPoint[]>("/portfolio/evolution", {
        params: { days },
      })
      return data
    },
  })
}

export function useDividends() {
  return useQuery({
    queryKey: ["dividends"],
    queryFn: async () => {
      const { data } = await api.get<Dividend[]>("/dividends")
      return data
    },
  })
}

export type AddHoldingPayload = {
  ticker: string
  quantity: number
  average_price: number
  name?: string
  asset_class?: string
}

export function useAddHolding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddHoldingPayload) => {
      const { data } = await api.post<HoldingWithQuote>("/holdings", payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holdings"] })
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
    },
  })
}
