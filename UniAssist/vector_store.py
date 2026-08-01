from importlib.resources import path
import os
from os import path

from langchain_community.vectorstores import FAISS
from langchain_core import documents 
from UniAssist import config
from UniAssist.embeddings import get_embeddings_model

def build_vector_store(chunks):
    """Build a FAISS vector store from the provided documents and save it to disk."""
    embeddings_model = get_embeddings_model()
    return FAISS.from_documents(chunks, embeddings_model)

def save_vector_store(vector_store, path: str=config.VECTOR_STORE_PATH) -> None:
    """Save the FAISS vector store to disk."""
    vector_store.save_local(path) 

def load_vector_store(path: str=config.VECTOR_STORE_PATH):
    """Load the FAISS vector store from disk."""
    embeddings_model = get_embeddings_model()
    return FAISS.load_local(path, embeddings_model, allow_dangerous_deserialization=True)

def vector_store_exists(path: str=config.VECTOR_STORE_PATH) -> bool:
    """Check if the FAISS vector store exists on disk."""
    return os.path.exists(os.path.join(path, "index.faiss"))

def get_retriever(vector_store, top_k: int=config.TOP_K_RESULTS):
    """Get a retriever from the FAISS vector store."""
    return vector_store.as_retriever(search_kwargs={"k": top_k})

