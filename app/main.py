from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
from .database import engine, Base, get_db
from .models import ChatLog
from .schemas import ChatRequest, ChatResponse

# Initialize FastAPI App
app = FastAPI(title="RAG Chatbot Backend")

# Enable CORS for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"status": "Backend is running smoothly"}


@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(payload: ChatRequest, db: Session = Depends(get_db)):
    user_message = payload.message
    lower_msg = user_message.lower()

   # Pass user query to the RAG/AI pipeline
    # TODO: Connect your vector search or LLM function here from rag.ipynb
    bot_reply = f"Thank you for asking about '{user_message}'. The B.Tech admission process requires submitting the online application form, meeting minimum qualification marks, and uploading valid registration documents."
    mock_sources = ["Admission Guide 2026"]
    # Save to your local database records
    db_log = ChatLog(
        user_query=user_message,
        bot_response=bot_reply,
        sources_dump=json.dumps(mock_sources)
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return ChatResponse(
        id=db_log.id,
        user_query=db_log.user_query,
        bot_response=db_log.bot_response,
        sources=mock_sources,
        timestamp=db_log.timestamp
    )
