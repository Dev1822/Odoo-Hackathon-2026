import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  Copy,
  Download,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';

const defaultColumns = [
  { key: 'name', label: 'Goal', width: 240 },
  { key: 'department', label: 'Department', width: 140 },
  { key: 'target', label: 'Target', width: 120 },
  { key: 'current', label: 'Current', width: 120 },
  { key: 'progress', label: 'Progress', width: 150 },
  { key: 'owner', label: 'Owner', width: 140 },
  { key: 'deadline', label: 'Deadline', width: 130 },
  { key: 'priority', label: 'Priority', width: 110 },
  { key: 'status', label: 'Status', width: 110 },
];

const toolbarActions = [
  { icon: Plus, label: 'New Goal', className: 'btn-primary' },
  { icon: Pencil, label: 'Edit', className: 'btn-outline' },
  { icon: Trash2, label: 'Delete', className: 'btn-outline' },
  { icon: Copy, label: 'Duplicate', className: 'btn-outline' },
  { icon: Download, label: 'Export', className: 'btn-outline' },
  { icon: Upload, label: 'Import', className: 'btn-outline' },
];

export default function EnvWorkspaceTable({ goals, loading, onOpenGoal }) {
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState(defaultColumns);
  const [resizing, setResizing] = useState(null);

  useEffect(() => {
    if (!resizing) {
      return undefined;
    }

    const handleMove = (event) => {
      const delta = event.clientX - resizing.startX;
      setColumns((current) =>
        current.map((column) =>
          column.key === resizing.key
            ? { ...column, width: Math.max(110, resizing.startWidth + delta) }
            : column
        )
      );
    };

    const handleUp = () => setResizing(null);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [resizing]);

  const filteredGoals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return goals;
    }

    return goals.filter((goal) =>
      [goal.name, goal.department, goal.owner, goal.status, goal.priority]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [goals, query]);

  if (loading) {
    return (
      <div className="card environmental-workspace-card">
        <div className="section-heading">
          <div>
            <h3>Environmental Goals Workspace</h3>
            <p>Loading workspace records.</p>
          </div>
        </div>
        <div className="skeleton-table workspace-skeleton" />
      </div>
    );
  }

  return (
    <div className="card environmental-workspace-card">
      <div className="section-heading">
        <div>
          <h3>Environmental Goals Workspace</h3>
          <p>Full goal register with ownership, target tracking and workflow controls.</p>
        </div>
      </div>

      <div className="workspace-toolbar">
        <div className="workspace-toolbar-actions">
          {toolbarActions.map((action) => {
            const Icon = action.icon;

            return (
              <button key={action.label} type="button" className={action.className}>
                <Icon size={16} />
                {action.label}
              </button>
            );
          })}
        </div>

        <div className="workspace-toolbar-actions workspace-toolbar-right">
          <label className="search-input">
            <Search size={16} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search goals"
            />
          </label>
          <button type="button" className="btn-outline">
            <Filter size={16} />
            Advanced Filter
          </button>
          <button type="button" className="btn-outline">
            Columns
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="workspace-table-wrap responsive-table-shell">
        <table className="erp-table enterprise-table workspace-table">
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} style={{ width: `${column.width}px` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  <div className="resizable-header">
                    <span>{column.label}</span>
                    <button
                      type="button"
                      className="resize-handle"
                      aria-label={`Resize ${column.label} column`}
                      title={`Resize ${column.label}`}
                      onMouseDown={(event) =>
                        setResizing({
                          key: column.key,
                          startX: event.clientX,
                          startWidth: column.width,
                        })
                      }
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredGoals.map((goal) => (
              <tr key={goal.id} className="hover-row clickable-row" onClick={() => onOpenGoal(goal)}>
                <td data-label="Goal">
                  <div className="table-primary-cell">
                    <strong>{goal.name}</strong>
                    <span>{goal.id}</span>
                  </div>
                </td>
                <td data-label="Department">{goal.department}</td>
                <td data-label="Target">{goal.target}</td>
                <td data-label="Current">{goal.current}</td>
                <td data-label="Progress">
                  <div className="table-progress-cell">
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
                    </div>
                    <span>{goal.progress}%</span>
                  </div>
                </td>
                <td data-label="Owner">{goal.owner}</td>
                <td data-label="Deadline">{goal.deadline}</td>
                <td data-label="Priority">
                  <span className={`priority-badge priority-${goal.priority.toLowerCase()}`}>{goal.priority}</span>
                </td>
                <td data-label="Status">
                  <span className={`status-badge status-${goal.status.toLowerCase()}`}>{goal.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
