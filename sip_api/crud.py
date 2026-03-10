"""
CRUD operations for the sipnscrape bean database
Contains functions for creating and retrieving bean data
"""

from sqlalchemy.orm import Session
import models
import schemas

def create_bean(db: Session, bean: schemas.BeanCreate):
    """
    Create a new coffee bean record in the database
    """
    db_bean = models.Bean(
        name=bean.name,
        roaster=bean.roaster,
        roast_type=bean.roast_type,
        taste_notes=bean.taste_notes,
        elevation=bean.elevation,
        country=bean.country,
        process=bean.process,
        hyperlink=bean.hyperlink
    )
    db.add(db_bean)
    db.commit()
    db.refresh(db_bean)
    return db_bean

def get_beans(db: Session, skip: int = 0, limit: int = 100):
    """
    Retrieve a list of coffee beans
    """
    return db.query(models.Bean).offset(skip).limit(limit).all()
