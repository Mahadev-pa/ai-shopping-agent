// frontend/src/api/shopping.js
const API_BASE_URL = 'http://localhost:8000';

export const searchProducts = async (request) => {
    try {
        console.log('🔍 Sending search request:', request);
        
        const response = await fetch(`${API_BASE_URL}/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: request.query,
                max_price: request.max_price || null,
                min_rating: request.min_rating || null,
                preferred_stores: request.preferred_stores || ['amazon', 'flipkart']
            }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to search products');
        }
        
        const data = await response.json();
        console.log('✅ Search response:', data);
        return data;
        
    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
};

export const healthCheck = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Health check failed:', error);
        return { status: 'unhealthy', error: error.message };
    }
};
