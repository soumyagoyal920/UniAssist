from langchain_community.document_loaders import PyPDFLoader
from UniAssist import config

def load_document(file_path: str = config.DATA_FILE_PATH):
    """Load a PDF document and return its content as a list of pages."""
    loader = PyPDFLoader(file_path)
    return loader.load()



