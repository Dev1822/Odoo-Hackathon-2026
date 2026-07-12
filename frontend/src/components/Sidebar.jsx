import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Trophy, 
  FileBarChart, 
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    submenus: [
      { label: 'Executive Overview', path: '/' },
      { label: 'ESG Analytics', path: '/' },
      { label: 'Organization Overview', path: '/' }
    ]
  },
  {
    title: 'Environmental',
    icon: Leaf,
    submenus: [
      { label: 'Emission Tracking & Goals', path: '/environmental' },
      { label: 'Carbon Transactions', path: '/' },
      { label: 'Emission Factors', path: '/' },
      { label: 'Product Profiles', path: '/' }
    ]
  },
  {
    title: 'Social',
    icon: Users,
    submenus: [
      { label: 'CSR Activities', path: '/csr' },
      { label: 'Employee Participation', path: '/participation' },
      { label: 'Diversity Dashboard', path: '/diversity' }
    ]
  },
  {
    title: 'Governance',
    icon: ShieldCheck,
    submenus: [
      { label: 'Policies', path: '/' },
      { label: 'Audits', path: '/' },
      { label: 'Compliance', path: '/' },
      { label: 'Risk Management', path: '/' }
    ]
  },
  {
    title: 'Gamification',
    icon: Trophy,
    submenus: [
      { label: 'Challenges', path: '/' },
      { label: 'Badges', path: '/' },
      { label: 'Leaderboard', path: '/' },
      { label: 'Rewards', path: '/' }
    ]
  },
  {
    title: 'Reports',
    icon: FileBarChart,
    submenus: [
      { label: 'Environmental', path: '/' },
      { label: 'Social', path: '/' },
      { label: 'Governance', path: '/' },
      { label: 'Custom Reports', path: '/' }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    submenus: [
      { label: 'Departments', path: '/' },
      { label: 'Categories', path: '/' },
      { label: 'User Roles', path: '/' },
      { label: 'Organization', path: '/' }
    ]
  }
];

export default function Sidebar({ activeMenu, setActiveMenu, activeSub, setActiveSub, onNavigate }) {
  const expandedMenu = activeMenu;

  const handleMenuClick = (title) => {
    setActiveMenu(title);

    const item = MENU_ITEMS.find(i => i.title === title);
    if (item && item.submenus.length > 0) {
      setActiveSub(item.submenus[0].label);
    }

    onNavigate?.();
  };

  return (
    <aside className="card flex-col justify-between" style={{ height: '100%', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderBottom: 'none' }}>
      <div className="flex-col">
        <div className="flex items-center" style={{ height: 'var(--header-height)', padding: '0 24px', borderBottom: '1px solid var(--border-color)' }}>
          <span className="font-bold text-xl text-primary-brand">EcoSphere</span>
        </div>

        <nav className="flex-col" style={{ padding: '16px 12px', gap: '4px' }}>
          {MENU_ITEMS.map((item) => {
            const isActive = activeMenu === item.title;
            const isExpanded = expandedMenu === item.title;

            return (
              <div key={item.title}>
                <button
                  className="w-full flex items-center justify-between"
                  onClick={() => handleMenuClick(item.title)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    background: isActive ? '#F3F4F6' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'background 0.1s'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} color={isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'} />
                    <span className="text-sm">{item.title}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {isExpanded && (
                  <div className="flex-col" style={{ padding: '4px 0 8px 36px', gap: '2px' }}>
                    {item.submenus.map(sub => (
                      <NavLink
                        key={sub.label}
                        to={sub.path}
                        className="submenu-item text-sm text-secondary"
                        style={({ isActive }) => ({
                          padding: '6px 12px', 
                          border: 'none', 
                          background: isActive ? 'transparent' : 'transparent', 
                          color: isActive ? 'var(--color-primary-green)' : 'var(--color-text-secondary)',
                          fontWeight: isActive ? 500 : 400,
                          cursor: 'pointer',
                          borderRadius: 'var(--border-radius-sm)',
                          display: 'block',
                          textDecoration: 'none'
                        })}
                        onClick={() => {
                          setActiveMenu(item.title);
                          setActiveSub(sub.label);
                        }}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            AP
          </div>
          <div className="flex-col">
            <span className="text-sm font-semibold">Ansh Patel</span>
            <span className="text-xs text-secondary">ESG Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
