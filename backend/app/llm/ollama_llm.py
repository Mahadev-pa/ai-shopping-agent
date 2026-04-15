
import requests
import json
import time
from typing import Optional, Dict, Any, List
from datetime import datetime
import asyncio
import aiohttp

class OllamaLLM:
    """Interface for interacting with Ollama LLM service"""
    
    def __init__(self, model: str = "llama2", base_url: str = "http://localhost:11434", timeout: int = 60):
        """
        Initialize Ollama LLM client
        
        Args:
            model: Model name to use (llama2, mistral, phi, etc.)
            base_url: Ollama API base URL
            timeout: Request timeout in seconds
        """
        self.model = model
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.available_models = self._get_available_models()
        
        # Check if model is available
        if model not in self.available_models:
            print(f"Warning: Model '{model}' not found. Available: {self.available_models}")
            if self.available_models:
                self.model = self.available_models[0]
                print(f"Falling back to: {self.model}")
    
    def _get_available_models(self) -> List[str]:
        """Get list of available models from Ollama"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                data = response.json()
                return [model['name'] for model in data.get('models', [])]
        except Exception as e:
            print(f"Could not fetch models: {e}")
        return []
    
    def generate(
        self, 
        prompt: str, 
        max_tokens: int = 500, 
        temperature: float = 0.7,
        stream: bool = False
    ) -> Optional[str]:
        """
        Generate response from Ollama
        
        Args:
            prompt: Input prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0-1)
            stream: Whether to stream response
        
        Returns:
            Generated text or None if error
        """
        try:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": stream,
                "options": {
                    "num_predict": max_tokens,
                    "temperature": temperature,
                    "top_p": 0.9,
                    "stop": ["\n\n", "Human:", "User:"]
                }
            }
            
            if stream:
                return self._generate_stream(payload)
            else:
                return self._generate_sync(payload)
                
        except requests.exceptions.Timeout:
            print(f"Ollama request timeout after {self.timeout}s")
            return self._fallback_response(prompt)
        except requests.exceptions.ConnectionError:
            print(f"Cannot connect to Ollama at {self.base_url}")
            return self._fallback_response(prompt)
        except Exception as e:
            print(f"Ollama generation error: {e}")
            return self._fallback_response(prompt)
    
    def _generate_sync(self, payload: Dict) -> Optional[str]:
        """Synchronous generation"""
        response = requests.post(
            f"{self.base_url}/api/generate",
            json=payload,
            timeout=self.timeout
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get('response', '').strip()
        else:
            print(f"Ollama API error: {response.status_code}")
            return None
    
    def _generate_stream(self, payload: Dict) -> Optional[str]:
        """Streaming generation"""
        full_response = ""
        
        response = requests.post(
            f"{self.base_url}/api/generate",
            json=payload,
            stream=True,
            timeout=self.timeout
        )
        
        if response.status_code == 200:
            for line in response.iter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        chunk = data.get('response', '')
                        full_response += chunk
                        if data.get('done', False):
                            break
                    except json.JSONDecodeError:
                        continue
            return full_response.strip()
        return None
    
    async def async_generate(
        self, 
        prompt: str, 
        max_tokens: int = 500, 
        temperature: float = 0.7
    ) -> Optional[str]:
        """Asynchronous generation"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": max_tokens,
                        "temperature": temperature
                    }
                }
                
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=self.timeout)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result.get('response', '').strip()
                    return None
                    
        except Exception as e:
            print(f"Async generation error: {e}")
            return self._fallback_response(prompt)
    
    def chat(
        self, 
        messages: List[Dict[str, str]], 
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> Optional[str]:
        """
        Chat completion with message history
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
        
        Returns:
            Assistant's response or None
        """
        try:
            payload = {
                "model": self.model,
                "messages": messages,
                "stream": False,
                "options": {
                    "num_predict": max_tokens,
                    "temperature": temperature
                }
            }
            
            response = requests.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('message', {}).get('content', '').strip()
            return None
            
        except Exception as e:
            print(f"Chat completion error: {e}")
            return None
    
    def generate_product_recommendation(
        self, 
        products: List[Dict], 
        user_query: str,
        user_preferences: Optional[Dict] = None
    ) -> str:
        """Generate product recommendation with reasoning"""
        
        # Format products for prompt
        products_text = ""
        for i, product in enumerate(products[:5], 1):
            products_text += f"""
            {i}. {product.get('name', 'Unknown')}
               - Price: ${product.get('price', 0)}
               - Rating: {product.get('rating', 0)}/5
               - Reviews: {product.get('review_count', 0)}
               - Store: {product.get('store', 'Unknown')}
               - Score: {product.get('total_score', 0)}/100
            """
        
        prompt = f"""You are an AI shopping assistant. Based on the following products, recommend the best one for the user.

User Query: "{user_query}"

Products Found:
{products_text}

Please provide:
1. Which product is the best choice and why
2. Key factors that influenced your decision (price, quality, reviews, etc.)
3. Any important considerations or trade-offs

Be concise but informative. Focus on value for money and user satisfaction."""

        recommendation = self.generate(prompt, max_tokens=300, temperature=0.5)
        
        if recommendation:
            return recommendation
        else:
            return self._fallback_recommendation(products)
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of reviews or product descriptions"""
        
        prompt = f"""Analyze the sentiment of the following text and return ONLY JSON:
        Text: "{text[:500]}"
        
        Return JSON format:
        {{
            "sentiment": "positive/negative/neutral",
            "confidence": 0.0-1.0,
            "key_phrases": ["phrase1", "phrase2"]
        }}
        """
        
        response = self.generate(prompt, max_tokens=150, temperature=0.3)
        
        if response:
            try:
                # Try to extract JSON from response
                json_start = response.find('{')
                json_end = response.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = response[json_start:json_end]
                    return json.loads(json_str)
            except:
                pass
        
        return {
            "sentiment": "neutral",
            "confidence": 0.5,
            "key_phrases": []
        }
    
    def compare_products(self, product1: Dict, product2: Dict) -> str:
        """Compare two products and provide analysis"""
        
        prompt = f"""Compare these two products and tell me which is better:

Product A: {product1.get('name', 'Unknown')}
- Price: ${product1.get('price', 0)}
- Rating: {product1.get('rating', 0)}/5
- Store: {product1.get('store', 'Unknown')}

Product B: {product2.get('name', 'Unknown')}
- Price: ${product2.get('price', 0)}
- Rating: {product2.get('rating', 0)}/5
- Store: {product2.get('store', 'Unknown')}

Provide a brief comparison (2-3 sentences) highlighting which is better value and why."""

        return self.generate(prompt, max_tokens=150, temperature=0.4) or "Unable to compare products."
    
    def _fallback_response(self, prompt: str) -> str:
        """Fallback response when Ollama is unavailable"""
        
        if "recommend" in prompt.lower() or "best" in prompt.lower():
            return "Based on the analysis of price, ratings, and customer reviews, this product offers the best value for your needs."
        elif "compare" in prompt.lower():
            return "When comparing these products, consider factors like price-to-performance ratio, customer satisfaction, and feature set."
        else:
            return "I've analyzed the products and found the best option considering quality, price, and user reviews."
    
    def _fallback_recommendation(self, products: List[Dict]) -> str:
        """Fallback recommendation when LLM fails"""
        
        if not products:
            return "No products found matching your criteria."
        
        best_product = max(products, key=lambda x: x.get('total_score', 0))
        
        return (f"I recommend the {best_product.get('name', 'product')} from {best_product.get('store', 'store')}. "
                f"With a price of ${best_product.get('price', 0)}, rating of {best_product.get('rating', 0)}/5, "
                f"and an AI score of {best_product.get('total_score', 0)}/100, this offers the best value.")
    
    def health_check(self) -> Dict[str, Any]:
        """Check if Ollama service is healthy"""
        
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                return {
                    "status": "healthy",
                    "url": self.base_url,
                    "model": self.model,
                    "available_models": self.available_models,
                    "timestamp": datetime.now().isoformat()
                }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "url": self.base_url,
                "timestamp": datetime.now().isoformat()
            }
        return {"status": "unknown", "timestamp": datetime.now().isoformat()}
    
    def pull_model(self, model_name: str) -> bool:
        """Pull a model from Ollama registry"""
        
        try:
            response = requests.post(
                f"{self.base_url}/api/pull",
                json={"name": model_name},
                timeout=300  # 5 minutes for downloading
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Error pulling model: {e}")
            return False
