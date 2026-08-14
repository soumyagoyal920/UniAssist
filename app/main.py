import os
import json
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Import your database models/schemas from your project structure
from .database import get_db, engine
from .models import ChatLog
from . import models
from .schemas import ChatRequest, ChatResponse
from UniAssist.pipeline import build_UniAssist_agent, ask_agent

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)   # creates chat_logs table if missing


# Build the RAG agent ONCE at startup (not per-request — that would be slow)
agent = None
try:
    agent = build_UniAssist_agent()
    print("UniAssist RAG agent initialized successfully.")
except Exception as e:
    print(f"Failed to initialize UniAssist agent: {e}")


@app.get("/")
def read_root():
    return {"status": "Backend is running smoothly"}


@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(payload: ChatRequest, db: Session = Depends(get_db)):
    user_message = payload.message

    # 1. Try calling the RAG agent (this actually searches your PDF)
    if agent is None:
    raise HTTPException(
        status_code=503,
        detail="RAG agent is unavailable."
    )

    try:
        bot_reply = ask_agent(agent, user_message)
    except Exception as e:
        print(f"Agent error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate response from RAG."
        )
    else:
        # Fallback if agent failed to initialize (e.g. missing API keys on Render)
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
        sources=mock_sources,
        timestamp=db_log.timestamp
    )
