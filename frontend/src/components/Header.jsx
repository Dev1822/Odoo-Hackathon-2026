import { useState } from 'react';
import { Search, Bell, ChevronDown, Calendar, User, Moon, Sun, Menu } from 'lucide-react';

export default function Header({ activeMenu, activeSub, onOpenSidebar }) {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  const buttonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500
  };

  const iconButtonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <header
      className="app-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        padding: '0 24px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      
      <div className="header-left-cluster" style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        <button type="button" className="mobile-menu-button" onClick={onOpenSidebar} aria-label="Open sidebar">
          <Menu size={18} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '20px', color: 'var(--color-primary)' }}>EcoSphere</span>
        <div className="top-breadcrumb" style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span>{activeMenu}</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{activeSub}</span>
        </div>
      </div>

      <div className="header-search-wrap" style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: '200px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--color-text-secondary)' 
            }} 
          />
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ 
              width: '100%',
              padding: '8px 12px 8px 36px', 
              borderRadius: '6px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-main)',
              color: 'var(--color-text-primary)',
              outline: 'none',
              fontSize: '14px',
              boxSizing: 'border-box'
            }} 
          />
        </div>
      </div>

      <div className="header-right-cluster" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', flex: 1, minWidth: 0 }}>
        <div className="header-dropdown-cluster" style={{ display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap' }}>
          <button style={buttonStyle}>
            <span>Global Corp</span>
            <ChevronDown size={14} color="var(--color-text-secondary)" />
          </button>
          
          <div style={{ width: '1px', height: '16px', background: 'var(--border-color)' }}></div>
          
          <button style={buttonStyle}>
            <Calendar size={14} color="var(--color-text-secondary)" />
            <span>This Month</span>
            <ChevronDown size={14} color="var(--color-text-secondary)" />
          </button>
        </div>

        <div className="header-divider" style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

        <div className="header-icon-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={toggleTheme} style={iconButtonStyle} title="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button style={{ ...iconButtonStyle, position: 'relative' }}>
            <Bell size={20} />
            <span style={{ 
              position: 'absolute', 
              top: '-2px', 
              right: '-2px', 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#D92D20', 
              border: '2px solid var(--bg-surface)' 
            }}></span>
          </button>
          
          <button style={{ 
            background: 'var(--bg-main)', 
            border: 'none', 
            color: 'var(--color-text-secondary)', 
            cursor: 'pointer', 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <User size={18} />
          </button>
        </div>
      </div>

    </header>
  );
}
