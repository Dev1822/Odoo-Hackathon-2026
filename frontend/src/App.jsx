import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EnvironmentalDashboard from './components/env/EnvironmentalDashboard';
import GamificationTestbed from './components/GamificationTestbed';
import './index.css';

function App() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [activeSub, setActiveSub] = useState('Executive Overview');

  return (
    <Layout 
      activeMenu={activeMenu} 
      setActiveMenu={setActiveMenu}
      activeSub={activeSub}
      setActiveSub={setActiveSub}
    >
      {activeMenu === 'Dashboard' && <Dashboard />}
      {activeMenu === 'Environmental' && <EnvironmentalDashboard />}
      {activeMenu === 'Gamification' && <GamificationTestbed initialTab={activeSub} />}
      
      {/* Fallback for other modules under construction */}
      {activeMenu !== 'Dashboard' && activeMenu !== 'Environmental' && activeMenu !== 'Gamification' && (
        
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{activeMenu} - {activeSub}</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>This module is currently under construction.</p>
        </div>
      )}
    </Layout>
  );
}

export default App;
