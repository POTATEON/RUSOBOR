# models.py
import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"
    id       = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    login    = Column(String(50), nullable=False)
    password = Column(String(20), nullable=False)

class Tag(Base):
    __tablename__ = "tags"
    tagId = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name  = Column(String(50), nullable=False)

class Habit(Base):
    __tablename__ = "habits"
    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name        = Column(String(25), nullable=False)
    description = Column(String(100))
    tagId       = Column(String, ForeignKey("tags.tagId"))
    cost        = Column(Integer, nullable=False, default=0)
    finalValue  = Column(Integer, nullable=False, default=0)

class UserHabit(Base):
    __tablename__ = "userHabit"
    idUser  = Column(String, ForeignKey("users.id"), primary_key=True)
    idHabit = Column(String, ForeignKey("habits.id"), primary_key=True)
    streak  = Column(Integer, nullable=False, default=0)

class Achievement(Base):
    __tablename__ = "achievements"
    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name        = Column(String(25), nullable=False)
    description = Column(String(100))
    progress    = Column(Integer, nullable=False, default=0)
    finalValue  = Column(Integer)
    tagId       = Column(String, ForeignKey("tags.tagId"))

class UserAchievement(Base):
    __tablename__ = "userAchievement"
    idUser        = Column(String, ForeignKey("users.id"), primary_key=True)
    idAchievement = Column(String, ForeignKey("achievements.id"), primary_key=True)
    progress      = Column(Integer, nullable=False, default=0) 
    isCompleted   = Column(Boolean, nullable=False, default=False)