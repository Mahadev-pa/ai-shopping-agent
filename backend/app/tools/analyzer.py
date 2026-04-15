# backend/app/tools/analyzer.py
from typing import Dict

class ProductAnalyzer:
    def analyze_product(self, product: Dict, plan: Dict) -> Dict:
        """Enhanced product analysis"""
        
        return {
            "value_score": self._calculate_value_score(product),
            "sentiment": self._analyze_sentiment(product),
            "trust_score": self._calculate_trust_score(product),
            "popularity_index": self._calculate_popularity(product),
            "price_fairness": self._analyze_price_fairness(product)
        }
    
    def _calculate_value_score(self, product: Dict) -> float:
        """Calculate value for money"""
        price = product.get('price', 1)
        rating = product.get('rating', 3)
        
        if price <= 0:
            return 0
        
        # Value = rating per dollar (normalized)
        value = (rating / price) * 100
        return min(100, value)
    
    def _analyze_sentiment(self, product: Dict) -> str:
        """Analyze review sentiment"""
        rating = product.get('rating', 3)
        review_count = product.get('review_count', 0)
        
        if rating >= 4.5:
            sentiment = "excellent"
        elif rating >= 4.0:
            sentiment = "good"
        elif rating >= 3.0:
            sentiment = "average"
        else:
            sentiment = "poor"
        
        # Adjust based on review count
        if review_count > 1000 and sentiment in ["excellent", "good"]:
            return "excellent"  # Highly trusted
        elif review_count < 10:
            return "limited_reviews"
        
        return sentiment
    
    def _calculate_trust_score(self, product: Dict) -> float:
        """Calculate trust score based on reviews and ratings"""
        rating = product.get('rating', 3)
        review_count = product.get('review_count', 0)
        
        # Rating contribution (max 50 points)
        rating_score = (rating / 5) * 50
        
        # Review count contribution (max 50 points, logarithmic)
        if review_count >= 1000:
            review_score = 50
        elif review_count >= 500:
            review_score = 45
        elif review_count >= 100:
            review_score = 35
        elif review_count >= 50:
            review_score = 25
        elif review_count >= 10:
            review_score = 15
        else:
            review_score = 5
        
        return rating_score + review_score
    
    def _calculate_popularity(self, product: Dict) -> float:
        """Calculate popularity index"""
        review_count = product.get('review_count', 0)
        
        # Logarithmic scale for popularity
        if review_count >= 5000:
            return 100
        elif review_count >= 1000:
            return 85
        elif review_count >= 500:
            return 70
        elif review_count >= 100:
            return 50
        elif review_count >= 50:
            return 30
        elif review_count >= 10:
            return 15
        else:
            return 5
    
    def _analyze_price_fairness(self, product: Dict) -> str:
        """Analyze if price is fair"""
        price = product.get('price', 0)
        rating = product.get('rating', 3)
        
        if price <= 0:
            return "unknown"
        
        # Price to rating ratio
        price_per_rating = price / rating if rating > 0 else price
        
        if price_per_rating < 20:
            return "excellent_deal"
        elif price_per_rating < 50:
            return "good_deal"
        elif price_per_rating < 100:
            return "fair_price"
        else:
            return "overpriced"
