import os
import requests
import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Imports for AI
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
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
from database import engine, Base, SessionLocal
import models
from routers import auth, data, admin, clearance
from fastapi.staticfiles import StaticFiles
from auth import get_password_hash

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Include Routers
app.include_router(auth.router)
app.include_router(data.router)
app.include_router(admin.router)
app.include_router(clearance.router)

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
                cds_group="ICT", # Fixed typo
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

DB_PATH = "chroma_db"
embedding_function = None
vector_db = None
llm = None

try:
    llm_openai = None
    llm_gemini = None
    
    # Initialize OpenAI
    if os.getenv("OPENAI_API_KEY") and not os.getenv("OPENAI_API_KEY").startswith("sk-placeholder"):
        print("Initializing OpenAI...")
        embedding_function = OpenAIEmbeddings()
        vector_db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function)
        llm_openai = ChatOpenAI(temperature=0.2, model="gpt-3.5-turbo")
    
    # Initialize Gemini
    if os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"):
        print("Initializing Gemini...")
        gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        # Note: If reusing ChromaDB embedded with OpenAI, switching LLMs is fine, but embeddings must match DB.
        llm_gemini = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=gemini_key, temperature=0.2)
        
    # Set default LLM (Prioritize OpenAI if both exist, or use whichever is available)
    if llm_openai:
        llm = llm_openai
        print("Using OpenAI as primary LLM.")
    elif llm_gemini:
        llm = llm_gemini
        print("Using Gemini as primary LLM.")
    else:
        print("WARNING: No valid API Key found (OpenAI or Gemini). AI features disabled.")
except Exception as e:
    print(f"WARNING: Failed to initialize AI components: {e}")

tavily = None
try:
    if os.getenv("TAVILY_API_KEY"):
        tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
except Exception:
    pass

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

# --- CORE AI LOGIC FUNCTION ---
def get_nysc_answer(question: str):
    try:
        # 0. Get Today's Date (Crucial for "Current Batch" questions)
        today = datetime.date.today().strftime("%B %d, %Y")

        # 1. Search Internal Database (Prioritize your "standard_procedures.txt")
        internal_knowledge = ""
        if vector_db:
            db_results = vector_db.similarity_search(question, k=3)
            internal_knowledge = "\n".join([doc.page_content for doc in db_results])
        
        # 2. Search Web (Refined Query)
        # We add "Official" to filter out random Facebook comments
        web_context = ""
        if tavily:
            print(f"Searching web for: NYSC Nigeria official news {question}")
            try:
                web_response = tavily.search(
                    query=f"NYSC Nigeria official news {question}", 
                    search_depth="basic", 
                    max_results=2,
                    include_domains=["nysc.gov.ng", "nyscselfservice.com.ng", "legit.ng" , "punchng.com", "vanguardngr.com", "dailypost.ng", "thecable.ng"] 
                    # (Optional: You can restrict to trusted news sites if Tavily allows, or just use general better queries)
                )
                web_context = "\n".join([result["content"] for result in web_response["results"]])
            except Exception as e:
                print(f"Tavily Search Error: {e}")
        
        # 3. Construct System Prompt
        system_prompt = f"""
        You are an NYSC Guidance Assistant, designed to provide accurate, professional, and supportive information to all categories of users: Corps Members (CMs), Prospective Corps Members (PCMs), NYSC officials, and the general public.
        
        CURRENT DATE: {today}
        
        INSTRUCTIONS:
        1. DIRECT RESPONSE: Always begin with the answer itself. Avoid filler phrases like "According to the latest news" or "Based on web search".
        2. KNOWLEDGE PRIORITY: Use the 'INTERNAL KNOWLEDGE' section as the primary source. Refer to 'WEB NEWS' only when specific dates or updates are missing internally.
        3. TONE & STYLE: Maintain a professional, authoritative, and approachable tone. Be respectful and supportive regardless of the audience. Do not mention benefits (e.g., "cars will be provided") unless explicitly stated in the knowledge base.
        4. PROCEDURES: When asked about documentation, registration, or travel, provide the exact step-by-step guidance outlined in 'INTERNAL KNOWLEDGE' and from the official NYSC self service website.
        5. AUDIENCE AWARENESS: Tailor responses appropriately:
            - For CMs and PCMs: Use simple, clear explanations and step-by-step guidance.
            - For NYSC officials: Provide precise, policy-aligned information.
            - For general users: Offer accessible explanations that clarify NYSC processes and context.
        6. CLARITY: Use numbered steps or bullet points when explaining procedures to make instructions easy to follow.
        7. CONSISTENCY: Ensure all responses are aligned with official NYSC standards and practices.
        
        <INTERNAL_KNOWLEDGE>
        {internal_knowledge}
        </INTERNAL_KNOWLEDGE>

        <WEB_NEWS>
        {web_context}
        </WEB_NEWS>
        """
        
        if llm:
            messages = [SystemMessage(content=system_prompt), HumanMessage(content=question)]
            response = llm.invoke(messages)
            return response.content
        else:
            return "I am currently in Maintenance Mode. AI features are temporarily disabled. Please check back later or contact support for assistance."
    except Exception as e:
        print(f"Error: {e}")
        return "I am currently upgrading my database to serve you better. Please try again in a moment."

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

@app.on_event("startup")
async def startup_event():
    seed_users()
    print("\n" + "="*50)
    print(" NYSC SMART BOT BACKEND IS RUNNING")
    print("="*50)
    print(" API Documentation: /docs")
    print(" Frontend API URL:  (Configured via ENV)")
    print("="*50 + "\n")
