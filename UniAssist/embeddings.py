from langchain_community.embeddings import JinaEmbeddings

from UniAssist import config

def get_embeddings_model():
    """Return the Jina embeddings model based on the specified model name."""
    return JinaEmbeddings(model_name=config.EMBEDDING_MODEL_NAME)