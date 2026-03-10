# pylint: disable=R0903
"""
SQLAlchemy models for sipnscrape
Defines database schema for beans
"""
from sqlalchemy import Column, Integer, String, JSON
from database import Base

class Bean(Base):
    """
    Represents coffee bean entry in database
    """
    __tablename__ = "beans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    roaster = Column(String, index=True)
    roast_type = Column(String)
    taste_notes = Column(JSON, default=[])
    elevation = Column(Integer, nullable=True)
    country = Column(String, index=True)
    process = Column(String)
    hyperlink = Column(String)
