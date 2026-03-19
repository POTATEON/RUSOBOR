# routers/habits.py
from fastapi import Depends, APIRouter, Query
from schemas import HabitOut, HabitWithStreakOut, Response, HabitCreate, HabitUpdate, PaginatedHabits, HabitAttach
from sqlalchemy.orm import Session
from database import get_db
from models import Habit, UserHabit
import time

router = APIRouter()

@router.get("")
def get_habits(
    page:     int = Query(default=1, ge=1),
    sizePage: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    start   = time.time()
    total   = db.query(Habit).count()
    habits  = db.query(Habit).offset((page - 1) * sizePage).limit(sizePage).all()

    return Response[PaginatedHabits](
        result=PaginatedHabits(
            habits=[
                HabitWithStreakOut(
                    id=h.id, name=h.name, description=h.description,
                    tagId=h.tagId, cost=h.cost, finalValue=h.finalValue,
                    streak=0
                )
                for h in habits
            ],
            totalCount=total
        ),
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.get("/{idUser}")
def get_habits(
    idUser:   str,
    page:     int = Query(default=1, ge=1),
    sizePage: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    start = time.time()
    query = db.query(Habit, UserHabit.streak).join(
        UserHabit, UserHabit.idHabit == Habit.id
    ).filter(UserHabit.idUser == idUser)

    total   = query.count()
    results = query.offset((page - 1) * sizePage).limit(sizePage).all()

    habits = [
        HabitWithStreakOut(
            id=h.id, name=h.name, description=h.description,
            tagId=h.tagId, cost=h.cost, finalValue=h.finalValue,
            streak=streak
        )
        for h, streak in results
    ]

    return Response[PaginatedHabits](
        result=PaginatedHabits(habits=habits, totalCount=total),
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.post("/{idUser}")
def create_habit(idUser: str, body: HabitCreate, db: Session = Depends(get_db)):
    start = time.time()
    habit = Habit(
        name=idUser,
        description=body.description,
        cost=body.cost,
        tagId=body.tagId
    )
    db.add(habit)
    db.flush()
    db.add(UserHabit(idUser=idUser, idHabit=habit.id))
    db.commit()
    db.refresh(habit)
    return Response[HabitOut](
        result=HabitOut(
            id=idUser, name=habit.name, description=habit.description,
            tagId=habit.tagId, cost=habit.cost, finalValue=habit.finalValue
        ),
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.put("/{idUser}/{idHabit}")
def update_habit(idUser: str, idHabit: str, body: HabitUpdate, db: Session = Depends(get_db)):
    start = time.time()
    habit = db.query(Habit).join(
        UserHabit, UserHabit.idHabit == Habit.id
    ).filter(
        UserHabit.idUser == idUser,
        Habit.id == idHabit
    ).first()
    if not habit:
        return Response(errorList=["Привычка не найдена"], timeGeneral=f"{time.time() - start:.4f}s")
    if body.name is not None:
        habit.name = body.name
    if body.description is not None:
        habit.description = body.description
    db.commit()
    db.refresh(habit)
    return Response[HabitOut](
        result=HabitOut(
            id=habit.id, name=habit.name, description=habit.description,
            tagId=habit.tagId, cost=habit.cost, finalValue=habit.finalValue
        ),
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.put("/{idUser}/{idHabit}/streak/add")
def add_streak(idUser: str, idHabit: str, db: Session = Depends(get_db)):
    start = time.time()
    user_habit = db.query(UserHabit).filter(
        UserHabit.idUser == idUser,
        UserHabit.idHabit == idHabit
    ).first()
    if not user_habit:
        return Response(errorList=["Привычка не найдена"], timeGeneral=f"{time.time() - start:.4f}s")
    user_habit.streak += 1
    db.commit()
    return Response(result=idHabit, timeGeneral=f"{time.time() - start:.4f}s")

@router.put("/{idUser}/{idHabit}/streak/reset")
def reset_streak(idUser: str, idHabit: str, db: Session = Depends(get_db)):
    start = time.time()
    user_habit = db.query(UserHabit).filter(
        UserHabit.idUser == idUser,
        UserHabit.idHabit == idHabit
    ).first()
    if not user_habit:
        return Response(errorList=["Привычка не найдена"], timeGeneral=f"{time.time() - start:.4f}s")
    user_habit.streak = 0
    db.commit()
    return Response(result={"streak": 0}, timeGeneral=f"{time.time() - start:.4f}s")

@router.delete("/{idUser}/{idHabit}")
def delete_habit(idUser: str, idHabit: str, db: Session = Depends(get_db)):
    start = time.time()
    user_habit = db.query(UserHabit).filter(
        UserHabit.idUser == idUser,
        UserHabit.idHabit == idHabit
    ).first()
    if not user_habit:
        return Response(errorList=["Привычка не найдена"], timeGeneral=f"{time.time() - start:.4f}s")
    db.delete(user_habit)
    db.commit()
    return Response(result={"deleted": idHabit}, timeGeneral=f"{time.time() - start:.4f}s")

@router.post("/{idUser}/attach")
def attach_habit(idUser: str, body: HabitAttach, db: Session = Depends(get_db)):
    start = time.time()
    
    # проверяем что привычка существует
    habit = db.query(Habit).filter(Habit.id == body.idHabit).first()
    if not habit:
        return Response(errorList=["Привычка не найдена"], timeGeneral=f"{time.time() - start:.4f}s")
    
    # проверяем что привязка ещё не существует
    existing = db.query(UserHabit).filter(
        UserHabit.idUser == idUser,
        UserHabit.idHabit == body.idHabit
    ).first()
    if existing:
        return Response(errorList=["Привычка уже привязана"], timeGeneral=f"{time.time() - start:.4f}s")

    db.add(UserHabit(idUser=idUser, idHabit=body.idHabit))
    db.commit()
    return Response(
        result={"attached": body.idHabit},
        timeGeneral=f"{time.time() - start:.4f}s"
    )