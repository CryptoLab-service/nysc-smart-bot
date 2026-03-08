import os
import requests
import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import asyncio

# Imports for AI
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from tavily import TavilyClient
from apscheduler.schedulers.background import BackgroundScheduler
from services.news_service import fetch_and_store_news

load_dotenv()

app = FastAPI()

# SlowAPI Rate Limiter setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SETUP TOOLS ---
from database import engine, Base, SessionLocal
import models
from routers import auth, data, admin, clearance, resources
from fastapi.staticfiles import StaticFiles
from auth import get_password_hash

# Create Database Tables
Base.metadata.create_all(bind=engine)

def seed_users():
    db = SessionLocal()
    try:
        # 1. Super Admin
        admin_email = "admin@nysc.gov.ng"
        if not db.query(models.User).filter(models.User.email == admin_email).first():
            print(f"Creating Super Admin: {admin_email}")
            db.add(models.User(
                email=admin_email,
                hashed_password=get_password_hash("admin123"),
                name="System Administrator",
                role="Admin",
                state="Headquarters"
            ))

        # 2. Official
        off_email = "official@nysc.gov.ng"
        if not db.query(models.User).filter(models.User.email == off_email).first():
            print(f"Creating Official: {off_email}")
            db.add(models.User(
                email=off_email,
                hashed_password=get_password_hash("official123"),
                name="Lagos Coordinator",
                role="Official",
                state="Lagos"
            ))

        # 3. Corps Member
        cm_email = "cm@nysc.gov.ng"
        if not db.query(models.User).filter(models.User.email == cm_email).first():
            print(f"Creating Corps Member: {cm_email}")
            db.add(models.User(
                email=cm_email,
                hashed_password=get_password_hash("cm123"),
                name="Adewale Corps",
                role="Corps Member",
                state="Lagos",
                state_code="LA/24A/1234",
                lga="Ikeja",
                cds_group="ICT",
                ppa="Lagos State Secretariat"
            ))

        # 4. PCM
        pcm_email = "pcm@nysc.gov.ng"
        if not db.query(models.User).filter(models.User.email == pcm_email).first():
            print(f"Creating PCM: {pcm_email}")
            db.add(models.User(
                email=pcm_email,
                hashed_password=get_password_hash("pcm123"),
                name="Chidinma PCM",
                role="PCM",
                state="Pending"
            ))
            
        db.commit()
    except Exception as e:
        print(f"Error seeding users: {e}")
    finally:
        db.close()

# Mount Static Files (for PDF resources)
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include Routers
app.include_router(auth.router)
app.include_router(data.router)
app.include_router(admin.router)
app.include_router(clearance.router)
app.include_router(resources.router)

# --- AI INITIALIZATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "chroma_db")
embedding_function = None
vector_db = None
llm = None

try:
    # Check for Gemini API Key (often GOOGLE_API_KEY is standard for GenAI)
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    
    if gemini_key and not gemini_key.startswith("your-api-key"):
        print("Initializing Gemini AI Components...")
        
        # 1. Initialize Gemini embedding model
        embedding_function = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001",
            google_api_key=gemini_key
        )
        
        # 2. Load the pre-computed Chroma database locally
        vector_db = Chroma(
            persist_directory=DB_PATH, 
            embedding_function=embedding_function
        )
        
        # 3. Initialize Gemini LLM for chatting
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash", 
            temperature=0.2, 
            google_api_key=gemini_key
        )
        print("Successfully initialized Gemini as primary LLM.")
    else:
        print("WARNING: No valid Gemini API Key found. AI features disabled.")
except Exception as e:
    print(f"WARNING: Failed to initialize AI components: {e}")

# --- EXTERNAL TOOLS ---
tavily = None
try:
    if os.getenv("TAVILY_API_KEY"):
        tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
except Exception:
    pass

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

# --- CORE AI LOGIC FUNCTION ---
SESSION_HISTORY = {} # dict mapping session_id -> list of messages

