import { CheckCircle2, FileText, Medal, AlertCircle, Calendar } from 'lucide-react';

const activities = [
  { text: 'logged a carbon transaction', employee: 'Ansh Patel', dept: 'IT', time: '10 mins ago' },
  { text: 'approved a CSR activity', employee: 'Emma Watson', dept: 'HR', time: '1 hour ago' },
  { text: 'accepted a new policy', employee: 'John Doe', dept: 'Sales', time: '2 hours ago' },
  { text: 'completed an internal audit', employee: 'Priya Singh', dept: 'Manufacturing', time: '3 hours ago' },
  { text: 'earned the Eco Champion badge', employee: 'Alex Lee', dept: 'Logistics', time: '5 hours ago' },
];

const tasks = [
  { title: 'Q3 Internal Audit', type: 'Audit', date: 'Oct 15, 2026', icon: FileText },
  { title: 'Community Tree Planting', type: 'CSR Event', date: 'Oct 18, 2026', icon: CheckCircle2 },
  { title: 'Reduce Waste Challenge', type: 'Challenge Deadline', date: 'Oct 20, 2026', icon: Medal },
  { title: 'Annual Code of Conduct', type: 'Policy Renewal', date: 'Oct 25, 2026', icon: AlertCircle },
];

export default function Row4() {
  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Recent Activities (Left 6/12) */}
      <div className="card p-6" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6 text-primary">Recent Activities</h3>
        
        <div className="flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activities.map((act, index) => (
            <div key={index} className="flex gap-3 text-sm pb-4" style={{ borderBottom: index !== activities.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '600', color: 'var(--color-text-secondary)' }}>
                {act.employee.charAt(0)}
              </div>
              <div>
                <p className="text-primary" style={{ lineHeight: '1.4' }}>
                  <span className="font-semibold">{act.employee}</span> {act.text}
                </p>
                <div className="flex gap-2 text-xs text-secondary mt-1">
                  <span>{act.dept}</span>
                  <span>•</span>
                  <span>{act.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tasks (Right 6/12) */}
      <div className="card p-6" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6 text-primary">Upcoming Tasks</h3>
        
        <div className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tasks.map((task, index) => (
            <div key={index} className="flex items-start gap-4 p-4" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
              <div style={{ padding: '8px', background: '#F0FDF4', borderRadius: '4px', color: 'var(--color-primary)' }}>
                <task.icon size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-primary">{task.title}</h4>
                <div className="flex gap-4 mt-2 text-xs text-secondary">
                  <span className="flex items-center gap-1"><span style={{ fontWeight: 500 }}>Type:</span> {task.type}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {task.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
