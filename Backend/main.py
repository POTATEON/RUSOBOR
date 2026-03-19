# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import routers.habits as habits
import routers.achievements as achievements
import routers.auth as auth
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="РУСОБОР - собиратель привычек русских", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # CRA / Next.js
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
<<<<<<< HEAD
#whfebwuife
=======
app = FastAPI(title="РУСОБОР - собиратель привычек русских", version="1.0.0")

>>>>>>> 12c21c9f7f7035d6a50c0ca775d84376b439ddd7
app.include_router(habits.router,       prefix="/habits",       tags=["habits"])
app.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/", tags=["main"])
def root():
    return {"status": "ok"}