from fastapi import Depends, APIRouter, Query
from schemas import HabitOut, Response, HabitCreate, HabitUpdate, PaginatedHabits
from sqlalchemy.orm import Session
from database import get_db
from models import Habit
import time


router = APIRouter()

@router.get("", tags=["habits.get"])
def get_habits(
    page:     int = Query(default=1, ge=1),
    sizePage: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    start  = time.time()
    total  = db.query(Habit).count()
    habits = db.query(Habit).offset((page - 1) * sizePage).limit(sizePage).all()
    return Response[PaginatedHabits](
        result=PaginatedHabits(habits=habits, totalCount=total),
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.get("/{id}")
def get_habit(id: str, db: Session = Depends(get_db)):
    start  = time.time()
    habit = db.query(Habit).filter(Habit.id == id).first()
    if not habit:
        return Response(
            errorList=["Привычка не найдена"],
            timeGeneral=f"{time.time() - start:.4f}s"
        )
    return Response[HabitOut](
        result=habit,
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.post("")
def create_habit(body: HabitCreate, db: Session = Depends(get_db)):
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


@router.put("/{id}")
def update_habit(id: str, body: HabitUpdate, db: Session = Depends(get_db)):
    start = time.time()
    habit = db.query(Habit).filter(Habit.id == id).first()
    if not habit:
        return Response(
            errorList=["Привычка не найдена"],
            timeGeneral=f"{time.time() - start:.4f}s"
        )
    if body.name is not None:
        habit.name = body.name
    if body.description is not None:
        habit.description = body.description
    db.commit()
    db.refresh(habit)
    return Response[HabitOut](
        result=habit,
        timeGeneral=f"{time.time() - start:.4f}s"
    )


@router.delete("/{id}")
def delete_habit(id: str, db: Session = Depends(get_db)):
    start  = time.time()
    habit = db.query(Habit).filter(Habit.id == id).first()
    if not habit:
        return Response(
            errorList=["Привычка не найдена"],
            timeGeneral=f"{time.time() - start:.4f}s"
        )
    db.delete(habit)
    db.commit()
    return Response(
        result=id,
        timeGeneral=f"{time.time() - start:.4f}s"
    )





