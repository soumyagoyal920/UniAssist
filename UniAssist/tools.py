
from langchain_community.tools import tool

def create_search_tool(retriever):
    """Create a search tool using the provided retriever."""

    @tool
    def Search_UniAssist(question:str)-> str:
        """Search the document chunks for the answer to the question and return the matching chunks."""
        matching_chunks = retriever.invoke(question)
        return "\n\n".join([chunk.page_content for chunk in matching_chunks])

    return Search_UniAssist
