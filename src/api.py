from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import sys
import os
import csv
import json
from datetime import datetime
from sqlalchemy.orm import Session

# Ensure src is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from rag_pipeline import RAGPipeline
from database import get_db, User, RoleEnum, QueryHistory
from auth import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from datetime import timedelta
from stats_engine import StatsEngine
from jose import jwt, JWTError
import asyncio

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

print("Initializing StatsEngine...")
stats_engine = StatsEngine(os.path.join(os.path.dirname(__file__), "..", "data", "complaints.csv"))

# --- Initialization ---
@app.on_event("startup")
def startup_event():
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
    # Trigger initial load of stats asynchronously so it doesn't block startup completely
    # But for a portfolio, we might want it synchronous so first load isn't slow
    stats_engine.get_stats()

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
    
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None

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

@app.put("/api/auth/profile", response_model=UserResponse)
def update_profile(profile: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if profile.name:
        current_user.name = profile.name
    if profile.password:
        current_user.hashed_password = get_password_hash(profile.password)
    db.commit()
    db.refresh(current_user)
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

# --- History Endpoints ---
@app.get("/api/history")
def get_query_history(limit: int = 50, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(QueryHistory).filter(QueryHistory.user_id == current_user.id).order_by(QueryHistory.id.desc()).limit(limit).all()
    results = []
    for h in history:
        h_dict = {
            "id": h.id,
            "question": h.question,
            "answer": h.answer,
            "sources": json.loads(h.sources_json) if h.sources_json else [],
            "product_filter": h.product_filter,
            "response_time": h.response_time,
            "created_at": h.created_at
        }
        results.append(h_dict)
    return results

@app.delete("/api/history/{history_id}")
def delete_query_history(history_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(QueryHistory).filter(QueryHistory.id == history_id, QueryHistory.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
    db.delete(item)
    db.commit()
    return {"status": "success"}

# --- Application Endpoints ---

@app.get("/")
def health_check():
    return {"status": "ok", "message": "RAG API is running"}

@app.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        filters_dict = request.filters.model_dump(exclude_none=True) if request.filters else None
        
        start_time = datetime.now()
        result = rag_pipeline.answer_question(request.question, filters=filters_dict)
        elapsed = (datetime.now() - start_time).total_seconds()
        
        # Save to DB
        history_item = QueryHistory(
            user_id=current_user.id,
            question=request.question,
            answer=result.get("answer", ""),
            sources_json=json.dumps([s for s in result.get("sources", [])]),
            product_filter=filters_dict.get("product") if filters_dict else None,
            response_time=str(round(elapsed, 2))
        )
        db.add(history_item)
        db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/ask")
async def websocket_ask(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        request_data = json.loads(data)
        token = request_data.get("token")
        if not token:
            await websocket.close(code=1008)
            return
            
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                await websocket.close(code=1008)
                return
            user = db.query(User).filter(User.id == int(user_id)).first()
            if not user:
                await websocket.close(code=1008)
                return
        except JWTError:
            await websocket.close(code=1008)
            return
            
        question = request_data.get("question")
        filters = request_data.get("filters", None)
        
        start_time = datetime.now()
        token_generator, sources = rag_pipeline.answer_question_stream(question, filters=filters)
        
        full_answer = ""
        for text in token_generator():
            full_answer += text
            await websocket.send_json({"type": "token", "content": text})
            await asyncio.sleep(0.01) # Small delay to yield loop
            
        elapsed = (datetime.now() - start_time).total_seconds()
        await websocket.send_json({"type": "sources", "content": sources})
        await websocket.send_json({"type": "done", "response_time": elapsed})
        
        # Save to history
        history_item = QueryHistory(
            user_id=user.id,
            question=question,
            answer=full_answer.strip(),
            sources_json=json.dumps(sources),
            product_filter=filters.get("product") if filters else None,
            response_time=str(round(elapsed, 2))
        )
        db.add(history_item)
        db.commit()

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass

@app.get("/api/complaints/stats")
def get_complaint_stats(current_user: User = Depends(get_current_user)):
    return stats_engine.get_stats()

@app.get("/api/complaints/stats/refresh")
def refresh_complaint_stats(current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return stats_engine.load_and_compute(force=True)

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

@app.get("/api/complaints/search")
def search_complaints(q: Optional[str] = None, product: Optional[str] = None, page: int = 1, limit: int = 50, current_user: User = Depends(get_current_user)):
    return stats_engine.search_complaints(query=q, product=product, page=page, limit=limit)

@app.get("/api/complaints/compare")
def compare_products(productA: str, productB: str, current_user: User = Depends(get_current_user)):
    return stats_engine.compare_products(productA, productB)

@app.get("/api/complaints/trends")
def get_trends(current_user: User = Depends(get_current_user)):
    return stats_engine.get_trends()

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
