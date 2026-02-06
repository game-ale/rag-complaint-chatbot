import chromadb
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from langchain_community.llms import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate
import json

# Configuration
VECTOR_STORE_DIR = 'vector_store'
EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2'
LLM_MODEL_NAME = "google/flan-t5-base" # Lightweight, CPU-friendly
TOP_K = 5
MAX_CONTEXT_LENGTH = 1000 # Character limit for context to avoid token limits

class RAGPipeline:
    def __init__(self):
        print("Initializing RAG Pipeline...")
        # 1. Load Vector Store
        self.chroma_client = chromadb.PersistentClient(path=VECTOR_STORE_DIR)
        self.collection = self.chroma_client.get_collection("complaints_rag")
        
        # 2. Load Embedding Model
        print(f"Loading Embedding Model: {EMBEDDING_MODEL_NAME}...")
        self.embedder = SentenceTransformer(EMBEDDING_MODEL_NAME)
        
        # 3. Load LLM
        print(f"Loading LLM: {LLM_MODEL_NAME}...")
        self.generate_text = pipeline(
            model=LLM_MODEL_NAME, 
            task="text2text-generation", 
            max_new_tokens=200,
            temperature=0.1,
            do_sample=True
        )
        self.llm = HuggingFacePipeline(pipeline=self.generate_text)
        
        # 4. Define Prompt
        template = """You are a financial analyst Assistant for CrediTrust. Use the following context to answer the question. 
If the context does not contain the answer, say "I don't have enough information." and do not make up facts.

Context:
{context}

Question: {question}

Answer:"""
        self.prompt = PromptTemplate(template=template, input_variables=["context", "question"])
        self.chain = self.prompt | self.llm
        print("Pipeline Initialized.")

    def retrieve_context(self, question, filters=None, k=TOP_K):
        # Embed query
        query_vec = self.embedder.encode([question]).tolist()
        
        # Build filter dict
        where_filter = {}
        if filters:
            # Simple equality filters for now
            for key, val in filters.items():
                if val:
                    where_filter[key] = val
                    
        # Query Chroma
        # Handle case where filter is empty
        query_args = {
            "query_embeddings": query_vec,
            "n_results": k,
        }
        if where_filter:
            query_args["where"] = where_filter
            
        results = self.collection.query(**query_args)
        
        # Format results
        docs = []
        if results['documents']:
            for i, doc_text in enumerate(results['documents'][0]):
                meta = results['metadatas'][0][i]
                docs.append({
                    "text": doc_text,
                    "metadata": meta,
                    "score": results['distances'][0][i] if results['distances'] else 0
                })
        return docs

    def format_context(self, retrieved_docs):
        context_str = ""
        for doc in retrieved_docs:
            # Clean newlines to save space
            clean_text = doc['text'].replace("\n", " ")
            entry = f"- [Product: {doc['metadata']['product']}] {clean_text}\n"
            if len(context_str) + len(entry) < MAX_CONTEXT_LENGTH:
                context_str += entry
            else:
                break
        return context_str if context_str else "No relevant complaints found."

    def answer_question(self, question, filters=None):
        # 1. Retrieve
        print(f"Retrieving for: {question}...")
        docs = self.retrieve_context(question, filters)
        
        # 2. Format Context
        context = self.format_context(docs)
        
        # 3. Generate
        # If no docs found, fallback immediately? 
        # But 'No relevant complaints found' is in context, so LLM should handle it via prompt instructions.
        print("Generating Answer...")
        response = self.chain.invoke({"context": context, "question": question})
        
        # 4. Structure Output
        result = {
            "question": question,
            "answer": response.strip(),
            "sources": [
                {
                    "text": doc['text'], # React UI expects 'text'
                    "product": doc['metadata']['product'],
                    "company": doc['metadata']['company'],
                    "complaint_id": doc['metadata']['complaint_id']
                } for doc in docs
            ]
        }
        return result

# Simple CLI test
if __name__ == "__main__":
    rag = RAGPipeline()
    q = "What are the common issues with credit cards?"
    print(f"\nExample Query: {q}")
    ans = rag.answer_question(q, filters={"product": "Credit card"})
    print(json.dumps(ans, indent=2))
