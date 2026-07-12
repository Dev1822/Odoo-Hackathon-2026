import { TrendingUp } from 'lucide-react';

const kpiData = [
  { title: 'Environmental Score', score: 82, trend: 8, color: 'var(--color-primary-green)' },
  { title: 'Social Score', score: 74, trend: 4, color: 'var(--color-blue)' },
  { title: 'Governance Score', score: 88, trend: 12, color: 'var(--color-purple)' },
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' }}>
      
      {/* 3 Standard KPI Cards */}
      {kpiData.map((kpi, index) => (
        <div key={kpi.title} className="glass-panel p-6 flex flex-col items-center justify-center animate-fade-in" style={{ padding: '24px', animationDelay: `${index * 100}ms` }}>
          <h3 className="text-secondary font-medium mb-4 text-sm">{kpi.title}</h3>
          
          <div className="relative flex items-center justify-center" style={{ width: '100px', height: '100px', marginBottom: '16px' }}>
            <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <path
                className="text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="3"
              />
              <path
                className="text-primary-green"
                strokeDasharray={`${kpi.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={kpi.color}
                strokeWidth="3"
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span className="text-2xl font-bold">{kpi.score}</span>
              <span className="text-xs text-secondary">/100</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <TrendingUp size={16} color="var(--color-primary-green)" />
            <span className="text-green font-medium">↑ {kpi.trend}%</span>
            <span className="text-xs text-muted ml-1">vs last month</span>
          </div>
        </div>
      ))}

      {/* Overall ESG Score Card */}
      <div className="glass-panel p-6 flex flex-col justify-center animate-fade-in delay-300" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(30, 41, 59, 1) 100%)', border: '1px solid var(--color-primary-green)', animationDelay: '300ms' }}>
        <h3 className="text-white font-semibold mb-2">Overall ESG Score</h3>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-5xl font-bold" style={{ background: '-webkit-linear-gradient(45deg, var(--color-primary-green), var(--color-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>81</span>
          <span className="text-lg text-secondary mb-1">/100</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex text-orange">
            ★ ★ ★ ★ <span style={{ color: 'var(--color-text-muted)' }}>☆</span>
          </div>
          <div className="badge" style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'var(--color-primary-green)', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
            Excellent
          </div>
        </div>
      </div>

    </div>
  );
}
