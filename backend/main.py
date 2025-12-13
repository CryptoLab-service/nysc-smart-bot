import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# 1. Imports
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.messages import SystemMessage, HumanMessage
from tavily import TavilyClient

load_dotenv()

app = FastAPI()

# 2. CORS (So React can talk to Python)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Setup Tools
# -- The Database (Long-term memory)
DB_PATH = "chroma_db"
embedding_function = OpenAIEmbeddings()
vector_db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function)

# -- The Web Searcher (Real-time eyes)
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# -- The Brain
llm = ChatOpenAI(temperature=0.3, model="gpt-3.5-turbo")

class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(request: QueryRequest):
    try:
        print(f"Thinking about: {request.question}")
        
        # SOURCE A: Search the PDF Database (The Rules)
        db_results = vector_db.similarity_search(request.question, k=2)
        pdf_context = "\n".join([doc.page_content for doc in db_results])
        
        # SOURCE B: Search the Internet (The News)
        # We search specifically for NYSC related info
        print("Searching the web...")
        web_response = tavily.search(query=f"NYSC Nigeria {request.question}", search_depth="basic", max_results=2)
        web_context = "\n".join([result["content"] for result in web_response["results"]])
        
        # Combine Contexts
        full_context = f"""
        --- INFO FROM NYSC BYE-LAWS (RULES) ---
        {pdf_context}
        
        --- INFO FROM LATEST WEB SEARCH (NEWS) ---
        {web_context}
        """
        
        # Construct the Prompt
        system_prompt = f"""
        You are a smart NYSC Assistant. You have access to the Bye-Law Rules and the latest News from the web.
        
        Your Goal: Answer the user's question accurately.
        - If the question is about RULES (penalties, dress code), prioritize the 'NYSC BYE-LAWS' section.
        - If the question is about DATES or NEWS (camp dates, senate list), prioritize the 'WEB SEARCH' section.
        - Always cite your source context (e.g., "According to the latest news..." or "The Bye-Laws state...").
        
        <context>
        {full_context}
        </context>
        """
        
        # Send to AI
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=request.question)
        ]
        
        response = llm.invoke(messages)
        
        return {
            "answer": response.content,
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "NYSC AI (Hybrid Mode) is Ready!"}