// frontend/src/components/SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading, darkMode }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 2000,
    minRating: 4.0,
    stores: ['amazon', 'flipkart', 'myntra', 'meesho']
  });

  // Generate price options from ₹10 to ₹2000 in increments of 10
  const generatePriceOptions = () => {
    const options = [];
    for (let i = 10; i <= 2000; i += 10) {
      options.push(i);
    }
    return options;
  };

  const priceOptions = generatePriceOptions();
  
  // Show every 50th option to avoid clutter (10, 60, 110, 160...)
  const displayPriceOptions = priceOptions.filter((_, index) => index % 5 === 0);

  const ratingOptions = [4.0, 4.2, 4.5, 4.7, 5.0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query, filters);
    }
  };

  const theme = {
    bg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f1f5f9' : '#0f172a',
    border: darkMode ? '#334155' : '#e2e8f0',
  };

  const styles = {
    container: {
      marginBottom: '32px',
      position: 'relative',
    },
    form: {
      width: '100%',
    },
    inputWrapper: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      background: 'white',
      borderRadius: '60px',
      padding: '4px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    input: {
      flex: 1,
      padding: '16px 24px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '60px',
      background: 'transparent',
      color: '#0f172a',
      outline: 'none',
      fontFamily: 'inherit',
    },
    filterToggle: {
      padding: '12px 20px',
      background: '#fbbf24',
      border: 'none',
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#0f172a',
      transition: 'all 0.2s',
    },
    searchButton: {
      padding: '14px 32px',
      background: '#f59e0b',
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    filtersPanel: {
      position: 'absolute',
      top: 'calc(100% + 12px)',
      left: 0,
      right: 0,
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      padding: '28px',
      zIndex: 100,
      border: '1px solid #e2e8f0',
    },
    filtersHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0',
    },
    filtersTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0f172a',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#64748b',
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '28px',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    filterLabel: {
      fontWeight: '600',
      color: '#0f172a',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    priceSlider: {
      width: '100%',
      margin: '10px 0',
    },
    priceRangeDisplay: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '8px',
      fontSize: '14px',
      color: '#f59e0b',
      fontWeight: '600',
    },
    priceOptions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '8px',
      marginTop: '10px',
      maxHeight: '150px',
      overflowY: 'auto',
      padding: '8px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
    },
    priceBtn: {
      padding: '8px',
      background: '#f1f5f9',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      color: '#0f172a',
      transition: 'all 0.2s',
    },
    activePriceBtn: {
      background: '#fbbf24',
      color: '#0f172a',
      fontWeight: '600',
    },
    ratingOptions: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    ratingBtn: {
      padding: '8px 16px',
      background: '#f1f5f9',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      color: '#0f172a',
      transition: 'all 0.2s',
    },
    activeRatingBtn: {
      background: '#fbbf24',
      color: '#0f172a',
    },
    storesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
    },
    storeCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      background: '#f1f5f9',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    filterActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid #e2e8f0',
    },
    clearBtn: {
      padding: '10px 20px',
      background: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      cursor: 'pointer',
      color: '#64748b',
      fontSize: '13px',
    },
    applyBtn: {
      padding: '10px 24px',
      background: '#f59e0b',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      color: 'white',
      fontSize: '13px',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products... (e.g., laptop, headphones, shoes, dress)"
            style={styles.input}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            style={styles.filterToggle}
            onMouseEnter={e => e.currentTarget.style.background = '#f59e0b'}
            onMouseLeave={e => e.currentTarget.style.background = '#fbbf24'}
          >
            ⚡ Filters
          </button>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={styles.searchButton}
            onMouseEnter={e => { if (!loading && query.trim()) e.currentTarget.style.background = '#d97706'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Searching...' : 'Find Best →'}
          </button>
        </div>
      </form>

      {showFilters && (
        <div style={styles.filtersPanel}>
          <div style={styles.filtersHeader}>
            <div style={styles.filtersTitle}>Advanced Filters</div>
            <button onClick={() => setShowFilters(false)} style={styles.closeBtn}>✕</button>
          </div>
          
          <div style={styles.filtersGrid}>
            {/* Price Filter - ₹10 to ₹2000 */}
            <div style={styles.filterGroup}>
              <div style={styles.filterLabel}>
                <span>💰</span> Max Price (₹)
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                style={styles.priceSlider}
              />
              <div style={styles.priceRangeDisplay}>
                <span>₹10</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{filters.maxPrice}</span>
                <span>₹2,000</span>
              </div>
              <div style={styles.priceOptions}>
                {displayPriceOptions.map(price => (
                  <button
                    key={price}
                    style={{
                      ...styles.priceBtn,
                      ...(filters.maxPrice === price ? styles.activePriceBtn : {})
                    }}
                    onClick={() => setFilters({ ...filters, maxPrice: price })}
                  >
                    ₹{price}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div style={styles.filterGroup}>
              <div style={styles.filterLabel}>
                <span>⭐</span> Minimum Rating
              </div>
              <div style={styles.ratingOptions}>
                {ratingOptions.map(rating => (
                  <button
                    key={rating}
                    style={{
                      ...styles.ratingBtn,
                      ...(filters.minRating === rating ? styles.activeRatingBtn : {})
                    }}
                    onClick={() => setFilters({ ...filters, minRating: rating })}
                  >
                    {rating} ★
                  </button>
                ))}
              </div>
            </div>

            {/* Store Filter */}
            <div style={styles.filterGroup}>
              <div style={styles.filterLabel}>
                <span>🏪</span> Stores
              </div>
              <div style={styles.storesGrid}>
                {['amazon', 'flipkart', 'myntra', 'meesho'].map(store => (
                  <label
                    key={store}
                    style={{
                      ...styles.storeCheckbox,
                      ...(filters.stores.includes(store) ? { border: '2px solid #f59e0b', background: '#fef3c7' } : {})
                    }}
                    onClick={() => {
                      if (filters.stores.includes(store)) {
                        setFilters({ ...filters, stores: filters.stores.filter(s => s !== store) });
                      } else {
                        setFilters({ ...filters, stores: [...filters.stores, store] });
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.stores.includes(store)}
                      onChange={() => {}}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{store}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.filterActions}>
            <button
              style={styles.clearBtn}
              onClick={() => setFilters({ maxPrice: 2000, minRating: 4.0, stores: ['amazon', 'flipkart', 'myntra', 'meesho'] })}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Clear All
            </button>
            <button
              style={styles.applyBtn}
              onClick={() => setShowFilters(false)}
              onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
              onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;