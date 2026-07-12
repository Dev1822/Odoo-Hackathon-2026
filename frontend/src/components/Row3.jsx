import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const deptEmissions = [
  { name: 'IT', emissions: 1200 },
  { name: 'Mfg', emissions: 4500 },
  { name: 'Finance', emissions: 800 },
  { name: 'HR', emissions: 600 },
  { name: 'Sales', emissions: 1500 },
  { name: 'Logistics', emissions: 3200 },
];

const goals = [
  { title: 'Reduce Carbon', progress: 82, color: 'var(--color-primary-green)' },
  { title: 'CSR Participation', progress: 74, color: 'var(--color-blue)' },
  { title: 'Policy Compliance', progress: 96, color: 'var(--color-purple)' },
  { title: 'Training Completion', progress: 68, color: 'var(--color-orange)' },
];

export default function Row3() {
  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Carbon Analytics Bar Chart (Left 6/12) */}
      <div className="glass-panel p-6 animate-fade-in delay-200" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6">Carbon Emissions by Department</h3>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptEmissions} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
              <Bar dataKey="emissions" fill="var(--color-blue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal Progress (Right 6/12) */}
      <div className="glass-panel p-6 animate-fade-in delay-300" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6">Goal Progress</h3>
        
        <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {goals.map(goal => (
            <div key={goal.title} className="p-4" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-secondary">{goal.title}</span>
                <span className="text-sm font-bold" style={{ color: goal.color }}>{goal.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${goal.progress}%`, 
                    height: '100%', 
                    background: goal.color, 
                    borderRadius: '4px',
                    transition: 'width 1s ease-out'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
