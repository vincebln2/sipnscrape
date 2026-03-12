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
    existing_bean = db.query(models.Bean).filter(
        models.Bean.name == bean.name,
        models.Bean.roaster == bean.roaster
    ).first()

    if existing_bean:
        for var, value in vars(bean).items():
            setattr(existing_bean, var, value) if value else None
        db.commit()
        db.refresh(existing_bean)
        return existing_bean

    db_bean = models.Bean(**bean.dict())
    db.add(db_bean)
    db.commit()
    db.refresh(db_bean)
    return db_bean

def delete_all_beans(db: Session):
    """
    Removes all rows from the beans table
    """
    try:
        num_rows_deleted = db.query(models.Bean).delete()
        db.commit()
        return num_rows_deleted
    except Exception:
        db.rollback()
        raise

def get_beans(db: Session, skip: int = 0, limit: int = 100):
    """
    Retrieve a list of coffee beans
    """
    return db.query(models.Bean).offset(skip).limit(limit).all()
