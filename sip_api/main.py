from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SipNScrape API")


@app.get("/")
def read_root():
    return {"message": "Welcome to SipNScrape. Ground Control is active."}


@app.post("/beans/", response_model=schemas.Bean)
def create_bean(bean: schemas.BeanCreate, db: Session = Depends(database.get_db)):
    db_bean = models.CoffeeBean(**bean.dict())
    db.add(db_bean)
    db.commit()
    db.refresh(db_bean)
    return db_bean


@app.get("/beans/")
def get_beans(db: Session = Depends(database.get_db)):
    return db.query(models.CoffeeBean).all()
