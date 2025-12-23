# NYSC Smart Companion AI 🇳🇬

![NYSC AI](https://img.shields.io/badge/Status-Live-green) ![License](https://img.shields.io/badge/License-MIT-blue)

A next-generation **AI-powered assistant** designed to guide Prospective and Serving Corps Members through their Service Year. This project combines a **FastAPI** backend with a modern **React (Vite)** frontend to deliver real-time answers, personalized timelines, and resource management.

---

## 🚀 Live Demo
- **Frontend (Vercel)**: [https://nysc-smart-bot.vercel.app](https://nysc-smart-bot.vercel.app)
- **Backend API (Render)**: [https://nysc-bot-api.onrender.com](https://nysc-bot-api.onrender.com)
- **Telegram Bot**: *(Run locally or verify via Webhook)*

---

## ✨ Key Features

### 🤖 Intelligent AI Chat
- **RAG System (Retrieval Augmentation Generation)**: built with LangChain & ChromaDB.
- **Context-Aware**: Knows the current date and NYSC specific procedures.
- **Hybrid Search**: Combines internal official guidelines with live web search (Tavily HTTP) for recent news.

### 🔐 Robust Authentication
- **Secure Signup/Login**: JWT-based authentication with Bcrypt hashing.
- **Social Auth Integration**: Login seamlessly with Google, Facebook, or GitHub.
- **Role-Based Access**: Specialized views for PCMs, Corps Members, and Officials.
- **Persistent Sessions**: Auto-login functionality via local storage tokens.

### 📅 Dynamic Timeline & Dashboard
- **Smart Timeline**: Automatically calculates Mobilization, Camp, and P.O.P dates based on user inputs.
- **ResourceHub**: Download official PDFs (Bye-Laws, SAED Handbook) directly from the dashboard.
- **Responsive UI**: Beautiful dark/light mode capable interface built with TailwindCSS.

### 📱 Telegram Integration
- **Cross-Platform**: Chat with the same AI intelligence via Telegram.
- **Webhook Support**: Fully integrated webhook setup for real-time responses.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **AI/ML**: LangChain, OpenAI/Gemini API, ChromaDB (Vector Store)
- **Tools**: Uvicorn, Python-Dotenv

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: TailwindCSS 4, Lucide Icons
- **State/Auth**: Context API, Axios, React Hot Toast

---

## ⚙️ Local Setup Guide

### Prerequisites
- Node.js & npm
- Python 3.10+
- Git

### 1. Clone & Install
```bash
git clone https://github.com/your-username/nysc-bot.git
cd nysc-bot
```

### 2. Environment Variables
Create a `.env` file in `backend/` and add your keys:
```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
TAVILY_API_KEY=tvly-...
TELEGRAM_TOKEN=123456:ABC...
SECRET_KEY=your_secret_key
```

### 3. Run Locally (The Easy Way)
We have included a startup script for Windows:
- Double-click `start_app.bat`

**Or manually:**
- **Backend**: `cd backend && uvicorn main:app --reload --port 8000`
- **Frontend**: `cd frontend && npm run dev`

---

## ☁️ Deployment Guide

### Backend (Render)
1. Push code to GitHub.
2. Create a new **Web Service** on Render connected to your repo.
3. **Build Command**: `pip install -r backend/requirements.txt`
4. **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port 10000`
5. **Environment Variables**: Add all keys from your local `.env` to Render Dashboard.

### Frontend (Vercel)
1. Import your GitHub repo to Vercel.
2. **Framework Preset**: Vite
3. **Root Directory**: `frontend`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://nysc-bot-api.onrender.com`

### Telegram Webhook
To connect your Telegram Bot to the live Render Backend:
1. Ensure your Render backend is deployed.
2. Locally, run the helper script:
   ```bash
   python backend/set_webhook.py
   ```
3. Enter your Render URL when prompted (e.g., `https://nysc-bot-api.onrender.com`).

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the MIT License.
