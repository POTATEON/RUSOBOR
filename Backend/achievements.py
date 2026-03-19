from fastapi import Depends, APIRouter
from schemas import HabitOut, Response, HabitCreate, HabitDelete
from sqlalchemy.orm import Session
from database import get_db
from models import Habit
import time


router = APIRouter()

@router.get("/")
def get_achievements(db: Session = Depends(get_db)):
    start = time.time()
    habits = db.query(Habit).all()
    return Response[list[HabitOut]](
        result=habits,
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.post("/")
def create_achievements(body: HabitCreate, db: Session = Depends(get_db)):
    start = time.time()
    habit = Habit(
        name=body.name,
        description=body.description,
        cost=body.cost
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)

    return Response[HabitOut](
        result=habit,
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.delete("/")
def delete_achievements(db: Session = Depends(get_db)):
    start  = time.time()


