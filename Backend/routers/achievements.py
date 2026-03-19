from fastapi import Depends, APIRouter, Query
from schemas import AchievementWithStatusOut, Response, PaginatedAchievements, AchievementProgressUpdate
from sqlalchemy.orm import Session
from database import get_db
from models import Achievement, UserAchievement
import time

router = APIRouter()

@router.get("/{idUser}")
def get_achievements(
    idUser:   str,
    page:     int = Query(default=1, ge=1),
    sizePage: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    start   = time.time()
    query   = db.query(Achievement, UserAchievement).join(
        UserAchievement, UserAchievement.idAchievement == Achievement.id
    ).filter(UserAchievement.idUser == idUser)

    total   = query.count()
    results = query.offset((page - 1) * sizePage).limit(sizePage).all()

    achievements = [
        AchievementWithStatusOut(
            id=a.id, name=a.name, description=a.description,
            finalValue=a.finalValue, tagId=a.tagId,
            progress=ua.progress,
            isCompleted=ua.isCompleted
        )
        for a, ua in results
    ]

    return Response[PaginatedAchievements](
        result=PaginatedAchievements(achievements=achievements, totalCount=total),
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.get("/{idUser}/{idAchievement}")
def get_achievement(idUser: str, idAchievement: str, db: Session = Depends(get_db)):
    start  = time.time()
    result = db.query(Achievement, UserAchievement).join(
        UserAchievement, UserAchievement.idAchievement == Achievement.id
    ).filter(
        UserAchievement.idUser == idUser,
        Achievement.id == idAchievement
    ).first()
    if not result:
        return Response(errorList=["Достижение не найдено"], timeGeneral=f"{time.time() - start:.4f}s")
    a, ua = result
    return Response[AchievementWithStatusOut](
        result=AchievementWithStatusOut(
            id=a.id, name=a.name, description=a.description,
            finalValue=a.finalValue, tagId=a.tagId,
            progress=ua.progress,
            isCompleted=ua.isCompleted
        ),
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.put("/{idUser}/{idAchievement}/complete")
def complete_achievement(idUser: str, idAchievement: str, db: Session = Depends(get_db)):
    start            = time.time()
    user_achievement = db.query(UserAchievement).filter(
        UserAchievement.idUser == idUser,
        UserAchievement.idAchievement == idAchievement
    ).first()
    if not user_achievement:
        return Response(errorList=["Достижение не найдено"], timeGeneral=f"{time.time() - start:.4f}s")
    user_achievement.isCompleted = True
    db.commit()
    return Response(
        result={"isCompleted": True},
        timeGeneral=f"{time.time() - start:.4f}s"
    )

@router.put("/progress")
def update_progress(body: AchievementProgressUpdate, db: Session = Depends(get_db)):
    start            = time.time()
    user_achievement = db.query(UserAchievement).filter(
        UserAchievement.idUser == body.idUser,
        UserAchievement.idAchievement == body.idAchievement
    ).first()
    if not user_achievement:
        return Response(errorList=["Достижение не найдено"], timeGeneral=f"{time.time() - start:.4f}s")
    
    user_achievement.progress = body.progress

    achievement = db.query(Achievement).filter(Achievement.id == body.idAchievement).first()
    if achievement.finalValue and body.progress >= achievement.finalValue:
        user_achievement.isCompleted = True

    db.commit()
    return Response(
        result={"progress": user_achievement.progress, "isCompleted": user_achievement.isCompleted},
        timeGeneral=f"{time.time() - start:.4f}s"
    )