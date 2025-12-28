import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Config
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

def upload_file(file_obj):
    """
    Uploads a file-like object to Cloudinary and returns the secure URL.
    Returns None if upload fails or keys are missing.
    """
    if not os.getenv("CLOUDINARY_CLOUD_NAME"):
        print("Cloudinary keys missing. Returning mock URL.")
        return f"https://mock-cloudinary.com/{file_obj.filename}"

    try:
        # Upload directly from file object
        upload_result = cloudinary.uploader.upload(file_obj.file, resource_type="auto")
        return upload_result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary Upload Error: {e}")
        return None
