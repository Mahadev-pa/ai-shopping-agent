# backend/app/agents/analyzer_agent.py
from typing import List, Dict
import math

class AnalyzerAgent:
    """Analysis Agent - Compare products from all platforms"""
    
    async def analyze_products(self, products: List[Dict]) -> List[Dict]:
        """Analyze and compare all products"""
        
        if not products:
            return products
        
        # Group by store
        store_products = {}
        for p in products:
            store = p.get('store', 'Unknown')
            if store not in store_products:
                store_products[store] = []
            store_products[store].append(p)
        
        print(f"\n📊 Analyzing products from {len(store_products)} platforms...")
        
        # Calculate min/max for normalization
        prices = [p.get('price_inr', 0) for p in products if p.get('price_inr', 0) > 0]
        ratings = [p.get('rating', 0) for p in products]
        reviews = [p.get('review_count', 0) for p in products]
        
        min_price = min(prices) if prices else 1
        max_price = max(prices) if prices else 1
        max_reviews = max(reviews) if reviews else 1
        
        for product in products:
            # Price score (lower price = higher score)
            if max_price > min_price:
                price_score = ((max_price - product.get('price_inr', 0)) / (max_price - min_price)) * 100
            else:
                price_score = 100
            
            # Rating score
            rating_score = (product.get('rating', 0) / 5) * 100
            
            # Review score
            review_count = product.get('review_count', 0)
            if max_reviews > 0 and review_count > 0:
                review_score = (math.log(review_count + 1) / math.log(max_reviews + 1)) * 100
            else:
                review_score = 0
            
            # Weighted total score
            total_score = (price_score * 0.40) + (rating_score * 0.40) + (review_score * 0.20)
            
            product['scores'] = {
                'price_score': round(price_score, 2),
                'rating_score': round(rating_score, 2),
                'review_score': round(review_score, 2),
                'total_score': round(total_score, 2)
            }
        
        # Sort by total score
        products.sort(key=lambda x: x['scores']['total_score'], reverse=True)
        
        # Print comparison
        print("\n" + "="*60)
        print("🏆 PRODUCT COMPARISON RESULTS")
        print("="*60)
        
        for i, p in enumerate(products[:8], 1):
            winner_mark = "🏆" if i == 1 else "  "
            print(f"{winner_mark} {i}. {p['store']:8} | ₹{p['price_inr']:6,} | {p['rating']}⭐ | {p['review_count']:,} reviews | Score: {p['scores']['total_score']:.0f}")
        
        print("="*60)
        
        return products