import os
from datetime import datetime
from tavily import TavilyClient
from sqlalchemy.orm import Session
from database import SessionLocal
import models

# Initialize Tavily
tavily = None
try:
    if os.getenv("TAVILY_API_KEY"):
        tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
except Exception:
    pass

def fetch_and_store_news():
    """
    Fetches latest NYSC news using Tavily and stores unique items in the database.
    This is intended to be run as a background job.
    """
    print(f"[{datetime.now()}] Starting News Fetch Job...")
    
    if not tavily:
        print("Tavily API Key not found. Skipping news fetch.")
        return

    try:
        # Search for latest news
        response = tavily.search(
            query="NYSC Nigeria latest official news updates", 
            search_depth="advanced", 
            max_results=5,
            include_domains=["nysc.gov.ng", "punchng.com", "vanguardngr.com", "dailypost.ng", "thecable.ng"]
        )
        
        db = SessionLocal()
        count = 0
        
        for result in response.get("results", []):
            title = result.get("title")
            url = result.get("url")
            content = result.get("content", "")[:200] + "..." # Truncate for summary
            
            # Check for duplicates
            existing = db.query(models.News).filter(models.News.title == title).first()
            if not existing:
                # Determine type based on keywords
                news_type = "General"
                lower_title = title.lower()
                if "mobilization" in lower_title or "timetable" in lower_title:
                    news_type = "Mobilization"
                elif "camp" in lower_title or "orientation" in lower_title:
                    news_type = "Guide"
                elif "official" in lower_title or "director" in lower_title:
                    news_type = "Official"

                new_news = models.News(
                    title=title,
                    content=content,
                    date=datetime.now().strftime("%Y-%m-%d"),
                    type=news_type,
                    url=url
                )
                db.add(new_news)
                count += 1
        
        db.commit()
        print(f"[{datetime.now()}] News Fetch Complete. Added {count} new items.")
        db.close()
        
    except Exception as e:
        print(f"Error fetching news: {e}")
