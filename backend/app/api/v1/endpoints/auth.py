from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    InvalidTokenException,
    TokenType,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.base import generate_uuid
from app.models.user import PlanType, User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.services.demo_seed import seed_demo_portfolio

router = APIRouter()


def _issue_tokens(user_id: str) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(subject=user_id),
        refresh_token=create_refresh_token(subject=user_id),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe uma conta com este e-mail",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        plan=PlanType.TRIAL,
        trial_ends_at=User.new_trial_expiry(),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe uma conta com este e-mail",
        ) from exc
    db.refresh(user)

    # Conta real: começa completamente zerada — o usuário cadastra os
    # próprios ativos desde o início. (A carteira de exemplo só existe na
    # conta demo, criada via POST /auth/demo.)

    return _issue_tokens(user.id)


@router.post("/demo", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def login_as_demo(db: Session = Depends(get_db)) -> TokenResponse:
    """
    Cria uma conta demo descartável, já populada com uma carteira de exemplo,
    e devolve tokens prontos para uso — sem precisar preencher formulário.
    Cada chamada gera uma conta isolada (ninguém compartilha dados com outro
    visitante testando a demo).
    """
    demo_id = generate_uuid()[:8]
    user = User(
        name="Visitante Demo",
        email=f"demo-{demo_id}@vestora.com",
        hashed_password=hash_password(generate_uuid()),  # senha aleatória, não é usada
        plan=PlanType.TRIAL,
        trial_ends_at=User.new_trial_expiry(),
        is_demo=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    seed_demo_portfolio(db, user)

    return _issue_tokens(user.id)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="E-mail ou senha incorretos",
    )

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise invalid_credentials

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Conta desativada"
        )

    return _issue_tokens(user.id)


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)) -> TokenResponse:
    invalid_token = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token inválido ou expirado"
    )

    try:
        token_payload = decode_token(payload.refresh_token, expected_type=TokenType.REFRESH)
    except InvalidTokenException as exc:
        raise invalid_token from exc

    user = db.get(User, token_payload.subject)
    if user is None or not user.is_active:
        raise invalid_token

    return _issue_tokens(user.id)
