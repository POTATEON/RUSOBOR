# routers/auth.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import Response, UserOut, UserCreate
from models import User
import time

router = APIRouter()

@router.post("/init")
def init_user(body: UserCreate, db: Session = Depends(get_db)):
    start = time.time()
    user  = db.query(User).filter(User.id == body.id).first()
    if not user:
        user = User(
            id=body.id,
            login=body.login,
            password=body.password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return Response[UserOut](
        result=UserOut(id=user.id, login=user.login),
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.get("/{id}")
def get_user(id: str, db: Session = Depends(get_db)):
    start = time.time()
    user  = db.query(User).filter(User.id == id).first()
    if not user:
        return Response(errorList=["Пользователь не найден"], timeGeneral=f"{time.time() - start:.4f}s")
    return Response[UserOut](
        result=UserOut(id=user.id, login=user.login),
        timeGeneral=f"{time.time() - start:.4f}s"
    )