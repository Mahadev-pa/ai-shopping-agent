// frontend/src/components/ProductDetailModal.jsx
import React from 'react';

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const formatIndianPrice = (priceInr) => {
    if (!priceInr) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceInr);
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

  const storeColor = storeColors[product.store] || '#FFC107';
  const storeIcon = storeIcons[product.store] || '🏪';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out',
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        maxWidth: '900px',
        width: '90%',
        maxHeight: '85vh',
        overflow: 'auto',
        position: 'relative',
        animation: 'modalSlideIn 0.3s ease-out',
      }} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '20px',
            background: '#f0f0f0',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e0e0e0'}
          onMouseLeave={e => e.currentTarget.style.background = '#f0f0f0'}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${storeColor} 0%, ${storeColor}CC 100%)`,
          padding: '20px 28px',
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>{storeIcon}</span>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Product from</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{product.store}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {/* Image */}
            <div style={{
              flex: '0 0 300px',
              background: '#f8f9fa',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '280px',
                  objectFit: 'contain',
                }}
                onError={e => e.target.src = 'https://picsum.photos/id/20/300/300'}
              />
            </div>

            {/* Details */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
                {product.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '18px', color: '#fbbf24', fontWeight: '600' }}>
                  {'⭐'.repeat(Math.floor(product.rating || 0))} {product.rating}/5
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  📝 {(product.review_count || 0).toLocaleString('en-IN')} reviews
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                padding: '16px 0',
                borderTop: '2px solid #f0f0f0',
                borderBottom: '2px solid #f0f0f0',
                marginBottom: '20px',
              }}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: storeColor }}>
                  {formatIndianPrice(product.price_inr)}
                </div>
                {product.original_price_inr > product.price_inr && (
                  <div style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through' }}>
                    {formatIndianPrice(product.original_price_inr)}
                  </div>
                )}
                {product.discount > 0 && (
                  <div style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '30px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                  }}>
                    {product.discount}% OFF
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>🚚 Delivery</div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{product.delivery || 'Free delivery'}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>🔧 Warranty</div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{product.warranty || '1 Year warranty'}</div>
              </div>

              {product.features && product.features.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>✨ Key Features</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {product.features.slice(0, 4).map((f, i) => (
                      <li key={i} style={{ fontSize: '14px', color: '#555', marginBottom: '6px' }}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginTop: '24px' }}>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    background: storeColor,
                    color: 'white',
                    textDecoration: 'none',
                    textAlign: 'center',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Buy Now on {product.store} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailModal;