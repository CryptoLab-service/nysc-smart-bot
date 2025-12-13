# NYSC Smart Assistant Bot

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-RAG-green?style=for-the-badge)

> **The NYSC Smart Assistant is a powerful, all‑in‑one digital companion for Graduates, Prospective Corps Members (PCMs), serving Corps Members (CMs), parents, and anyone seeking trusted information about the NYSC scheme. It is a Hybrid AI Agent that integrates official NYSC Bye‑Laws, publications, policies, historical data, and real‑time verified updates to deliver accurate, instant, and reliable answers.**
>
> **Built to eliminate misinformation, the NYSC Bot provides clear guidance across every stage of the NYSC journey — from pre‑mobilization and deployment to camp rules, posting, relocation, and service‑year operations. Continuously updated with the latest announcements and guidelines, it ensures users always receive current, authoritative, and dependable information about the scheme.**

---

## 🚀 Live Demo
**Backend API:** [https://nysc-bot-api.onrender.com/docs](https://nysc-bot-api.onrender.com/docs)  
**Frontend App:** *(Link coming soon)*

---

## 🧠 How It Works (The Architecture)

This system goes far beyond a regular chatbot — it is a fully engineered **Retrieval‑Augmented Generation (RAG)** platform designed to connect complex NYSC policies with the everyday questions of Prospective Corps Members (PCMs), Corps Members (CMs), parents, and the general public.

### 1. The Knowledge Base (The Library) 📚
At its core is a rich, structured knowledge repository built from officially recognized NYSC materials. The bot has indexed and understands:
* **NYSC Bye‑Laws (Revised 2011)**
* **Official Publications, Handbooks & Circulars**
* **Service Year Policies & Historical Engagement Records**
* **Standard Operating Procedures (SOPs) and Administrative Guidelines**

This ensures every response is grounded in verified, authoritative information.

### 2. The Eyes (Real‑Time Information Layer) 🌐
NYSC processes evolve constantly — static data isn’t enough.  
The system integrates a **real‑time search layer** that fetches up‑to‑date information such as:
* Camp registration timelines
* Senate list updates
* Mobilization news
* Official announcements and policy changes

This keeps the bot aligned with the latest developments across the NYSC ecosystem.

### 3. The Brain (Generative AI Engine) 🤖
Using a powerful **Generative AI model**, the bot blends:
* Verified knowledge from the internal library  
* Fresh updates from the live web  

It then synthesizes both into **clear, accurate, context‑aware answers** tailored to the user’s question.

---

## ✨ Key Features

✅ **Comprehensive Knowledge:** Provides accurate answers on everything from Camp Rules and Code of Conduct to CDS, LGA postings, and POP procedures.  
✅ **Hybrid Intelligence:** Combines officially indexed NYSC documents (PDFs, Bye‑Laws, SOPs) with real‑time verified updates from the web.  
✅ **Context‑Aware Responses:** Automatically cites its information sources (e.g., *“According to the 2011 Bye‑Laws…”* or *“Based on the latest NYSC update…”*).  
✅ **High Performance:** Powered by FastAPI for ultra‑fast, low‑latency responses.  
✅ **Modern UI:** Clean, mobile‑friendly React interface optimized for accessibility and smooth user experience.  
✅ **Always Up‑to‑Date:** Continuously refreshes its knowledge base to prevent misinformation and ensure accuracy.  

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Python & FastAPI | High‑performance API powering the bot’s core logic. |
| **AI Orchestration** | LangChain | Coordinates the RAG pipeline, tools, and reasoning steps. |
| **Vector Database** | ChromaDB | Stores embeddings for semantic search and document retrieval. |
| **Search Layer** | Tavily API | Fetches real‑time NYSC news, updates, and announcements. |
| **Frontend** | React + Vite | Fast, responsive, and mobile‑optimized chat interface. |
| **Hosting** | Render (API) & Vercel (UI) | Reliable cloud infrastructure for global availability. |

---

## ⚡ Quick Start (Run Locally)

### Prerequisites
* Python 3.10+
* Node.js 16+

### 1. Clone the Repo
```bash
git clone [https://github.com/CryptoLab-service/nysc-smart-bot.git](https://github.com/CryptoLab-service/nysc-smart-bot.git)
cd nysc-smart-bot
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate | Mac: source venv/bin/activate)
pip install -r requirements.txt

# Create .env file with your keys:
# OPENAI_API_KEY=sk-...
# TAVILY_API_KEY=tvly-...

# Ingest Data
python ingest.py

# Run Server
uvicorn main:app --reload
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📄 About the creator
Built with ❤️ by Oluwalowo Toluwalope John.
Toluwalope John Oluwalowo is a Designer, AI-Software Developer, Automation Specialist, a techie and a serving Corps Member (2025 Batch A1) currently serving in the FCT. I built this tool to help Prospective Corps Member (PCMs) and felow Corpers navigate the service year with ease, removing the confusion of unverified information.

## ☕ Support the Project
If this bot saved you stress or you love the innovation, consider buying me a coffee to keep the servers running and integrated into various social media platfoms!   
![Email](https://img.shields.io/badge/Email-oluwalowojohn@gmail.com-blue?style=for-the-badge&logo=gmail&logoColor=white)  ![WhatsApp](https://img.shields.io/badge/WhatsApp-2347030739128-green?style=for-the-badge&logo=whatsapp&logoColor=white)


---

## 🤝 Contributing
Contributions are welcome!

Fork the Project

Create your Feature Branch (```git checkout -b feature/AmazingFeature```)

Commit your Changes (```git commit -m 'Add some AmazingFeature'```)

Push to the Branch (```git push origin feature/AmazingFeature```)

Open a Pull Request

## 📄 License
Distributed under the MIT License. See LICENSE for more information.

---

Built with ❤️ for Nigerian Corpers.
