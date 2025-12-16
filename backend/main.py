import os
import requests
import datetime
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
llm = ChatOpenAI(temperature=0.2, model="gpt-3.5-turbo") # Lower temperature for more factual answers
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

# --- CORE AI LOGIC FUNCTION ---
def get_nysc_answer(question: str):
    try:
        # 0. Get Today's Date (Crucial for "Current Batch" questions)
        today = datetime.date.today().strftime("%B %d, %Y")

        # 1. Search Internal Database (Prioritize your "standard_procedures.txt")
        db_results = vector_db.similarity_search(question, k=3)
        internal_knowledge = "\n".join([doc.page_content for doc in db_results])
        
        # 2. Search Web (Refined Query)
        # We add "Official" to filter out random Facebook comments
        print(f"Searching web for: NYSC Nigeria official news {question}")
        web_response = tavily.search(
            query=f"NYSC Nigeria official news {question}", 
            search_depth="basic", 
            max_results=2,
            include_domains=["nysc.gov.ng", "nyscselfservice.com.ng", "legit.ng" , "punchng.com", "vanguardngr.com", "dailypost.ng", "thecable.ng"] 
            # (Optional: You can restrict to trusted news sites if Tavily allows, or just use general better queries)
        )
        web_context = "\n".join([result["content"] for result in web_response["results"]])
        
        # 3. Construct System Prompt
        system_prompt = f"""
        You are a Senior NYSC Consultant. Your job is to give accurate, professional guidance to Corps Members.
        
        CURRENT DATE: {today}
        
        INSTRUCTIONS:
        1. DIRECT ANSWER: Start with the answer immediately. NEVER say "According to the latest news" or "Based on the web search".
        2. HIERARCHY: Trust the 'INTERNAL KNOWLEDGE' section above all else. Only use 'WEB NEWS' for dates not found in your internal knowledge.
        3. TONE: Professional, authoritative, and helpful. Do not mention "cars will be provided" unless explicitly stated in the text.
        4. PROCEDURES: If asked about documentation or travel, give the specific steps listed in 'INTERNAL KNOWLEDGE'.

        <INTERNAL_KNOWLEDGE>
        {internal_knowledge}
        </INTERNAL_KNOWLEDGE>

        <WEB_NEWS>
        {web_context}
        </WEB_NEWS>
        """
        
        messages = [SystemMessage(content=system_prompt), HumanMessage(content=question)]
        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        print(f"Error: {e}")
        return "I am currently upgrading my database to serve you better. Please ask again in a moment."

# --- API ENDPOINTS ---

class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(request: QueryRequest):
    answer = get_nysc_answer(request.question)
    return {"answer": answer}

@app.post("/telegram")
async def telegram_webhook(request: Request):
    data = await request.json()
    if "message" in data:
        chat_id = data["message"]["chat"]["id"]
        user_text = data["message"].get("text", "")
        if user_text:
            ai_reply = get_nysc_answer(user_text)
            url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
            payload = {"chat_id": chat_id, "text": ai_reply}
            requests.post(url, json=payload)
    return {"status": "ok"}

@app.get("/")
def home():
    return {"message": "NYSC AI is Live (Fine-Tuned)!"}
