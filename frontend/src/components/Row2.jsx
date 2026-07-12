import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const emissionsData = [
  { month: 'Jan', emissions: 4000 },
  { month: 'Feb', emissions: 3000 },
  { month: 'Mar', emissions: 2000 },
  { month: 'Apr', emissions: 2780 },
  { month: 'May', emissions: 1890 },
  { month: 'Jun', emissions: 2390 },
  { month: 'Jul', emissions: 3490 },
  { month: 'Aug', emissions: 2000 },
  { month: 'Sep', emissions: 2780 },
  { month: 'Oct', emissions: 1890 },
  { month: 'Nov', emissions: 1390 },
  { month: 'Dec', emissions: 1100 },
];

const rankingData = [
  { rank: '🥇', dept: 'Manufacturing', score: 95 },
  { rank: '🥈', dept: 'Corporate', score: 92 },
  { rank: '🥉', dept: 'Logistics', score: 89 },
  { rank: '4', dept: 'HR', score: 84 },
  { rank: '5', dept: 'Sales', score: 80 },
];

export default function Row2() {
  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Carbon Emissions Trend (Left 70% approx, so span 8 in 12 col grid) */}
      <div className="glass-panel p-6 animate-fade-in delay-100" style={{ padding: '24px', gridColumn: 'span 8' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Carbon Emissions Trend</h3>
          <select className="bg-main text-sm text-secondary" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-main)' }}>
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={emissionsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary-green)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary-green)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--color-primary-green)' }}
              />
              <Area type="monotone" dataKey="emissions" stroke="var(--color-primary-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department ESG Ranking (Right 30% approx, so span 4 in 12 col grid) */}
      <div className="glass-panel p-6 animate-fade-in delay-200" style={{ padding: '24px', gridColumn: 'span 4' }}>
        <h3 className="font-semibold text-lg mb-6">Department ESG Ranking</h3>
        
        <div className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {rankingData.map((item, index) => (
            <div key={item.dept} className="flex items-center justify-between group" style={{ padding: '8px 0', borderBottom: index !== rankingData.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div className="flex items-center gap-3">
                <span style={{ width: '24px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>{item.rank}</span>
                <span className="font-medium text-sm group-hover:text-green transition-colors">{item.dept}</span>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.score}%`, height: '100%', background: 'var(--color-primary-green)', borderRadius: '3px' }}></div>
                </div>
                <span className="text-sm font-bold">{item.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
