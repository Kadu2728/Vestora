import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

from app.core.security import InvalidTokenException, TokenType, decode_token
from app.db.session import SessionLocal
from app.models.user import User
from app.services.portfolio_service import PortfolioService

router = APIRouter()

POLL_INTERVAL_SECONDS = 5


@router.websocket("/ws/portfolio")
async def portfolio_live_updates(websocket: WebSocket, token: str = Query(...)) -> None:
    """
    Envia atualizações periódicas de patrimônio e cotações para o dashboard.

    Autenticação via query param (?token=<access_token>), já que WebSocket
    nativo do browser não permite enviar headers customizados.
    """
    try:
        payload = decode_token(token, expected_type=TokenType.ACCESS)
    except InvalidTokenException:
        await websocket.close(code=4401)
        return

    db = SessionLocal()
    try:
        user = db.get(User, payload.subject)
        if user is None or not user.is_active:
            await websocket.close(code=4401)
            return

        await websocket.accept()
        service = PortfolioService(db)

        try:
            while True:
                summary = await service.get_summary(user.id)
                holdings = await service.get_holdings_with_quotes(user.id)
                await websocket.send_json(
                    {
                        "type": "portfolio_update",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "summary": summary.model_dump(),
                        "holdings": [h.model_dump() for h in holdings],
                    }
                )
                await asyncio.sleep(POLL_INTERVAL_SECONDS)
        except WebSocketDisconnect:
            return
    finally:
        db.close()
