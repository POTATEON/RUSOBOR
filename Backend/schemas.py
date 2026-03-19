# schemas.py
from typing import List, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class HabitCreate(BaseModel):
    name:        str
    description: str | None = None
    tagId:       str | None = None
    cost:        int = 0
    goal_days:   int = 0

class HabitUpdate(BaseModel):
    name:        str | None = None
    description: str | None = None
    goal_days:   int | None = None

class HabitOut(BaseModel):
    id:          str
    name:        str
    description: str | None = None
    tagId:       str | None = None
    cost:        int
    finalValue:  int
    goal_days:   int
    model_config = {"from_attributes": True}

class HabitWithStreakOut(HabitOut):
    streak: int

class HabitAttach(BaseModel):
    idHabit: str

class PaginatedHabits(BaseModel):
    habits:     List[HabitWithStreakOut]
    totalCount: int

class UserCreate(BaseModel):
    id:       str
    login:    str
    password: str

class UserOut(BaseModel):
    id:    str
    login: str
    model_config = {"from_attributes": True}

class AchievementOut(BaseModel):
    id:          str
    name:        str
    description: str | None = None
    progress:    int
    finalValue:  int | None = None
    tagId:       str | None = None
    model_config = {"from_attributes": True}

class AchievementProgressUpdate(BaseModel):
    idUser:        str
    idAchievement: str
    progress:      int


class AchievementCreate(BaseModel):
    name:        str
    description: str | None = None
    finalValue:  int
    tagId:       str | None = None
    userId:      str

class AchievementWithStatusOut(BaseModel):
    id:          str
    name:        str
    description: str | None = None
    finalValue:  int | None = None
    tagId:       str | None = None
    progress:    int    
    isCompleted: bool
    model_config = {"from_attributes": True}

class PaginatedAchievements(BaseModel):
    achievements: list[AchievementWithStatusOut]
    totalCount:   int

class Response(BaseModel, Generic[T]):
    result:      Optional[T] = None
    errorList:   Optional[List[str]] = None
    timeGeneral: str