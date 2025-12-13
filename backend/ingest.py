import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# 1. Load Environment Variables (API Key)
load_dotenv()

# Define where the data is and where the database will be
DATA_PATH = "nysc_documents"
DB_PATH = "chroma_db"

def create_vector_db():
    print(f"Loading documents from {DATA_PATH}...")
    
    # 2. Load the Documents (PDFs and TXT files)
    # We use DirectoryLoader to grab everything in the folder
    loader = DirectoryLoader(DATA_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()
    
    # If you also have text files, you can uncomment this:
    txt_loader = DirectoryLoader(DATA_PATH, glob="**/*.txt", loader_cls=TextLoader)
    documents.extend(txt_loader.load())

    if not documents:
        print("No documents found! Please check your nysc_documents folder.")
        return

    print(f"Loaded {len(documents)} documents. Splitting text...")

    # 3. Split Text into Chunks
    # AI can't read a whole book at once. We cut it into smaller pieces.
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.")

    # 4. Save to ChromaDB (The Vector Database)
    print("Saving to Vector Database (this may take a moment)...")
    
    # This sends text to OpenAI to turn into numbers (embeddings)
    embedding_function = OpenAIEmbeddings()
    
    # Create the database on your disk
    Chroma.from_documents(
        documents=chunks, 
        embedding=embedding_function, 
        persist_directory=DB_PATH
    )
    
    print(f"Success! Database created at '{DB_PATH}'.")

if __name__ == "__main__":
    create_vector_db()