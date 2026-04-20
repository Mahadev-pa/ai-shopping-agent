# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os

from app.agents.orchestrator import OrchestratorAgent

app = FastAPI(title="AI Shopping Agent")

# CORS - Production साठी
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-shopping-agent-frontend.vercel.app",
        "https://*.onrender.com",
        "https://*.railway.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = OrchestratorAgent()

class SearchRequest(BaseModel):
    query: str
    max_price: Optional[float] = None
    min_rating: Optional[float] = None
    preferred_stores: Optional[List[str]] = None

@app.get("/")
async def root():
    return {"message": "AI Shopping Agent API", "status": "running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/search")
async def search_products(request: SearchRequest):
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
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
