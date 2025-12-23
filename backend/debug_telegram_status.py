import os
import requests
from dotenv import load_dotenv
import sys

# Force load .env from backend directory if running from root
if os.path.exists("backend/.env"):
    load_dotenv("backend/.env")
else:
    load_dotenv()

TOKEN = os.getenv("TELEGRAM_TOKEN")

def check_webhook_status():
    if not TOKEN:
        print("❌ Error: TELEGRAM_TOKEN not found in .env")
        return

    print(f"Token (masked): {TOKEN[:5]}...{TOKEN[-5:]}")
    
    url = f"https://api.telegram.org/bot{TOKEN}/getWebhookInfo"
    try:
        response = requests.get(url)
        response.raise_for_status()
        info = response.json()
        
        if info.get("ok"):
            result = info["result"]
            print("\n--- 🔍 Telegram Webhook Status ---")
            print(f"URL: {result.get('url', 'Not Set')}")
            print(f"Has Custom Certificate: {result.get('has_custom_certificate')}")
            print(f"Pending Updates: {result.get('pending_update_count')}")
            print(f"Last Error Date: {result.get('last_error_date')}")
            print(f"Last Error Message: {result.get('last_error_message', 'None')}")
            print(f"Max Connections: {result.get('max_connections')}")
            print("----------------------------------\n")
            
            if result.get('last_error_message'):
                print("⚠️  DIAGNOSIS: Telegram is reporting errors delivering to your server.")
                print("   Please check if your Render service is awake and the URL is correct.")
            elif not result.get('url'):
                print("⚠️  DIAGNOSIS: Webhook URL is NOT set.")
            else:
                print("✅ Status looks OK from Telegram's side.")
                print("   If bot is silent, check:")
                print("   1. Did you add OPENAI_API_KEY / GEMINI_API_KEY to Render Dashboard?")
                print("   2. Is the Render service crashing? (Check Render Logs)")
                
        else:
            print("❌ Failed to get webhook info:", info)
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    check_webhook_status()
