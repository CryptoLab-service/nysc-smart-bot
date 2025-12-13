# 🇳🇬 NYSC Smart Assistant (AI-Powered)

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-RAG-green?style=for-the-badge)

> **A Hybrid AI Agent that combines the strict NYSC Bye-Laws with real-time news to answer Prospective Corps Members' (PCM) questions accurately.**

---

## 🚀 Live Demo
**Backend API:** [https://nysc-bot-api.onrender.com/docs](https://nysc-bot-api.onrender.com/docs)  
**Frontend App:** *(Link coming soon)*

---

## 🧠 How It Works (The Architecture)

This isn't just a chatbot; it's a **Retrieval Augmented Generation (RAG)** engine.

1.  **The Knowledge Base:** It reads and "memorizes" the official **NYSC Bye-Laws (Revised 2011)**.
2.  **The Eyes (Web Scraping):** It uses **Tavily** to search the live internet for recent news (Camp dates, Senate lists).
3.  **The Brain:** It combines both sources and uses **OpenAI (GPT)** to synthesize an accurate answer.

### Key Features
* ✅ **Hybrid Intelligence:** Knows the rules (PDF) and the news (Web).
* ✅ **Context Aware:** Cites sources ("According to the Bye-Laws...").
* ✅ **Fast:** Built on FastAPI for high-performance responses.
* ✅ **Modern UI:** Clean React interface with chat history.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Python & FastAPI | The core logic engine. |
| **AI Logic** | LangChain | Orchestrates the RAG workflow. |
| **Database** | ChromaDB | Stores the Bye-Laws as vector embeddings. |
| **Search** | Tavily API | Real-time web scraping for news. |
| **Frontend** | React + Vite | Fast, responsive chat interface. |
| **Deployment** | Render & Vercel | Cloud hosting. |

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
