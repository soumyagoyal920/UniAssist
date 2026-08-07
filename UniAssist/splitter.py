from langchain_text_splitters import RecursiveCharacterTextSplitter
from UniAssist import config

def split_into_chunks(documents):
    """Split documents into chunks based on the specified chunk size and overlap."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=config.CHUNK_SIZE,
        chunk_overlap=config.CHUNK_OVERLAP
    )
    return text_splitter.split_documents(documents)