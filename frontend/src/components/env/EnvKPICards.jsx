import { ArrowDownRight, Leaf, Target } from 'lucide-react';

const iconMap = {
  leaf: Leaf,
  arrow: ArrowDownRight,
  target: Target,
};

function KpiCardSkeleton() {
  return (
    <div className="card environmental-kpi-card skeleton-card">
      <div className="skeleton skeleton-line" style={{ width: '48%' }} />
      <div className="skeleton skeleton-metric" />
      <div className="skeleton skeleton-line" style={{ width: '72%' }} />
    </div>
  );
}

export default function EnvKPICards({ cards, loading }) {
  if (loading) {
    return (
      <div className="environmental-kpi-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="environmental-kpi-grid">
      {cards.map((kpi) => {
        const Icon = iconMap[kpi.icon];

        return (
          <button key={kpi.id} className="card environmental-kpi-card" type="button">
            <div className="environmental-kpi-top">
              <div>
                <span className="environmental-kpi-label">{kpi.title}</span>
                <div className="environmental-kpi-value-row">
                  <span className="environmental-kpi-value">{kpi.value}</span>
                  {kpi.unit ? <span className="environmental-kpi-unit">{kpi.unit}</span> : null}
                </div>
              </div>

              {kpi.icon === 'progress' ? (
                <div
                  className="environmental-progress-ring"
                  style={{ '--progress': `${kpi.progress}%` }}
                >
                  <span>{kpi.progress}%</span>
                </div>
              ) : (
                <span className="environmental-kpi-icon" data-tone={kpi.deltaTone}>
                  {Icon ? <Icon size={18} /> : null}
                </span>
              )}
            </div>

            <div className="environmental-kpi-footer">
              {kpi.delta ? <span className={`metric-delta tone-${kpi.deltaTone}`}>{kpi.delta}</span> : null}
              <span className="environmental-kpi-caption">{kpi.caption}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
