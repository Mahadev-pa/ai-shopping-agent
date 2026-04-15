// frontend/src/App.jsx
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import RecommendationCard from './components/RecommendationCard';
import LoadingSpinner from './components/LoadingSpinner';
import { searchProducts } from './api/shopping';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (query, filters) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await searchProducts({
        query: query,
        max_price: filters.maxPrice,
        min_rating: filters.minRating,
        preferred_stores: filters.stores
      });
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    app: {
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: "'Inter', 'Segoe UI', 'Poppins', system-ui, sans-serif",
    },
    header: {
      background: '#FFC107',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '24px 32px',
      textAlign: 'center',
    },
    logo: {
      fontSize: '48px',
      fontWeight: '800',
      color: '#1a1a1a',
      letterSpacing: '-1px',
      margin: 0,
    },
    logoSmall: {
      fontSize: '16px',
      color: '#1a1a1a',
      opacity: 0.8,
      marginTop: '10px',
      fontWeight: '500',
    },
    main: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '48px 32px',
      minHeight: 'calc(100vh - 200px)',
    },
    error: {
      background: '#fff3cd',
      border: '1px solid #ffeeba',
      borderRadius: '16px',
      padding: '18px 24px',
      color: '#856404',
      textAlign: 'center',
      fontWeight: '500',
      fontSize: '16px',
    },
    footer: {
      textAlign: 'center',
      padding: '28px',
      color: '#666',
      fontSize: '14px',
      borderTop: '1px solid #f0f0f0',
      background: '#fafafa',
    },
  };

  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    if (!document.querySelector('#app-styles')) {
      style.id = 'app-styles';
      document.head.appendChild(style);
    }
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>🛒 AI Shopping Agent</h1>
          <p style={styles.logoSmall}>Smart Product Comparison Across Amazon, Flipkart, Myntra & Meesho</p>
        </div>
      </header>

      <main style={styles.main}>
        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && result && result.recommendation && (
          <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <RecommendationCard 
              product={result.recommendation} 
              reasoning={result.reasoning} 
            />

            {/* Stats Dashboard */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginTop: '40px',
              marginBottom: '56px',
            }}>
              <div style={{
                background: 'white',
                padding: '28px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>🔍</div>
                <div style={{ fontSize: '38px', fontWeight: '700', color: '#FFC107' }}>{result.total_products_found}</div>
                <div style={{ fontSize: '15px', color: '#666', marginTop: '8px', fontWeight: '500' }}>Products Analyzed</div>
              </div>
              <div style={{
                background: 'white',
                padding: '28px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>💰</div>
                <div style={{ fontSize: '38px', fontWeight: '700', color: '#FFC107' }}>₹{result.summary?.avg_price?.toLocaleString('en-IN') || 0}</div>
                <div style={{ fontSize: '15px', color: '#666', marginTop: '8px', fontWeight: '500' }}>Average Price</div>
              </div>
              <div style={{
                background: 'white',
                padding: '28px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>🏪</div>
                <div style={{ fontSize: '38px', fontWeight: '700', color: '#FFC107' }}>{result.summary?.stores_compared || 0}</div>
                <div style={{ fontSize: '15px', color: '#666', marginTop: '8px', fontWeight: '500' }}>Stores Compared</div>
              </div>
              <div style={{
                background: 'white',
                padding: '28px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>⭐</div>
                <div style={{ fontSize: '38px', fontWeight: '700', color: '#FFC107' }}>{result.recommendation?.rating || 0}</div>
                <div style={{ fontSize: '15px', color: '#666', marginTop: '8px', fontWeight: '500' }}>Rating</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p style={{ fontSize: '14px' }}>© 2024 AI Shopping Agent | Intelligent Product Comparison Across All Major Platforms</p>
      </footer>
    </div>
  );
}

export default App;