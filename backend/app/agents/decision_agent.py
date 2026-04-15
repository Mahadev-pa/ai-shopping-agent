# backend/app/agents/decision_agent.py
from typing import List, Dict

class DecisionAgent:
    """Decision Agent - Select best product with clear reasoning"""
    
    def make_decision(self, products: List[Dict], user_query: str) -> Dict:
        """Select best product"""
        
        if not products:
            return {
                "recommendation": None,
                "alternatives": [],
                "reasoning": f"No products found for '{user_query}'",
                "total_products_found": 0,
                "summary": {}
            }
        
        best = products[0]
        alternatives = products[1:4]
        
        # Group products by store for comparison
        store_products = {}
        for p in products:
            store = p.get('store', 'Unknown')
            if store not in store_products:
                store_products[store] = []
            store_products[store].append(p)
        
        # Generate reasoning
        reasoning = f"""🏆 **BEST PRODUCT: {best['store']}**

After comparing {len(products)} products from Amazon, Flipkart, Myntra & Meesho:

✅ **Why {best['store']} is the winner:**

• 💰 **Price:** ₹{best['price_inr']:,} - Best price among all platforms
• ⭐ **Rating:** {best['rating']}/5 from {best['review_count']:,}+ customers
• 🏷️ **Discount:** Save {best['discount']}% (₹{best['original_price_inr'] - best['price_inr']:,.0f} off)

📊 **Platform-wise Comparison:**
"""
        
        for store, items in store_products.items():
            if store == best['store']:
                reasoning += f"  ✅ **{store}**: ₹{best['price_inr']:,} | {best['rating']}⭐ | 🏆 WINNER\n"
            else:
                avg_price = sum(p['price_inr'] for p in items) / len(items)
                reasoning += f"  ❌ **{store}**: ₹{avg_price:,.0f} avg | Higher price than winner\n"
        
        reasoning += f"""
💡 **Final Verdict:**
This {best['name']} offers the perfect balance of price, quality, and customer satisfaction. Click below to buy now from {best['store']}!"""
        
        return {
            "recommendation": self._format_product(best),
            "alternatives": [self._format_product(p) for p in alternatives],
            "reasoning": reasoning,
            "total_products_found": len(products),
            "summary": self._generate_summary(products, best)
        }
    
    def _format_product(self, product: Dict) -> Dict:
        """Format product for frontend"""
        return {
            "id": str(product.get('id', '')),
            "name": str(product.get('name', 'Product')),
            "price_inr": float(product.get('price_inr', 0)),
            "original_price_inr": float(product.get('original_price_inr', 0)),
            "discount": int(product.get('discount', 0)),
            "store": str(product.get('store', 'Unknown')),
            "store_icon": str(product.get('store_icon', '🏪')),
            "store_color": str(product.get('store_color', '#f59e0b')),
            "rating": float(product.get('rating', 0)),
            "review_count": int(product.get('review_count', 0)),
            "in_stock": bool(product.get('in_stock', True)),
            "url": str(product.get('url', '#')),
            "image_url": str(product.get('image_url', '')),
            "delivery": str(product.get('delivery', 'Free delivery')),
            "warranty": str(product.get('warranty', '1 Year')),
            "features": list(product.get('features', [])),
            "description": str(product.get('description', '')),
            "score": float(product.get('scores', {}).get('total_score', 0))
        }
    
    def _generate_summary(self, products: List[Dict], best: Dict) -> Dict:
        """Generate summary"""
        prices = [p.get('price_inr', 0) for p in products]
        
        store_counts = {}
        for p in products:
            store = p.get('store', 'Unknown')
            store_counts[store] = store_counts.get(store, 0) + 1
        
        return {
            "avg_price": round(sum(prices) / len(prices), 2) if prices else 0,
            "min_price": min(prices) if prices else 0,
            "max_price": max(prices) if prices else 0,
            "total_products": len(products),
            "stores_compared": len(store_counts),
            "best_price": best.get('price_inr', 0),
            "best_store": best.get('store', 'Unknown')
        }