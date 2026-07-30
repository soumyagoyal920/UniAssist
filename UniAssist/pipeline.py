from UniAssist import config
from UniAssist.agent import create_UniAssist_agent
from UniAssist.document_loader import load_document
from UniAssist.llm import get_llm
from UniAssist.splitter import split_into_chunks
from UniAssist.tools import create_search_tool
from UniAssist.vector_store import(
    build_vector_store,
    save_vector_store,
    load_vector_store,
    vector_store_exists,
    get_retriever
)

def build_vector_store_for_document(file_path: str =config.DATA_FILE_PATH):
    """Load+split+embed the document, reusing a saved index if we have one."""
    if vector_store_exists():
        print("Loading existing vector store...")
        return load_vector_store()

    print("no saved vector store found, building a new one...")
    document = load_document(file_path)
    chunks = split_into_chunks(document)
    print(f"Loaded {file_path} and split into {len(chunks)} chunks...")

    vector_store = build_vector_store(chunks)
    save_vector_store(vector_store)
    print("Vector store built and saved to disk.")
    return vector_store

def build_UniAssist_agent(file_path: str =config.DATA_FILE_PATH):
    """Build a UniAssist agent with a retriever tool."""
    config.check_api_keys()
    llm = get_llm()
    vector_store = build_vector_store_for_document(file_path)
    retriever = get_retriever(vector_store)
    search_tool = create_search_tool(retriever)
    tools = [search_tool]
    agent = create_UniAssist_agent(llm, [search_tool])
    return agent

def ask_agent(agent, question: str) -> str:
    """Ask the UniAssist agent a question and return the response."""
    response = agent.invoke({"messages": [{"role": "user", "content": question}]})
    return response["messages"][-1].content