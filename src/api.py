from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import sys
import os
import csv
from datetime import datetime
from sqlalchemy.orm import Session

# Ensure src is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from rag_pipeline import RAGPipeline
from database import get_db, User, RoleEnum
from auth import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

# Initialize App & Pipeline
app = FastAPI(title="CrediTrust Complaint RAG API", version="1.0")

# CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading RAG Pipeline shortly...")
rag_pipeline = RAGPipeline()

# --- Initialization ---
@app.on_event("startup")
def create_initial_admin():
    db = next(get_db())
    admin = db.query(User).filter(User.email == "admin@creditrust.com").first()
    if not admin:
        print("Creating default admin user...")
        admin = User(
            email="admin@creditrust.com",
            name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role=RoleEnum.admin
        )
        db.add(admin)
        db.commit()

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

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str

    class Config:
        from_attributes = True

class ModelSwitchRequest(BaseModel):
    model_name: str

# --- Auth Endpoints ---

@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password, name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role.value}}

@app.get("/api/auth/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- Settings Endpoints ---

@app.get("/api/settings/model")
def get_active_model(current_user: User = Depends(get_current_user)):
    return {"active_model": rag_pipeline.active_model}

@app.post("/api/settings/model")
def set_active_model(req: ModelSwitchRequest, current_user: User = Depends(get_current_user)):
    try:
        new_model = rag_pipeline.switch_model(req.model_name)
        return {"status": "success", "active_model": new_model}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Application Endpoints ---

@app.get("/")
def health_check():
    return {"status": "ok", "message": "RAG API is running"}

@app.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest, current_user: User = Depends(get_current_user)):
    try:
        # Convert Pydantic filters to dict
        filters_dict = request.filters.model_dump(exclude_none=True) if request.filters else None
        
        # Get Response from RAG
        result = rag_pipeline.answer_question(request.question, filters=filters_dict)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/complaints/stats")
def get_complaint_stats(current_user: User = Depends(get_current_user)):
    # Return realistic mock stats for the Analytics dashboard
    return {
        "byProduct": [
            {"name": "Credit card", "value": 12450},
            {"name": "Personal loan", "value": 8200},
            {"name": "Mortgage", "value": 4500},
            {"name": "Bank account", "value": 3100},
            {"name": "Money transfer", "value": 2800}
        ],
        "byMonth": [
            {"month": "Jan", "complaints": 2100, "resolved": 1800},
            {"month": "Feb", "complaints": 2400, "resolved": 1900},
            {"month": "Mar", "complaints": 2800, "resolved": 2100},
            {"month": "Apr", "complaints": 2600, "resolved": 2300},
            {"month": "May", "complaints": 3100, "resolved": 2600},
            {"month": "Jun", "complaints": 3500, "resolved": 3000}
        ],
        "topIssues": [
            {"issue": "Billing dispute", "count": 8450},
            {"issue": "Fraudulent charges", "count": 6200},
            {"issue": "High interest rates", "count": 4100},
            {"issue": "Customer service", "count": 3800}
        ],
        "topCompanies": [
            {"company": "CitiBank", "count": 9200},
            {"company": "Wells Fargo", "count": 8100},
            {"company": "Chase", "count": 7500},
            {"company": "Capital One", "count": 6800}
        ],
        "narrativeStats": {
            "total": 464021,
            "withNarrative": 142050,
            "avgLength": 840
        }
    }

@app.get("/api/complaints/recent")
def get_recent_complaints(limit: int = 20, current_user: User = Depends(get_current_user)):
    complaints = []
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "complaints.csv")
    
    if os.path.exists(file_path):
        try:
            with open(file_path, mode='r', encoding='utf-8') as f:
                reader = csv.reader(f)
                header = next(reader) # Skip header
                count = 0
                for row in reader:
                    if len(row) > 10:
                        complaints.append({
                            "id": f"CFPB-{row[11] if len(row) > 11 else '00000'}",
                            "product": row[1] if row[1] else "Unknown",
                            "issue": row[3] if len(row) > 3 else "Unknown",
                            "company": row[7] if len(row) > 7 else "Unknown",
                            "state": row[8] if len(row) > 8 else "Unknown",
                            "date": row[0] if row[0] else datetime.now().strftime("%Y-%m-%d"),
                            "narrative": row[5] if len(row) > 5 else ""
                        })
                        count += 1
                    if count >= limit:
                        break
        except Exception as e:
            print(f"Error reading CSV: {e}")
    
    # Fallback to mock data if file reading fails
    if not complaints:
        complaints = [
            { "id": "CFPB-4392", "product": "Credit card", "issue": "Billing dispute", "company": "CitiBank", "state": "FL", "date": "2026-02-15" },
            { "id": "CFPB-4391", "product": "Mortgages", "issue": "Loan modification", "company": "Wells Fargo", "state": "CA", "date": "2026-02-14" },
            { "id": "CFPB-4390", "product": "Bank account", "issue": "Account access", "company": "Chase", "state": "NY", "date": "2026-02-14" },
        ]
        
    return complaints

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
