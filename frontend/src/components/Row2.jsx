import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const emissionsData = [
  { month: 'Jan', emissions: 4000, target: 4500 },
  { month: 'Feb', emissions: 3000, target: 4300 },
  { month: 'Mar', emissions: 2000, target: 4100 },
  { month: 'Apr', emissions: 2780, target: 3900 },
  { month: 'May', emissions: 1890, target: 3700 },
  { month: 'Jun', emissions: 2390, target: 3500 },
  { month: 'Jul', emissions: 3490, target: 3300 },
  { month: 'Aug', emissions: 2000, target: 3100 },
  { month: 'Sep', emissions: 2780, target: 2900 },
  { month: 'Oct', emissions: 1890, target: 2700 },
  { month: 'Nov', emissions: 1390, target: 2500 },
  { month: 'Dec', emissions: 1100, target: 2300 },
];

const rankingData = [
  { rank: '1', dept: 'Manufacturing', score: 95 },
  { rank: '2', dept: 'Corporate', score: 92 },
  { rank: '3', dept: 'Logistics', score: 89 },
  { rank: '4', dept: 'HR', score: 84 },
  { rank: '5', dept: 'Sales', score: 80 },
];

export default function Row2() {
  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Carbon Emissions Trend (Left 70%) */}
      <div className="card p-6" style={{ padding: '24px', gridColumn: 'span 8' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-primary">Carbon Emissions Trend</h3>
          <select className="text-sm text-secondary" style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-surface)' }}>
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emissionsData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px', color: '#6B7280' }} />
              <Line type="monotone" dataKey="emissions" name="Actual Emissions" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-primary)" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="var(--color-secondary)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department ESG Ranking (Right 30%) */}
      <div className="card p-6" style={{ padding: '24px', gridColumn: 'span 4' }}>
        <h3 className="font-semibold text-lg mb-6 text-primary">Department ESG Ranking</h3>
        
        <div className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {rankingData.map((item, index) => (
            <div key={item.dept} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: index !== rankingData.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div className="flex items-center gap-3">
                <span style={{ width: '24px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-secondary)', background: '#F3F4F6', borderRadius: '4px', padding: '2px' }}>{item.rank}</span>
                <span className="font-medium text-sm text-primary">{item.dept}</span>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ width: '100px', height: '6px', background: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.score}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }}></div>
                </div>
                <span className="text-sm font-bold text-primary">{item.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
