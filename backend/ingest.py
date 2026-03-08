import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader, DirectoryLoader
from langchain_text_splitters import MarkdownTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

# Load Environment Variables (API Key)
load_dotenv()

# Define where the data is and where the database will be
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "nysc_documents")
DB_PATH = os.path.join(BASE_DIR, "chroma_db")

def create_vector_db():
    print(f"Loading documents from {DATA_PATH}...")
    
    # Load the Documents (PDFs and TXT files)
    # DirectoryLoader to grab everything in the folder
    loader = DirectoryLoader(DATA_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()
    
    # To also access text files if available, (uncomment this to use):
    txt_loader = DirectoryLoader(DATA_PATH, glob="**/*.txt", loader_cls=TextLoader)
    documents.extend(txt_loader.load())

    if not documents:
        print("No documents found! Please check your nysc_documents folder.")
        return

    print(f"Loaded {len(documents)} documents. Splitting text...")

    # Split Text into Chunks
    # AI can't read a whole book at once. We cut it into smaller pieces.
    text_splitter = MarkdownTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.")

    import time
    import shutil

    # If DB already exists, clear it so we don't duplicate data when retrying
    if os.path.exists(DB_PATH):
        print(f"Clearing old database at {DB_PATH} to start fresh...")
        shutil.rmtree(DB_PATH)

    # Save to ChromaDB (The Vector Database)
    print("Saving to Vector Database in batches to avoid API quota exhaustion...")
    
    # This sends text to Gemini to turn into numbers (embeddings)
    embedding_function = GoogleGenerativeAIEmbeddings(model="models/embedding-001") 
    
    # Initialize the database on your disk
    vector_db = Chroma(
        embedding_function=embedding_function, 
        persist_directory=DB_PATH
    )
    
    # Process chunks in smaller batches
    BATCH_SIZE = 50 
    
    total_batches = (len(chunks) - 1) // BATCH_SIZE + 1
    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i : i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        print(f"Processing batch {batch_num} of {total_batches} ({len(batch)} chunks)...")
        
        # Add batch to the database
        vector_db.add_documents(batch)
        
        # Wait before processing the next batch to cool down API quota usage
        if i + BATCH_SIZE < len(chunks):
            print("Sleeping for 15 seconds to respect Gemini API rate limits...")
            time.sleep(15)
    
    print(f"Success! Database created at '{DB_PATH}'.")

if __name__ == "__main__":
    create_vector_db()