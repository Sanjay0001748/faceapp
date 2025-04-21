import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UploadImage from './components/UploadImage';
import WebcamFeed from './components/WebcamFeed';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/upload" element={<UploadImage />} />
        <Route path="/webcam" element={<WebcamFeed />} />
      </Routes>
    </Router>
  );
};

export default App;
