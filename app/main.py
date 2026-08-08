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

    # --- MOCKING SOURCES TO MATCH THE FRONTEND STRUCTURE ---
    bot_reply = f"MOCK RESPONSE: You asked about '{user_message}'."
    mock_sources = ["General Knowledge"]

    if "fee" in lower_msg or "structure" in lower_msg or "cost" in lower_msg:
        bot_reply = "According to the official Fee Structure document: Standard tuition fee details are available in Section 2."
        mock_sources = ["Fee Structure"]
    elif "admission" in lower_msg or "voucher" in lower_msg or "apply" in lower_msg:
        bot_reply = "Based on the Admission Voucher documentation: Valid vouchers are required during registration."
        mock_sources = ["Admission Voucher"]

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