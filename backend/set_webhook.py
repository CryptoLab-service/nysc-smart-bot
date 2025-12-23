import os
import requests
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("TELEGRAM_TOKEN")

if not TOKEN:
    print("Error: TELEGRAM_TOKEN not found in .env")
    exit(1)

def set_webhook():
    print("--- Telegram Webhook Setup ---")
    print("To receive messages, Telegram needs a public HTTPS URL forwarding to your local server.")
    print("If you are using ngrok, it looks like: https://xxxx-xx-xx.ngrok-free.app")
    print("If you are deploying to Render, it looks like: https://your-app.onrender.com")
    
    base_url = input("\nEnter your Public HTTPS URL (without /telegram): ").strip()
    
    if base_url.endswith("/"):
        base_url = base_url[:-1]
        
    webhook_url = f"{base_url}/telegram"
    
    print(f"\nSetting webhook to: {webhook_url}")
    
    url = f"https://api.telegram.org/bot{TOKEN}/setWebhook"
    response = requests.post(url, json={"url": webhook_url})
    
    if response.status_code == 200:
        print("Success!", response.json())
    else:
        print("Failed!", response.text)

if __name__ == "__main__":
    set_webhook()
