import { useState } from 'react';
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Trophy, 
  FileBarChart, 
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const MENU_ITEMS = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    submenus: ['Executive Overview', 'ESG Analytics', 'Organization Overview']
  },
  {
    title: 'Environmental',
    icon: Leaf,
    submenus: ['Emission Factors', 'Product ESG Profiles', 'Carbon Transactions', 'Environmental Goals', 'Sustainability Targets', 'Carbon Reports']
  },
  {
    title: 'Social',
    icon: Users,
    submenus: ['CSR Activities', 'Employee Participation', 'Diversity Dashboard', 'Training Completion', 'Employee Engagement']
  },
  {
    title: 'Governance',
    icon: ShieldCheck,
    submenus: ['ESG Policies', 'Policy Acknowledgements', 'Audits', 'Compliance Issues', 'Risk Management']
  },
  {
    title: 'Gamification',
    icon: Trophy,
    submenus: ['Challenges', 'Challenge Participation', 'Badges', 'Rewards', 'Leaderboard', 'Achievement Levels']
  },
  {
    title: 'Reports',
    icon: FileBarChart,
    submenus: ['Environmental Report', 'Social Report', 'Governance Report', 'ESG Summary Report', 'Custom Report Builder']
  },
  {
    title: 'Settings',
    icon: Settings,
    submenus: ['Departments', 'Categories', 'ESG Configuration', 'Emission Factors', 'Notification Settings', 'User Roles', 'Organization Settings']
  }
];

export default function Sidebar({ isExpanded, setIsExpanded }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [expandedMenu, setExpandedMenu] = useState('Dashboard');

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const handleMenuClick = (title) => {
    if (!isExpanded) setIsExpanded(true);
    setExpandedMenu(expandedMenu === title ? null : title);
    setActiveMenu(title);
  };

  return (
    <aside className={`glass-panel flex-col justify-between sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-top">
        <div className="sidebar-toggle-wrapper flex items-center justify-between" style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
          {isExpanded && <span className="font-bold text-lg" style={{ color: 'var(--color-primary-green)' }}>EcoSphere</span>}
          <button onClick={toggleSidebar} className="btn-outline toggle-btn" style={{ padding: '4px', border: 'none' }}>
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav" style={{ padding: '16px 0' }}>
          {MENU_ITEMS.map((item) => {
            const isActive = activeMenu === item.title;
            const isMenuExpanded = expandedMenu === item.title && isExpanded;

            return (
              <div key={item.title} className="menu-group">
                <button
                  className={`menu-item flex items-center w-full ${isActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.title)}
                  style={{
                    padding: '12px 16px',
                    borderLeft: isActive ? '3px solid var(--color-primary-green)' : '3px solid transparent',
                    background: isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isActive ? 'var(--color-primary-green)' : 'var(--color-text-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                  title={!isExpanded ? item.title : ''}
                >
                  <item.icon size={20} style={{ minWidth: '20px' }} />
                  {isExpanded && (
                    <span className="font-medium text-sm" style={{ marginLeft: '12px', flex: 1, textAlign: 'left' }}>
                      {item.title}
                    </span>
                  )}
                  {isExpanded && (
                    <ChevronRight size={16} style={{ transform: isMenuExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  )}
                </button>
                
                {isMenuExpanded && (
                  <div className="submenu animate-fade-in" style={{ paddingLeft: '48px', paddingRight: '16px', paddingBottom: '8px' }}>
                    {item.submenus.map(sub => (
                      <div key={sub} className="submenu-item text-sm text-secondary" style={{ padding: '8px 0', cursor: 'pointer' }}>
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-color)', padding: '16px' }}>
        <div className="user-card flex items-center gap-3">
          <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            AP
          </div>
          {isExpanded && (
            <div className="user-info flex-col" style={{ flex: 1 }}>
              <span className="text-sm font-semibold">Ansh Patel</span>
              <span className="text-xs text-secondary">ESG Administrator</span>
              <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary-green)' }}></span>
                <span className="text-xs text-muted">Online</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
