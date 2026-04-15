// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const formatIndianPrice = (price) => {
    if (!price) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

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

  const storeColor = storeColors[product?.store] || '#FFC107';
  const storeIcon = storeIcons[product?.store] || '🏪';

  if (!product) return null;

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      transition: 'all 0.3s',
      cursor: 'pointer',
      height: '100%',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      
      <div style={{
        position: 'relative',
        height: '220px',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onError={() => setImageError(true)}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ fontSize: '56px' }}>{storeIcon}</div>
        )}
        {product.discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#ef4444',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            {product.discount}% OFF
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: storeColor,
          color: 'white',
          padding: '6px 14px',
          borderRadius: '30px',
          fontSize: '12px',
          fontWeight: 'bold',
        }}>
          {storeIcon} {product.store}
        </div>
      </div>

      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0, lineHeight: '1.4', height: '44px', overflow: 'hidden' }}>
          {product.name}
        </h4>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
          <span style={{ color: '#fbbf24', fontWeight: '600' }}>⭐ {product.rating || 0}</span>
          <span style={{ color: '#666' }}>({(product.review_count || 0).toLocaleString('en-IN')})</span>
        </div>
        
        <div style={{ marginTop: '4px' }}>
          <span style={{ fontSize: '24px', fontWeight: '800', color: storeColor }}>
            {formatIndianPrice(product.price_inr)}
          </span>
          {product.original_price_inr > product.price_inr && (
            <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through', marginLeft: '10px' }}>
              {formatIndianPrice(product.original_price_inr)}
            </span>
          )}
        </div>
        
        <div style={{ marginTop: '8px' }}>
          <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${product.score || 0}%`,
              background: `linear-gradient(90deg, ${storeColor}, ${storeColor}80)`,
              borderRadius: '4px',
            }} />
          </div>
          <div style={{ fontSize: '12px', marginTop: '6px', color: '#666' }}>AI Score: {product.score || 0}/100</div>
        </div>
        
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: '12px',
            padding: '12px',
            textAlign: 'center',
            background: '#f8f9fa',
            color: storeColor,
            textDecoration: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = storeColor; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.color = storeColor; }}
        >
          View Details →
        </a>
      </div>
    </div>
  );
};

export default ProductCard;