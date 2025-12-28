# 🇳🇬 NYSC Smart Companion (AI-Powered)

![Build Status](https://img.shields.io/badge/Status-Live-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/Frontend-React_19-cyan) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-teal)

A premium, AI-driven assistant designed to guide Nigerian Youth Corps Members through their Service Year. From intelligent query resolution to automated clearance workflows, **NYSC Smart Companion** is the ultimate digital toolkit.

---

## ⚡ Quick Links
- **🌐 Live App**: [https://nysc-smart-bot.vercel.app](https://nysc-smart-bot.vercel.app)
- **🔌 API Documentation**: [https://nysc-bot-api.onrender.com/docs](https://nysc-bot-api.onrender.com/docs)
- **📱 Telegram Bot**: *(Available via separate webhook)*

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User]) <--> Client[React Frontend (Vite)]
    Client <--> API[FastAPI Backend]
    
    subgraph "Backend Services"
        API <--> Auth[Auth Service (JWT/Bcrypt)]
        API <--> AI[LangChain AI Agent]
        API <--> DB[(SQLite/Postgres Database)]
        API <--> Scheduler[APScheduler (News Fetcher)]
    end
    
    subgraph "External Integrations"
        AI <--> Chroma[ChromaDB Vector Store]
        AI <--> OpenAI[OpenAI/Gemini API]
        AI <--> Tavily[Tavily Search API]
    end
```

---

## ✨ Key Features

### 🧠 Hybrid AI Core
- **RAG + Real-Time Web Search**: Combines official NYSC Bye-Laws (Vector Store) with live news from the web (Tavily) to answer questions like *"When is 2025 Batch A streaming?"* accurately.
- **Context-Aware**: Understands the user's state (PCM, Serving, Official) to tailor responses.

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern, frosted-glass interface with smooth framer-motion animations.
- **Mobile-First**: Dedicated Bottom Navigation Bar for mobile users, mimicking a native app experience.
- **Tools Hub**: Features a client-side **ID Card Generator** (HTML5 Canvas) and Monthly Clearance Tracker.

### 🔐 Secure Role Management
- **Multi-Role Dashboards**:
    - **PCMs**: Mobilization timeline, Packing Checklists.
    - **Corps Members**: Clearance requests, PPA details.
    - **Admins**: Content Management Systems (CMS) for posting News and uploading Resources.

### 🛠️ Automated Operations
- **News Aggregator**: A background scheduler fetches fresh NYSC news every 6 hours automatically.
- **Resource Library**: Dynamic repository for downloadable official forms and guides.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### 1. Installation
Clone the repository:
```bash
git clone https://github.com/CryptoLab-service/nysc-smart-bot.git
cd nysc-bot
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```
**Configure Environment**: Create a `.env` file in `backend/`:
```env
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
TAVILY_API_KEY=your_key
SECRET_KEY=super_secret
DATABASE_URL=sqlite:///./nysc_bot.db
```
Start Server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contribution
We welcome contributions! Please see `CONTRIBUTING.md` for details on how to submit Pull Requests.

## 📄 License
This project is open-sourced under the MIT License.
