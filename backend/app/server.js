const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Search products from multiple sites
async function searchAmazon(product) {
  // Use RapidAPI or SerpAPI
  const response = await axios.get('https://real-time-amazon-data.p.rapidapi.com/search', {
    params: { query: product, page: '1' },
    headers: {
      'X-RapidAPI-Key': 'YOUR_API_KEY',
      'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
    }
  });
  return response.data.data.products.slice(0, 5);
}

async function searchFlipkart(product) {
  // Similar implementation for Flipkart
  // Return first 5 products
}

// AI Agent for decision making
async function agenticAI(products) {
  const prompt = `
    Analyze these products and recommend Top 3:
    ${JSON.stringify(products)}
    
    Consider:
    1. Price to value ratio
    2. Customer reviews (positive/negative)
    3. Features and specifications
    4. Brand reputation
    
    Return as JSON with: {rank1, rank2, rank3, reasons}
  `;
  
  // Call OpenAI or HuggingFace
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: { 'Authorization': `Bearer YOUR_OPENAI_KEY` }
  });
  
  return JSON.parse(response.data.choices[0].message.content);
}

app.post('/api/search', async (req, res) => {
  const { product } = req.body;
  
  // Fetch from all sites
  const [amazon, flipkart, site3, site4] = await Promise.all([
    searchAmazon(product),
    searchFlipkart(product),
    searchSite3(product),
    searchSite4(product)
  ]);
  
  const allProducts = [...amazon, ...flipkart, ...site3, ...site4];
  
  // Get AI recommendations
  const recommendations = await agenticAI(allProducts);
  
  res.json({ recommendations, allProducts });
});

app.listen(5000, () => console.log('Server running'));