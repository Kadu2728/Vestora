"""Teste de fumaça (smoke test): exercita o fluxo completo da API ponta a ponta."""


def test_register_starts_with_empty_portfolio(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"name": "Kadu Teste", "email": "kadu@vestora.com", "password": "senha12345"},
    )
    assert response.status_code == 201
    tokens = response.json()
    assert "access_token" in tokens

    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    holdings = client.get("/api/v1/holdings", headers=headers)
    assert holdings.status_code == 200
    assert holdings.json() == []  # conta real nasce zerada

    summary = client.get("/api/v1/portfolio/summary", headers=headers)
    assert summary.status_code == 200
    assert summary.json()["total_patrimony"] == 0


def test_demo_account_comes_prefilled(client):
    response = client.post("/api/v1/auth/demo")
    assert response.status_code == 201
    tokens = response.json()

    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    holdings = client.get("/api/v1/holdings", headers=headers)
    assert holdings.status_code == 200
    assert len(holdings.json()) == 5  # carteira de exemplo da demo

    evolution = client.get("/api/v1/portfolio/evolution", headers=headers)
    assert len(evolution.json()) == 12


def test_each_demo_call_creates_an_isolated_account(client):
    first = client.post("/api/v1/auth/demo").json()
    second = client.post("/api/v1/auth/demo").json()
    assert first["access_token"] != second["access_token"]


def test_duplicate_email_is_rejected(client):
    payload = {"name": "Outro", "email": "duplicado@vestora.com", "password": "senha12345"}
    first = client.post("/api/v1/auth/register", json=payload)
    second = client.post("/api/v1/auth/register", json=payload)
    assert first.status_code == 201
    assert second.status_code == 409


def test_full_authenticated_flow(client):
    register = client.post(
        "/api/v1/auth/register",
        json={"name": "Ana Investidora", "email": "ana@vestora.com", "password": "senha12345"},
    )
    tokens = register.json()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    me = client.get("/api/v1/users/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["is_trial_active"] is True

    summary = client.get("/api/v1/portfolio/summary", headers=headers)
    assert summary.status_code == 200
    assert summary.json()["total_patrimony"] == 0  # zerado até o usuário adicionar ativos

    allocation = client.get("/api/v1/portfolio/allocation", headers=headers)
    assert allocation.status_code == 200
    assert allocation.json() == []

    dividends = client.get("/api/v1/dividends", headers=headers)
    assert dividends.status_code == 200
    assert dividends.json() == []


def test_add_holding_creates_snapshot_and_refresh_works(client):
    register = client.post(
        "/api/v1/auth/register",
        json={"name": "Bruno", "email": "bruno@vestora.com", "password": "senha12345"},
    )
    tokens = register.json()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    response = client.post(
        "/api/v1/holdings",
        json={
            "ticker": "BBAS3",
            "quantity": 100,
            "average_price": 26.50,
            "name": "Banco do Brasil ON",
            "asset_class": "acoes",
        },
        headers=headers,
    )
    assert response.status_code == 201
    assert response.json()["ticker"] == "BBAS3"

    # Adicionar o primeiro ativo já deve gerar o ponto de hoje na evolução
    evolution = client.get("/api/v1/portfolio/evolution", headers=headers)
    assert len(evolution.json()) == 1

    refresh = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert refresh.status_code == 200
    assert "access_token" in refresh.json()


def test_protected_route_requires_token(client):
    response = client.get("/api/v1/portfolio/summary")
    assert response.status_code == 401
