import { TreePine, Car, Zap, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';

const events = [
  { title: 'CSR Drive', time: 'Tomorrow', type: 'social' },
  { title: 'Internal Audit', time: 'Friday', type: 'governance' },
  { title: 'Challenge Deadline', time: 'Monday', type: 'gamification' },
  { title: 'Policy Expiry', time: 'Next Week', type: 'governance' },
];

export default function Row6() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 520;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Carbon Saved (Left 6/12) */}
      <div className="glass-panel p-6 animate-fade-in delay-500 flex flex-col justify-center" style={{ padding: '24px', gridColumn: 'span 6', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(30, 41, 59, 1) 100%)' }}>
        <h3 className="font-semibold text-lg mb-2">Carbon Saved</h3>
        
        <div className="flex items-end gap-2 mb-6">
          <span className="font-bold text-green" style={{ fontSize: '48px', lineHeight: '1' }}>{count}</span>
          <span className="text-lg text-secondary mb-1">kg CO₂</span>
        </div>

        <div className="text-sm font-medium text-secondary mb-3">Equivalent to:</div>
        <div className="grid grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div className="flex flex-col items-center p-3 text-center" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <TreePine size={24} color="var(--color-primary-green)" className="mb-2" />
            <span className="font-bold text-sm">26 Trees</span>
          </div>
          <div className="flex flex-col items-center p-3 text-center" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <Car size={24} color="var(--color-blue)" className="mb-2" />
            <span className="font-bold text-sm">1200 km</span>
            <span className="text-xs text-muted">avoided</span>
          </div>
          <div className="flex flex-col items-center p-3 text-center" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <Zap size={24} color="var(--color-orange)" className="mb-2" />
            <span className="font-bold text-sm">18 homes</span>
            <span className="text-xs text-muted">energy</span>
          </div>
        </div>
      </div>

      {/* Upcoming Events (Right 6/12) */}
      <div className="glass-panel p-6 animate-fade-in delay-500" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Upcoming Events</h3>
          <CalendarDays size={20} color="var(--color-text-muted)" />
        </div>
        
        <div className="flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((evt, index) => {
            let color = 'var(--color-primary-green)';
            if(evt.type === 'social') color = 'var(--color-blue)';
            if(evt.type === 'governance') color = 'var(--color-purple)';
            if(evt.type === 'gamification') color = 'var(--color-orange)';
            
            return (
              <div key={index} className="flex items-center justify-between p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `3px solid ${color}` }}>
                <span className="text-sm font-medium">{evt.title}</span>
                <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: 'var(--bg-card)', color: 'var(--color-text-secondary)' }}>{evt.time}</span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
}
