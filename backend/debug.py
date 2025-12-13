import langchain
import os

print("--- DEBUG INFO ---")
print(f"LangChain is loading from: {langchain.__file__}")

if "site-packages" in langchain.__file__:
    print("✅ GOOD: It is loading from the installed library.")
else:
    print("❌ BAD: It is loading from a local file!")
    print(f"ACTION: Rename or delete this file/folder: {os.path.dirname(langchain.__file__)}")