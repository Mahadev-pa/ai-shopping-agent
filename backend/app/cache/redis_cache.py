import redis
import json
import pickle
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import hashlib
import asyncio
from functools import wraps

class RedisCache:
    """Redis cache manager for storing sessions, products, and API responses"""
    
    def __init__(
        self, 
        host: str = 'localhost', 
        port: int = 6379, 
        db: int = 0,
        password: Optional[str] = None,
        decode_responses: bool = True,
        socket_timeout: int = 5,
        socket_connect_timeout: int = 5
    ):
        """
        Initialize Redis connection
        
        Args:
            host: Redis server host
            port: Redis server port
            db: Redis database number
            password: Redis password (if any)
            decode_responses: Automatically decode responses
            socket_timeout: Socket timeout in seconds
            socket_connect_timeout: Connection timeout in seconds
        """
        self.host = host
        self.port = port
        self.db = db
        self.password = password
        
        try:
            self.redis_client = redis.Redis(
                host=host,
                port=port,
                db=db,
                password=password,
                decode_responses=decode_responses,
                socket_timeout=socket_timeout,
                socket_connect_timeout=socket_connect_timeout,
                retry_on_timeout=True
            )
            # Test connection
            self.redis_client.ping()
            self.connected = True
            print(f"✅ Connected to Redis at {host}:{port}")
        except Exception as e:
            print(f"❌ Redis connection failed: {e}")
            self.redis_client = None
            self.connected = False
    
    def _get_key(self, prefix: str, identifier: str) -> str:
        """Generate a namespaced Redis key"""
        return f"shopping_agent:{prefix}:{identifier}"
    
    def _serialize(self, data: Any) -> str:
        """Serialize data for storage"""
        try:
            return json.dumps(data, default=str)
        except (TypeError, ValueError):
            return pickle.dumps(data).hex()
    
    def _deserialize(self, data: str) -> Any:
        """Deserialize data from storage"""
        try:
            return json.loads(data)
        except (json.JSONDecodeError, TypeError):
            try:
                return pickle.loads(bytes.fromhex(data))
            except:
                return data
    
    # Session Management
    def store_session(
        self, 
        session_id: str, 
        data: Dict[str, Any], 
        ttl_seconds: int = 3600
    ) -> bool:
        """
        Store session data
        
        Args:
            session_id: Unique session identifier
            data: Session data to store
            ttl_seconds: Time to live in seconds (default 1 hour)
        
        Returns:
            True if successful, False otherwise
        """
        if not self.connected:
            return False
        
        try:
            key = self._get_key('session', session_id)
            serialized = self._serialize(data)
            self.redis_client.setex(key, ttl_seconds, serialized)
            return True
        except Exception as e:
            print(f"Error storing session: {e}")
            return False
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve session data"""
        if not self.connected:
            return None
        
        try:
            key = self._get_key('session', session_id)
            data = self.redis_client.get(key)
            if data:
                return self._deserialize(data)
            return None
        except Exception as e:
            print(f"Error getting session: {e}")
            return None
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a session"""
        if not self.connected:
            return False
        
        try:
            key = self._get_key('session', session_id)
            return bool(self.redis_client.delete(key))
        except Exception as e:
            print(f"Error deleting session: {e}")
            return False
    
    # Product Cache
    def cache_product_search(
        self, 
        query: str, 
        results: List[Dict], 
        ttl_seconds: int = 1800
    ) -> bool:
        """
        Cache product search results
        
        Args:
            query: Search query
            results: List of products
            ttl_seconds: Cache TTL (default 30 minutes)
        """
        if not self.connected:
            return False
        
        try:
            # Create normalized query hash
            query_hash = hashlib.md5(query.lower().strip().encode()).hexdigest()
            key = self._get_key('search', query_hash)
            serialized = self._serialize(results)
            self.redis_client.setex(key, ttl_seconds, serialized)
            return True
        except Exception as e:
            print(f"Error caching search: {e}")
            return False
    
    def get_cached_search(self, query: str) -> Optional[List[Dict]]:
        """Get cached search results"""
        if not self.connected:
            return None
        
        try:
            query_hash = hashlib.md5(query.lower().strip().encode()).hexdigest()
            key = self._get_key('search', query_hash)
            data = self.redis_client.get(key)
            if data:
                return self._deserialize(data)
            return None
        except Exception as e:
            print(f"Error getting cached search: {e}")
            return None
    
    # Product Details Cache
    def cache_product_details(self, product_id: str, details: Dict, ttl_seconds: int = 86400) -> bool:
        """Cache individual product details (24 hours default)"""
        if not self.connected:
            return False
        
        try:
            key = self._get_key('product', product_id)
            serialized = self._serialize(details)
            self.redis_client.setex(key, ttl_seconds, serialized)
            return True
        except Exception as e:
            print(f"Error caching product details: {e}")
            return False
    
    def get_cached_product(self, product_id: str) -> Optional[Dict]:
        """Get cached product details"""
        if not self.connected:
            return None
        
        try:
            key = self._get_key('product', product_id)
            data = self.redis_client.get(key)
            if data:
                return self._deserialize(data)
            return None
        except Exception as e:
            print(f"Error getting cached product: {e}")
            return None
    
    # API Response Cache
    def cache_api_response(
        self, 
        endpoint: str, 
        params: Dict, 
        response: Any, 
        ttl_seconds: int = 300
    ) -> bool:
        """Cache API responses (5 minutes default)"""
        if not self.connected:
            return False
        
        try:
            # Create unique key from endpoint and params
            param_str = json.dumps(params, sort_keys=True)
            cache_key = hashlib.md5(f"{endpoint}:{param_str}".encode()).hexdigest()
            key = self._get_key('api', cache_key)
            serialized = self._serialize(response)
            self.redis_client.setex(key, ttl_seconds, serialized)
            return True
        except Exception as e:
            print(f"Error caching API response: {e}")
            return False
    
    def get_cached_api_response(self, endpoint: str, params: Dict) -> Optional[Any]:
        """Get cached API response"""
        if not self.connected:
            return None
        
        try:
            param_str = json.dumps(params, sort_keys=True)
            cache_key = hashlib.md5(f"{endpoint}:{param_str}".encode()).hexdigest()
            key = self._get_key('api', cache_key)
            data = self.redis_client.get(key)
            if data:
                return self._deserialize(data)
            return None
        except Exception as e:
            print(f"Error getting cached API response: {e}")
            return None
    
    # Rate Limiting
    def check_rate_limit(
        self, 
        user_id: str, 
        action: str, 
        max_requests: int = 10, 
        window_seconds: int = 60
    ) -> bool:
        """
        Check if user has exceeded rate limit
        
        Args:
            user_id: User identifier
            action: Action being performed (search, view, etc.)
            max_requests: Maximum requests allowed in window
            window_seconds: Time window in seconds
        
        Returns:
            True if under limit, False if exceeded
        """
        if not self.connected:
            return True  # Allow if Redis is down
        
        try:
            key = self._get_key('ratelimit', f"{user_id}:{action}")
            current = self.redis_client.get(key)
            
            if current is None:
                # First request in window
                self.redis_client.setex(key, window_seconds, 1)
                return True
            
            count = int(current)
            if count >= max_requests:
                return False
            
            # Increment counter
            self.redis_client.incr(key)
            return True
            
        except Exception as e:
            print(f"Error checking rate limit: {e}")
            return True
    
    # Queue Management for Async Tasks
    def enqueue_task(self, queue_name: str, task_data: Dict) -> bool:
        """Add task to queue for async processing"""
        if not self.connected:
            return False
        
        try:
            key = self._get_key('queue', queue_name)
            serialized = self._serialize(task_data)
            self.redis_client.lpush(key, serialized)
            return True
        except Exception as e:
            print(f"Error enqueuing task: {e}")
            return False
    
    def dequeue_task(self, queue_name: str, timeout: int = 0) -> Optional[Dict]:
        """Get task from queue"""
        if not self.connected:
            return None
        
        try:
            key = self._get_key('queue', queue_name)
            if timeout > 0:
                # Blocking pop with timeout
                result = self.redis_client.brpop(key, timeout=timeout)
                if result:
                    _, data = result
                    return self._deserialize(data)
            else:
                # Non-blocking pop
                data = self.redis_client.rpop(key)
                if data:
                    return self._deserialize(data)
            return None
        except Exception as e:
            print(f"Error dequeuing task: {e}")
            return None
    
    # Cache Invalidation
    def invalidate_pattern(self, pattern: str) -> int:
        """Invalidate all keys matching a pattern"""
        if not self.connected:
            return 0
        
        try:
            full_pattern = self._get_key(pattern, '*')
            keys = self.redis_client.keys(full_pattern)
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception as e:
            print(f"Error invalidating pattern: {e}")
            return 0
    
    # Statistics
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        if not self.connected:
            return {"connected": False, "error": "Redis not connected"}
        
        try:
            info = self.redis_client.info()
            return {
                "connected": True,
                "redis_version": info.get("redis_version"),
                "used_memory_human": info.get("used_memory_human"),
                "total_connections_received": info.get("total_connections_received"),
                "total_commands_processed": info.get("total_commands_processed"),
                "keyspace_hits": info.get("keyspace_hits"),
                "keyspace_misses": info.get("keyspace_misses"),
                "uptime_days": info.get("uptime_in_days"),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {"connected": False, "error": str(e)}
    
    def clear_all(self) -> bool:
        """Clear all cached data (use with caution!)"""
        if not self.connected:
            return False
        
        try:
            pattern = self._get_key('*', '*')
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
            return True
        except Exception as e:
            print(f"Error clearing cache: {e}")
            return False
    
    def close(self):
        """Close Redis connection"""
        if self.connected and self.redis_client:
            self.redis_client.close()
            self.connected = False


# Decorator for automatic caching
def redis_cache(ttl_seconds: int = 300):
    """Decorator to cache function results in Redis"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Get Redis instance from first argument (assuming self has redis_client)
            if args and hasattr(args[0], 'cache') and isinstance(args[0].cache, RedisCache):
                cache = args[0].cache
                
                # Create cache key from function name and arguments
                key_data = {
                    'func': func.__name__,
                    'args': str(args[1:]),  # Skip self
                    'kwargs': str(kwargs)
                }
                cache_key = hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest()
                
                # Try to get from cache
                cached_result = cache.get_cached_api_response(func.__name__, key_data)
                if cached_result is not None:
                    return cached_result
                
                # Execute function
                result = func(*args, **kwargs)
                
                # Cache result
                cache.cache_api_response(func.__name__, key_data, result, ttl_seconds)
                return result
            
            # No cache available, just execute
            return func(*args, **kwargs)
        return wrapper
    return decorator
