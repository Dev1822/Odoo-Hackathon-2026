import { useState, useEffect } from 'react';
import { 
  Trophy, 
  User, 
  Award, 
  Gift, 
  ListTodo, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Bell, 
  RefreshCw,
  Plus,
  Info,
  Calendar,
  AlertTriangle,
  Flame,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

// Seed users for easy authentication
const TEST_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'ADMIN', color: '#ef4444', desc: 'Full system access, can create resources, edit status, and approve completions.' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'MANAGER', color: '#10b981', desc: 'Can manage challenges, transition statuses, and approve completions.' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'EMPLOYEE', color: '#3b82f6', desc: 'Standard employee. Can join challenges, update progress, upload proof, and redeem rewards.' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'EMPLOYEE', color: '#f59e0b', desc: 'Standard employee. Can join challenges, update progress, upload proof, and redeem rewards.' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'EMPLOYEE', color: '#8b5cf6', desc: 'Standard employee. Can join challenges, update progress, upload proof, and redeem rewards.' }
];

export default function GamificationTestbed({ initialTab }) {
  const [activeUser, setActiveUser] = useState(TEST_USERS[0]);
  const [token, setToken] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('challenges');

  // Data states
  const [challenges, setChallenges] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardScope, setLeaderboardScope] = useState('employee');
  const [notifications, setNotifications] = useState([]);
  
  // Forms & UI states
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [progressValues, setProgressValues] = useState({});
  const [proofFiles, setProofFiles] = useState({});
  
  // New Resource Forms
  const [newChallenge, setNewChallenge] = useState({
    title: '', categoryId: 1, description: '', xp: 100, difficulty: 'EASY', evidenceRequired: false
  });
  const [newReward, setNewReward] = useState({
    name: '', description: '', pointsRequired: 100, stock: 10
  });

  // Sync with initialTab prop
  useEffect(() => {
    if (initialTab) {
      const tabMap = {
        'Challenges': 'challenges',
        'Challenge Participation': 'participation',
        'Badges': 'badges',
        'Rewards': 'rewards',
        'Leaderboard': 'leaderboard'
      };
      if (tabMap[initialTab]) {
        setActiveSubTab(tabMap[initialTab]);
      }
    }
  }, [initialTab]);

  // Fetch token when active user changes
  useEffect(() => {
    const fetchRealToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/dev-token/${activeUser.id}`);
        const data = await res.json();
        if (data.success) {
          setToken(data.data.token);
        }
      } catch (err) {
        console.warn("Could not fetch token from backend dev-helper. Make sure backend is running.");
      }
    };
    fetchRealToken();
  }, [activeUser]);

  // Fetch data on tab switch, user change, or token update
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeSubTab, leaderboardScope]);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 6000);
  };

  const getHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeSubTab === 'challenges') {
        const res = await fetch(`${API_BASE}/gamification/challenges`, { headers: getHeaders() });
        const data = await res.json();
        if (data.success) setChallenges(data.data);
      } else if (activeSubTab === 'participation') {
        const res = await fetch(`${API_BASE}/gamification/participation`, { headers: getHeaders() });
        const data = await res.json();
        if (data.success) setParticipations(data.data);
      } else if (activeSubTab === 'rewards') {
        const res = await fetch(`${API_BASE}/gamification/rewards`, { headers: getHeaders() });
        const data = await res.json();
        if (data.success) setRewards(data.data);
      } else if (activeSubTab === 'leaderboard') {
        const res = await fetch(`${API_BASE}/gamification/leaderboard?scope=${leaderboardScope}`, { headers: getHeaders() });
        const data = await res.json();
        if (data.success) setLeaderboard(data.data);
      } else if (activeSubTab === 'badges') {
        const res = await fetch(`${API_BASE}/gamification/badges`, { headers: getHeaders() });
        const data = await res.json();
        if (data.success) setBadges(data.data);

        const userRes = await fetch(`${API_BASE}/gamification/employees/${activeUser.id}/badges`, { headers: getHeaders() });
        const userData = await userRes.json();
        if (userData.success) setUserBadges(userData.data);
      }
      
      // Fetch notifications
      const notifRes = await fetch(`${API_BASE}/gamification/notifications`, { headers: getHeaders() });
      const notifData = await notifRes.json();
      if (notifData.success) setNotifications(notifData.data);
    } catch (err) {
      console.error("Error fetching data", err);
      showFeedback('Failed to connect to backend. Please check if backend is running on http://localhost:5000', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/gamification/challenges`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newChallenge)
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('Challenge created successfully in DRAFT mode! Activate it so users can join.');
        setNewChallenge({ title: '', categoryId: 1, description: '', xp: 100, difficulty: 'EASY', evidenceRequired: false });
        fetchData();
      } else {
        showFeedback(data.message || 'Failed to create challenge', 'error');
      }
    } catch (err) {
      showFeedback('Connection error', 'error');
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      const res = await fetch(`${API_BASE}/gamification/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('Joined challenge successfully! Go to the "My Progress & Approvals" tab to complete it.');
        fetchData();
      } else {
        showFeedback(data.message || 'Failed to join challenge', 'error');
      }
    } catch (err) {
      showFeedback('Connection error', 'error');
    }
  };

  const handleUpdateProgress = async (participationId) => {
    const progress = progressValues[participationId] || 0;
    try {
      const res = await fetch(`${API_BASE}/gamification/participation/${participationId}/progress`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ progress: parseInt(progress) })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('Progress updated successfully! Make sure to upload proof if required.');
        fetchData();
      } else {
        showFeedback(data.message || 'Failed to update progress', 'error');
      }
    } catch (err) {
      showFeedback('Connection error', 'error');
    }
  };

  const handleUploadProof = async (participationId) => {
    const file = proofFiles[participationId];
    if (!file) {
      showFeedback('Please select a file first.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('proof', file);

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/gamification/participation/${participationId}/proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('Proof uploaded successfully! A manager can now review and approve this completion.');
        fetchData();
      } else {
        showFeedback(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      showFeedback('Connection error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecideApproval = async (participationId, decision) => {
    try {
      const res = await fetch(`${API_BASE}/gamification/participation/${participationId}/${decision.toLowerCase()}`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Challenge submission has been successfully ${decision === 'APPROVE' ? 'approved' : 'rejected'}!`);
        fetchData();
      } else {
        showFeedback(data.message || 'Action failed', 'error');
      }
    } catch (err) {
      showFeedback('Connection error', 'error');
    }
  };

  const handleTransitionStatus = async (challengeId, status) => {
    try {
      const res = await fetch(`${API_BASE}/gamification/challenges/${challengeId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Challenge status updated to ${status}!`);
        fetchData();
      } else {
        showFeedback(data.message || 'Failed to transition status', 'error');
      }
    } catch (err) {
      showFeedback('Connection error', 'error');
    }
  };

  const handleCreateReward = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/gamification/rewards`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newReward)
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('Reward added to catalog successfully!');
        setNewReward({ name: '', description: '', pointsRequired: 100, stock: 10 });
        fetchData();
      } else {
        showFeedback(data.message || 'Failed to add reward', 'error');
      }
    } catch (err) {
      showFeedback('Connection error', 'error');
    }
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      const res = await fetch(`${API_BASE}/gamification/rewards/${rewardId}/redeem`, {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('Reward redeemed successfully! XP points deducted.');
        fetchData();
      } else {
        showFeedback(data.message || 'Failed to redeem reward', 'error');
      }
    } catch (err) {
      showFeedback('Connection error', 'error');
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/gamification/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="gamification-testbed flex-col gap-6" style={{ width: '100%', padding: '8px 0' }}>
      
      {/* Banner / User Selector Header */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: '20px' }}>
          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '12px' }}>
              <Trophy size={32} style={{ color: 'var(--color-primary-green)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#fff', fontSize: '24px' }}>Gamification Portal</h2>
              <p className="text-sm text-secondary" style={{ marginTop: '2px' }}>Simulate, verify, and test backend endpoints seamlessly from the UI</p>
            </div>
          </div>
          
          <button 
            onClick={fetchData} 
            className="btn-outline flex items-center gap-2"
            style={{ 
              borderRadius: '10px', 
              padding: '10px 16px', 
              background: 'rgba(255,255,255,0.03)', 
              borderColor: 'rgba(255,255,255,0.1)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </div>

        {/* User Switcher Card */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="avatar" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px', 
                  background: activeUser.color, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justify: 'center', 
                  fontWeight: '700',
                  color: '#fff',
                  fontSize: '18px',
                  boxShadow: `0 4px 10px rgba(0,0,0,0.3)`
                }}
              >
                {activeUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white">{activeUser.name}</span>
                  <span 
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full" 
                    style={{ 
                      background: `${activeUser.color}22`, 
                      color: activeUser.color,
                      border: `1px solid ${activeUser.color}44` 
                    }}
                  >
                    {activeUser.role}
                  </span>
                </div>
                <span className="text-xs text-secondary" style={{ marginTop: '2px' }}>{activeUser.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase text-secondary">Switch Test Profile:</span>
              <select 
                value={activeUser.id}
                onChange={(e) => setActiveUser(TEST_USERS.find(u => u.id === parseInt(e.target.value)))}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {TEST_USERS.map(u => (
                  <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
            <p className="text-xs text-muted flex items-start gap-1">
              <Info size={14} style={{ color: activeUser.color, flexShrink: 0, marginTop: '1px' }} />
              <span className="text-secondary font-medium">{activeUser.desc}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div className="animate-fade-in p-4 rounded-xl flex items-center justify-between gap-4" style={{
          background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
          border: `1px solid ${feedback.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
          color: feedback.type === 'error' ? '#fda4af' : '#6ee7b7'
        }}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'error' ? <AlertTriangle size={20} className="text-red" /> : <CheckCircle size={20} className="text-green" />}
            <span className="text-sm font-semibold">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ message: '', type: '' })} className="text-xs font-semibold text-secondary hover:text-white" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      {/* Tab Navigation buttons */}
      <div className="flex items-center gap-1 border-b" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto', paddingBottom: '2px' }}>
        {[
          { id: 'challenges', label: 'Challenges Catalog', icon: ListTodo, desc: 'View drafts, join active challenges' },
          { id: 'participation', label: 'My Progress & Approvals', icon: Award, desc: 'Update progress, review completions' },
          { id: 'rewards', label: 'Rewards Catalog', icon: Gift, desc: 'Redeem points for gift items' },
          { id: 'leaderboard', label: 'XP Leaderboards', icon: TrendingUp, desc: 'Rankings across organization' },
          { id: 'badges', label: 'Badges & Achievements', icon: Trophy, desc: 'Verify unlock conditions' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              padding: '14px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeSubTab === tab.id ? '3px solid var(--color-primary-green)' : '3px solid transparent',
              color: activeSubTab === tab.id ? 'var(--color-primary-green)' : 'var(--color-text-secondary)',
              fontWeight: activeSubTab === tab.id ? '700' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <div className="flex items-center gap-2">
              <tab.icon size={16} />
              <span className="text-sm">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content Display Area */}
      <div style={{ marginTop: '8px' }}>
        
        {/* ==================== CHALLENGES TAB ==================== */}
        {activeSubTab === 'challenges' && (
          <div className="flex-col gap-6 w-full">
            {/* Info bar */}
            <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }} className="flex items-start gap-2.5">
              <Info size={18} style={{ color: 'var(--color-blue)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span className="text-sm font-bold text-white block">Workflow Explanation</span>
                <span className="text-xs text-secondary mt-1 block">
                  Challenges start in **DRAFT** status (visible to Admins/Managers only). Transition a challenge to **ACTIVE** to allow employees to join. Once completed, managers can review submittals.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Challenge List */}
              <div className="lg:col-span-2 flex-col gap-4">
                <h3 className="text-lg font-bold text-white mb-2">System Challenges</h3>
                {challenges.length === 0 ? (
                  <div className="glass-panel p-12 text-center text-secondary">
                    <ListTodo size={40} className="text-muted block mx-auto" style={{ marginBottom: '12px' }} />
                    No challenges in system database. Use the creation form on the right to add some.
                  </div>
                ) : (
                  challenges.map(ch => (
                    <div key={ch.id} className="glass-panel" style={{ padding: '20px', marginBottom: '16px', background: '#1e293b' }}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-col gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="font-bold text-lg text-white">{ch.title}</h4>
                            <span 
                              className="text-xs font-bold px-2 py-0.5 rounded-full" 
                              style={{ 
                                background: ch.difficulty === 'EASY' ? 'rgba(34,197,94,0.12)' : ch.difficulty === 'MEDIUM' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                                color: ch.difficulty === 'EASY' ? 'var(--color-primary-green)' : ch.difficulty === 'MEDIUM' ? 'var(--color-orange)' : 'var(--color-red)'
                              }}
                            >
                              {ch.difficulty}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              Status: {ch.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-secondary" style={{ lineHeight: '1.4' }}>{ch.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs font-semibold text-muted flex-wrap">
                            <span className="flex items-center gap-1">
                              <Flame size={14} className="text-orange" />
                              Award: <strong className="text-white">{ch.xp} XP</strong>
                            </span>
                            {ch.evidenceRequired && (
                              <span className="flex items-center gap-1 text-orange">
                                <ShieldAlert size={14} />
                                Requires Proof Upload
                              </span>
                            )}
                            {ch.deadline && (
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                Deadline: {new Date(ch.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {ch.status === 'ACTIVE' && (
                            <button 
                              onClick={() => handleJoinChallenge(ch.id)} 
                              className="btn-primary flex items-center gap-1.5"
                              style={{ padding: '10px 18px', borderRadius: '8px' }}
                            >
                              Join Challenge
                            </button>
                          )}

                          {/* Admin & Manager status transition controls */}
                          {(activeUser.role === 'ADMIN' || activeUser.role === 'MANAGER') && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {ch.status === 'DRAFT' && (
                                <button 
                                  onClick={() => handleTransitionStatus(ch.id, 'ACTIVE')} 
                                  className="btn-outline text-green"
                                  style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                  Activate
                                </button>
                              )}
                              {ch.status === 'ACTIVE' && (
                                <button 
                                  onClick={() => handleTransitionStatus(ch.id, 'UNDER_REVIEW')} 
                                  className="btn-outline text-orange"
                                  style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                  Submit Review
                                </button>
                              )}
                              {ch.status === 'UNDER_REVIEW' && (
                                <button 
                                  onClick={() => handleTransitionStatus(ch.id, 'COMPLETED')} 
                                  className="btn-outline text-green"
                                  style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                  Complete
                                </button>
                              )}
                              {ch.status !== 'ARCHIVED' && (
                                <button 
                                  onClick={() => handleTransitionStatus(ch.id, 'ARCHIVED')} 
                                  className="btn-outline text-red"
                                  style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                  Archive
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Create Challenge Form Panel */}
              <div className="glass-panel" style={{ padding: '24px', background: '#1e293b', height: 'fit-content' }}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Plus size={20} style={{ color: 'var(--color-primary-green)' }} />
                  Create Challenge
                </h3>
                
                {(activeUser.role === 'ADMIN' || activeUser.role === 'MANAGER') ? (
                  <form onSubmit={handleCreateChallenge} className="flex-col gap-4">
                    <div className="flex-col gap-1.5">
                      <label className="text-xs font-semibold text-secondary">Challenge Title</label>
                      <input 
                        type="text" 
                        value={newChallenge.title}
                        onChange={e => setNewChallenge({...newChallenge, title: e.target.value})}
                        required
                        placeholder="e.g. Save Water in Cafeteria"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                      />
                    </div>

                    <div className="flex-col gap-1.5">
                      <label className="text-xs font-semibold text-secondary">Description</label>
                      <textarea 
                        value={newChallenge.description}
                        onChange={e => setNewChallenge({...newChallenge, description: e.target.value})}
                        required
                        placeholder="Explain the environmental goal..."
                        rows={3}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', resize: 'vertical' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex-col gap-1.5">
                        <label className="text-xs font-semibold text-secondary">XP Points</label>
                        <input 
                          type="number" 
                          value={newChallenge.xp}
                          onChange={e => setNewChallenge({...newChallenge, xp: parseInt(e.target.value)})}
                          required
                          min="1"
                          style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                        />
                      </div>
                      <div className="flex-col gap-1.5">
                        <label className="text-xs font-semibold text-secondary">Difficulty</label>
                        <select 
                          value={newChallenge.difficulty}
                          onChange={e => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                          style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                        >
                          <option value="EASY">EASY</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HARD">HARD</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input 
                        type="checkbox" 
                        id="evidenceRequired"
                        checked={newChallenge.evidenceRequired}
                        onChange={e => setNewChallenge({...newChallenge, evidenceRequired: e.target.checked})}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <label htmlFor="evidenceRequired" className="text-xs font-semibold text-secondary cursor-pointer">
                        Requires Proof Upload (PDF/Image)
                      </label>
                    </div>

                    <button type="submit" className="btn-primary w-full py-2.5 rounded-lg justify-center font-bold" style={{ marginTop: '8px' }}>
                      Submit Draft Challenge
                    </button>
                  </form>
                ) : (
                  <div className="p-4 text-center rounded-lg" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <p className="text-sm text-red font-medium">Insufficient Permissions</p>
                    <p className="text-xs text-secondary mt-1">Switch to MANAGER or ADMIN role at the top to create challenges.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== PARTICIPATION & APPROVALS TAB ==================== */}
        {activeSubTab === 'participation' && (
          <div className="flex-col gap-6">
            <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }} className="flex items-start gap-2.5">
              <Info size={18} style={{ color: 'var(--color-purple)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span className="text-sm font-bold text-white block">Workflow Explanation</span>
                <span className="text-xs text-secondary mt-1 block">
                  Employees update their progress sliders. If a challenge requires proof, the employee must upload a file. A manager or admin then reviews the proof in the approvals queue and awards the points.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* My Progress Panel */}
              <div className="flex-col gap-4">
                <h3 className="text-lg font-bold text-white mb-2">My Current Challenges</h3>
                {participations.filter(p => p.employeeId === activeUser.id).length === 0 ? (
                  <div className="glass-panel p-12 text-center text-secondary">
                    You have not joined any challenges. Go to **Challenges Catalog** to join one.
                  </div>
                ) : (
                  participations.filter(p => p.employeeId === activeUser.id).map(p => (
                    <div key={p.id} className="glass-panel" style={{ padding: '20px', marginBottom: '16px', background: '#1e293b' }}>
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div>
                          <h4 className="font-bold text-base text-white">{p.challenge.title}</h4>
                          <p className="text-xs text-secondary mt-1">Status: {p.challenge.status}</p>
                        </div>
                        <span 
                          className="text-xs font-bold px-3 py-1 rounded-full uppercase" 
                          style={{
                            background: p.approvalStatus === 'APPROVED' ? 'rgba(34,197,94,0.12)' : p.approvalStatus === 'REJECTED' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                            color: p.approvalStatus === 'APPROVED' ? 'var(--color-primary-green)' : p.approvalStatus === 'REJECTED' ? 'var(--color-red)' : 'var(--color-orange)'
                          }}
                        >
                          {p.approvalStatus}
                        </span>
                      </div>
                      
                      {p.approvalStatus === 'PENDING' ? (
                        <div className="flex-col gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          {/* Slider */}
                          <div className="flex-col gap-2 p-3 rounded-lg" style={{ background: '#0f172a' }}>
                            <div className="flex justify-between text-xs font-semibold text-secondary">
                              <span>Drag to update progress:</span>
                              <span className="text-white font-bold">{progressValues[p.id] !== undefined ? progressValues[p.id] : p.progress}%</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={progressValues[p.id] !== undefined ? progressValues[p.id] : p.progress}
                                onChange={e => setProgressValues({...progressValues, [p.id]: e.target.value})}
                                style={{ flex: 1, cursor: 'pointer' }}
                              />
                              <button 
                                onClick={() => handleUpdateProgress(p.id)} 
                                className="btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                              >
                                Save Progress
                              </button>
                            </div>
                          </div>

                          {/* Upload Proof */}
                          <div className="flex-col gap-2 p-3 rounded-lg" style={{ background: '#0f172a' }}>
                            <label className="text-xs font-bold text-secondary">Submission Proof File</label>
                            {p.proofUrl && (
                              <a href={p.proofUrl} target="_blank" rel="noreferrer" className="text-xs text-blue truncate mb-2 block font-semibold hover:underline">
                                🔗 View Uploaded File Proof
                              </a>
                            )}
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <input 
                                type="file" 
                                onChange={e => setProofFiles({...proofFiles, [p.id]: e.target.files[0]})}
                                className="text-xs text-secondary"
                              />
                              <button 
                                onClick={() => handleUploadProof(p.id)} 
                                className="btn-outline flex items-center gap-1"
                                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                              >
                                <Upload size={14} /> Upload Proof
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg mt-3 text-xs text-secondary" style={{ background: 'rgba(0,0,0,0.1)' }}>
                          Points Awarded: <strong className="text-green">{p.xpAwarded} XP</strong> {p.completedAt && `on ${new Date(p.completedAt).toLocaleDateString()}`}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Review Queue (Managers/Admins) */}
              <div className="flex-col gap-4">
                <h3 className="text-lg font-bold text-white mb-2">Completions Review Queue</h3>
                {(activeUser.role === 'ADMIN' || activeUser.role === 'MANAGER') ? (
                  <div>
                    {participations.filter(p => p.approvalStatus === 'PENDING').length === 0 ? (
                      <div className="glass-panel p-12 text-center text-secondary">
                        No submissions are currently pending manager approval.
                      </div>
                    ) : (
                      participations.filter(p => p.approvalStatus === 'PENDING').map(p => (
                        <div key={p.id} className="glass-panel" style={{ padding: '20px', marginBottom: '16px', background: '#1e293b' }}>
                          <div className="flex-col gap-2">
                            <h4 className="font-bold text-white text-base">{p.challenge.title}</h4>
                            <div className="flex-col gap-1 text-xs text-secondary" style={{ margin: '6px 0' }}>
                              <span>Participant: <strong className="text-white">{p.employee?.name || `Employee #${p.employeeId}`}</strong></span>
                              <span>Progress: <strong className="text-white">{p.progress}%</strong></span>
                            </div>

                            {p.proofUrl ? (
                              <a href={p.proofUrl} target="_blank" rel="noreferrer" className="text-xs text-blue font-bold hover:underline mb-3 block">
                                🔗 Open and Verify Completion Proof
                              </a>
                            ) : (
                              <span className="text-xs text-red font-bold mb-3 block">⚠️ No verification proof uploaded by employee</span>
                            )}

                            <div className="flex items-center gap-2 mt-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                              <button 
                                onClick={() => handleDecideApproval(p.id, 'APPROVE')} 
                                className="btn-primary" 
                                style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px' }}
                              >
                                Approve & Award {p.challenge.xp} XP
                              </button>
                              <button 
                                onClick={() => handleDecideApproval(p.id, 'REJECT')} 
                                className="btn-outline text-red" 
                                style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', borderColor: 'var(--color-red)' }}
                              >
                                Reject Submission
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-lg" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <p className="text-sm text-red font-medium">Insufficient Permissions</p>
                    <p className="text-xs text-secondary mt-1">Switch to MANAGER or ADMIN role at the top to review the submissions queue.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== REWARDS TAB ==================== */}
        {activeSubTab === 'rewards' && (
          <div className="flex-col gap-6">
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }} className="flex items-start gap-2.5">
              <Info size={18} style={{ color: 'var(--color-orange)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span className="text-sm font-bold text-white block">Workflow Explanation</span>
                <span className="text-xs text-secondary mt-1 block">
                  Employees spend their earned XP points to redeem catalog items. Redeeming a reward decrements their points balance in the `XpLedgerEntry` (as negative points) and updates the reward stock.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rewards List */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-4">Rewards Catalog</h3>
                {rewards.length === 0 ? (
                  <div className="glass-panel p-12 text-center text-secondary">
                    No items in catalog. Use the admin form on the right to add some.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rewards.map(rw => (
                      <div key={rw.id} className="glass-panel flex-col justify-between" style={{ padding: '20px', background: '#1e293b' }}>
                        <div>
                          <h4 className="font-bold text-lg text-white">{rw.name}</h4>
                          <p className="text-sm text-secondary mt-1" style={{ minHeight: '40px' }}>{rw.description}</p>
                        </div>
                        <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="flex-col">
                            <span className="text-xs text-secondary">Price:</span>
                            <span className="font-bold text-green text-base">{rw.pointsRequired} XP</span>
                          </div>
                          <div className="flex-col items-end">
                            <span className="text-xs text-muted mb-1">{rw.stock} left in stock</span>
                            <button 
                              onClick={() => handleRedeemReward(rw.id)} 
                              disabled={rw.stock <= 0}
                              className="btn-primary" 
                              style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '12px' }}
                            >
                              Redeem Item
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Create Reward Form Panel */}
              <div className="glass-panel" style={{ padding: '24px', background: '#1e293b', height: 'fit-content' }}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Plus size={20} style={{ color: 'var(--color-primary-green)' }} />
                  Add Reward Item
                </h3>
                {activeUser.role === 'ADMIN' ? (
                  <form onSubmit={handleCreateReward} className="flex-col gap-4">
                    <div className="flex-col gap-1.5">
                      <label className="text-xs font-semibold text-secondary">Item Name</label>
                      <input 
                        type="text" 
                        value={newReward.name}
                        onChange={e => setNewReward({...newReward, name: e.target.value})}
                        required
                        placeholder="e.g. Canvas Tote Bag"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                      />
                    </div>

                    <div className="flex-col gap-1.5">
                      <label className="text-xs font-semibold text-secondary">Description</label>
                      <textarea 
                        value={newReward.description}
                        onChange={e => setNewReward({...newReward, description: e.target.value})}
                        required
                        placeholder="Product description and material details..."
                        rows={3}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', resize: 'vertical' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex-col gap-1.5">
                        <label className="text-xs font-semibold text-secondary">Points Required</label>
                        <input 
                          type="number" 
                          value={newReward.pointsRequired}
                          onChange={e => setNewReward({...newReward, pointsRequired: parseInt(e.target.value)})}
                          required
                          min="1"
                          style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                        />
                      </div>
                      <div className="flex-col gap-1.5">
                        <label className="text-xs font-semibold text-secondary">Stock Qty</label>
                        <input 
                          type="number" 
                          value={newReward.stock}
                          onChange={e => setNewReward({...newReward, stock: parseInt(e.target.value)})}
                          required
                          min="0"
                          style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-2.5 rounded-lg justify-center font-bold" style={{ marginTop: '8px' }}>
                      Publish Reward
                    </button>
                  </form>
                ) : (
                  <div className="p-4 text-center rounded-lg" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <p className="text-sm text-red font-medium">Insufficient Permissions</p>
                    <p className="text-xs text-secondary mt-1">Switch to ADMIN role at the top to add reward catalog items.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== LEADERBOARD TAB ==================== */}
        {activeSubTab === 'leaderboard' && (
          <div className="flex-col gap-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Live Standings</h3>
                <p className="text-xs text-secondary">Simulate rank aggregates dynamically (cached for 60s)</p>
              </div>

              {/* Scope Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                <button 
                  onClick={() => setLeaderboardScope('employee')} 
                  style={{
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: leaderboardScope === 'employee' ? 'var(--color-primary-green)' : 'transparent',
                    color: leaderboardScope === 'employee' ? '#fff' : 'var(--color-text-secondary)'
                  }}
                >
                  Employees
                </button>
                <button 
                  onClick={() => setLeaderboardScope('department')} 
                  style={{
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: leaderboardScope === 'department' ? 'var(--color-primary-green)' : 'transparent',
                    color: leaderboardScope === 'department' ? '#fff' : 'var(--color-text-secondary)'
                  }}
                >
                  Departments
                </button>
              </div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="glass-panel p-12 text-center text-secondary">No records found. Users must earn XP to show standings.</div>
            ) : (
              <div className="flex-col gap-6" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                
                {/* Podium for top 3 */}
                {leaderboard.length >= 1 && (
                  <div className="flex items-end justify-center gap-4 py-8 flex-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
                    {/* Second Place */}
                    {leaderboard[1] && (
                      <div className="flex-col items-center gap-2">
                        <div style={{ background: '#94a3b8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>2</div>
                        <span className="text-xs text-secondary font-bold truncate" style={{ maxWidth: '100px' }}>{leaderboard[1].name}</span>
                        <div style={{ height: '70px', width: '90px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="font-bold text-sm text-green">{leaderboard[1].totalXp} XP</span>
                        </div>
                      </div>
                    )}

                    {/* First Place */}
                    {leaderboard[0] && (
                      <div className="flex-col items-center gap-2">
                        <Trophy size={24} style={{ color: '#fbbf24' }} className="animate-bounce" />
                        <div style={{ background: '#fbbf24', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>1</div>
                        <span className="text-sm text-white font-bold truncate" style={{ maxWidth: '120px' }}>{leaderboard[0].name}</span>
                        <div style={{ height: '110px', width: '110px', background: 'rgba(34,197,94,0.05)', border: '2px solid rgba(34,197,94,0.2)', borderBottom: 'none', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="font-bold text-base text-green">{leaderboard[0].totalXp} XP</span>
                        </div>
                      </div>
                    )}

                    {/* Third Place */}
                    {leaderboard[2] && (
                      <div className="flex-col items-center gap-2">
                        <div style={{ background: '#b45309', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>3</div>
                        <span className="text-xs text-secondary font-bold truncate" style={{ maxWidth: '100px' }}>{leaderboard[2].name}</span>
                        <div style={{ height: '50px', width: '90px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="font-bold text-sm text-green">{leaderboard[2].totalXp} XP</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Leaderboard Table List */}
                <div className="glass-panel" style={{ padding: '16px', background: '#1e293b' }}>
                  {leaderboard.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3.5 rounded-lg mb-2"
                      style={{ 
                        background: item.id === activeUser.id && leaderboardScope === 'employee' ? 'rgba(34, 197, 94, 0.12)' : '#0f172a',
                        borderLeft: `3px solid ${idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'transparent'}`
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-base text-secondary" style={{ width: '30px' }}>
                          #{idx + 1}
                        </span>
                        <div className="flex-col">
                          <span className="font-bold text-white">{item.name}</span>
                          {leaderboardScope === 'employee' && (
                            <span className="text-xs text-secondary mt-0.5">{item.departmentName || 'No Department'}</span>
                          )}
                          {leaderboardScope === 'department' && (
                            <span className="text-xs text-secondary mt-0.5">Code: {item.code} | {item.employeeCount} Members</span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-green">{item.totalXp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== BADGES TAB ==================== */}
        {activeSubTab === 'badges' && (
          <div className="flex-col gap-6">
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }} className="flex items-start gap-2.5">
              <Info size={18} style={{ color: 'var(--color-primary-green)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span className="text-sm font-bold text-white block">Badge Awarding Engine</span>
                <span className="text-xs text-secondary mt-1 block">
                  Every time a challenge is approved and XP is awarded, the server automatically checks the unlock rules for all badges (e.g. completedChallenges &gt;= 1). If satisfied, the badge is unlocked.
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-4">Badges catalog</h3>
            {badges.length === 0 ? (
              <div className="glass-panel p-12 text-center text-secondary">No badges found in database. Seeding should create them.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map(bg => {
                  const hasUnlocked = userBadges.some(ub => ub.badgeId === bg.id);
                  return (
                    <div 
                      key={bg.id} 
                      className="glass-panel flex items-start gap-4"
                      style={{
                        padding: '20px',
                        background: '#1e293b',
                        border: hasUnlocked ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: hasUnlocked ? '0 4px 15px rgba(34,197,94,0.05)' : 'none',
                        opacity: hasUnlocked ? 1 : 0.6
                      }}
                    >
                      <div 
                        style={{ 
                          fontSize: '32px', 
                          background: hasUnlocked ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.15)', 
                          padding: '12px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {bg.icon || '🏆'}
                      </div>
                      <div className="flex-col gap-1">
                        <h4 className="font-bold text-base text-white">{bg.name}</h4>
                        <p className="text-xs text-secondary leading-normal">{bg.description}</p>
                        <div style={{ marginTop: '6px' }}>
                          {hasUnlocked ? (
                            <span className="text-xs font-bold text-green">🟢 Unlocked & Earned</span>
                          ) : (
                            <span className="text-xs font-bold text-muted">🔒 Locked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      <div className="glass-panel" style={{ padding: '20px', marginTop: '24px', background: '#1e293b' }}>
        <h3 className="text-base font-bold flex items-center gap-2 mb-3 text-white">
          <Bell size={18} style={{ color: 'var(--color-primary-green)' }} />
          Notifications & Activity Stream
        </h3>
        {notifications.length === 0 ? (
          <p className="text-xs text-secondary">No notification logs recorded for this user.</p>
        ) : (
          <div className="flex-col gap-2 max-h-52 overflow-y-auto pr-1">
            {notifications.map(nt => (
              <div 
                key={nt.id} 
                className="flex items-center justify-between p-3 rounded-lg text-xs gap-3"
                style={{ 
                  background: nt.read ? 'transparent' : 'rgba(34, 197, 94, 0.05)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}
              >
                <div className="flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green">[{nt.type}]</span>
                    <span className="text-muted">{new Date(nt.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="text-secondary" style={{ marginTop: '2px', wordBreak: 'break-all' }}>{JSON.stringify(nt.payload)}</span>
                </div>
                {!nt.read && (
                  <button 
                    onClick={() => handleMarkNotificationRead(nt.id)} 
                    className="btn-outline" 
                    style={{ padding: '4px 10px', fontSize: '10px', borderRadius: '4px' }}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
