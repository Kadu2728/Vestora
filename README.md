# VESTORA

Plataforma SaaS de acompanhamento de carteira de investimentos — patrimônio,
dividendos, rentabilidade e evolução em tempo real (ações, FIIs e ETFs).

```
VESTORA/
├── frontend/   → Next.js 16, TypeScript, Tailwind v4, Framer Motion, Recharts
├── backend/    → FastAPI, SQLAlchemy, Pydantic, JWT, Alembic, PostgreSQL
└── vestora.code-workspace
```

O frontend já está **100% integrado** ao backend real: login, cadastro,
dashboard com dados reais, tudo funcionando de ponta a ponta.

---

## 🚀 Subindo o projeto completo (2 terminais)

### Terminal 1 — Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```
→ API em `http://localhost:8000` · Docs em `http://localhost:8000/docs`

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```
→ Site em `http://localhost:3000`

### Testando

1. Abra `http://localhost:3000`
2. Você tem duas opções:
   - **"Começar grátis"** → cria sua conta real, carteira **zerada** —
     você adiciona seus próprios ativos em `/dashboard/carteira`.
   - **"Testar com conta demo"** (na tela de login/cadastro) → entra
     direto, sem formulário, numa carteira de exemplo já populada
     (ações, FIIs, ETF, dividendos, 12 meses de evolução). Cada clique
     gera uma conta demo isolada só pra você.

Tanto o cadastro quanto o login redirecionam automaticamente; se você tentar
acessar `/dashboard` sem estar logado, é redirecionado para `/login`.

> ⚠️ O backend precisa estar rodando **antes** de você usar o site — se a API
> estiver fora, o cadastro/login mostra uma mensagem de erro amigável (não
> trava a página).

---

## Abrindo no VSCode (recomendado)

Dê duplo clique em **`vestora.code-workspace`** (ou no VSCode: `Arquivo → Abrir Workspace pelo Arquivo...`).
Isso abre frontend e backend lado a lado, cada um com o interpretador/linter
corretos já configurados, e extensões recomendadas (ESLint, Prettier, Tailwind
IntelliSense, Python, Pylance, Ruff) — o VSCode vai sugerir instalá-las.

No VSCode, com a pasta backend em foco, basta apertar **F5** pra subir o
servidor com debug (configuração já em `backend/.vscode/launch.json`).

---

## Como a integração funciona

- **`frontend/.env.local`** define `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
  — é só essa variável que conecta o front ao back.
- **Autenticação:** `src/lib/auth-context.tsx` guarda o usuário logado;
  tokens ficam no `localStorage` e são renovados automaticamente pelo
  interceptor do Axios (`src/lib/api.ts`) quando expiram.
- **Rotas protegidas:** `src/components/auth/auth-guard.tsx` redireciona pra
  `/login` quem tentar acessar `/dashboard/*` sem sessão válida.
- **Dados do dashboard:** `src/hooks/use-portfolio.ts` usa React Query pra
  buscar `/portfolio/summary`, `/holdings`, `/portfolio/allocation`,
  `/portfolio/evolution` e `/dividends` — atualiza sozinho a cada 30s.
- **Formulários:** login e cadastro usam React Hook Form + Zod
  (`src/lib/validations/`), com erros do backend exibidos na tela.

---

## Stack completa

| Camada      | Tecnologias |
|-------------|-------------|
| Frontend    | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Recharts · Axios · React Query · React Hook Form · Zod |
| Backend     | FastAPI · SQLAlchemy 2.0 · Pydantic v2 · JWT (PyJWT) · Alembic · PostgreSQL |
| Deploy      | Frontend → Vercel · Backend → Render/Railway · Banco → Neon PostgreSQL |

Detalhes de deploy em produção (Render/Railway + Neon + Vercel) estão em
[`backend/README.md`](./backend/README.md).

---

## Próximos passos sugeridos

- WebSocket de tempo real no front (o backend já expõe `ws://.../ws/portfolio`;
  hoje o front atualiza por polling a cada 30s via React Query, que é mais
  simples de manter)
- Página de recuperação de senha
- Upgrade de plano com pagamento real (hoje os planos pagos só levam ao cadastro)
- Navegação mobile no dashboard (a sidebar atual só aparece em telas ≥ lg)
