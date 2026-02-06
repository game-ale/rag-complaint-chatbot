from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import sys
import os

# Ensure src is in path to import pipeline
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from rag_pipeline import RAGPipeline

# Initialize App & Pipeline
app = FastAPI(title="CrediTrust Complaint RAG API", version="1.0")

# CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading RAG Pipeline shortly...")
rag_pipeline = RAGPipeline()

# --- Pydantic Models ---
class FilterParams(BaseModel):
    product: Optional[str] = None
    company: Optional[str] = None

class QuestionRequest(BaseModel):
    question: str
    filters: Optional[FilterParams] = None

class SourceItem(BaseModel):
    text: str
    product: str
    company: str
    complaint_id: str

class AnswerResponse(BaseModel):
    question: str
    answer: str
    sources: List[SourceItem]

# --- Endpoints ---
@app.get("/")
def health_check():
    return {"status": "ok", "message": "RAG API is running"}

@app.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest):
    try:
        # Convert Pydantic filters to dict
        filters_dict = request.filters.dict(exclude_none=True) if request.filters else None
        
        # Get Response from RAG
        result = rag_pipeline.answer_question(request.question, filters=filters_dict)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
