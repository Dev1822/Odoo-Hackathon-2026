const leaderboard = [
  { rank: '🥇', name: 'Emma', xp: '2450 XP', level: 12, title: '🌿 Eco Champion' },
  { rank: '🥈', name: 'John', xp: '2310 XP', level: 11, title: '' },
  { rank: '🥉', name: 'Priya', xp: '2200 XP', level: 10, title: '' },
  { rank: '4', name: 'Alex', xp: '1980 XP', level: 9, title: '' },
];

const rewards = [
  { title: 'Coffee Coupon', xp: 200, stock: '45 left' },
  { title: 'Movie Ticket', xp: 500, stock: '12 left' },
  { title: 'Amazon Voucher', xp: 1200, stock: '5 left' },
];

export default function Row5() {
  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Gamification Leaderboard (Left 6/12) */}
      <div className="glass-panel p-6 animate-fade-in delay-400" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6">Gamification Leaderboard</h3>
        
        <div className="flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {leaderboard.map((user, index) => (
            <div key={user.name} className="flex items-center justify-between p-3" style={{ borderBottom: index !== leaderboard.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div className="flex items-center gap-3">
                <span style={{ width: '24px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>{user.rank}</span>
                <div className="flex-col">
                  <span className="font-medium text-sm">{user.name}</span>
                  {user.title && <span className="text-xs text-green">{user.title}</span>}
                </div>
              </div>
              <div className="flex-col items-end" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="text-sm font-bold text-orange">{user.xp}</span>
                <span className="text-xs text-muted">Level {user.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Store (Right 6/12) */}
      <div className="glass-panel p-6 animate-fade-in delay-500" style={{ padding: '24px', gridColumn: 'span 6' }}>
        <h3 className="font-semibold text-lg mb-6">Reward Store</h3>
        
        <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          {rewards.map((reward) => (
            <div key={reward.title} className="p-4 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
              <div className="w-12 h-12 mb-3" style={{ width: '48px', height: '48px', background: 'var(--bg-card)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🎁
              </div>
              <span className="text-sm font-medium mb-1">{reward.title}</span>
              <span className="text-xs font-bold text-orange mb-3">{reward.xp} XP</span>
              <button className="btn-outline w-full justify-center text-xs" style={{ padding: '4px 0' }}>Redeem</button>
              <span className="text-xs text-muted mt-2">{reward.stock}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
