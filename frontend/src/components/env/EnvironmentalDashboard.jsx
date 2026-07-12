import { useEffect, useMemo, useState } from 'react';
import { CalendarRange, ChevronRight, Download, Filter, FolderSync } from 'lucide-react';
import EnvKPICards from './EnvKPICards';
import EnvCharts from './EnvCharts';
import EnvGoalsRow from './EnvGoalsRow';
import EnvTransactionsRow from './EnvTransactionsRow';
import EnvWorkspaceTable from './EnvWorkspaceTable';
import GoalDrawer from './GoalDrawer';
import {
  departmentRanking,
  emissionSources,
  emissionTrendData,
  environmentalGoals,
  environmentalKpis,
  getGoalSummary,
  quickActions,
  transactions,
} from './envData';

export default function EnvironmentalDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('This Month');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredGoals = useMemo(() => {
    if (departmentFilter === 'All Departments') {
      return environmentalGoals;
    }

    return environmentalGoals.filter((goal) => goal.department === departmentFilter);
  }, [departmentFilter]);

  const filteredTransactions = useMemo(() => {
    if (departmentFilter === 'All Departments') {
      return transactions;
    }

    return transactions.filter((transaction) => transaction.department === departmentFilter);
  }, [departmentFilter]);

  const summaryCards = useMemo(() => getGoalSummary(filteredGoals), [filteredGoals]);

  const openGoalDrawer = (goal) => {
    setSelectedGoal(goal);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="environmental-page">
      <div className="environmental-page-header">
        <div>
          <div className="environmental-breadcrumb">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span>Environmental</span>
            <ChevronRight size={14} />
            <span className="current">Emission Tracking &amp; Goals</span>
          </div>

          <h1 className="environmental-title">Environmental Management</h1>
          <p className="environmental-subtitle">
            Monitor emissions, sustainability targets and environmental performance across departments.
          </p>
        </div>

        <div className="environmental-header-actions">
          <label className="control-chip">
            <CalendarRange size={16} />
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
              <option>This Month</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
          </label>

          <label className="control-chip">
            <Filter size={16} />
            <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
              <option>All Departments</option>
              <option>Facilities</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Logistics</option>
              <option>Manufacturing</option>
              <option>Procurement</option>
              <option>Sales</option>
            </select>
          </label>

          <button className="btn-primary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="environmental-filter-strip card">
        <div className="filter-strip-group">
          <div>
            <p className="filter-strip-label">Reporting Period</p>
            <strong>{dateFilter}</strong>
          </div>
          <div>
            <p className="filter-strip-label">Department Scope</p>
            <strong>{departmentFilter}</strong>
          </div>
        </div>

        <div className="filter-strip-group">
          <div className="filter-stat">
            <span className="filter-stat-label">Open Goals</span>
            <strong>{filteredGoals.filter((goal) => goal.status === 'Active').length}</strong>
          </div>
          <div className="filter-stat">
            <span className="filter-stat-label">Pending Entries</span>
            <strong>{filteredTransactions.filter((item) => item.status === 'Pending').length}</strong>
          </div>
          <button className="btn-outline">
            <FolderSync size={16} />
            Refresh Workspace
          </button>
        </div>
      </div>

      <EnvKPICards cards={environmentalKpis} loading={isLoading} />
      <EnvCharts
        loading={isLoading}
        trendData={emissionTrendData}
        rankingData={departmentRanking}
      />
      <EnvGoalsRow goals={filteredGoals} summaryCards={summaryCards} loading={isLoading} onOpenGoal={openGoalDrawer} />
      <EnvTransactionsRow
        transactions={filteredTransactions}
        sourceData={emissionSources}
        loading={isLoading}
      />
      <EnvWorkspaceTable goals={filteredGoals} loading={isLoading} onOpenGoal={openGoalDrawer} />

      <div className="card quick-actions-card">
        <div className="section-heading">
          <div>
            <h3>Quick Actions</h3>
            <p>Launch common environmental workflows without leaving the workspace.</p>
          </div>
        </div>

        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <button key={action} className="quick-action-button">
              {action}
            </button>
          ))}
        </div>
      </div>

      <GoalDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        goal={selectedGoal}
      />
    </div>
  );
}
