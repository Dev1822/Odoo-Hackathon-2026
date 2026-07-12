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

const MENU_ITEMS = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    submenus: ['Executive Overview', 'ESG Analytics', 'Organization Overview']
  },
  {
    title: 'Environmental',
    icon: Leaf,
    submenus: ['Emission Tracking & Goals', 'Carbon Transactions', 'Emission Factors', 'Product Profiles']
  },
  {
    title: 'Social',
    icon: Users,
    submenus: ['CSR Activities', 'Diversity Dashboard', 'Training', 'Employee Engagement']
  },
  {
    title: 'Governance',
    icon: ShieldCheck,
    submenus: ['Policies', 'Audits', 'Compliance', 'Risk Management']
  },
  {
    title: 'Gamification',
    icon: Trophy,
    submenus: ['Challenges', 'Badges', 'Leaderboard', 'Rewards']
  },
  {
    title: 'Reports',
    icon: FileBarChart,
    submenus: ['Environmental', 'Social', 'Governance', 'Custom Reports']
  },
  {
    title: 'Settings',
    icon: Settings,
    submenus: ['Departments', 'Categories', 'User Roles', 'Organization']
  }
];

export default function Sidebar({ activeMenu, setActiveMenu, activeSub, setActiveSub, onNavigate }) {
  const expandedMenu = activeMenu;

  const handleMenuClick = (title) => {
    setActiveMenu(title);

    const item = MENU_ITEMS.find(i => i.title === title);
    if (item && item.submenus.length > 0) {
      setActiveSub(item.submenus[0]);
    }

    onNavigate?.();
  };

  const handleSubClick = (sub, e) => {
    e.stopPropagation();
    setActiveSub(sub);
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
                    <item.icon size={18} color={isActive ? 'var(--color-primary-green)' : 'var(--color-text-secondary)'} />
                    <span className="text-sm">{item.title}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {isExpanded && (
                  <div className="flex-col" style={{ padding: '4px 0 8px 36px', gap: '2px' }}>
                    {item.submenus.map(sub => (
                      <button 
                        key={sub} 
                        className="text-sm text-left" 
                        onClick={(e) => handleSubClick(sub, e)}
                        style={{ 
                          padding: '6px 12px', 
                          border: 'none', 
                          background: 'transparent', 
                          color: activeSub === sub ? 'var(--color-primary-green)' : 'var(--color-text-secondary)',
                          fontWeight: activeSub === sub ? 600 : 400,
                          cursor: 'pointer',
                          borderRadius: 'var(--border-radius-sm)',
                        }}
                      >
                        {sub}
                      </button>
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
