# UniAssist
UniAssist is a domain specific chatbot built using RAG (retrieval augmented generation)

----

# More About The Project
## Problem
Students frequently spend significant time searching through multiple university websites, PDFs, and notices to find accurate information regarding admissions.

Traditional AI chatbots may generate inaccurate or misleading answers because they rely on general internet knowledge instead of institution-specific information.

## Solution
Our chatbot unlike an open-domain LLM which pulls generalized data from the internet, our chatbot operates inside a strictly closed boundary of university datasets. It is designed to act as an automated, localized assistant that resolves administrative and academic queries.

----

# Tech Stack
## Frontend
- HTML
- CSS
- JavaScript
- Reactjs
## Backend
- Python
- FastAPI
## AI & Machine Learning
- LangChain
- Google Gemini API (or another LLM)
- Hugging Face Sentence Transformers
- FAISS Vector Database
## Database
- SQLite / PostgreSQL
## Tools
- Git & GitHub
- VS Code

---

# WORKFLOW
- Official university documents are uploaded to the system.
- Documents are converted into texts and divided into smaller chunks.
- Each chunk is converted into vector embeddings.
- Embeddings are stored in FAISS vector databases.
- A user's question is converted into an embedding.
- The system retrieves the most relevant document chunks usinf semantic similarities.
- The retrieved content is provided to the LLM as context.
- The LLM generate a grounded response along with the references to the source documents.
- The response is shown through the web interface.

----

# EXPECTED OUTCOMES
The project delivers an intelligent university assistant capable of answering institutional queries quickly and accurately using verified university documents. By combining semantic retrieval with large language models, the chatbot improves access to information, reduces misinformation, and demonstrates the practical application of modern AI techniques in the education sector.
