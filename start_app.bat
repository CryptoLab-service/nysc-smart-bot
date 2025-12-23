@echo off
echo ===================================================
echo   NYSC SMART COMPANION - DEVELOPER STARTUP
echo ===================================================

echo.
echo [1/3] Clearing old database to fix schema issues...
if exist "backend\nysc_bot.db" (
    del "backend\nysc_bot.db"
    echo    - Deleted old nysc_bot.db
) else (
    echo    - No existing database found.
)

echo.
echo [2/3] Starting Backend (New Terminal)...
start cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo.
echo [3/3] Starting Frontend (New Terminal)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo   Startup Initiated! 
echo.
echo   1. Backend running at: http://localhost:8000
echo   2. Frontend running at: Localhost URL shown in new window
echo.
echo   * To set Telegram Webhook, run: python backend/set_webhook.py
echo ===================================================
pause
