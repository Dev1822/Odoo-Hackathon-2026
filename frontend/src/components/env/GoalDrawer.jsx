import { Clock3, MessageSquare, Paperclip, X } from 'lucide-react';

export default function GoalDrawer({ isOpen, onClose, goal }) {
  if (!goal) {
    return null;
  }

  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
        onClick={onClose}
      />

      <aside className={`goal-drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="goal-drawer-header">
          <div>
            <span className="drawer-kicker">{goal.id}</span>
            <h3>{goal.name}</h3>
            <p>{goal.department} environmental objective</p>
          </div>

          <button type="button" className="drawer-close-button" onClick={onClose} aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>

        <div className="goal-drawer-body">
          <section className="drawer-section">
            <div className="drawer-section-title">
              <h4>Goal Details</h4>
              <span className={`status-badge status-${goal.status.toLowerCase()}`}>{goal.status}</span>
            </div>

            <div className="drawer-detail-grid">
              <div>
                <span>Department</span>
                <strong>{goal.department}</strong>
              </div>
              <div>
                <span>Owner</span>
                <strong>{goal.owner}</strong>
              </div>
              <div>
                <span>Target</span>
                <strong>{goal.target}</strong>
              </div>
              <div>
                <span>Current</span>
                <strong>{goal.current}</strong>
              </div>
              <div>
                <span>Priority</span>
                <strong>{goal.priority}</strong>
              </div>
              <div>
                <span>Deadline</span>
                <strong>{goal.deadline}</strong>
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section-title">
              <h4>Progress</h4>
              <strong>{goal.progress}%</strong>
            </div>
            <div className="progress-track large">
              <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section-title">
              <h4>Timeline</h4>
              <Clock3 size={16} />
            </div>
            <div className="timeline-list">
              {goal.timeline.map((item) => (
                <div key={`${goal.id}-${item.label}`} className={`timeline-item timeline-${item.status}`}>
                  <span className="timeline-marker" />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section-title">
              <h4>Comments</h4>
              <span className="drawer-meta-pill">
                <MessageSquare size={14} />
                {goal.comments}
              </span>
            </div>
            <div className="drawer-notes">
              <div className="drawer-note">
                <strong>Maya Carter</strong>
                <p>Fleet routing update is reflected in July emissions. Awaiting supplier verification.</p>
              </div>
              <div className="drawer-note">
                <strong>Sustainability Office</strong>
                <p>Attach department evidence before the monthly review meeting.</p>
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section-title">
              <h4>Attachments</h4>
              <span className="drawer-meta-pill">
                <Paperclip size={14} />
                {goal.attachments}
              </span>
            </div>
            <div className="attachment-list">
              {goal.attachmentsList.length ? (
                goal.attachmentsList.map((item) => (
                  <button key={item} type="button" className="attachment-row">
                    {item}
                  </button>
                ))
              ) : (
                <p className="empty-drawer-state">No attachments uploaded yet.</p>
              )}
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section-title">
              <h4>Activity History</h4>
            </div>
            <div className="activity-list">
              {goal.activity.map((item) => (
                <div key={`${goal.id}-${item.user}-${item.time}`} className="activity-row">
                  <div className="activity-avatar">{item.user.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <strong>{item.user}</strong>
                    <p>{item.action}</p>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
