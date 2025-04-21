import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    padding: '50px',
    textAlign: 'center',
    backgroundColor: '#121212',
    color: '#ffffff',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const subtextStyle: React.CSSProperties = {
    fontSize: '20px',
    marginBottom: '40px',
    color: '#cccccc',
  };

  const buttonStyle: React.CSSProperties = {
    margin: '0 10px',
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#1f1f1f',
    border: '1px solid #444',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>FaceSense AI</h1>
      <p style={subtextStyle}>Detect Age, Gender & Emotion in Real-Time</p>
      <div>
        <button
          type="button"
          onClick={() => navigate('/webcam')}
          style={buttonStyle}
        >
          Use Webcam
        </button>
        <button
          type="button"
          onClick={() => navigate('/upload')}
          style={buttonStyle}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
