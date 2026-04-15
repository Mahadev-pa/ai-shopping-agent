
# backend/app/agents/planner.py
from typing import Dict, List, Optional
import json

class PlannerAgent:
    """Planning Agent - Determines search strategy"""
    
    def create_plan(self, query: str, max_price: Optional[float], min_rating: Optional[float]) -> Dict:
        """Create a comprehensive search plan"""
        
        # Extract product type and keywords
        product_type = self._extract_product_type(query)
        keywords = self._generate_keywords(query)
        
        plan = {
            "query": query,
            "product_type": product_type,
            "keywords": keywords,
            "max_price": max_price or 100000,  # INR
            "min_rating": min_rating or 3.5,
            "stores": ["amazon", "flipkart", "meesho", "myntra"],  # All platforms
            "products_per_store": 5,
            "priority_factors": ["price", "rating", "review_count", "availability"],
            "search_strategy": "multi_source"
        }
        
        return plan
    
    def _extract_product_type(self, query: str) -> str:
        """Extract main product type from query"""
        query_lower = query.lower()
        product_types = {
            'laptop': ['laptop', 'notebook', 'macbook'],
            'phone': ['phone', 'smartphone', 'mobile'],
            'headphones': ['headphone', 'earphone', 'earbud'],
            'kettle': ['kettle', 'electric kettle'],
            'shoes': ['shoe', 'sneaker', 'footwear', 'sports shoes'],
            'watch': ['watch', 'smartwatch'],
            'tv': ['television', 'tv', 'led tv'],
            'fridge': ['refrigerator', 'fridge'],
            'ac': ['air conditioner', 'ac', 'cooler'],
            'dress': ['dress', 'gown', 'frock'],
            'shirt': ['shirt', 't-shirt', 'tshirt'],
            'jeans': ['jeans', 'denim'],
            'saree': ['saree', 'sari'],
            'kurta': ['kurta', 'kurti'],
            'bag': ['bag', 'backpack', 'handbag'],
            'perfume': ['perfume', 'fragrance', 'deodorant'],
            'makeup': ['makeup', 'cosmetics', 'lipstick'],
            'furniture': ['sofa', 'chair', 'table', 'bed', 'mattress'],
            'kitchen': ['mixer', 'grinder', 'oven', 'microwave', 'cooker']
        }
        
        for product, keywords in product_types.items():
            for keyword in keywords:
                if keyword in query_lower:
                    return product
        return query.split()[0] if query else "product"
    
    def _generate_keywords(self, query: str) -> List[str]:
        """Generate search keywords"""
        return [query, query.lower(), query.title()]
