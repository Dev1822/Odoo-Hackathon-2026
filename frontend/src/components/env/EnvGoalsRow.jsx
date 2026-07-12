const actionButtons = ['View', 'Edit', 'Delete'];

export default function EnvGoalsRow({ goals, summaryCards, loading, onOpenGoal }) {
  if (loading) {
    return (
      <div className="environmental-split-grid">
        <div className="card environmental-table-card">
          <div className="section-heading">
            <div>
              <h3>Environmental Goals</h3>
              <p>Loading active goal performance.</p>
            </div>
          </div>
          <div className="skeleton-table" />
        </div>

        <div className="goal-summary-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card goal-summary-card">
              <div className="skeleton skeleton-line" style={{ width: '62%' }} />
              <div className="skeleton skeleton-metric" style={{ width: '52%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="environmental-split-grid">
      <div className="card environmental-table-card">
        <div className="section-heading">
          <div>
            <h3>Environmental Goals</h3>
            <p>Department goals with target, current output and delivery status.</p>
          </div>
        </div>

        <div className="responsive-table-shell">
          <table className="erp-table enterprise-table">
            <thead>
              <tr>
                <th>Goal Name</th>
                <th>Department</th>
                <th>Target CO2</th>
                <th>Current CO2</th>
                <th>Progress</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.slice(0, 5).map((goal) => (
                <tr key={goal.id} className="hover-row" onClick={() => onOpenGoal(goal)}>
                  <td data-label="Goal Name">
                    <div className="table-primary-cell">
                      <strong>{goal.name}</strong>
                      <span>{goal.id}</span>
                    </div>
                  </td>
                  <td data-label="Department">{goal.department}</td>
                  <td data-label="Target CO2">{goal.target}</td>
                  <td data-label="Current CO2">{goal.current}</td>
                  <td data-label="Progress">
                    <div className="table-progress-cell">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
                      </div>
                      <span>{goal.progress}%</span>
                    </div>
                  </td>
                  <td data-label="Deadline">{goal.deadline}</td>
                  <td data-label="Status">
                    <span className={`status-badge status-${goal.status.toLowerCase()}`}>{goal.status}</span>
                  </td>
                  <td data-label="Actions">
                    <div className="row-actions">
                      {actionButtons.map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (label === 'View') {
                              onOpenGoal(goal);
                            }
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="goal-summary-grid">
        {summaryCards.map((item) => (
          <div key={item.label} className="card goal-summary-card" data-tone={item.tone}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
