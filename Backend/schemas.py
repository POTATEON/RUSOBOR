from typing import List, Generic, Optional, TypeVar

from pydantic import BaseModel


T = TypeVar("T")


class HabitCreate(BaseModel, Generic[T]):
    name:        str
    description: str | None = None
    tagId:       int | None = None
    cost:        int = 0

class HabitUpdate(BaseModel):
    name:        str | None = None
    description: str | None = None

class HabitOut(BaseModel):
    id:          str
    name:        str
    description: str | None = None
    tagId:       int | None = None
    streak:      int
    cost:        int
    model_config = {"from_attributes": True}

class PaginatedHabits(BaseModel):
    habits: List[HabitOut]
    totalCount: int

class Response(BaseModel, Generic[T]):
    result:      Optional[T] = None
    errorList:   Optional[List[str]] = None  # добавь = None
    timeGeneral: str
