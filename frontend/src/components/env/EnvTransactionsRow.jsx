import { Filter, Search } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <strong>{payload[0].name}</strong>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: payload[0].payload.color }} />
        <span>Contribution</span>
        <strong>{payload[0].value} kg</strong>
      </div>
    </div>
  );
}

export default function EnvTransactionsRow({ transactions, sourceData, loading }) {
  if (loading) {
    return (
      <div className="environmental-split-grid">
        <div className="card environmental-table-card">
          <div className="section-heading">
            <div>
              <h3>Carbon Transactions</h3>
              <p>Loading emissions ledger.</p>
            </div>
          </div>
          <div className="skeleton-table" />
        </div>
        <div className="card environmental-chart-card environmental-chart-side">
          <div className="section-heading">
            <div>
              <h3>Emission Sources</h3>
              <p>Loading source distribution.</p>
            </div>
          </div>
          <div className="skeleton-chart" />
        </div>
      </div>
    );
  }

  return (
    <div className="environmental-split-grid">
      <div className="card environmental-table-card">
        <div className="section-heading section-heading-wrap">
          <div>
            <h3>Carbon Transactions</h3>
            <p>Captured emission records across operational sources.</p>
          </div>

          <div className="table-toolbar-inline">
            <label className="search-input">
              <Search size={16} />
              <input type="text" placeholder="Search transactions" />
            </label>
            <button type="button" className="btn-outline">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className="responsive-table-shell">
          <table className="erp-table enterprise-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Department</th>
                <th>Source</th>
                <th>Quantity</th>
                <th>Emission Factor</th>
                <th>CO2 Generated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover-row">
                  <td data-label="Date">{transaction.date}</td>
                  <td data-label="Department">{transaction.department}</td>
                  <td data-label="Source">{transaction.source}</td>
                  <td data-label="Quantity">{transaction.quantity}</td>
                  <td data-label="Emission Factor">{transaction.factor}</td>
                  <td data-label="CO2 Generated">
                    <strong>{transaction.co2Generated}</strong>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge status-${transaction.status.toLowerCase()}`}>{transaction.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Showing 1-6 of 124 transactions</span>
          <div className="pagination-controls">
            <button type="button">Previous</button>
            <button type="button" className="is-active">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">Next</button>
          </div>
        </div>
      </div>

      <div className="card environmental-chart-card environmental-chart-side">
        <div className="section-heading">
          <div>
            <h3>Emission Sources</h3>
            <p>Relative contribution by source category.</p>
          </div>
        </div>

        <div className="emission-source-chart">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={sourceData}
                dataKey="value"
                nameKey="name"
                innerRadius={68}
                outerRadius={92}
                paddingAngle={2}
                stroke="none"
              >
                {sourceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="source-legend">
          {sourceData.map((source) => (
            <div key={source.name} className="source-legend-row">
              <span className="source-legend-name">
                <span className="source-legend-dot" style={{ background: source.color }} />
                {source.name}
              </span>
              <strong>{source.value} kg</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
