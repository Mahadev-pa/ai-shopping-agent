# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uvicorn

from app.agents.orchestrator import OrchestratorAgent

app = FastAPI(title="AI Shopping Agent - Multi-Agent System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestrator
orchestrator = OrchestratorAgent()

class SearchRequest(BaseModel):
    query: str
    max_price: Optional[float] = None
    min_rating: Optional[float] = None
    preferred_stores: Optional[List[str]] = None

@app.get("/")
async def root():
    return {
        "message": "AI Shopping Agent - Multi-Agent System",
        "version": "2.0.0",
        "status": "running",
        "agents": ["Planner", "Search", "Analyzer", "Decision", "Orchestrator"]
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents_ready": True
    }

@app.post("/api/search")
async def search_products(request: SearchRequest):
    """Main endpoint - Orchestrates all agents"""
    try:
        result = await orchestrator.process_query(
            query=request.query,
            max_price=request.max_price,
            min_rating=request.min_rating
        )
        
        return {
            "session_id": datetime.now().strftime("%Y%m%d%H%M%S"),
            "status": "completed",
            **result
        }
        
    except Exception as e:
        print(f"Error in search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)