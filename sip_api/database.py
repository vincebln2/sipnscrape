"""
Database configuration for sipnscrape application
Sets up SQLAlchemy and base class
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

ENGINE = create_engine(SQLALCHEMY_DATABASE_URL)

SESSION_LOCAL = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)

Base = declarative_base()
