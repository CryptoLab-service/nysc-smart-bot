import os
import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Imports for AI
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.messages import SystemMessage, HumanMessage
from tavily import TavilyClient

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SETUP TOOLS ---
DB_PATH = "chroma_db"
embedding_function = OpenAIEmbeddings()
vector_db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function)
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
llm = ChatOpenAI(temperature=0.3, model="gpt-3.5-turbo")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

# --- CORE AI LOGIC FUNCTION (Reusable) ---
def get_nysc_answer(question: str):
    try:
        # 1. Search DB
        db_results = vector_db.similarity_search(question, k=2)
        pdf_context = "\n".join([doc.page_content for doc in db_results])
        
        # 2. Search Web
        web_response = tavily.search(query=f"NYSC Nigeria {question}", search_depth="basic", max_results=1)
        web_context = "\n".join([result["content"] for result in web_response["results"]])
        
        # 3. Prompt
        full_context = f"RULES:\n{pdf_context}\n\nNEWS:\n{web_context}"
        system_prompt = f"""
        You are an NYSC Assistant. Answer based on the context.
        If it's about rules, use the RULES section.
        If it's about dates/news, use the NEWS section.
        Keep it short and helpful for a chat interface.
        <context>{full_context}</context>
        """
        messages = [SystemMessage(content=system_prompt), HumanMessage(content=question)]
        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        return "Sorry, I am having trouble thinking right now."

# --- API ENDPOINTS ---

class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(request: QueryRequest):
    answer = get_nysc_answer(request.question)
    return {"answer": answer}

# --- TELEGRAM WEBHOOK ENDPOINT ---
@app.post("/telegram")
async def telegram_webhook(request: Request):
    data = await request.json()
    
    # Check if it's a message
    if "message" in data:
        chat_id = data["message"]["chat"]["id"]
        user_text = data["message"].get("text", "")
        
        if user_text:
            # 1. Get AI Answer
            print(f"Telegram User {chat_id} asked: {user_text}")
            ai_reply = get_nysc_answer(user_text)
            
            # 2. Send Reply back to Telegram
            url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
            payload = {"chat_id": chat_id, "text": ai_reply}
            requests.post(url, json=payload)
            
    return {"status": "ok"}

@app.get("/")
def home():
    return {"message": "NYSC AI is Live (Web + Telegram)!"}
