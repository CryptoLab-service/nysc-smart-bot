import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

TOKEN = os.getenv("TELEGRAM_TOKEN")
RENDER_URL = "https://nysc-bot-api.onrender.com"

def setup_webhook():
    if not TOKEN:
        print("❌ Error: TELEGRAM_TOKEN not found in .env file.")
        print("Please ensure you have added your Telegram Bot Token to backend/.env")
        return

    webhook_url = f"{RENDER_URL}/telegram"
    print(f"configured URL: {webhook_url}")
    
    # 1. Get current info (optional, just for debug)
    # 2. Set Webhook
    set_url = f"https://api.telegram.org/bot{TOKEN}/setWebhook"
    
    print(f"⏳ Attempting to set webhook to: {webhook_url}...")
    
    try:
        response = requests.post(set_url, json={"url": webhook_url})
        response.raise_for_status()
        result = response.json()
        
        if result.get("ok"):
            print("✅ SUCCESS! Telegram Webhook is now active.")
            print(f"   Messages sent to your bot will be forwarded to: {webhook_url}")
            print("   Response:", result.get("description"))
        else:
            print("❌ FAILED. Telegram returned an error:")
            print(result)
            
    except Exception as e:
        print(f"❌ Error setting webhook: {e}")

if __name__ == "__main__":
    setup_webhook()
