// frontend/src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ darkMode }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
    },
    spinnerContainer: {
      position: 'relative',
      width: '80px',
      height: '80px',
    },
    spinner: {
      width: '80px',
      height: '80px',
      border: '3px solid rgba(99, 102, 241, 0.1)',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    text: {
      marginTop: '24px',
      fontSize: '16px',
      fontWeight: '500',
      color: darkMode ? '#f1f5f9' : '#0f172a',
    },
    subtext: {
      marginTop: '8px',
      fontSize: '13px',
      color: darkMode ? '#94a3b8' : '#64748b',
    },
    steps: {
      marginTop: '32px',
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: darkMode ? '#94a3b8' : '#64748b',
    },
    dot: {
      width: '8px',
      height: '8px',
      background: '#6366f1',
      borderRadius: '50%',
      animation: 'pulse 1.5s infinite',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}></div>
      </div>
      <div style={styles.text}>AI Agents are analyzing products...</div>
      <div style={styles.subtext}>This may take a few seconds</div>
      <div style={styles.steps}>
        {['Planning', 'Searching', 'Analyzing', 'Deciding'].map((step, idx) => (
          <div key={idx} style={styles.step}>
            <div style={{ ...styles.dot, animationDelay: `${idx * 0.3}s` }}></div>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