async def build_nysc_messages(question: str, session_id: str) -> list:
    today = datetime.date.today().strftime("%B %d, %Y")

    internal_knowledge = ""
    if vector_db:
        db_results = await vector_db.asimilarity_search(question, k=3)
        internal_knowledge = "\n".join([doc.page_content for doc in db_results])
    
    web_context = ""
    if tavily:
        print(f"Searching web for: NYSC Nigeria official news {question}")
        try:
            web_response = tavily.search(
                query=f"NYSC Nigeria official news {question}", 
                search_depth="basic", 
                max_results=2,
                include_domains=["nysc.gov.ng", "nyscselfservice.com.ng", "legit.ng" , "punchng.com", "vanguardngr.com", "dailypost.ng", "thecable.ng"] 
            )
            web_context = "\n".join([result["content"] for result in web_response["results"]])
        except Exception as e:
            print(f"Tavily Search Error: {e}")
            
    system_prompt = f"""
    You are an NYSC Guidance Assistant, designed to provide accurate, professional, and supportive information to all categories of users: Corps Members (CMs), Prospective Corps Members (PCMs), NYSC officials, and the general public.
    
    CURRENT DATE: {today}
    
    INSTRUCTIONS:
    1. DIRECT RESPONSE: Always begin with the answer itself. Avoid filler phrases.
    2. STRUCTURED FORMATTING: 
       - Use **numbered steps** (1. 2. 3.) for all instructions (e.g., checking Senate Lists, Registration).
       - Use **bullet points** for lists of items.
       - Use "🔹" for section headers if the answer is long.
    3. REAL-TIME AWARENESS: 
       - Prioritize 'WEB NEWS' for recent announcements (e.g., "Orientation Camp Status"). 
       - If web news confirms "No camp activities", state that clearly.
    4. TIPS & WARNINGS:
       - Use "✅ Tip:" for helpful hints (e.g., "Ensure your matriculation number is correct").
       - Use "❌ Warning:" or "⚠️ Note:" for critical cautions (e.g., "Do not pay anyone for posting").
    5. TONE: Professional, authoritative, yet approachable.
    
    <INTERNAL_KNOWLEDGE>
    {internal_knowledge}
    </INTERNAL_KNOWLEDGE>

    <WEB_NEWS>
    {web_context}
    </WEB_NEWS>
    """
    
    messages = [SystemMessage(content=system_prompt)]
    
    if session_id not in SESSION_HISTORY:
        SESSION_HISTORY[session_id] = []
        
    for msg in SESSION_HISTORY[session_id][-10:]:
        messages.append(msg)
        
    current_msg = HumanMessage(content=question)
    messages.append(current_msg)
    SESSION_HISTORY[session_id].append(current_msg)
    
    return messages

async def stream_nysc_answer(question: str, session_id: str):
    try:
        messages = await build_nysc_messages(question, session_id)
        if llm:
            full_response = ""
            async for chunk in llm.astream(messages):
                yield chunk.content
                full_response += chunk.content
            SESSION_HISTORY[session_id].append(AIMessage(content=full_response))
        else:
            yield "I am currently in Maintenance Mode. AI features are temporarily disabled. Please check back later or contact support for assistance."
    except Exception as e:
        print(f"Error streaming response: {e}")
        yield "I am currently upgrading my database to serve you better. Please try again in a moment."

async def get_nysc_answer(question: str, session_id: str = "default") -> str:
    try:
        messages = await build_nysc_messages(question, session_id)
        if llm:
            response = await llm.ainvoke(messages)
            SESSION_HISTORY[session_id].append(AIMessage(content=response.content))
            return response.content
        else:
            return "I am currently in Maintenance Mode. AI features are temporarily disabled."
    except Exception as e:
        print(f"Error getting answer: {e}")
        return "I am experiencing technical difficulties. Please try again later."

# --- API ENDPOINTS ---

class QueryRequest(BaseModel):
    question: str
    session_id: str = "default_session"

@app.post("/ask")
@limiter.limit("10/minute")
async def ask_question(request: Request, payload: QueryRequest):
    return StreamingResponse(
        stream_nysc_answer(payload.question, payload.session_id),
        media_type="text/event-stream"
    )

@app.post("/telegram")
async def telegram_webhook(request: Request):
    data = await request.json()
    if "message" in data:
        chat_id = data["message"]["chat"]["id"]
        user_text = data["message"].get("text", "")
        if user_text:
            ai_reply = await get_nysc_answer(user_text, session_id=str(chat_id))
            url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
            payload = {"chat_id": chat_id, "text": ai_reply}
            requests.post(url, json=payload)
    return {"status": "ok"}

@app.get("/")
def home():
    return {"message": "NYSC AI is Live (Fine-Tuned)!"}

@app.on_event("startup")
async def startup_event():
    seed_users()
    
    # Start Background Jobs
    scheduler = BackgroundScheduler()
    # Run immediately on startup for demo purposes, then every 4 hours
    scheduler.add_job(fetch_and_store_news, 'interval', hours=4, next_run_time=datetime.datetime.now())
    scheduler.start()

    print("\n" + "="*50)
    print(" NYSC SMART BOT BACKEND IS RUNNING")
    print("="*50)
    print(" API Documentation: /docs")
    print(" Frontend API URL:  (Configured via ENV)")
    print("="*50 + "\n")