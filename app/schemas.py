from pydantic import BaseModel
from datetime import datetime
from typing import List

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    id: int
    user_query: str
    bot_response: str
    sources: List[str]  # Added to match the React frontend array
    timestamp: datetime

    class Config:
        from_attributes = True
