import os
from dotenv import load_dotenv

load_dotenv()

# Load environment variables from .env file

groq_key = os.getenv("GROQ_API_KEY")
jina_key = os.getenv("JINA_API_KEY")

#define path - data / vector store
DATA_FILE_PATH = os.path.join("data" , "data.pdf")
VECTOR_STORE_PATH = os.path.join("data" , "faiss_index")

## llms and embedding models

LLM_MODEL_NAME = "openai/gpt-oss-120b"
EMBEDDING_MODEL_NAME = "jina-embeddings-v2-base-en"

## chunk/text splitter config
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 100 

#retriever config
TOP_K_RESULTS = 3

## SYSTEM INSTRUCTIONS
SYSTEM_PROMPT =("""You are a helpful AI assistant which helps students during their admission process.
    Here is the context of the document you have to answer the questions based on it. 
    If you don't know the answer, just say that you don't know, don't try to make up an answer.""")

def check_api_keys() -> None:
    """ stop with an early message if the required API key is missing"""
    if not groq_key:
        raise ValueError("GROQ_API_KEY is missing. Please set it in the .env file.")
    if not jina_key:
        raise ValueError("JINA_API_KEY is missing. Please set it in the .env file.")
    


