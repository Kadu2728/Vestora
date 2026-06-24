# Vestora API

Backend da plataforma Vestora — acompanhamento de patrimônio, dividendos e
rentabilidade de carteiras de ações, FIIs e ETFs em tempo real.

**Stack:** FastAPI · SQLAlchemy · Pydantic v2 · JWT · Alembic · PostgreSQL (Neon)

---

## 1. Rodando localmente

### Pré-requisitos
- Python 3.11+
- (Opcional para produção) uma conta no [Neon](https://neon.tech) para PostgreSQL

### Passo a passo

```bash
# 1. Crie e ative o ambiente virtual
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 2. Instale as dependências
pip install -r requirements.txt

# 3. Copie o .env de exemplo
cp .env.example .env
# Por padrão já vem configurado com SQLite — funciona sem precisar de Postgres

# 4. Rode as migrations
alembic upgrade head

# 5. Suba o servidor
uvicorn app.main:app --reload
```

A API sobe em `http://localhost:8000`. Documentação interativa (Swagger) em
`http://localhost:8000/docs`.

### Testando rapidamente

```bash
# Cadastro (já cria uma carteira de demonstração automaticamente)
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Seu Nome","email":"voce@email.com","password":"senha12345"}'
```

A resposta traz `access_token` e `refresh_token`. Use o `access_token` no
header `Authorization: Bearer <token>` para acessar `/api/v1/portfolio/summary`,
`/api/v1/holdings`, etc.

---

## 2. Testes automatizados

```bash
pip install -r requirements-dev.txt
pytest -v
```

Os testes usam um banco SQLite isolado (`test_vestora.db`), criado e destruído
automaticamente — não tocam no seu banco de desenvolvimento.

---

## 3. Estrutura do projeto

```
app/
  core/        # configurações (.env), segurança (hash de senha, JWT)
  db/          # engine e sessão do SQLAlchemy
  models/      # tabelas (User, Asset, Holding, Transaction, DividendPayment, PortfolioSnapshot)
  schemas/     # contratos Pydantic de entrada/saída da API
  services/    # regras de negócio (cotações, cálculo de carteira, seed de demo)
  api/v1/      # rotas da API
alembic/       # migrations do banco
tests/         # testes automatizados (pytest)
```

---

## 4. Funcionalidades

- **Cadastro real começa zerado** — todo novo usuário entra no plano
  `trial` por 14 dias (configurável via `TRIAL_DURATION_DAYS`), mas a
  carteira começa **vazia**: o próprio usuário adiciona seus ativos reais
  desde o início. Nenhum dado fictício é inserido no cadastro.
- **Conta demo isolada** — `POST /auth/demo` cria uma conta descartável
  (`is_demo=true`), já populada com uma carteira de exemplo (ações, FIIs,
  ETF, dividendos e 12 meses de evolução simulada), para quem só quer ver o
  produto funcionando sem se cadastrar. Cada chamada gera uma conta nova e
  isolada — visitantes não compartilham dados entre si.
- **Evolução patrimonial real** — toda vez que o usuário adiciona/atualiza
  um ativo, um snapshot do patrimônio do dia é gravado automaticamente
  (`PortfolioService.record_daily_snapshot`). O gráfico de evolução cresce
  organicamente com o uso real, em vez de vir pré-preenchido.
- **Cotações em tempo real** — `MarketDataService` busca preços via
  [brapi.dev](https://brapi.dev) (API pública para ativos da B3), com cache
  de 60s e fallback automático para um preço simulado caso o provedor externo
  esteja indisponível (a carteira nunca fica "quebrada").
- **WebSocket de atualização contínua** — `ws://.../api/v1/ws/portfolio?token=<access_token>`
  envia o resumo da carteira e as cotações atualizadas a cada 5 segundos,
  para o dashboard reagir sem precisar dar refresh.
- **Autenticação JWT** com access token (30 min) + refresh token (7 dias).

---

## 5. Deploy em produção

### Banco de dados — Neon (PostgreSQL)
1. Crie um projeto em [neon.tech](https://neon.tech).
2. Copie a connection string e ajuste o driver para `postgresql+psycopg2://...`.
3. Defina essa URL como `DATABASE_URL` nas variáveis de ambiente do backend.

### Backend — Render ou Railway
1. Conecte o repositório do backend.
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Rode as migrations uma vez após o primeiro deploy (ou configure como
   "release command"): `alembic upgrade head`
5. Variáveis de ambiente obrigatórias:
   - `DATABASE_URL` (a do Neon)
   - `SECRET_KEY` (gere com `python -c "import secrets; print(secrets.token_hex(32))"`)
   - `ENVIRONMENT=production`
   - `CORS_ORIGINS` (URL do frontend na Vercel)

### Frontend — Vercel
Configure a variável `NEXT_PUBLIC_API_URL` apontando para a URL pública do
backend (Render/Railway).

---

## 6. Notas importantes

- Em `ENVIRONMENT=development`, a aplicação cria as tabelas automaticamente
  via `create_all` como rede de segurança. **Em produção, use sempre
  `alembic upgrade head`** — não dependa do `create_all`.
- O provedor de cotações (brapi.dev) é gratuito e não exige chave para a
  maioria dos tickers da B3. Se enfrentar rate limit, defina
  `MARKET_DATA_API_TOKEN` com uma chave gratuita gerada no site deles.
