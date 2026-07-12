import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EnvironmentalDashboard from './components/env/EnvironmentalDashboard';
import GamificationTestbed from './components/GamificationTestbed';
import CSRList from './pages/CSRList';
import CreateCSR from './pages/CreateCSR';
import CSRDetail from './pages/CSRDetail';
import CSREdit from './pages/CSREdit';
import EmployeeParticipation from './pages/EmployeeParticipation';
import DiversityDashboard from './pages/DiversityDashboard';
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
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/csr" element={<CSRList />} />
        <Route path="/csr/create" element={<CreateCSR />} />
        <Route path="/csr/:id" element={<CSRDetail />} />
        <Route path="/csr/:id/edit" element={<CSREdit />} />
        <Route path="/participation" element={<EmployeeParticipation />} />
        <Route path="/diversity" element={<DiversityDashboard />} />
        <Route path="/environmental" element={<EnvironmentalDashboard />} />
        <Route path="/gamification" element={<GamificationTestbed initialTab={activeSub} />} />
      </Routes>
      
      {/* Fallback for other modules under construction */}
      {activeMenu !== 'Dashboard' && activeMenu !== 'Social' && activeMenu !== 'Environmental' && activeMenu !== 'Gamification' && (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{activeMenu} - {activeSub}</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>This module is currently under construction.</p>
        </div>
      )}
    </Layout>
  );
}

export default App;
