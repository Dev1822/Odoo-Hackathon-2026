import { TrendingUp, Leaf, Users, ShieldCheck, Activity } from 'lucide-react';

const kpiData = [
  { title: 'Environmental Score', score: 82, trend: 8, color: 'var(--color-primary)', icon: Leaf },
  { title: 'Social Score', score: 74, trend: 4, color: 'var(--color-secondary)', icon: Users },
  { title: 'Governance Score', score: 88, trend: 12, color: '#9333EA', icon: ShieldCheck },
  { title: 'Overall ESG Score', score: 81, trend: 7, color: '#EAB308', icon: Activity },
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px', marginBottom: '24px' }}>
      
      {kpiData.map((kpi) => (
        <div key={kpi.title} className="card p-4 flex flex-col justify-between" style={{ height: '140px', padding: '16px' }}>
          
          <div className="flex justify-between items-start">
            <h3 className="text-secondary font-medium text-sm">{kpi.title}</h3>
            <kpi.icon size={16} color="var(--color-text-secondary)" />
          </div>
          
          <div className="flex items-end gap-2 my-2">
            <span className="text-3xl font-bold">{kpi.score}</span>
            <span className="text-sm text-secondary mb-1">/ 100</span>
          </div>

          <div className="flex-col gap-2">
            <div style={{ width: '100%', height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${kpi.score}%`, height: '100%', background: kpi.color, borderRadius: '2px' }}></div>
            </div>
            
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp size={12} color="var(--color-primary)" />
              <span className="text-primary-brand font-medium">+{kpi.trend}%</span>
              <span className="text-secondary ml-1">vs last month</span>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
}
