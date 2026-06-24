from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any

import bcrypt
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from app.core.config import settings


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


def hash_password(plain_password: str) -> str:
    """Gera o hash bcrypt de uma senha em texto puro."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto puro corresponde ao hash armazenado."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except ValueError:
        return False


def _create_token(subject: str, token_type: TokenType, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type.value,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(subject: str) -> str:
    return _create_token(
        subject,
        TokenType.ACCESS,
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(subject: str) -> str:
    return _create_token(
        subject,
        TokenType.REFRESH,
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


class TokenPayload:
    def __init__(self, subject: str, token_type: TokenType):
        self.subject = subject
        self.token_type = token_type


class InvalidTokenException(Exception):
    pass


def decode_token(token: str, expected_type: TokenType) -> TokenPayload:
    """Decodifica e valida um JWT, garantindo que é do tipo esperado."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
    except ExpiredSignatureError as exc:
        raise InvalidTokenException("Token expirado") from exc
    except InvalidTokenError as exc:
        raise InvalidTokenException("Token inválido") from exc

    if payload.get("type") != expected_type.value:
        raise InvalidTokenException("Tipo de token inválido")

    subject = payload.get("sub")
    if not subject:
        raise InvalidTokenException("Token sem 'subject'")

    return TokenPayload(subject=subject, token_type=expected_type)
