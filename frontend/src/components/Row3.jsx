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
  { title: 'Reduce Carbon Footprint', progress: 82 },
  { title: 'CSR Participation Target', progress: 74 },
  { title: 'Policy Compliance Rate', progress: 96 },
  { title: 'Employee Training Completion', progress: 68 },
];

export default function Row3() {
  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Carbon Analytics Bar Chart (Left 6/12) */}
      <div className="card p-6" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6 text-primary">Carbon Emissions by Department</h3>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptEmissions} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
              <Tooltip 
                cursor={{ fill: '#F9FAFB' }}
                contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="emissions" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal Progress (Right 6/12) */}
      <div className="card p-6" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6 text-primary">Goal Progress</h3>
        
        <div className="flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {goals.map(goal => (
            <div key={goal.title}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-primary">{goal.title}</span>
                <span className="text-sm font-bold text-primary">{goal.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${goal.progress}%`, 
                    height: '100%', 
                    background: 'var(--color-primary)', 
                    borderRadius: '4px'
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
