
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Room from './pages/Room';
import Layout from './components/Layout';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('devbrew_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsInitializing(false);
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('devbrew_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('devbrew_session');
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen bg-vs-bg flex items-center justify-center text-vs-accent font-mono animate-pulse">
        BOOTING_CORE_ENGINE...
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/feed" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/feed" /> : <Auth type="login" onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/signup" element={user ? <Navigate to="/feed" /> : <Auth type="signup" onAuthSuccess={handleAuthSuccess} />} />
          
          <Route path="/feed" element={user ? <Feed user={user} /> : <Navigate to="/" />} />
          <Route path="/room/:slug" element={user ? <Room user={user} /> : <Navigate to="/" />} />
          
          {/* Mock pages for navigation completeness */}
          <Route path="/friends" element={<div className="p-10 font-mono text-center">Friends.json - Module under maintenance</div>} />
          <Route path="/profile/:username" element={<div className="p-10 font-mono text-center">Profile.tsx - Generating dynamic view</div>} />
          <Route path="/settings" element={<div className="p-10 font-mono text-center">Settings.env - Unauthorized access level</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
