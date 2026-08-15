import os
import json
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq

# Import database models/schemas
from .database import get_db, engine
from .models import ChatLog
from . import models
from .schemas import ChatRequest, ChatResponse

# Safe import of RAG agent pipeline
try:
    from UniAssist.pipeline import build_UniAssist_agent, ask_agent
except ImportError:
    try:
        from pipeline import build_UniAssist_agent, ask_agent
    except ImportError:
        build_UniAssist_agent, ask_agent = None, None

load_dotenv()
app = FastAPI()

# FIX 1: Allow all origins so StackBlitz can talk to Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)   # Creates chat_logs table if missing

# Build the RAG agent ONCE at startup
agent = None
if build_UniAssist_agent:
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
    user_message = payload.message or getattr(payload, 'question', None) or "Hello"
    bot_reply = None
    mock_sources = ["UniAssist Knowledge Base"]

    # 1. Try calling RAG pipeline first
    if agent is not None and ask_agent is not None:
        try:
            bot_reply = ask_agent(agent, user_message)
        except Exception as e:
            print(f"RAG Agent error: {e}")

    # 2. FIX 2: If RAG agent failed or returned generic template text, query Groq directly live!
    if not bot_reply or "Thank you for asking about" in str(bot_reply):
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            try:
                llm = ChatGroq(
                    groq_api_key=api_key,
                    model_name="llama-3.3-70b-versatile"
                )
                res = llm.invoke(user_message)
                bot_reply = res.content
            except Exception as e:
                print(f"Direct Groq error: {e}")
                bot_reply = f"Error generating response: {str(e)}"
        else:
            bot_reply = bot_reply or "GROQ_API_KEY is missing in Render environment variables."

    # 3. Save log to SQLite Database
    db_log = ChatLog(
        user_query=user_message,
        bot_response=bot_reply,
        sources_dump=json.dumps(mock_sources)
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    # 4. Return response to React frontend
    return ChatResponse(
        id=db_log.id,
        user_query=db_log.user_query,
        bot_response=db_log.bot_response,
        sources=mock_sources,
        timestamp=db_log.timestamp
    )
