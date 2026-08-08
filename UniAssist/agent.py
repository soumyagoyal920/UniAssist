from langchain.agents import create_agent
from UniAssist import config

def create_UniAssist_agent(llm, tools):
    """Create a custom agent using the provided LLM and tools."""
    return create_agent(
        model=llm,
        tools=tools,
        system_prompt=config.SYSTEM_PROMPT
    )
