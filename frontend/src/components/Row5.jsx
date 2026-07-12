const leaderboard = [
  { rank: '1', name: 'Emma Watson', dept: 'HR', xp: '2450', badge: 'Eco Champion' },
  { rank: '2', name: 'John Doe', dept: 'Sales', xp: '2310', badge: 'Sustainability Pro' },
  { rank: '3', name: 'Priya Singh', dept: 'Manufacturing', xp: '2200', badge: 'Green Advocate' },
  { rank: '4', name: 'Alex Lee', dept: 'Logistics', xp: '1980', badge: '-' },
  { rank: '5', name: 'Sarah Connor', dept: 'IT', xp: '1850', badge: '-' },
];

const rewards = [
  { reward: 'Coffee Coupon', xp: '200', stock: '45' },
  { reward: 'Movie Ticket', xp: '500', stock: '12' },
  { reward: 'Amazon Voucher', xp: '1200', stock: '5' },
  { reward: 'Extra Vacation Day', xp: '5000', stock: '2' },
];

export default function Row5() {
  return (
    <div className="grid gap-6 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '24px' }}>
      
      {/* Gamification Leaderboard (Left 6/12) */}
      <div className="card p-6" style={{ padding: '24px', gridColumn: 'span 6', overflowX: 'auto' }}>
        <h3 className="font-semibold text-lg mb-6 text-primary">Leaderboard</h3>
        <table className="erp-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee</th>
              <th>Department</th>
              <th>XP</th>
              <th>Badge</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
              <tr key={user.name}>
                <td data-label="Rank" style={{ fontWeight: 600 }}>{user.rank}</td>
                <td data-label="Employee">{user.name}</td>
                <td data-label="Department">{user.dept}</td>
                <td data-label="XP" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{user.xp}</td>
                <td data-label="Badge">{user.badge !== '-' ? <span style={{ background: '#F0FDF4', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>{user.badge}</span> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reward Store (Right 6/12) */}
      <div className="card p-6" style={{ padding: '24px', gridColumn: 'span 6', overflowX: 'auto' }}>
        <h3 className="font-semibold text-lg mb-6 text-primary">Reward Store</h3>
        <table className="erp-table">
          <thead>
            <tr>
              <th>Reward</th>
              <th>XP Required</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((item) => (
              <tr key={item.reward}>
                <td data-label="Reward" style={{ fontWeight: 500 }}>{item.reward}</td>
                <td data-label="XP Required" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.xp}</td>
                <td data-label="Stock">{item.stock} left</td>
                <td data-label="Action">
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>Redeem</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
