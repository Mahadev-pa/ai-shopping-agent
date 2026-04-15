# backend/app/agents/orchestrator.py
from typing import Dict
from app.agents.planner import PlannerAgent
from app.agents.search_agent import SearchAgent
from app.agents.analyzer_agent import AnalyzerAgent
from app.agents.decision_agent import DecisionAgent

class OrchestratorAgent:
    """Orchestrator - Coordinates all agents"""
    
    def __init__(self):
        self.planner = PlannerAgent()
        self.search_agent = SearchAgent()
        self.analyzer = AnalyzerAgent()
        self.decision_agent = DecisionAgent()
    
    async def process_query(self, query: str, max_price: float = None, min_rating: float = None) -> Dict:
        """Process user query"""
        
        print("\n" + "="*60)
        print("🤖 AI SHOPPING AGENT")
        print("="*60)
        
        print(f"\n📝 Searching for: '{query}'")
        
        print("\n🔍 Fetching products from all platforms...")
        products = await self.search_agent.search_all_stores({
            'query': query,
            'max_price': max_price or 2000
        })
        
        if not products:
            return {"recommendation": None, "alternatives": [], "reasoning": "No products found"}
        
        print(f"\n📊 Analyzing {len(products)} products...")
        analyzed_products = await self.analyzer.analyze_products(products)
        
        print("\n🎯 Making final decision...")
        decision = self.decision_agent.make_decision(analyzed_products, query)
        
        print(f"\n✅ Best product: {decision['recommendation']['store']} - {decision['recommendation']['name']}")
        print("="*60 + "\n")
        
        return decision