import { CheckCircle2, TrendingUp, AlertCircle, AlertTriangle, Medal } from 'lucide-react';

const activities = [
  { text: 'Carbon Transaction Added', employee: 'Ansh Patel', dept: 'IT', time: '10 mins ago', icon: TrendingUp, color: 'var(--color-blue)' },
  { text: 'CSR Activity Approved', employee: 'Emma Watson', dept: 'HR', time: '1 hour ago', icon: CheckCircle2, color: 'var(--color-primary-green)' },
  { text: 'Policy Accepted', employee: 'John Doe', dept: 'Sales', time: '2 hours ago', icon: CheckCircle2, color: 'var(--color-purple)' },
  { text: 'Audit Completed', employee: 'Priya Singh', dept: 'Manufacturing', time: '3 hours ago', icon: CheckCircle2, color: 'var(--color-orange)' },
  { text: 'Badge Earned', employee: 'Alex Lee', dept: 'Logistics', time: '5 hours ago', icon: Medal, color: 'var(--color-orange)' },
  { text: 'Compliance Issue Raised', employee: 'System', dept: 'Corporate', time: '1 day ago', icon: AlertTriangle, color: 'var(--color-red)' },
];

const insights = [
  { text: 'Carbon emissions reduced by 12%', color: 'var(--color-primary-green)', icon: TrendingUp },
  { text: 'CSR participation increased by 18%', color: 'var(--color-blue)', icon: TrendingUp },
  { text: '2 audits pending', color: 'var(--color-orange)', icon: AlertCircle },
  { text: '3 compliance issues overdue', color: 'var(--color-red)', icon: AlertTriangle },
  { text: 'Manufacturing exceeded monthly target', color: 'var(--color-purple)', icon: Medal },
];

export default function Row4() {
  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Recent Activity Timeline (Left 6/12) */}
      <div className="glass-panel p-6 animate-fade-in delay-300" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6">Recent Activity Timeline</h3>
        
        <div className="relative pl-4" style={{ borderLeft: '2px solid var(--border-color)', marginLeft: '8px' }}>
          {activities.map((act, index) => (
            <div key={index} className="mb-6 relative">
              <div 
                style={{ 
                  position: 'absolute', 
                  left: '-29px', 
                  top: '0', 
                  background: 'var(--bg-card)',
                  padding: '2px',
                  borderRadius: '50%'
                }}
              >
                <act.icon size={18} color={act.color} />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-primary">{act.text}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                  <span>{act.employee}</span>
                  <span>•</span>
                  <span>{act.dept}</span>
                  <span>•</span>
                  <span>{act.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's ESG Insights (Right 6/12) */}
      <div className="glass-panel p-6 animate-fade-in delay-400" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6">Today's ESG Insights</h3>
        
        <div className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 p-4 transition-all" 
              style={{ 
                background: 'rgba(0,0,0,0.2)', 
                borderRadius: '12px', 
                borderLeft: `4px solid ${insight.color}` 
              }}
            >
              <div 
                style={{ 
                  background: `color-mix(in srgb, ${insight.color} 20%, transparent)`, 
                  padding: '8px', 
                  borderRadius: '50%' 
                }}
              >
                <insight.icon size={20} color={insight.color} />
              </div>
              <p className="text-sm font-medium">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
