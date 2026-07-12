import { Search, Bell, Moon, ChevronDown, Calendar } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass-panel flex items-center justify-between" style={{ height: 'var(--header-height)', padding: '0 24px', borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 10 }}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-xl text-green hidden lg:block">EcoSphere</span>
        <span className="text-sm text-secondary hidden lg:block">ESG Management Platform</span>
      </div>

      {/* Center */}
      <div className="flex-1 flex justify-center max-w-2xl px-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2" style={{ transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search employees, departments, reports..." 
            className="w-full bg-main text-sm text-primary"
            style={{ 
              padding: '10px 10px 10px 36px', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)', 
              background: 'rgba(0,0,0,0.2)',
              color: 'var(--color-text-primary)',
              outline: 'none'
            }} 
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="btn-outline text-sm" style={{ padding: '6px 12px' }}>
          <span>Global Corp</span>
          <ChevronDown size={16} />
        </button>

        <button className="btn-outline text-sm hidden md:flex" style={{ padding: '6px 12px' }}>
          <Calendar size={16} />
          <span>This Month</span>
          <ChevronDown size={16} />
        </button>

        <div className="flex items-center gap-3 border-l" style={{ borderColor: 'var(--border-color)', paddingLeft: '16px' }}>
          <button className="icon-btn" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <Moon size={20} />
          </button>
          
          <button className="icon-btn relative" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-red)' }}></span>
          </button>

          <div className="flex items-center gap-2 ml-2 cursor-pointer">
            <div className="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
              AP
            </div>
            <div className="flex-col hidden md:flex">
              <span className="text-sm font-semibold">Ansh Patel</span>
              <span className="text-xs text-secondary" style={{ fontSize: '10px' }}>Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
