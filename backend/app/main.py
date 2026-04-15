# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uvicorn
import os

from app.agents.orchestrator import OrchestratorAgent

app = FastAPI(title="AI Shopping Agent - Multi-Agent System")

# CORS - Allow all origins for production (Render + Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local React
        "http://localhost:5173",           # Local Vite
        "https://ai-shopping-agent-frontend.vercel.app",  # Vercel production
        "https://*.vercel.app",             # All Vercel preview deployments
        "https://ai-shopping-agent.vercel.app",  # Custom domain if any
        "https://*.onrender.com",           # Render backend itself
    ],
    allow_credentials=True,
    allow_methods=["*"],                    # Allow all HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
    allow_headers=["*"],                    # Allow all headers
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
        "agents": ["Planner", "Search", "Analyzer", "Decision", "Orchestrator"],
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents_ready": True,
        "cors_configured": True
    }

@app.post("/api/search")
async def search_products(request: SearchRequest):
    """Main endpoint - Orchestrates all agents"""
    try:
        print(f"📝 Search request received: {request.query}")
        
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
        print(f"❌ Error in search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.options("/api/search")
async def options_search():
    """Handle OPTIONS request for CORS preflight"""
    return {"message": "OK"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
