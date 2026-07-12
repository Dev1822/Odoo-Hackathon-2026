import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, activeMenu, setActiveMenu, activeSub, setActiveSub }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      <div
        className="layout-sidebar-desktop"
        style={{
          width: 'var(--sidebar-width-expanded)',
          height: '100%',
          flexShrink: 0,
        }}
      >
        <Sidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          activeSub={activeSub}
          setActiveSub={setActiveSub}
        />
      </div>

      <div
        className={`layout-mobile-overlay ${mobileSidebarOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileSidebarOpen}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <div className={`layout-mobile-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}>
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          activeSub={activeSub}
          setActiveSub={setActiveSub}
          onNavigate={() => setMobileSidebarOpen(false)}
        />
      </div>

      <div className="flex-col flex-1 overflow-hidden" style={{ height: '100%', minWidth: 0 }}>
        <Header
          activeMenu={activeMenu}
          activeSub={activeSub}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto" style={{ padding: '24px', minWidth: 0 }}>
          <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', width: '100%', position: 'relative' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
