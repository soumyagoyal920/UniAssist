from langchain_groq import ChatGroq
from UniAssist import config

def get_llm():
    """Return a ChatGroq LLM instance based on the specified model and temperature."""
    return ChatGroq(
        model=config.LLM_MODEL_NAME,
        temperature=0.5,
    )
