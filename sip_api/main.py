# pylint: disable=E0401
"""
Main FastApi application for sipnscrape
Handles routers for coffee bean management and recommendation
"""

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import crud
import models
import schemas
import recommender
from database import SESSION_LOCAL, ENGINE

models.Base.metadata.create_all(bind=ENGINE)

app = FastAPI(title="sipnscrape API")

def get_db():
    """
    Dependency that provides database session for each request
    """
    db = SESSION_LOCAL()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    """
    Health check endpoint to verify api is running
    """
    return {"status": "sipnscrape is brewing"}

@app.post("/beans/", response_model=schemas.Bean)
def create_bean(bean: schemas.BeanCreate, db: Session = Depends(get_db)):
    """
    Create a new coffee bean entry
    """
    return crud.create_bean(db=db, bean=bean)

@app.get("/beans/", response_model=list[schemas.Bean])
def read_beans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a paginated list of coffee beans
    """
    return crud.get_beans(db, skip=skip, limit=limit)

@app.get("/beans/{bean_id}/recommendations", response_model=list[schemas.Bean])
def get_recommendations(bean_id: int, db: Session = Depends(get_db)):
    """
    Returns list of semantically related beans
    """
    target = db.query(models.Bean).filter(models.Bean.id == bean_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Bean not found")

    all_beans = db.query(models.Bean).all()

    return recommender.get_ranked_recommendations(target, all_beans)

@app.get("/search", response_model=list[schemas.Bean])
def search_beans(q: str, db: Session = Depends(get_db)):
    """
    Search for beans using natural language 
    """
    all_beans = db.query(models.Bean).all()
    return recommender.semantic_search(q, all_beans)

@app.delete("/beans/delete", tags=["Admin"])
def delete_beans(db: Session = Depends(get_db)):
    """
    Deletes all beans in database
    """
    count = crud.delete_all_beans(db)
    return {"message": f"Database wiped. {count} beans removed."}
