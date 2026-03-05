import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

import SubscriptionManager from './pages/SubscriptionManager';
import StatementUpload from './pages/StatementUpload';

function App() {
  const [currentRoute, setCurrentRoute] = useState('landing'); // 'landing', 'login', 'signup', 'dashboard'

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentRoute('dashboard');
    }
  }, []);

  const navigate = (route) => {
    setCurrentRoute(route);
  };

  const handleLoginSuccess = () => {
    setCurrentRoute('dashboard');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-red-500/30">
      {currentRoute === 'landing' && <LandingPage onNavigate={navigate} />}
      {currentRoute === 'login' && <AuthPage initialMode="login" onLoginSuccess={handleLoginSuccess} />}
      {currentRoute === 'signup' && <AuthPage initialMode="signup" onLoginSuccess={handleLoginSuccess} />}
      {currentRoute === 'dashboard' && <SubscriptionManager onNavigate={navigate} />}
      {currentRoute === 'statementUpload' && <StatementUpload onNavigate={navigate} />}
    </div>
  );
}

export default App;
