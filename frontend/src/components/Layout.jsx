import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <div 
        style={{ 
          width: isSidebarExpanded ? 'var(--sidebar-width-expanded)' : 'var(--sidebar-width-collapsed)',
          transition: 'width var(--transition-normal)',
          height: '100%',
          flexShrink: 0
        }}
      >
        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      </div>

      {/* Main Content */}
      <div className="flex-col flex-1 overflow-hidden" style={{ height: '100%' }}>
        <Header />
        
        <main className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
