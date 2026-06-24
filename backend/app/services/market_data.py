"""
Serviço de cotações de mercado.

Em produção, busca preços reais via brapi.dev (API pública para ativos da B3).
Caso a requisição externa falhe (rate limit, ticker não suportado, ambiente
sem acesso à internet), cai para um preço simulado com pequena variação —
garantindo que a conta de teste grátis sempre tenha dados para mostrar.
"""

import asyncio
import random
import time

import httpx

from app.core.config import settings


class MarketDataService:
    # Cache simples em memória: ticker -> (preço, timestamp da última busca)
    _cache: dict[str, tuple[float, float]] = {}
    _lock = asyncio.Lock()

    @classmethod
    async def get_quote(cls, ticker: str) -> float:
        now = time.time()
        cached = cls._cache.get(ticker)
        if cached and (now - cached[1]) < settings.MARKET_DATA_CACHE_TTL_SECONDS:
            return cached[0]

        price = await cls._fetch_from_provider(ticker)

        async with cls._lock:
            cls._cache[ticker] = (price, now)
        return price

    @classmethod
    async def get_quotes(cls, tickers: list[str]) -> dict[str, float]:
        unique_tickers = list(dict.fromkeys(tickers))
        prices = await asyncio.gather(*(cls.get_quote(t) for t in unique_tickers))
        return dict(zip(unique_tickers, prices))

    @classmethod
    async def _fetch_from_provider(cls, ticker: str) -> float:
        url = f"{settings.MARKET_DATA_BASE_URL}/quote/{ticker}"
        params = {"token": settings.MARKET_DATA_API_TOKEN} if settings.MARKET_DATA_API_TOKEN else {}

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                payload = response.json()
                results = payload.get("results") or []
                if not results:
                    raise ValueError("Ticker sem resultados no provedor")
                price = results[0].get("regularMarketPrice")
                if price is None:
                    raise ValueError("Provedor não retornou preço")
                return float(price)
        except Exception:
            # Provedor indisponível, ticker não suportado, sem internet, etc.
            # Não deixamos o dashboard quebrar — caímos para o simulador.
            return cls._simulated_price(ticker)

    @staticmethod
    def _simulated_price(ticker: str) -> float:
        """Preço determinístico por ticker + pequena variação, para ambiente de demo."""
        base = (sum(ord(char) for char in ticker) % 250) + 8
        jitter = random.uniform(-0.6, 0.6)
        return round(base + jitter, 2)
