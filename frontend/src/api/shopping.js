// frontend/src/api/shopping.js

// Auto-detect environment - Local vs Production
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Production URL (Render.com वर deploy केल्यानंतर ही URL येईल)
// Local development साठी: http://localhost:8000
// Production साठी: तुमची Render backend URL

// तुमची Render backend URL इथे लिहा (deploy केल्यानंतर)
const PROD_API_URL = "https://ai-shopping-agent-backend.onrender.com";
const DEV_API_URL = "http://localhost:8000";

// API URL - environment नुसार auto select होईल
const API_BASE_URL = isProduction ? PROD_API_URL : DEV_API_URL;

console.log(`🚀 API Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`📍 API URL: ${API_BASE_URL}`);

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
        console.log('🏥 Health check:', data);
        return data;
    } catch (error) {
        console.error('Health check failed:', error);
        return { status: 'unhealthy', error: error.message };
    }
};
