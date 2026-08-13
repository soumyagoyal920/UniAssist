import os
import json
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Import your database models/schemas from your project structure
from .database import get_db, ChatLog
from .schemas import ChatRequest, ChatResponse

load_dotenv()

app = FastAPI()

# Initialize Groq Model
groq_api_key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.2,
    groq_api_key=groq_api_key
) if groq_api_key else None


@app.get("/")
def read_root():
    return {"status": "Backend is running smoothly"}


@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(payload: ChatRequest, db: Session = Depends(get_db)):
    user_message = payload.message

    # 1. Try calling the AI model directly
    if llm:
        try:
            response = llm.invoke(user_message)
            bot_reply = response.content
            mock_sources = ["UniAssist Knowledge Base"]
        except Exception as e:
            # Fallback if API rate limits or network issues occur
            bot_reply = f"Thank you for asking about '{user_message}'. The B.Tech admission process requires submitting the online application form and uploading valid registration documents."
            mock_sources = ["Admission Guide 2026"]
    else:
        # Fallback if GROQ_API_KEY is not yet added to Render
        bot_reply = f"Thank you for asking about '{user_message}'. The B.Tech admission process requires submitting the online application form and uploading valid registration documents."
        mock_sources = ["Admission Guide 2026"]

    # 2. Save log to database
    db_log = ChatLog(
        user_query=user_message,
        bot_response=bot_reply,
        sources_dump=json.dumps(mock_sources)
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    # 3. Return response to React frontend
    return ChatResponse(
        id=db_log.id,
        user_query=db_log.user_query,
        bot_response=db_log.bot_response,
        sources=mock_sources
    )
