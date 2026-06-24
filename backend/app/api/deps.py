from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import InvalidTokenException, TokenType, decode_token
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if token is None:
        raise credentials_exception

    try:
        payload = decode_token(token, expected_type=TokenType.ACCESS)
    except InvalidTokenException as exc:
        raise credentials_exception from exc

    user = db.get(User, payload.subject)
    if user is None or not user.is_active:
        raise credentials_exception

    return user


def get_current_active_user(user: User = Depends(get_current_user)) -> User:
    if not user.has_active_access:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Seu período de teste grátis terminou. Assine um plano para continuar.",
        )
    return user
