from fastapi import FastAPI
from database import Base, engine
import routers.habits as habits
import models


Base.metadata.create_all(bind=engine)

app = FastAPI(title="РУСОБОР - собиратель привычек русских", version="1.0.0")

app.include_router(habits.router, prefix="/habits", tags=["habits"])

@app.get("/", tags=["main"])
def root():
    return {"status": "ok"}