from sqlalchemy import Column, Integer, Text, DateTime
from datetime import datetime
from .database import Base

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_query = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    sources_dump = Column(Text, default="[]")  # Added to track source file histories
    timestamp = Column(DateTime, default=datetime.utcnow)
