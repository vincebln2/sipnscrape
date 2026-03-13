# pylint: disable=E0401
"""
Main FastApi application for sipnscrape
Handles routers for coffee bean management and recommendation
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, recommender
from database import ENGINE, SESSION_LOCAL

models.Base.metadata.create_all(bind=ENGINE)

app = FastAPI(title="sipnscrape API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SESSION_LOCAL()
    try:
        yield db
    finally:
        db.close()


@app.delete("/beans/delete")
def delete_all_beans(db: Session = Depends(get_db)):
    """
    Wipes the database for demo repopulation.
    """
    db.query(models.Bean).delete()
    db.commit()
    return {"message": "Database cleared"}

@app.get("/beans/", response_model=list[schemas.Bean])
def read_beans(db: Session = Depends(get_db)):
    return db.query(models.Bean).all()

@app.post("/beans/", response_model=schemas.Bean)
def create_bean(bean: schemas.BeanCreate, db: Session = Depends(get_db)):
    db_bean = models.Bean(**bean.dict())
    db.add(db_bean)
    db.commit()
    db.refresh(db_bean)
    return db_bean

@app.get("/search", response_model=list[schemas.Bean])
def search_beans(q: str, db: Session = Depends(get_db)):
    all_beans = db.query(models.Bean).all()
    return recommender.semantic_search(q, all_beans)

@app.get("/beans/{bean_id}/recommendations", response_model=list[schemas.Bean])
def get_recommendations(bean_id: int, db: Session = Depends(get_db)):
    target_bean = db.query(models.Bean).filter(models.Bean.id == bean_id).first()
    if not target_bean:
        raise HTTPException(status_code=404, detail="Bean not found")
    all_beans = db.query(models.Bean).filter(models.Bean.id != bean_id).all()
    return recommender.semantic_search(target_bean.name, all_beans)