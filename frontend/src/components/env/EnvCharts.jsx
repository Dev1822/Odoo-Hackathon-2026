import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function ChartSkeleton({ title }) {
  return (
    <div className="card environmental-chart-card">
      <div className="section-heading">
        <div>
          <h3>{title}</h3>
          <p>Loading environmental metrics.</p>
        </div>
      </div>
      <div className="skeleton-chart" />
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <div key={item.dataKey} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: item.color }} />
          <span>{item.name}</span>
          <strong>{item.value} kg</strong>
        </div>
      ))}
    </div>
  );
}

export default function EnvCharts({ loading, trendData, rankingData }) {
  const [range, setRange] = useState('Month');

  if (loading) {
    return (
      <div className="environmental-analytics-grid">
        <ChartSkeleton title="Carbon Emission Trend" />
        <ChartSkeleton title="Department Carbon Ranking" />
      </div>
    );
  }

  return (
    <div className="environmental-analytics-grid">
      <div className="card environmental-chart-card environmental-chart-main">
        <div className="section-heading">
          <div>
            <h3>Carbon Emission Trend</h3>
            <p>Monthly emissions across the last 12 months.</p>
          </div>

          <div className="segmented-control" role="tablist" aria-label="Trend period">
            {['Month', 'Quarter', 'Year'].map((option) => (
              <button
                key={option}
                type="button"
                className={range === option ? 'is-active' : ''}
                onClick={() => setRange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="environmental-chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-text-secondary)" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-text-secondary)" />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="emissions"
                name="Actual"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'var(--color-primary)' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="var(--color-secondary)"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card environmental-chart-card environmental-chart-side">
        <div className="section-heading">
          <div>
            <h3>Department Carbon Ranking</h3>
            <p>Highest to lowest emitting departments.</p>
          </div>
        </div>

        <div className="environmental-chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={rankingData}
              margin={{ top: 12, right: 12, left: 12, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-text-secondary)" />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="var(--color-text-secondary)"
                width={92}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="emissions" name="Emissions" fill="var(--color-secondary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
