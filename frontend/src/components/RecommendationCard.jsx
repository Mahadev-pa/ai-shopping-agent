// frontend/src/components/RecommendationCard.jsx
import React, { useState } from 'react';

const RecommendationCard = ({ product, reasoning }) => {
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const formatIndianPrice = (priceInr) => {
    if (!priceInr) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceInr);
  };

  if (!product) return null;

  const storeColors = {
    'Amazon': '#FF9900',
    'Flipkart': '#2874F0',
    'Myntra': '#E91E63',
    'Meesho': '#F43397',
  };
  
  const storeIcons = {
    'Amazon': '🛒',
    'Flipkart': '🛍️',
    'Myntra': '👗',
    'Meesho': '🎯',
  };

  const storeColor = storeColors[product.store] || '#FFC107';
  const storeIcon = storeIcons[product.store] || '🏪';

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, boxShadow 0.3s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.15)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}>
      
      <div style={{
        background: `linear-gradient(135deg, ${storeColor} 0%, ${storeColor}CC 100%)`,
        padding: '16px 28px',
        color: 'white',
        fontWeight: '700',
        fontSize: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '18px' }}>{storeIcon} {product.store}</span>
        <span style={{ fontSize: '15px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '30px' }}>🏆 Top Pick</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '28px', padding: '28px' }}>
        <div style={{
          background: '#f8f9fa',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
        }}>
          {product.image_url && !imageError ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '260px',
                objectFit: 'contain',
                transition: 'transform 0.3s',
              }}
              onError={() => setImageError(true)}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ fontSize: '80px' }}>{storeIcon}</div>
          )}
          {product.discount > 0 && (
            <div style={{
              position: 'absolute',
              marginTop: '-220px',
              marginLeft: '-20px',
              background: '#ef4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '30px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              {product.discount}% OFF
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0, lineHeight: '1.3' }}>{product.name}</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '20px', color: '#fbbf24', fontWeight: '600' }}>
              {'⭐'.repeat(Math.floor(product.rating || 0))} {product.rating}/5
            </div>
            <div style={{ color: '#666', fontSize: '15px' }}>
              📝 {(product.review_count || 0).toLocaleString('en-IN')} reviews
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '16px',
            padding: '20px 0',
            borderTop: '2px solid #f0f0f0',
            borderBottom: '2px solid #f0f0f0',
          }}>
            <div style={{ fontSize: '44px', fontWeight: '800', color: storeColor }}>
              {formatIndianPrice(product.price_inr)}
            </div>
            {product.original_price_inr > product.price_inr && (
              <div style={{ fontSize: '18px', color: '#999', textDecoration: 'line-through' }}>
                {formatIndianPrice(product.original_price_inr)}
              </div>
            )}
          </div>

          <div>
            <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${product.score || 0}%`,
                background: `linear-gradient(90deg, ${storeColor}, ${storeColor}80)`,
                borderRadius: '6px',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{ fontSize: '15px', marginTop: '10px', color: '#666', fontWeight: '500' }}>
              🤖 AI Confidence Score: {product.score || 0}/100
            </div>
          </div>

          <div style={{ display: 'flex', gap: '18px', marginTop: '10px' }}>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 2,
                background: storeColor,
                color: 'white',
                textDecoration: 'none',
                textAlign: 'center',
                padding: '16px 28px',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '16px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Buy Now on {product.store} →
            </a>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                flex: 1,
                background: 'white',
                color: storeColor,
                border: `2px solid ${storeColor}`,
                padding: '16px 28px',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = storeColor; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = storeColor; }}
            >
              {expanded ? 'Less Details' : 'More Details'}
            </button>
          </div>

          {expanded && (
            <div style={{ marginTop: '18px', padding: '20px', background: '#f8f9fa', borderRadius: '16px' }}>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#555' }}>{product.description}</p>
            </div>
          )}

          {reasoning && (
            <div style={{
              marginTop: '10px',
              padding: '16px 20px',
              background: '#FFF8E1',
              borderRadius: '14px',
              borderLeft: `5px solid ${storeColor}`,
            }}>
              <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                <strong style={{ fontSize: '15px' }}>🧠 AI Recommendation:</strong> {reasoning.split('\n')[0]}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;