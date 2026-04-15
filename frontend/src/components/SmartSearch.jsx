import React, { useState, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';

const SmartSearch = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const hf = new HfInference('YOUR_HUGGINGFACE_TOKEN');
  
  // Auto-suggest using Hugging Face
  useEffect(() => {
    const getSuggestions = async () => {
      if (input.length > 2) {
        const response = await hf.textGeneration({
          model: 'gpt2',
          inputs: `Complete product search: ${input} ->`,
          parameters: { max_new_tokens: 20 }
        });
        
        const suggestions_text = response.generated_text;
        setSuggestions(suggestions_text.split(',').map(s => s.trim()));
      }
    };
    
    const timeoutId = setTimeout(getSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [input]);
  
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: input })
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };
  
  return (
    <div className="smart-search">
      <div className="search-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for laptops, phones, etc..."
          list="suggestions"
        />
        <datalist id="suggestions">
          {suggestions.map((sug, idx) => (
            <option key={idx} value={sug} />
          ))}
        </datalist>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {recommendations && (
        <div className="recommendations">
          <h2>🎯 Top 3 Recommendations</h2>
          
          <div className="product-card rank-1">
            <h3>🥇 {recommendations.rank1.name}</h3>
            <p>Price: ₹{recommendations.rank1.price}</p>
            <p>Rating: ⭐ {recommendations.rank1.rating}</p>
            <p>{recommendations.rank1.reason}</p>
          </div>
          
          <div className="product-card rank-2">
            <h3>🥈 {recommendations.rank2.name}</h3>
            <p>Price: ₹{recommendations.rank2.price}</p>
            <p>Rating: ⭐ {recommendations.rank2.rating}</p>
            <p>{recommendations.rank2.reason}</p>
          </div>
          
          <div className="product-card rank-3">
            <h3>🥉 {recommendations.rank3.name}</h3>
            <p>Price: ₹{recommendations.rank3.price}</p>
            <p>Rating: ⭐ {recommendations.rank3.rating}</p>
            <p>{recommendations.rank3.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;