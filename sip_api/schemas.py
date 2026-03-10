# pylint: disable=R0903, E0401
"""
Pydantic schemas for sipnscrape
Defines data validation and serialization layers for beans
"""

from typing import List, Optional
from pydantic import BaseModel

class BeanBase(BaseModel):
    """
    Base properties for a coffee bean shared across all schemas
    """
    name: str
    roaster: str
    roast_type: str
    taste_notes: List[str] = []
    elevation: Optional[int] = None
    country: Optional[str] = None
    process: Optional[str] = None
    hyperlink: Optional[str] = None

class BeanCreate(BeanBase):
    """
    Used when receiving data to create a new bean
    """

class Bean(BeanBase):
    """
    Used when returning data from the database (includes the ID)
    """
    id: int

    class Config:
        """
        Pydantic config to allow ORM compatibility
        """
        from_attributes = True
