from datetime import datetime, date

from pydantic import BaseModel, ConfigDict, Field, field_serializer
from typing import Optional

class LogBase(BaseModel):
    daily_activity: Optional[str] = None
    date: datetime 
    
    
class LogEntry(LogBase):
    pass
          
class LogUpdate(LogEntry):
    daily_activity: Optional[str] = None
    date: Optional[datetime] = None
    
    
class LogResponse(LogBase): 
    model_config = ConfigDict(from_attributes = True)
    
    id: int
    user_id: int
    date: datetime
    daily_activity: str    
    
    @field_serializer("date")
    def serialize_date(self, value: date):
        return value.strftime("%d %b %Y, %I:%M %p")
        
        

class SummaryBase(BaseModel):
    interval_type: str  # "weekly" or "monthly"

class SummaryCreate(SummaryBase):
    summary_text: str

class SummaryUpdate(BaseModel):
    summary_text: str = Field(min_length=1, description="The updated summary text")


class SummaryResponse(SummaryBase):
    id: int
    start_date: datetime
    end_date: datetime
    summary_text: str

    class Config:
        from_attributes = True